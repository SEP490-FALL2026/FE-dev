import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useControlledWaitList } from '~/shared/api/generated/operations/controlled-waits/controlled-wait-list'
import { useStepCongestionList } from '~/shared/api/generated/operations/step-congestion/step-congestion-list'
import { getStepCongestionIncidentListQueryKey } from '~/shared/api/generated/operations/step-congestion/step-congestion-incident-list'
import { useStepCongestionIncidentRecord } from '~/shared/api/generated/operations/step-congestion/step-congestion-incident-record'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminField, AdminFormDialog, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'
import { CongestionDetails } from '../components/congestion-details'

export function SuperAdminOperationsView() {
  const { t: translate } = useTranslation('admin')
  const { formatDateTime, formatNumber } = useDashboardFormat()
  const [waitPage, setWaitPage] = useState(1)
  const [congestionPage, setCongestionPage] = useState(1)
  const waits = useControlledWaitList({ page: waitPage, pageSize: 20 })
  const congestion = useStepCongestionList({ page: congestionPage, pageSize: 20 })
  const [incident, setIncident] = useState<{ holderEmployeeId: string | null; description: string } | null>(null)
  const [selectedHolder, setSelectedHolder] = useState<string | null | undefined>(undefined)
  const feedback = useAdminMutationFeedback([getStepCongestionIncidentListQueryKey()], () => setIncident(null))
  const mutation = useStepCongestionIncidentRecord({ mutation: feedback })
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('operations.title')}</h1>
      <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
        <h2 className='font-semibold'>{translate('operations.waits')}</h2>
        <AdminQueryState query={waits}>
          {!waits.data?.data?.items.length && <AdminEmpty />}
          <ul className='divide-y divide-border/40'>
            {waits.data?.data?.items.map((item) => (
              <li key={item.stepId} className='space-y-2 py-4 text-sm'>
                <div className='flex flex-wrap justify-between gap-3'>
                  <p className='truncate font-medium' title={item.department.name}>
                    {item.department.name}
                  </p>
                  <time className='text-right font-mono text-xs tabular-nums' dateTime={item.waitingSince}>
                    {formatDateTime(item.waitingSince)}
                  </time>
                </div>
                <p>
                  {translate(`operations.waitReasons.${item.waitingReason}`, { defaultValue: translate('unknown') })}
                </p>
                <p className='break-all font-mono text-xs text-muted-foreground'>{item.requestId}</p>
              </li>
            ))}
          </ul>
          <AdminPagination
            pagination={waits.data?.data?.pagination}
            disabled={waits.isFetching}
            onPageChange={setWaitPage}
          />
        </AdminQueryState>
      </section>
      <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
        <h2 className='font-semibold'>{translate('operations.congestion')}</h2>
        <AdminQueryState query={congestion}>
          {!congestion.data?.data?.items.length && <AdminEmpty />}
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
      {selectedHolder !== undefined && (
        <CongestionDetails holderEmployeeId={selectedHolder} onClose={() => setSelectedHolder(undefined)} />
      )}
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
