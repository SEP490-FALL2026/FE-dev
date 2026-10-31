import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getNotificationListQueryOptions } from '~/shared/api/generated/operations/notifications/notification-list'
import { notificationMarkRead } from '~/shared/api/generated/operations/notifications/notification-mark-read'
import {
  getNotificationUnreadCountQueryKey,
  useNotificationUnreadCount
} from '~/shared/api/generated/operations/notifications/notification-unread-count'
import { getEmployeeError } from '../../shared/hooks/employee-errors'

const toastId = 'employee-notification'

export function EmployeeNotificationBell() {
  const { t: translate } = useTranslation('employee')
  const client = useQueryClient()
  const query = useNotificationUnreadCount({ query: { refetchInterval: 60000 } })
  const [busy, setBusy] = useState(false)
  const [retrySeconds, setRetrySeconds] = useState(0)
  const locked = useRef(false)
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
      toast.dismiss(toastId)
    }
  }, [])
  useEffect(() => {
    if (!retrySeconds) return
    const timer = window.setTimeout(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [retrySeconds])

  async function openNotification() {
    if (locked.current || retrySeconds) return
    locked.current = true
    setBusy(true)
    toast.loading(translate('loading'), { id: toastId })
    try {
      const response = await client.fetchQuery(
        getNotificationListQueryOptions(
          { page: 1, pageSize: 1, unreadOnly: 'true' },
          { query: { retry: false, staleTime: 0 } }
        )
      )
      if (!active.current) return
      const notification = response.data?.items[0]
      if (notification) await notificationMarkRead(notification.id)
      if (!active.current) return
      const key = `notificationCodes.${notification?.code}` as 'notificationCodes.REQUEST_SUBMITTED'
      toast.info(
        notification
          ? translate(key, { defaultValue: translate('notificationFallback') })
          : translate('noNotifications'),
        { id: toastId }
      )
    } catch (error) {
      if (!active.current) return
      const failure = getEmployeeError(error)
      if (failure.key === 'rateLimit') setRetrySeconds(failure.retryAfter)
      toast.error(translate(`errors.${failure.key}`), { id: toastId })
    } finally {
      locked.current = false
      if (active.current) {
        setBusy(false)
        void client.invalidateQueries({ queryKey: getNotificationUnreadCountQueryKey() })
      }
    }
  }
  const count = !query.isError ? query.data?.data?.unread : undefined
  return (
    <button
      type='button'
      onClick={() => void openNotification()}
      disabled={busy || retrySeconds > 0}
      aria-busy={busy}
      aria-label={retrySeconds ? translate('retryAfter', { seconds: retrySeconds }) : translate('notifications')}
      className='relative grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-subtle disabled:cursor-wait disabled:opacity-60'
    >
      <Bell aria-hidden='true' className='size-5' strokeWidth={1.5} />
      {count !== undefined && count > 0 && (
        <span className='absolute -top-1 -right-1 rounded-full bg-danger px-1.5 font-mono text-xs text-white tabular-nums'>
          {count}
        </span>
      )}
    </button>
  )
}
