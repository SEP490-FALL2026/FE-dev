import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getFinanceError } from '../../shared/finance-errors'
import { recordFinanceRetry } from '../../shared/hooks/use-finance-retry'

type PurchaseErrorKey =
  | 'sameDecider'
  | 'notSubmitted'
  | 'alreadyClosed'
  | 'differenceInvalid'
  | 'documentInvalid'
  | 'oopFinanceOnly'
  | 'oopItAdminOnly'
  | 'oopNotFound'
  | 'oopNumberTaken'
  | 'oopSpendAlreadyRecorded'
  | 'oopDocumentRequired'
  | 'oopRecordFieldsMissing'
  | 'oopRecordFieldsNotAllowed'
  | 'oopNoVendor'
  | 'oopCostCenterNotFound'
  | 'oopRevokeNotAllowed'
  | 'oopRevokeEvidenceMissing'
  | 'oopSpendRecorded'
  | 'oopAmountInvalid'

const purchaseErrorKeys: Partial<Record<string, PurchaseErrorKey>> = {
  'PURCHASE_INVOICE.SAME_PERSON': 'sameDecider',
  'PURCHASE_INVOICE.NOT_SUBMITTED': 'notSubmitted',
  'PURCHASE_INVOICE.DOCUMENT_INVALID': 'documentInvalid',
  'INVOICE_DISCREPANCY.ALREADY_CLOSED': 'alreadyClosed',
  'INVOICE_DISCREPANCY.DIFFERENCE_INVALID': 'differenceInvalid',
  'OUT_OF_PROCESS_CASE.ALREADY_CLOSED': 'alreadyClosed',
  'OUT_OF_PROCESS_CASE.FINANCE_ONLY': 'oopFinanceOnly',
  'OUT_OF_PROCESS_CASE.IT_ADMIN_ONLY': 'oopItAdminOnly',
  'OUT_OF_PROCESS_CASE.NOT_FOUND': 'oopNotFound',
  'OUT_OF_PROCESS_CASE.NUMBER_TAKEN': 'oopNumberTaken',
  'OUT_OF_PROCESS_CASE.SPEND_ALREADY_RECORDED': 'oopSpendAlreadyRecorded',
  'OUT_OF_PROCESS_CASE.DOCUMENT_REQUIRED': 'oopDocumentRequired',
  'OUT_OF_PROCESS_CASE.DOCUMENT_INVALID': 'documentInvalid',
  'OUT_OF_PROCESS_CASE.RECORD_FIELDS_MISSING': 'oopRecordFieldsMissing',
  'OUT_OF_PROCESS_CASE.RECORD_FIELDS_NOT_ALLOWED': 'oopRecordFieldsNotAllowed',
  'OUT_OF_PROCESS_CASE.NO_VENDOR': 'oopNoVendor',
  'OUT_OF_PROCESS_CASE.COST_CENTER_NOT_FOUND': 'oopCostCenterNotFound',
  'OUT_OF_PROCESS_CASE.REVOKE_NOT_ALLOWED': 'oopRevokeNotAllowed',
  'OUT_OF_PROCESS_CASE.REVOKE_EVIDENCE_MISSING': 'oopRevokeEvidenceMissing',
  'OUT_OF_PROCESS_CASE.SPEND_RECORDED': 'oopSpendRecorded',
  'OUT_OF_PROCESS_CASE.AMOUNT_INVALID': 'oopAmountInvalid'
}

/** The message key of a purchase or reconciliation error code, or undefined when it has none. */
export function purchaseErrorKey(code: string): PurchaseErrorKey | undefined {
  return purchaseErrorKeys[code]
}

/** Reads the BE error code of a failed call, or an empty string when there is none. */
export function purchaseErrorCode(error: unknown): string {
  if (!isAxiosError(error)) return ''
  const body = error.response?.data as { error?: { code?: string } } | undefined
  return body?.error?.code ?? ''
}

/** Same refresh-then-toast contract as the other finance writes, with messages for the purchase and reconciliation codes. */
export function usePurchasesFeedback(queryKeys: readonly QueryKey[], onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const { t: translateFinance } = useTranslation('finance')
  const { t: translate } = useTranslation('financePurchases')
  const invalidate = () => Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  return {
    onSuccess: async () => {
      await invalidate()
      toast.success(translateFinance('saved'), { id: 'finance-write' })
      onSuccess?.()
    },
    onError: async (error: unknown) => {
      recordFinanceRetry(queryClient, error)
      const failure = getFinanceError(error)
      if (failure.key !== 'rateLimit') await invalidate()
      if (failure.key === 'forbidden') {
        await queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
      }
      const specific = purchaseErrorKey(purchaseErrorCode(error))
      toast.error(
        specific
          ? translate(`errors.${specific}`)
          : translateFinance(`errors.${failure.ambiguous ? 'ambiguous' : failure.key}`),
        { id: 'finance-write' }
      )
    }
  }
}
