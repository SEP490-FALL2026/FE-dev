import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionLineChangeList } from '~/shared/api/generated/operations/budget-versions/budget-version-line-change-list'
import { FinanceDrawer, FinancePagination, FinanceQueryState } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useDashboardFormat } from '../../../dashboard-ui'

export function BudgetLineHistory({
  versionId,
  position,
  onClose
}: {
  versionId: string
  position: number
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeBudget')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useBudgetVersionLineChangeList(versionId, position, { page, pageSize: 20 })
  const result = query.data?.data
  const formatWindow = (window: { windowFrom: string; windowTo: string }) =>
    `${formatDate(window.windowFrom)} – ${formatDate(window.windowTo)}`
  return (
    <FinanceDrawer title={translate('lineHistory')} onClose={onClose}>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(change) => `${change.changedAt}-${change.reason}`}
          columns={[
            {
              key: 'before',
              label: translate('fields.before'),
              numeric: true,
              render: (change) => formatWindow(change.before)
            },
            {
              key: 'after',
              label: translate('fields.after'),
              numeric: true,
              render: (change) => formatWindow(change.after)
            },
            { key: 'reason', label: translate('fields.reason'), render: (change) => change.reason },
            {
              key: 'actor',
              label: translate('fields.actor'),
              render: (change) => change.changedBy?.fullName ?? translate('system')
            },
            {
              key: 'at',
              label: translate('fields.at'),
              numeric: true,
              render: (change) => formatDateTime(change.changedAt)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceDrawer>
  )
}
