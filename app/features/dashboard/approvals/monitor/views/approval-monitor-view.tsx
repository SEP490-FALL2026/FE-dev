import { Eye } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessRequestListView } from '~/shared/api/generated/model/access-requests'
import { useAccessRequestList } from '~/shared/api/generated/operations/access-requests/access-request-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalMonitorDetail } from './approval-monitor-detail'
import {
  ApprovalMonitorFilters,
  dayEnd,
  dayStart,
  emptyMonitorFilters,
  statesOfGroup,
  type MonitorFilters
} from './approval-monitor-filters'
import {
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsSelect,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'

const parseView = (value: string) => Object.values(AccessRequestListView).find((view) => view === value)

/** Read-only follow-up of requests that reached the spend step; deciding happens in the approval queue. */
export function ApprovalMonitorView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab?: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [view, setView] = useState<AccessRequestListView>(AccessRequestListView.open)
  const [filters, setFilters] = useState<MonitorFilters>(emptyMonitorFilters)
  const query = useAccessRequestList({
    view,
    ...(filters.stateGroup ? { state: statesOfGroup(filters.stateGroup).join(',') } : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.from ? { from: dayStart(filters.from) } : {}),
    ...(filters.to ? { to: dayEnd(filters.to) } : {}),
    ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
    ...(filters.flag ? { flag: filters.flag } : {}),
    page,
    pageSize: 20
  })
  if (itemId !== undefined) return <ApprovalMonitorDetail requestId={itemId} onBack={() => onSelectTab?.('monitor')} />
  return (
    <ApprovalsPage icon={Eye} title={translate('monitor.title')} description={translate('monitor.description')}>
      <ApprovalMonitorFilters
        filters={filters}
        onChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
        leading={
          <ApprovalsSelect
            label={translate('monitor.view')}
            value={view}
            options={Object.values(AccessRequestListView).map((value) => ({
              value,
              label: translate(`monitor.views.${value}`)
            }))}
            onChange={(value) => {
              setView(parseView(value) ?? AccessRequestListView.open)
              setPage(1)
            }}
          />
        }
      />
      <ApprovalsSection title={translate('layout.monitorListTitle')}>
        <ApprovalsQueryState query={query}>
          <ApprovalsTable
            items={query.data?.data?.items ?? []}
            rowKey={(request) => request.id}
            onOpen={onSelectTab ? (request) => onSelectTab('monitor', { id: request.id }) : undefined}
            columns={[
              {
                key: 'software',
                label: translate('monitor.software'),
                render: (request) =>
                  request.plan?.applicationName ?? request.softwareName ?? translate('monitor.noSoftware')
              },
              {
                key: 'type',
                label: translate('monitor.type'),
                render: (request) => translate(`monitor.types.${request.type}`)
              },
              {
                key: 'requester',
                label: translate('monitor.requester'),
                render: (request) => (
                  <span title={request.requester.employeeCode}>
                    {request.requester.fullName} · {request.department.name}
                  </span>
                )
              },
              {
                key: 'state',
                label: translate('monitor.state'),
                render: (request) => (
                  <div className='flex flex-wrap items-center gap-1'>
                    <ApprovalsStatus value={request.state} />
                    {request.routing.mode === 'ONE_STEP' && (
                      <span className='inline-flex items-center rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground ring-1 ring-border/70 ring-inset'>
                        {translate('routingOneStep')}
                      </span>
                    )}
                  </div>
                )
              },
              {
                key: 'submittedAt',
                label: translate('monitor.submittedAt'),
                numeric: true,
                align: 'center',
                render: (request) => formatDate(request.submittedAt)
              }
            ]}
          />
          <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
        </ApprovalsQueryState>
      </ApprovalsSection>
    </ApprovalsPage>
  )
}
