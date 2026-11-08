import { useTranslation } from 'react-i18next'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState, EmployeeSection, EmployeeStatus } from '../../shared/components/employee-api-ui'

export function LiveRequestTimings({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const query = useAccessRequestTimingsGet(id)
  const timings = !query.isError ? query.data?.data?.timings : undefined
  const segments = timings ? Object.entries(timings.segments).filter(([, segment]) => !!segment) : []

  return (
    <EmployeeSection title={translate('timeline')}>
      <EmployeeQueryState query={query} empty={!timings || segments.length === 0} />
      {segments.length > 0 && (
        <ol className='relative space-y-5 pl-5 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:bg-border/60'>
          {segments.map(([kind, segment]) =>
            segment ? (
              <li key={kind} className='relative space-y-1.5'>
                <span
                  aria-hidden='true'
                  className='absolute -left-[1.55rem] top-1.5 grid size-2.5 place-items-center rounded-full bg-primary ring-4 ring-primary/15'
                />
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <EmployeeStatus value={kind} />
                  <p className='font-mono text-xs text-muted-foreground tabular-nums'>
                    <span>{formatDateTime(segment.startedAt)}</span>
                    {segment.endedAt && (
                      <span className='ml-1.5 text-foreground/70'>→ {formatDateTime(segment.endedAt)}</span>
                    )}
                  </p>
                </div>
              </li>
            ) : null
          )}
        </ol>
      )}
    </EmployeeSection>
  )
}
