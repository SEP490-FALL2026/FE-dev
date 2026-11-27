import { useTranslation } from 'react-i18next'
import { useAccessRequestAssessmentGet } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { RequestAssessmentContent } from '~/entities/request/components/request-assessment-content'
import { RequestProcessingProgress } from '~/entities/request/components/request-processing-progress'
import type { AccessRequestState } from '~/entities/request/enums/access-request-state'
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
export function ManagerRequestTimings({ id, state }: { id: string; state?: AccessRequestState }) {
  const { t: translate } = useTranslation('employee')
  const query = useAccessRequestTimingsGet(id)
  const timings = !query.isError ? query.data?.data?.timings : null
  return (
    <ManagerSection title={translate('timeline')}>
      <ManagerQueryState query={query} empty={!timings} />
      {timings && <RequestProcessingProgress timings={timings} state={state} />}
    </ManagerSection>
  )
}
