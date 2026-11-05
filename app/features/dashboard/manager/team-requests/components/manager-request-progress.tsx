import { useTranslation } from 'react-i18next'
import { useAccessRequestAssessmentGet } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { RequestAssessmentContent } from '~/entities/request/components/request-assessment-content'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'

export function ManagerRequestAssessment({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const query = useAccessRequestAssessmentGet(id)
  const assessment = !query.isError ? query.data?.data?.assessment : null
  return (
    <ManagerSection title={translate('assessment.title')}>
      <ManagerQueryState query={query} empty={!assessment} emptyTitle={translate('assessment.empty')} />
      {assessment && <RequestAssessmentContent assessment={assessment} />}
    </ManagerSection>
  )
}
export function ManagerRequestTimings({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const query = useAccessRequestTimingsGet(id)
  const timings = !query.isError ? query.data?.data?.timings : null
  const segments = timings ? Object.entries(timings.segments).filter(([, segment]) => !!segment) : []

  return (
    <ManagerSection title={translate('timeline')}>
      <ManagerQueryState query={query} empty={!timings || segments.length === 0} />
      {segments.length > 0 && (
        <ol className='relative space-y-6 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-border/60'>
          {segments.map(([key, segment]) =>
            segment ? (
              <li key={key} className='relative space-y-1.5'>
                <span
                  aria-hidden='true'
                  className='absolute -left-[1.85rem] top-1 grid size-3 place-items-center rounded-full bg-primary ring-4 ring-primary/15'
                />
                <div className='flex flex-wrap items-baseline justify-between gap-2'>
                  <p className='text-sm font-semibold text-foreground'>
                    {translate(`statuses.${key}` as 'statuses.PENDING', { defaultValue: translate('unknownStatus') })}
                  </p>
                  <p className='font-mono text-xs text-muted-foreground tabular-nums'>
                    <span>{formatDateTime(segment.startedAt)}</span>
                    {segment.endedAt && <span className='ml-2 text-foreground/70'>→ {formatDateTime(segment.endedAt)}</span>}
                  </p>
                </div>
              </li>
            ) : null
          )}
        </ol>
      )}
    </ManagerSection>
  )
}
