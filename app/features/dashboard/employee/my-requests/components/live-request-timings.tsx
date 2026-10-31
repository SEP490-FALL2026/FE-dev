import { useTranslation } from 'react-i18next'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState, EmployeeStatus } from '../../shared/components/employee-api-ui'

export function LiveRequestTimings({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const query = useAccessRequestTimingsGet(id)
  const timings = !query.isError ? query.data?.data?.timings : undefined
  return (
    <section className='space-y-4 border-t border-border/60 pt-4'>
      <h2 className='font-semibold'>{translate('timeline')}</h2>
      <EmployeeQueryState query={query} empty={!timings} />
      {timings && (
        <ol className='space-y-3'>
          {Object.entries(timings.segments)
            .filter(([, segment]) => !!segment)
            .map(
              ([kind, segment]) =>
                segment && (
                  <li key={kind} className='flex flex-wrap items-center justify-between gap-3'>
                    <EmployeeStatus value={kind} />
                    <p className='text-right font-mono text-xs tabular-nums'>
                      {formatDateTime(segment.startedAt)}
                      {segment.endedAt && <span className='ml-2'>{formatDateTime(segment.endedAt)}</span>}
                    </p>
                  </li>
                )
            )}
        </ol>
      )}
    </section>
  )
}
