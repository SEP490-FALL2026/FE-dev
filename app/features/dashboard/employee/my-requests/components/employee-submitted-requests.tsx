import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useMeAccessRequestList } from '~/shared/api/generated/operations/me/me-access-request-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import {
  EmployeeButton,
  EmployeeField,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import { REQUEST_LIST_STATE } from '../enums/request-list-state'
import { REQUEST_LIST_TYPE } from '../enums/request-list-type'
import { REQUEST_LIST_VIEW } from '../enums/request-list-view'

export function EmployeeSubmittedRequests({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const paging = useEmployeePage()
  const state = Object.values(REQUEST_LIST_STATE).find((value) => value === params.get('requestState'))
  const type = Object.values(REQUEST_LIST_TYPE).find((value) => value === params.get('requestType'))
  const view = Object.values(REQUEST_LIST_VIEW).find((value) => value === params.get('requestView'))
  const requestsQuery = useMeAccessRequestList({
    page: paging.page,
    pageSize: paging.pageSize,
    ...(state ? { state } : {}),
    ...(type ? { type } : {}),
    ...(view ? { view } : {})
  })
  const requestsPage = !requestsQuery.isError ? requestsQuery.data?.data : null
  const items = requestsPage?.items ?? []
  const filtered = ['requestState', 'requestType', 'requestView'].some((key) => params.has(key))
  const updateFilter = (key: string, value: string) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  return (
    <EmployeeSection
      title={translate('requestList.title')}
      action={
        requestsPage && (
          <span className='font-mono text-xs text-muted-foreground tabular-nums'>
            {translate('requestList.total', { count: requestsPage.pagination.totalItems })}
          </span>
        )
      }
    >
      <div
        role='group'
        aria-label={translate('requestList.filters')}
        className='grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]'
      >
        <EmployeeField label={translate('requestList.view')}>
          <select
            className={employeeInputClass}
            value={view ?? ''}
            onChange={(event) => updateFilter('requestView', event.target.value)}
          >
            <option value=''>{translate('requestList.all')}</option>
            {Object.values(REQUEST_LIST_VIEW).map((value) => (
              <option key={value} value={value}>
                {translate(`requestList.views.${value}`)}
              </option>
            ))}
          </select>
        </EmployeeField>
        <EmployeeField label={translate('requestList.state')}>
          <select
            className={employeeInputClass}
            value={state ?? ''}
            onChange={(event) => updateFilter('requestState', event.target.value)}
          >
            <option value=''>{translate('requestList.allStates')}</option>
            {Object.values(REQUEST_LIST_STATE).map((value) => (
              <option key={value} value={value}>
                {translate(`statuses.${value}`)}
              </option>
            ))}
          </select>
        </EmployeeField>
        <EmployeeField label={translate('requestList.type')}>
          <select
            className={employeeInputClass}
            value={type ?? ''}
            onChange={(event) => updateFilter('requestType', event.target.value)}
          >
            <option value=''>{translate('requestList.allTypes')}</option>
            {Object.values(REQUEST_LIST_TYPE).map((value) => (
              <option key={value} value={value}>
                {translate(`statuses.${value}`)}
              </option>
            ))}
          </select>
        </EmployeeField>
        {filtered && (
          <div className='sm:pt-7'>
            <EmployeeButton
              onClick={() =>
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  for (const key of ['requestState', 'requestType', 'requestView', 'page']) next.delete(key)
                  return next
                })
              }
            >
              {translate('requestList.clear')}
            </EmployeeButton>
          </div>
        )}
      </div>
      {!!items.length && <EmployeeQueryState query={requestsQuery} />}
      <EmployeeDataTable
        label={translate('requestList.title')}
        items={items}
        rowKey={(item) => item.id}
        onOpen={(item) => onOpen(item.id)}
        emptyState={
          <EmployeeQueryState
            query={requestsQuery}
            empty={!items.length}
            emptyTitle={translate(filtered ? 'requestList.noMatches' : 'requestList.empty')}
            emptyDescription={translate(filtered ? 'requestList.noMatchesHint' : 'requestList.emptyHint')}
          />
        }
        columns={[
          {
            key: 'software',
            label: translate('redesign.application'),
            render: (item) => (
              <div className='min-w-0'>
                <p
                  className='max-w-64 truncate font-medium'
                  title={item.plan?.applicationName ?? item.softwareName ?? ''}
                >
                  {item.plan?.applicationName ?? item.softwareName ?? translate('requestDetail')}
                </p>
                {item.plan && (
                  <p className='mt-1 max-w-64 truncate text-xs text-muted-foreground' title={item.plan.planName}>
                    {item.plan.planName}
                  </p>
                )}
              </div>
            )
          },
          {
            key: 'beneficiary',
            label: translate('members'),
            render: (item) => (
              <div className='min-w-0'>
                <p className='max-w-56 truncate' title={item.beneficiary?.fullName}>
                  {item.beneficiary?.fullName ??
                    (item.type === REQUEST_LIST_TYPE.GROUP_GRANT
                      ? translate('requestList.groupMembers', { count: item.lineCount })
                      : translate('requestList.recipientInDetails'))}
                </p>
                <div className='mt-1'>
                  <EmployeeStatus value={item.type} />
                </div>
              </div>
            )
          },
          {
            key: 'state',
            label: translate('requestList.state'),
            render: (item) => <EmployeeStatus value={item.state} />
          },
          {
            key: 'submitted',
            label: translate('requestList.submittedAt'),
            align: 'right',
            render: (item) => formatDateTime(item.submittedAt)
          }
        ]}
      />
      <EmployeePagination
        pagination={requestsPage?.pagination}
        onPage={paging.onPage}
        busy={requestsQuery.isFetching}
      />
    </EmployeeSection>
  )
}
