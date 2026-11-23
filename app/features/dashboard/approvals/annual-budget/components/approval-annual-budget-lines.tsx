import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionLineList } from '~/shared/api/generated/operations/budget-versions/budget-version-line-list'
import { ApprovalsPagination, ApprovalsSection } from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { formatMoney } from '../../shared/approvals-money'

export function ApprovalAnnualBudgetLines({ itemId }: { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const [page, setPage] = useState(1)
  const query = useBudgetVersionLineList(itemId, { page, pageSize: 20 })
  return (
    <div role='region' aria-label={translate('lines')}>
      <ApprovalsSection title={translate('lines')}>
        <ApprovalsQueryState query={query}>
          <ApprovalsTable
            items={query.data?.data?.items ?? []}
            rowKey={(line) => String(line.position)}
            columns={[
              {
                key: 'description',
                label: translate('description'),
                render: (line) => <span title={line.description}>{line.description}</span>
              },
              {
                key: 'amount',
                label: translate('amount'),
                numeric: true,
                render: (line) => formatMoney(line.amount, i18n.language)
              },
              {
                key: 'seats',
                label: translate('seats'),
                numeric: true,
                render: (line) => line.seats ?? translate('unavailable')
              },
              {
                key: 'comment',
                label: translate('financeComment'),
                render: (line) => (
                  <span title={line.financeComment ?? undefined}>
                    {line.financeComment ?? translate('unavailable')}
                  </span>
                )
              },
              {
                key: 'adjustment',
                label: translate('adjustmentReason'),
                render: (line) => (
                  <span title={line.adjustmentReason ?? undefined}>
                    {line.adjustmentReason ?? translate('unavailable')}
                  </span>
                )
              }
            ]}
          />
          <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
        </ApprovalsQueryState>
      </ApprovalsSection>
    </div>
  )
}
