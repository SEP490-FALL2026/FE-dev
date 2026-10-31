import { Bell, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useNotificationList,
  getNotificationListQueryKey
} from '~/shared/api/generated/operations/notifications/notification-list'
import { notificationMarkRead } from '~/shared/api/generated/operations/notifications/notification-mark-read'
import { getNotificationUnreadCountQueryKey } from '~/shared/api/generated/operations/notifications/notification-unread-count'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerPagination,
  ManagerQueryState
} from '../../shared/components/manager-api-ui'

export function ManagerNotificationPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const { t: employeeTranslate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [unread, setUnread] = useState(false)
  const query = useNotificationList({ page, pageSize: 10, unreadOnly: unread ? 'true' : 'false' })
  const action = useManagerAction({
    mutationFn: (id: string) => notificationMarkRead(id),
    invalidate: [getNotificationListQueryKey(), getNotificationUnreadCountQueryKey()]
  })
  return (
    <div className='space-y-4'>
      <div aria-label={translate('notifications')} className='flex gap-1 border-b border-border/60 pb-3'>
        {[false, true].map((value) => (
          <button
            key={String(value)}
            type='button'
            aria-pressed={unread === value}
            className={`min-h-11 rounded-md px-4 text-sm font-medium transition-colors ${unread === value ? 'bg-primary-soft text-primary-ink' : 'text-muted-foreground hover:bg-surface-subtle'}`}
            onClick={() => {
              setUnread(value)
              setPage(1)
            }}
          >
            {translate(value ? 'unread' : 'all')}
          </button>
        ))}
      </div>
      <ManagerQueryState
        query={query}
        empty={!query.data?.data?.items.length}
        emptyTitle={translate('noNotifications')}
        emptyDescription={translate('noNotificationsHint')}
      />
      {!query.isError &&
        query.data?.data?.items.map((notification) => {
          const requestId = typeof notification.params.requestId === 'string' ? notification.params.requestId : ''
          const label = employeeTranslate(
            `notificationCodes.${notification.code}` as 'notificationCodes.REQUEST_SUBMITTED',
            { defaultValue: translate('notifications') }
          )
          return (
            <article
              key={notification.id}
              className={`rounded-lg border p-4 ${notification.readAt ? 'border-border/50' : 'border-primary/20 bg-primary-soft/20'}`}
            >
              <div className='flex items-start gap-3'>
                <Bell
                  aria-hidden
                  strokeWidth={1.5}
                  className={`mt-0.5 size-4 shrink-0 ${notification.readAt ? 'text-muted-foreground' : 'text-primary-ink'}`}
                />
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium leading-relaxed'>{label}</p>
                  <p className='mt-1 font-mono text-xs text-muted-foreground tabular-nums'>
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.readAt && (
                  <span className='mt-1.5 size-2 shrink-0 rounded-full bg-primary' aria-label={translate('unread')} />
                )}
              </div>
              <div className='flex flex-wrap justify-end gap-3'>
                {isResourceId(requestId) && (
                  <ManagerButton onClick={() => onOpen(requestId)}>
                    <ExternalLink aria-hidden strokeWidth={1.5} className='size-4' />
                    {translate('open')}
                  </ManagerButton>
                )}
                {!notification.readAt && (
                  <ManagerButton
                    disabled={action.blocked}
                    busy={action.isPending && action.variables === notification.id}
                    onClick={() => {
                      if (!action.blocked) action.mutate(notification.id)
                    }}
                  >
                    <Check aria-hidden strokeWidth={1.5} className='size-4' />
                    {action.retrySeconds
                      ? translate('retryAfter', { seconds: action.retrySeconds })
                      : translate('markRead')}
                  </ManagerButton>
                )}
              </div>
            </article>
          )
        })}
      <ManagerActionState action={action} />
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={setPage} busy={query.isFetching} />
    </div>
  )
}
