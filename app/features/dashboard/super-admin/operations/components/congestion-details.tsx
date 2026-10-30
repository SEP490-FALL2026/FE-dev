import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStepCongestionStepList } from '~/shared/api/generated/operations/step-congestion/step-congestion-step-list'
import { useStepCongestionIncidentList } from '~/shared/api/generated/operations/step-congestion/step-congestion-incident-list'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass } from '../../shared/components/admin-form'
import { useDashboardFormat } from '../../../dashboard-ui'

export function CongestionDetails({
  holderEmployeeId,
  onClose
}: {
  holderEmployeeId: string | null
  onClose: () => void
}) {
  const { t: translate } = useTranslation('admin')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [incidentPage, setIncidentPage] = useState(1)
  const steps = useStepCongestionStepList({ page, pageSize: 20, ...(holderEmployeeId ? { holderEmployeeId } : {}) })
  const incidents = useStepCongestionIncidentList({ page: incidentPage, pageSize: 20 })
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-semibold'>{translate('operations.waitingSteps')}</h2>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('close')}
        </button>
      </div>
      <AdminQueryState query={steps}>
        {!steps.data?.data?.items.length && <AdminEmpty />}
        {steps.data?.data?.items.map((item) => (
          <div
            key={item.stepId}
            className='flex flex-wrap justify-between gap-3 border-b border-border/40 py-3 text-sm'
          >
            <span className='truncate font-mono text-xs' title={item.requestId}>
              {item.requestId}
            </span>
            <span>{translate(`operations.stepKinds.${item.stepKind}`, { defaultValue: translate('unknown') })}</span>
            <time className='text-right font-mono text-xs tabular-nums' dateTime={item.dueAt}>
              {formatDateTime(item.dueAt)}
            </time>
          </div>
        ))}
        <AdminPagination pagination={steps.data?.data?.pagination} onPageChange={setPage} disabled={steps.isFetching} />
      </AdminQueryState>
      <h3 className='font-semibold'>{translate('operations.incidentHistory')}</h3>
      <AdminQueryState query={incidents}>
        {!incidents.data?.data?.items.length && <AdminEmpty />}
        {incidents.data?.data?.items.map((item) => (
          <article key={item.id} className='space-y-2 border-b border-border/40 py-3 text-sm'>
            <p className='truncate' title={item.holder?.fullName}>
              {item.holder?.fullName ?? translate('none')}
            </p>
            <p className='whitespace-pre-wrap break-words'>{item.description}</p>
            <time className='block text-right font-mono text-xs tabular-nums' dateTime={item.recordedAt}>
              {formatDateTime(item.recordedAt)}
            </time>
          </article>
        ))}
        <AdminPagination
          pagination={incidents.data?.data?.pagination}
          onPageChange={setIncidentPage}
          disabled={incidents.isFetching}
        />
      </AdminQueryState>
    </section>
  )
}
