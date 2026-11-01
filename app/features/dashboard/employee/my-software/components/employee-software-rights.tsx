import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useMeSoftwareRightList } from '~/shared/api/generated/operations/me/me-software-right-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import {
  EmployeeField,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import { SOFTWARE_RIGHT_STATUS } from '../enums/software-right-status'
import { SOFTWARE_RIGHT_VIEW } from '../enums/software-right-view'

const statusTone: Record<string, string> = {
  [SOFTWARE_RIGHT_STATUS.ACTIVE]: 'bg-success/10 text-success',
  [SOFTWARE_RIGHT_STATUS.UPCOMING]: 'bg-primary-soft text-primary-ink',
  [SOFTWARE_RIGHT_STATUS.PROVISIONING]: 'bg-primary-soft text-primary-ink',
  [SOFTWARE_RIGHT_STATUS.EXPIRED]: 'bg-warning/10 text-warning',
  [SOFTWARE_RIGHT_STATUS.REVOKING]: 'bg-warning/10 text-warning',
  [SOFTWARE_RIGHT_STATUS.ENDING]: 'bg-warning/10 text-warning',
  [SOFTWARE_RIGHT_STATUS.ENDED]: 'bg-surface-subtle text-muted-foreground'
}

export function EmployeeSoftwareRights() {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const paging = useEmployeePage('softwarePage')
  const view =
    Object.values(SOFTWARE_RIGHT_VIEW).find((option) => option === params.get('rightsView')) ??
    SOFTWARE_RIGHT_VIEW.current
  const query = useMeSoftwareRightList({ view, page: paging.page, pageSize: paging.pageSize })
  const softwarePage = !query.isError ? query.data?.data : null
  const items = softwarePage?.items ?? []
  return (
    <EmployeeSection
      title={translate('accessLists.software')}
      action={
        softwarePage && (
          <span className='font-mono text-xs text-muted-foreground tabular-nums'>
            {translate('softwareRights.total', { count: softwarePage.pagination.totalItems })}
          </span>
        )
      }
    >
      <div className='flex flex-wrap items-start justify-between gap-x-6 gap-y-2'>
        <div className='w-full sm:max-w-xs'>
          <EmployeeField label={translate('softwareRights.view')}>
            <select
              className={employeeInputClass}
              value={view}
              onChange={(event) =>
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  next.set('rightsView', event.target.value)
                  next.delete('softwarePage')
                  return next
                })
              }
            >
              {Object.values(SOFTWARE_RIGHT_VIEW).map((option) => (
                <option key={option} value={option}>
                  {translate(`softwareRights.views.${option}`)}
                </option>
              ))}
            </select>
          </EmployeeField>
        </div>
        {softwarePage && (
          <p className='pt-2 text-sm text-muted-foreground sm:pt-9'>
            {translate('softwareRights.asOf', { date: formatDate(softwarePage.asOf) })}
          </p>
        )}
      </div>
      <p className='text-sm leading-relaxed text-muted-foreground'>
        {translate(view === SOFTWARE_RIGHT_VIEW.current ? 'softwareRights.currentHint' : 'softwareRights.endedHint')}
      </p>
      {!!items.length && <EmployeeQueryState query={query} />}
      <EmployeeDataTable
        label={translate('accessLists.software')}
        items={items}
        rowKey={(item) => item.assignmentId}
        emptyState={
          <EmployeeQueryState
            query={query}
            empty={!items.length}
            emptyTitle={translate(
              view === SOFTWARE_RIGHT_VIEW.current ? 'softwareRights.empty' : 'softwareRights.emptyEnded'
            )}
            emptyDescription={translate('softwareRights.emptyHint')}
          />
        }
        columns={[
          {
            key: 'software',
            label: translate('redesign.application'),
            render: (item) => (
              <div className='min-w-0'>
                <p className='max-w-64 truncate font-medium' title={item.application.name}>
                  {item.application.name}
                </p>
                <p className='mt-1 max-w-64 truncate text-xs text-muted-foreground' title={item.plan.name}>
                  {item.plan.name}
                </p>
              </div>
            )
          },
          {
            key: 'status',
            label: translate('state'),
            render: (item) => (
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${statusTone[item.status] ?? 'bg-surface-subtle text-muted-foreground'}`}
              >
                <span aria-hidden className='size-1.5 rounded-full bg-current' />
                {Object.values(SOFTWARE_RIGHT_STATUS).some((status) => status === item.status)
                  ? translate(`softwareRights.statuses.${item.status}`)
                  : translate('unknownStatus')}
              </span>
            )
          },
          {
            key: 'granted',
            label: translate('softwareRights.grantedOn'),
            align: 'right',
            render: (item) =>
              item.grantedOn ? (
                formatDate(item.grantedOn)
              ) : (
                <span className='font-sans text-xs text-muted-foreground'>
                  {translate('softwareRights.noGrantDate')}
                </span>
              )
          },
          {
            key: 'end',
            label: translate(view === SOFTWARE_RIGHT_VIEW.ended ? 'softwareRights.validUntil' : 'expiresOn'),
            align: 'right',
            render: (item) => {
              const endDate = view === SOFTWARE_RIGHT_VIEW.ended ? item.validUntil : item.expectedEndDate
              return (
                <div>
                  {endDate ? (
                    formatDate(endDate)
                  ) : (
                    <span className='font-sans text-xs text-muted-foreground'>
                      {translate('softwareRights.noEndDate')}
                    </span>
                  )}
                  {item.expiringSoon && (
                    <p className='mt-1 font-sans text-xs text-warning'>{translate('softwareRights.expiringSoon')}</p>
                  )}
                </div>
              )
            }
          }
        ]}
      />
      <EmployeePagination pagination={softwarePage?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </EmployeeSection>
  )
}
