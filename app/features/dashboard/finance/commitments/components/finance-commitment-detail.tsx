import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CommitmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-commitments/commitmentListResponseDtoDataItemsItem'
import { useBudgetCommitmentRelease } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-release'
import {
  getBudgetCommitmentReleasesQueryKey,
  useBudgetCommitmentReleases
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-releases'
import { getBudgetCommitmentListQueryKey } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import {
  FinanceButton,
  FinanceDrawer,
  FinanceField,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { formatMoney } from '../../shared/finance-money'
import { CommitmentState } from '../enums/commitment-state'

export function FinanceCommitmentDetail({
  item,
  fresh,
  onClose
}: {
  item: CommitmentListResponseDtoDataItemsItem
  fresh: boolean
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const [page, setPage] = useState(1)
  const [reason, setReason] = useState('')
  const guard = useRef(false)
  const retrySeconds = useFinanceRetry()
  const me = useMeGet()
  const releases = useBudgetCommitmentReleases(item.id, { page, pageSize: 20 })
  const feedback = useFinanceFeedback(
    [getBudgetCommitmentListQueryKey(), getBudgetCommitmentReleasesQueryKey(item.id), getBudgetTableQueryKey()],
    () => setReason('')
  )
  const mutation = useBudgetCommitmentRelease({ mutation: feedback })
  const disabled =
    !fresh ||
    item.state !== CommitmentState.HELD ||
    !me.data?.data?.roles.includes('FINANCE') ||
    me.isFetching ||
    me.isError ||
    releases.isFetching ||
    releases.isError ||
    !reason.trim() ||
    reason.trim().length > 1000
  const submit = async () => {
    if (disabled || guard.current || mutation.isPending || retrySeconds > 0) return
    guard.current = true
    try {
      await mutation.mutateAsync({ id: item.id, data: { reason: reason.trim() } })
    } catch {
      /* Keep the release reason. */
    } finally {
      guard.current = false
    }
  }
  return (
    <FinanceDrawer title={translate('commitments.detail')} onClose={onClose} pending={mutation.isPending}>
      <p className='break-all font-mono text-sm'>{item.requestId}</p>
      <p>{item.costCenter.name}</p>
      <FinanceStatus value={item.state} />
      <dl className='grid gap-3 sm:grid-cols-2'>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('commitments.held')}</dt>
          <dd className='font-mono tabular-nums'>{formatMoney(item.held, i18n.language)}</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>{translate('commitments.released')}</dt>
          <dd className='font-mono tabular-nums'>{formatMoney(item.released, i18n.language)}</dd>
        </div>
      </dl>
      <FinanceQueryState query={me}>
        <span />
      </FinanceQueryState>
      <section className='space-y-3' aria-label={translate('commitments.releases')}>
        <h3 className='font-semibold [text-wrap:balance]'>{translate('commitments.releases')}</h3>
        <FinanceQueryState query={releases}>
          <FinanceTable
            items={releases.data?.data?.items ?? []}
            rowKey={(item) => item.id}
            columns={[
              {
                key: 'amount',
                label: translate('common.amount'),
                numeric: true,
                render: (item) => formatMoney(item.amount, i18n.language)
              },
              {
                key: 'reason',
                label: translate('common.reason'),
                render: (item) => item.reasonText ?? <FinanceStatus value={item.reason} />
              },
              {
                key: 'by',
                label: translate('commitments.releasedBy'),
                render: (item) => item.releasedBy?.fullName ?? translate('common.unavailable')
              }
            ]}
          />
          <FinancePagination pagination={releases.data?.data?.pagination} onPageChange={setPage} />
        </FinanceQueryState>
      </section>
      <form
        className='space-y-4 border-t border-border pt-4'
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <FinanceField label={translate('common.reason')} hint={translate('commitments.releaseHint')}>
          <textarea
            aria-label={translate('common.reason')}
            className={financeInputClass}
            rows={4}
            maxLength={1000}
            value={reason}
            disabled={mutation.isPending}
            onChange={(event) => setReason(event.target.value)}
            required
          />
        </FinanceField>
        <FinanceButton variant='primary' type='submit' pending={mutation.isPending} disabled={disabled}>
          {translate('commitments.release')}
        </FinanceButton>
      </form>
    </FinanceDrawer>
  )
}
