import { useTranslation } from 'react-i18next'
import { useReturnRequestGet } from '~/shared/api/generated/operations/return-requests/return-request-get'
import {
  EmployeeButton,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'

export function EmployeeLiveReturnDetail({
  id,
  onBack,
  onHandover
}: {
  id: string
  onBack: () => void
  onHandover: () => void
}) {
  const { t: translate } = useTranslation('employee')
  const query = useReturnRequestGet(id, { query: { enabled: !!id } })
  const request = !query.isError ? query.data?.data?.returnRequest : undefined
  return (
    <div className='space-y-6'>
      <EmployeeButton onClick={onBack}>{translate('back')}</EmployeeButton>
      <h1 className='text-2xl font-semibold'>{translate('returnDetail')}</h1>
      <EmployeeSection title={request?.plan.applicationName ?? translate('returnDetail')}>
        <EmployeeQueryState query={query} empty={!request} />
        {request && (
          <>
            <EmployeeStatus value={request.state} />
            <p className='truncate font-mono text-xs' title={request.id}>
              {request.id}
            </p>
            <p className='text-sm'>{request.reason}</p>
            <p className='text-sm text-muted-foreground'>{translate('returnHint')}</p>
            {request.failureReason && <p className='text-sm'>{request.failureReason}</p>}
            {request.handover.required && !request.handover.confirmed && (
              <EmployeeButton onClick={onHandover}>{translate('handovers')}</EmployeeButton>
            )}
          </>
        )}
      </EmployeeSection>
    </div>
  )
}
