import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { OffboardingRightPageResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { itButtonClass } from '../../shared/components/it-form'
import { HandoverConfirmation } from './offboarding-handover-duties'

export function OffboardingRightContext({
  right,
  caseId,
  authorized
}: {
  right: OffboardingRightPageResponseDtoDataItemsItem
  caseId: string
  authorized: boolean
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const { formatDate } = useDashboardFormat()
  const [viewHandover, setViewHandover] = useState(false)
  const handover = right.handover
  return (
    <div className='space-y-1 text-sm'>
      {right.revocationNote && <p className='break-words'>{right.revocationNote}</p>}
      {right.accessRunsOnUntil && (
        <p>{translate('rightContext.accessRunsOnUntil', { date: formatDate(right.accessRunsOnUntil) })}</p>
      )}
      {handover && (
        <>
          <p>
            {translate('handover')}:{' '}
            {translate(`states.${handover.status}`, { defaultValue: translate('states.UNKNOWN') })}
          </p>
          <p>
            {translate('rightContext.confirmer')}:{' '}
            {translate(`duties.roles.${handover.role}`, { defaultValue: translate('states.UNKNOWN') })}
            {handover.confirmer && ` · ${handover.confirmer.fullName} (${handover.confirmer.employeeCode})`}
          </p>
          <p>{translate('rightContext.dueOn', { date: formatDate(handover.dueOn) })}</p>
          {handover.waitingReason && (
            <p>
              {translate(`rightContext.waitingReasons.${handover.waitingReason}`, {
                defaultValue: translate('states.UNKNOWN')
              })}
            </p>
          )}
          {handover.overdue && <p className='text-warning'>{translate('rightContext.overdue')}</p>}
          {handover.flaggedUnconfirmed && (
            <p className='text-warning'>{translate('rightContext.flaggedUnconfirmed')}</p>
          )}
          <button type='button' className={itButtonClass} disabled={!authorized} onClick={() => setViewHandover(true)}>
            {translate('rightContext.viewHandover')}
          </button>
          {viewHandover && (
            <HandoverConfirmation id={handover.dutyId} caseId={caseId} onClose={() => setViewHandover(false)} />
          )}
        </>
      )}
    </div>
  )
}
