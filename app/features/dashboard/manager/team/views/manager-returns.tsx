import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useReturnRequestList } from '~/shared/api/generated/operations/return-requests/return-request-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerField,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { RETURN_STATE } from '../enums/return-state'

export function ManagerReturns({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const paging = useManagerPage('returnPage')
  const state = Object.values(RETURN_STATE).find((value) => value === params.get('returnState'))
  const query = useReturnRequestList({ page: paging.page, pageSize: paging.pageSize, ...(state ? { state } : {}) })
  const data = !query.isError ? query.data?.data : null
  return (
    <ManagerSection>
      <div className='max-w-xs'>
        <ManagerField label={translate('status')}>
          <select
            className={managerInputClass}
            value={state ?? ''}
            onChange={(event) =>
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                if (event.target.value) next.set('returnState', event.target.value)
                else next.delete('returnState')
                next.set('returnPage', '1')
                return next
              })
            }
          >
            <option value=''>{translate('all')}</option>
            {Object.values(RETURN_STATE).map((value) => (
              <option key={value} value={value}>
                {translate(`statuses.${value}` as 'statuses.COMPLETED')}
              </option>
            ))}
          </select>
        </ManagerField>
      </div>
      <ManagerDataTable
        label={translate('integration.returns')}
        items={data?.items ?? []}
        rowKey={(row) => row.id}
        onOpen={(row) => onOpen(row.id)}
        emptyState={
          <ManagerQueryState
            query={query}
            empty={!data?.items.length}
            emptyTitle={translate('integration.noReturns')}
          />
        }
        columns={[
          {
            key: 'software',
            label: translate('application'),
            render: (row) => (
              <div>
                <p className='max-w-56 truncate font-medium' title={row.plan.applicationName}>
                  {row.plan.applicationName}
                </p>
                <p className='max-w-56 truncate text-xs text-muted-foreground' title={row.plan.planName}>
                  {row.plan.planName}
                </p>
              </div>
            )
          },
          {
            key: 'holder',
            label: translate('employee'),
            render: (row) => (
              <p className='max-w-48 truncate' title={row.holder.fullName}>
                {row.holder.fullName}
              </p>
            )
          },
          { key: 'state', label: translate('status'), render: (row) => <ManagerStatus value={row.state} /> },
          {
            key: 'date',
            label: translate('integration.requestedOn'),
            align: 'right',
            render: (row) => formatDate(row.requestedOn)
          }
        ]}
      />
      <ManagerPagination pagination={data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
