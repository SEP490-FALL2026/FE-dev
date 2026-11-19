import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useStepCongestionList } from '~/shared/api/generated/operations/step-congestion/step-congestion-list'
import { getStepCongestionIncidentListQueryKey } from '~/shared/api/generated/operations/step-congestion/step-congestion-incident-list'
import { useStepCongestionIncidentRecord } from '~/shared/api/generated/operations/step-congestion/step-congestion-incident-record'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPageHeader, AdminSectionTitle } from '../../shared/components/admin-page-header'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { Activity, CircleCheck } from 'lucide-react'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminField, AdminFormDialog, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { CongestionDetails } from '../components/congestion-details'
import { OperationsReports } from '../components/operations-reports'

const MONITORING_VIEWS = ['workflow', 'sla', 'auditFlags', 'deadlines'] as const
type MonitoringView = (typeof MONITORING_VIEWS)[number]

export function SuperAdminOperationsView() {
  const { t: translate } = useTranslation('admin')
  const [report, setReport] = useState<MonitoringView>('workflow')
  const panelId = useId()
  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next =
      MONITORING_VIEWS[(MONITORING_VIEWS.indexOf(report) + step + MONITORING_VIEWS.length) % MONITORING_VIEWS.length]
    setReport(next)
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-view='${next}']`)?.focus()
  }
  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={Activity}
        eyebrow={translate('ui.operationsEyebrow')}
        title={translate('operations.title')}
        subtitle={translate(`ui.operationsHint.${report}`)}
      >
        <div
          aria-label={translate('oversight.choose')}
          className='flex w-full gap-1 overflow-x-auto rounded-lg border border-border/70 bg-surface/80 p-1 sm:w-fit'
          onKeyDown={moveFocus}
          role='tablist'
        >
          {MONITORING_VIEWS.map((value) => (
            <button
              aria-controls={panelId}
              aria-selected={report === value}
              className='min-h-10 shrink-0 rounded-md px-4 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground aria-selected:bg-primary-soft aria-selected:text-primary-ink'
              data-view={value}
              key={value}
              onClick={() => setReport(value)}
              role='tab'
              tabIndex={report === value ? 0 : -1}
              type='button'
            >
              {translate(`oversight.${value}`)}
            </button>
          ))}
        </div>
      </AdminPageHeader>
      <div id={panelId} role='tabpanel'>
        {report === 'workflow' ? <WorkflowMonitoring /> : <OperationsReports key={report} report={report} />}
      </div>
    </div>
  )
}

function WorkflowMonitoring() {
  const { t: translate } = useTranslation('admin')
  const { formatNumber } = useDashboardFormat()
  const [congestionPage, setCongestionPage] = useState(1)
  const congestion = useStepCongestionList({ page: congestionPage, pageSize: 20 })
  const [incident, setIncident] = useState<{ holderEmployeeId: string | null; description: string } | null>(null)
  const [selectedHolder, setSelectedHolder] = useState<string | null | undefined>(undefined)
  const feedback = useAdminMutationFeedback([getStepCongestionIncidentListQueryKey()], () => setIncident(null))
  const mutation = useStepCongestionIncidentRecord({ mutation: feedback })
  if (selectedHolder !== undefined)
    return <CongestionDetails holderEmployeeId={selectedHolder} onClose={() => setSelectedHolder(undefined)} />
  return (
    <div className='space-y-6'>
      <section className='space-y-4 rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)] sm:p-6'>
        <AdminSectionTitle title={translate('operations.congestion')} hint={translate('ui.congestionHint')} />
        <AdminQueryState query={congestion}>
          {!congestion.data?.data?.items.length && (
            <WorkspaceEmptyState
              icon={CircleCheck}
              title={translate('ui.noCongestionTitle')}
              description={translate('ui.noCongestionHint')}
            />
          )}
          <ul className='divide-y divide-border/40'>
            {congestion.data?.data?.items.map((item) => (
              <li
                key={item.holder?.employeeId ?? 'unassigned'}
                className='grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center'
              >
                <div>
                  <p className='truncate font-medium' title={item.holder?.fullName}>
                    {item.holder?.fullName ?? translate('none')}
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {translate('operations.waitingSteps')}
                    {': '}
                    <span className='font-mono tabular-nums'>{formatNumber(item.openSteps)}</span>
                    {' · '}
                    {translate('operations.reminders')}
                    {': '}
                    <span className='font-mono tabular-nums'>{formatNumber(item.totalReminders)}</span>
                  </p>
                </div>
                <details className='relative justify-self-end'>
                  <summary className={`${adminButtonClass} cursor-pointer`}>{translate('actions')}</summary>
                  <div className='absolute right-0 z-10 mt-1 grid min-w-44 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                    <button
                      type='button'
                      className={adminButtonClass}
                      onClick={() => setSelectedHolder(item.holder?.employeeId ?? null)}
                    >
                      {translate('details')}
                    </button>
                    <button
                      type='button'
                      className={adminButtonClass}
                      onClick={() =>
                        setIncident({ holderEmployeeId: item.holder?.employeeId ?? null, description: '' })
                      }
                    >
                      {translate('operations.incident')}
                    </button>
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <AdminPagination
            pagination={congestion.data?.data?.pagination}
            disabled={congestion.isFetching}
            onPageChange={setCongestionPage}
          />
        </AdminQueryState>
      </section>
      {incident && (
        <AdminFormDialog
          title={translate('operations.incident')}
          pending={mutation.isPending}
          onClose={() => setIncident(null)}
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate({
              data: { holderEmployeeId: incident.holderEmployeeId, description: incident.description.trim() }
            })
          }}
        >
          <AdminField label={translate('operations.description')}>
            <textarea
              required
              minLength={1}
              maxLength={1000}
              placeholder={translate('operations.descriptionPlaceholder')}
              className={adminInputClass}
              value={incident.description}
              onChange={(event) => setIncident({ ...incident, description: event.target.value })}
            />
          </AdminField>
        </AdminFormDialog>
      )}
    </div>
  )
}
