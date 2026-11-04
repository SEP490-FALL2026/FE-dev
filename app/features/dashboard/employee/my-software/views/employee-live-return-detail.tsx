import { useTranslation } from 'react-i18next'
import { ArrowLeft, Undo2 } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useReturnRequestGet } from '~/shared/api/generated/operations/return-requests/return-request-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeReturnHandover } from '../components/employee-return-handover'
import { RETURN_STATE } from '../enums/return-state'
import {
  EmployeeButton,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'

export function EmployeeLiveReturnDetail({
  id,
  onBack,
  employeeId
}: {
  id: string
  onBack: () => void
  employeeId: string
}) {
  const { t: translate } = useTranslation('employee')
  const query = useReturnRequestGet(id, { query: { enabled: !!id } })
  const { formatDate, formatDateTime } = useDashboardFormat()
  const request = !query.isError ? query.data?.data?.returnRequest : undefined
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('returnDetail')}
        icon={Undo2}
        actions={
          <EmployeeButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </EmployeeButton>
        }
      />
      <EmployeeSection title={request?.plan.applicationName ?? translate('redesign.softwareDetails')}>
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
            {request.revocationNote && (
              <p className='whitespace-pre-wrap break-words text-sm'>{request.revocationNote}</p>
            )}
            {request.handover.required && (
              <section className='space-y-3 border-t border-border/60 pt-4'>
                <p className='text-sm'>
                  {translate(
                    request.handover.confirmed
                      ? 'requestExtras.returnHandover.done'
                      : 'requestExtras.returnHandover.needed'
                  )}
                </p>
                {request.handover.dueOn && (
                  <p className='text-right font-mono text-sm tabular-nums'>
                    {translate('requestExtras.returnHandover.dueOn', { date: formatDate(request.handover.dueOn) })}
                  </p>
                )}
                {request.handoverConfirmedAt && (
                  <p className='text-right font-mono text-xs tabular-nums'>
                    {formatDateTime(request.handoverConfirmedAt)}
                  </p>
                )}
                {request.handover.flagged && (
                  <p className='text-sm text-warning-ink'>{translate('requestExtras.returnHandover.flagged')}</p>
                )}
                {request.state === RETURN_STATE.AWAITING_REVOCATION &&
                  !request.handover.confirmed &&
                  request.requestedBy.employeeId === employeeId && <EmployeeReturnHandover id={id} />}
              </section>
            )}
          </>
        )}
      </EmployeeSection>
    </div>
  )
}
