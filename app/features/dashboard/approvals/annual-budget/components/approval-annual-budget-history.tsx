import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionHistoryList } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ApprovalsPagination, ApprovalsStatus } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { formatMoney } from '../../shared/approvals-money'

export function ApprovalAnnualBudgetHistory({ itemId }: { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useBudgetVersionHistoryList(itemId, { page, pageSize: 20 })
  const fieldLabels = new Map<string, string>(
    (
      [
        'base',
        'reserve',
        'total',
        'highValuePercent',
        'highValueAmount',
        'description',
        'amount',
        'seats',
        'period',
        'repeatCycle',
        'quoteValidUntil',
        'financeComment',
        'adjustmentReason',
        'q1',
        'q2',
        'q3',
        'q4'
      ] as const
    ).map((field): [string, string] => [field, translate(field)])
  )
  const moneyFields = ['base', 'reserve', 'total', 'highValueAmount', 'amount', 'q1', 'q2', 'q3', 'q4']
  const formatChange = (field: string, value: string | null, currency: string) =>
    value === null
      ? translate('unavailable')
      : moneyFields.includes(field)
        ? formatMoney({ amount: value, currency }, i18n.language)
        : value
  return (
    <section aria-label={translate('history')} className='space-y-3'>
      <h2 className='text-lg font-semibold'>{translate('history')}</h2>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(entry) => String(entry.seq)}
          columns={[
            {
              key: 'kind',
              label: translate('event'),
              render: (entry) => (
                <div className='space-y-2'>
                  <p>{translate(`historyKind.${entry.kind}`, { defaultValue: translate('unavailable') })}</p>
                  {entry.changes.map((change) => (
                    <div key={change.field} className='text-xs text-muted-foreground'>
                      <p>{fieldLabels.get(change.field) ?? translate('unavailable')}</p>
                      <p className='text-right font-mono tabular-nums'>
                        {translate('before')}: {formatChange(change.field, change.before, entry.currency)}
                      </p>
                      <p className='text-right font-mono tabular-nums'>
                        {translate('after')}: {formatChange(change.field, change.after, entry.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              )
            },
            {
              key: 'state',
              label: translate('state'),
              render: (entry) => <ApprovalsStatus value={entry.versionState} />
            },
            {
              key: 'by',
              label: translate('actor'),
              render: (entry) => <span title={entry.by.name}>{entry.by.name}</span>
            },
            { key: 'at', label: translate('occurredAt'), numeric: true, render: (entry) => formatDateTime(entry.at) }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </section>
  )
}
