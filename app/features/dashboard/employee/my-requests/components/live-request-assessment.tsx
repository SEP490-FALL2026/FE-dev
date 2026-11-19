import { useTranslation } from 'react-i18next'
import { useAccessRequestAssessmentGet } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { RequestAssessmentContent } from '~/entities/request/components/request-assessment-content'
import { EmployeeQueryState, EmployeeSection } from '../../shared/components/employee-api-ui'
export function LiveRequestAssessment({ id }: { id: string }) {
  const { t: translate } = useTranslation('employee')
  const query = useAccessRequestAssessmentGet(id)
  const assessment = !query.isError ? query.data?.data?.assessment : undefined
  return (
    <EmployeeSection title={translate('assessment.title')}>
      <EmployeeQueryState query={query} empty={!assessment} emptyTitle={translate('assessment.empty')} />
      {assessment && <RequestAssessmentContent assessment={assessment} />}
    </EmployeeSection>
  )
}
