import { useTranslation } from 'react-i18next'
import { useAccessRequestSimilarSeatList } from '~/shared/api/generated/operations/access-requests/access-request-similar-seat-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerSimilarSeats({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const paging = useManagerPage('seatPage')
  const query = useAccessRequestSimilarSeatList(id, { page: paging.page, pageSize: paging.pageSize })
  const items = !query.isError ? (query.data?.data?.items ?? []) : []
  return (
    <details>
      <summary className='min-h-11 cursor-pointer py-3 text-sm'>{translate('similarSeats')}</summary>
      <ManagerQueryState query={query} empty={!items.length} />
      <ManagerDataTable
        label={translate('similarSeats')}
        items={items}
        rowKey={(seat) => seat.assignmentId}
        columns={[
          {
            key: 'plan',
            label: translate('plan'),
            render: (seat) => (
              <div>
                <p className='max-w-48 truncate font-medium' title={seat.plan.applicationName}>
                  {seat.plan.applicationName}
                </p>
                <p className='mt-1 max-w-48 truncate text-xs text-muted-foreground' title={seat.plan.planName}>
                  {seat.plan.planName}
                </p>
              </div>
            )
          },
          {
            key: 'account',
            label: translate('integration.accountIdentifier'),
            render: (seat) => (
              <p className='max-w-48 truncate' title={seat.accountIdentifier}>
                {seat.accountIdentifier}
              </p>
            )
          },
          { key: 'since', label: translate('since'), align: 'right', render: (seat) => formatDate(seat.heldSince) }
        ]}
      />
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </details>
  )
}
