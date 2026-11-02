import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionHistoryList } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { FinanceDrawer, FinancePagination, FinanceQueryState } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useDashboardFormat } from '../../../dashboard-ui'

export function BudgetVersionHistory({ versionId, onClose }: { versionId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('financeBudget')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useBudgetVersionHistoryList(versionId, { page, pageSize: 20 })
  const result = query.data?.data
  return (
    <FinanceDrawer title={translate('history')} onClose={onClose}>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(event) => String(event.seq)}
          columns={[
            {
              key: 'kind',
              label: translate('fields.kind'),
              render: (event) => (
                <div className='space-y-2'>
                  <p>{translate(`kinds.${event.kind}`, { defaultValue: translate('unknown') })}</p>
                  {event.changes.map((change) => (
                    <div key={change.field} className='text-xs text-muted-foreground'>
                      <p>{translate(`fields.${change.field}`, { defaultValue: translate('unknown') })}</p>
                      <p>
                        {translate('fields.before')}: {change.before ?? translate('none')}
                      </p>
                      <p>
                        {translate('fields.after')}: {change.after ?? translate('none')}
                      </p>
                    </div>
                  ))}
                  {event.position !== null && (
                    <p className='text-xs'>
                      {translate('fields.position')}: {event.position}
                    </p>
                  )}
                  {event.lines && (
                    <p className='text-xs'>
                      {translate('fields.position')}: {event.lines.fromPosition}–{event.lines.toPosition}
                    </p>
                  )}
                </div>
              )
            },
            {
              key: 'actor',
              label: translate('fields.actor'),
              render: (event) => event.by?.name ?? translate('system')
            },
            {
              key: 'at',
              label: translate('fields.at'),
              numeric: true,
              render: (event) => formatDateTime(event.at)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceDrawer>
  )
}
