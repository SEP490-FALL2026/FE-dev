import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type {
  BudgetCommitmentList200,
  CommitmentListResponseDtoDataItemsItem
} from '~/shared/api/generated/model/budget-commitments'
import { getBudgetCommitmentInvoiceListQueryKey } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-invoice-list'
import { useBudgetCommitmentInvoiceRecord } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-invoice-record'
import { getBudgetCommitmentListQueryKey } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import { useBudgetCommitmentRelease } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-release'
import { getBudgetCommitmentReleasesQueryKey } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-releases'
import { getBudgetSummaryQueryKey } from '~/shared/api/generated/operations/budgets/budget-summary'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getFinanceError } from '../../shared/finance-errors'
import { recordFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { invoiceFields, type InvoiceField, type InvoiceFieldErrors } from '../invoice-form'

export type Commitment = CommitmentListResponseDtoDataItemsItem

function errorDetails(error: unknown): { code: string; paths: string[] } {
  const body = isAxiosError(error)
    ? (error.response?.data as { error?: { code?: string; details?: { issues?: { path?: unknown }[] } } } | undefined)
    : undefined
  const issues = body?.error?.details?.issues
  const paths = Array.isArray(issues)
    ? issues.flatMap((issue) => {
        const path = issue?.path
        const first = Array.isArray(path) ? path[0] : typeof path === 'string' ? path.split('.')[0] : undefined
        return typeof first === 'string' ? [first] : []
      })
    : []
  return { code: body?.error?.code ?? '', paths }
}

const isInvoiceField = (value: string): value is InvoiceField => (invoiceFields as readonly string[]).includes(value)

/** Field messages for a refused invoice: the code says what is wrong, the issue paths say where. */
export function invoiceFieldErrors(error: unknown): InvoiceFieldErrors {
  const { code, paths } = errorDetails(error)
  const fields = paths.filter(isInvoiceField)
  const at = (fallback: InvoiceField, message: InvoiceFieldErrors[InvoiceField]) =>
    Object.fromEntries((fields.length ? fields : [fallback]).map((field) => [field, message])) as InvoiceFieldErrors
  if (code === 'INVOICE.DUPLICATE') return { number: 'duplicate' }
  if (code === 'MONEY_SCALE_EXCEEDED') return at('netAmount', 'amountScale')
  if (code === 'MONEY_OUT_OF_RANGE') return at('netAmount', 'amountRange')
  if (code === 'VALIDATION_ERROR') return Object.fromEntries(fields.map((field) => [field, 'invalid']))
  return {}
}

/** Puts the commitment the API returned into every cached commitment list, then marks those lists stale. */
async function applyCommitment(queryClient: QueryClient, commitment: Commitment) {
  const listKey = getBudgetCommitmentListQueryKey()
  queryClient.setQueriesData<BudgetCommitmentList200>({ queryKey: listKey }, (current) =>
    current?.data
      ? {
          ...current,
          data: {
            ...current.data,
            items: current.data.items.map((item) => (item.id === commitment.id ? commitment : item))
          }
        }
      : current
  )
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: listKey, refetchType: 'none' }),
    queryClient.invalidateQueries({ queryKey: getBudgetTableQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getBudgetSummaryQueryKey() })
  ])
}

/** Failures the user fixes in the form; the stored data did not change, so nothing is reloaded. */
const inputFailures: readonly string[] = ['rateLimit', 'validation', 'money', 'invoiceDuplicate']

function useFailureFeedback(commitmentId: string) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('finance')
  return async (error: unknown, toastId: string) => {
    recordFinanceRetry(queryClient, error)
    const failure = getFinanceError(error)
    if (failure.key === 'forbidden') {
      await queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
    } else if (!inputFailures.includes(failure.key)) {
      // The state changed or the outcome is unknown: read it again before the user decides (never resend on its own).
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getBudgetCommitmentListQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getBudgetCommitmentInvoiceListQueryKey(commitmentId) }),
        queryClient.invalidateQueries({ queryKey: getBudgetCommitmentReleasesQueryKey(commitmentId) })
      ])
    }
    toast.error(translate(`errors.${failure.ambiguous ? 'ambiguous' : failure.key}`), { id: toastId })
    return failure
  }
}

export function useRecordInvoice(
  commitment: Commitment,
  handlers: { onDone: () => void; onFieldErrors: (errors: InvoiceFieldErrors) => void }
) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('financeSpend')
  const reportFailure = useFailureFeedback(commitment.id)
  return useBudgetCommitmentInvoiceRecord({
    mutation: {
      onSuccess: async (response) => {
        const recorded = response.data
        if (recorded) await applyCommitment(queryClient, recorded.commitment)
        await queryClient.invalidateQueries({ queryKey: getBudgetCommitmentInvoiceListQueryKey(commitment.id) })
        const invoice = recorded?.invoice
        toast.success(translate('commitments.record.success', { number: invoice?.number ?? '' }), {
          id: 'finance-invoice-record',
          description: invoice
            ? translate(`commitments.record.result${invoice.matchResult}`, { defaultValue: '' })
            : undefined
        })
        handlers.onDone()
      },
      onError: async (error) => {
        const failure = await reportFailure(error, 'finance-invoice-record')
        handlers.onFieldErrors(invoiceFieldErrors(error))
        // Nothing more can be recorded on this commitment: close the form, the detail shows the reloaded state.
        if (failure.key === 'invoiceCommitmentReleased' || failure.key === 'commitmentNotFound') handlers.onDone()
      }
    }
  })
}

export function useReleaseCommitment(
  commitment: Commitment,
  handlers: { onDone: () => void; onReasonError: () => void }
) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('financeSpend')
  const reportFailure = useFailureFeedback(commitment.id)
  return useBudgetCommitmentRelease({
    mutation: {
      onSuccess: async (response) => {
        if (response.data) await applyCommitment(queryClient, response.data.commitment)
        await queryClient.invalidateQueries({ queryKey: getBudgetCommitmentReleasesQueryKey(commitment.id) })
        toast.success(translate('commitments.release.success'), { id: 'finance-commitment-release' })
        handlers.onDone()
      },
      onError: async (error) => {
        const failure = await reportFailure(error, 'finance-commitment-release')
        if (failure.key === 'validation') handlers.onReasonError()
        if (['commitmentNotHeld', 'commitmentRequestOpen', 'commitmentNotFound'].includes(failure.key))
          handlers.onDone()
      }
    }
  })
}
