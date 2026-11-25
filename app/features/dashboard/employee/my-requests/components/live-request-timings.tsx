import { useTranslation } from 'react-i18next'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { RequestProcessingProgress } from '~/entities/request/components/request-processing-progress'
import type { AccessRequestState } from '~/entities/request/enums/access-request-state'
import { EmployeeQueryState, EmployeeSection } from '../../shared/components/employee-api-ui'

export function LiveRequestTimings({ id, state }: { id: string; state?: AccessRequestState }) {
  const { t: translate } = useTranslation('employee')
  const query = useAccessRequestTimingsGet(id)
  const timings = !query.isError ? query.data?.data?.timings : undefined

  return (
    <EmployeeSection title={translate('timeline')}>
      <EmployeeQueryState query={query} empty={!timings} />
      {timings && <RequestProcessingProgress timings={timings} state={state} />}
    </EmployeeSection>
  )
}
