import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { Boxes, ChevronRight } from 'lucide-react'
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
import { SOFTWARE_RIGHT_VIEW } from '../enums/software-right-view'
import { EmployeeSoftwareRightStatus } from './employee-software-right-status'
import { EmployeeSoftwareRightDetails } from './employee-software-right-details'

export function EmployeeSoftwareRights() {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const paging = useEmployeePage('softwarePage')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const view =
    Object.values(SOFTWARE_RIGHT_VIEW).find((option) => option === params.get('rightsView')) ??
    SOFTWARE_RIGHT_VIEW.current
  const query = useMeSoftwareRightList({ view, page: paging.page, pageSize: paging.pageSize })
  const softwarePage = !query.isError ? query.data?.data : null
  const items = softwarePage?.items ?? []
  const selectedRight = items.find((item) => item.assignmentId === selectedId)
  return (
    <>
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
                onChange={(event) => {
                  setSelectedId(null)
                  setParams((previous) => {
                    const next = new URLSearchParams(previous)
                    next.set('rightsView', event.target.value)
                    next.delete('softwarePage')
                    return next
                  })
                }}
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
          actionLabel={translate('softwareRightDetails.action')}
          renderAction={(item) => (
            <button
              type='button'
              aria-label={translate('softwareRightDetails.open', { name: item.application.name })}
              aria-haspopup='dialog'
              onClick={() => setSelectedId(item.assignmentId)}
              className='inline-flex min-h-11 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-primary-ink transition-colors duration-150 hover:bg-primary-soft active:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:min-h-9'
            >
              {translate('softwareRightDetails.action')}
              <ChevronRight aria-hidden strokeWidth={1.5} className='size-4' />
            </button>
          )}
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
                <div className='flex min-w-0 items-center gap-3'>
                  <span
                    aria-hidden='true'
                    className='grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <Boxes strokeWidth={1.5} className='size-4' />
                  </span>
                  <div className='min-w-0'>
                    <p className='max-w-64 truncate font-medium text-foreground' title={item.application.name}>
                      {item.application.name}
                    </p>
                    <p className='mt-0.5 max-w-64 truncate text-xs text-muted-foreground' title={item.plan.name}>
                      {item.plan.name}
                    </p>
                  </div>
                </div>
              )
            },
            {
              key: 'status',
              label: translate('state'),
              render: (item) => <EmployeeSoftwareRightStatus status={item.status} />
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
        <EmployeePagination
          pagination={softwarePage?.pagination}
          onPage={(page) => {
            setSelectedId(null)
            paging.onPage(page)
          }}
          busy={query.isFetching}
        />
      </EmployeeSection>
      {selectedRight && softwarePage && (
        <EmployeeSoftwareRightDetails
          key={selectedRight.assignmentId}
          right={selectedRight}
          asOf={softwarePage.asOf}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
