import { useTranslation } from 'react-i18next'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model/notifications/notificationListResponseDtoDataItemsItem'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function NotificationPersonnelContext({
  notification
}: {
  notification: NotificationListResponseDtoDataItemsItem
}) {
  const { t } = useTranslation('common')
  const { formatDate } = useWorkspaceFormat()
  const params = notification.params
  const deadline = params.graceEndsOn
  if (
    notification.code.startsWith('TRANSFER_GRACE_') &&
    typeof deadline === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(deadline)
  )
    return (
      <p className='mt-2 text-sm text-foreground'>{t('notifications.graceDeadline', { date: formatDate(deadline) })}</p>
    )
  if (
    notification.code === 'REQUEST_CANCELLED_BENEFICIARY_GONE' &&
    (params.reasonKind === 'DEPARTURE' || params.reasonKind === 'TRANSFER')
  )
    return (
      <p className='mt-2 text-sm text-foreground'>
        {t(params.reasonKind === 'DEPARTURE' ? 'notifications.departureCancelled' : 'notifications.transferCancelled')}
      </p>
    )
  if (notification.code === 'DEPARTMENT_SOFTWARE_PROPOSAL_DECIDED') {
    if (params.decision === 'ACCEPTED')
      return <p className='mt-2 text-sm text-success-ink'>{t('notifications.proposalAccepted')}</p>
    if (params.decision === 'REJECTED' && typeof params.reason === 'string')
      return (
        <p className='mt-2 whitespace-pre-wrap text-sm text-foreground [overflow-wrap:anywhere]'>{params.reason}</p>
      )
  }
  return null
}
