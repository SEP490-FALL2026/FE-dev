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
  return (
    <ManagerSection title={translate('timeline')}>
      <ManagerQueryState query={query} empty={!timings} />
      {timings && (
        <ol className='space-y-4'>
          {Object.entries(timings.segments).map(
            ([key, segment]) =>
              segment && (
                <li key={key} className='space-y-2 border-l border-primary/30 pl-4'>
                  <p className='text-sm font-medium'>
                    {translate(`statuses.${key}` as 'statuses.PENDING', { defaultValue: translate('unknownStatus') })}
                  </p>
                  <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                    {formatDateTime(segment.startedAt)}
                    {segment.endedAt && <span className='ml-3'>{formatDateTime(segment.endedAt)}</span>}
                  </p>
                </li>
              )
          )}
        </ol>
      )}
    </ManagerSection>
  )
}
