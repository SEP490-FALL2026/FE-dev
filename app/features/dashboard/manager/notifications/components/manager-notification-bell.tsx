import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { createPortal } from 'react-dom'
import { useNotificationUnreadCount } from '~/shared/api/generated/operations/notifications/notification-unread-count'
import { Dialog } from '../../../dashboard-ui'
import { ManagerNotificationPanel } from './manager-notification-panel'

export function ManagerNotificationBell() {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const open = params.get('notifications') === 'open'
  const query = useNotificationUnreadCount({ query: { refetchInterval: 60000 } })
  const count = !query.isError ? query.data?.data?.unread : undefined
  return (
    <>
      <button
        type='button'
        aria-label={translate('notifications')}
        aria-haspopup='dialog'
        aria-expanded={open}
        className='relative grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-subtle'
        onClick={() => {
          setParams(
            (previous) => {
              const next = new URLSearchParams(previous)
              next.set('notifications', 'open')
              return next
            },
            { replace: true }
          )
        }}
      >
        <Bell aria-hidden='true' className='size-5' strokeWidth={1.5} />
        {count !== undefined && count > 0 && (
          <span className='absolute -top-1 -right-1 rounded-full bg-danger px-1.5 font-mono text-xs text-white tabular-nums'>
            {count}
          </span>
        )}
      </button>
      {open &&
        createPortal(
          <Dialog
            presentation='drawer'
            title={translate('notifications')}
            onClose={() => {
              setParams(
                (previous) => {
                  const next = new URLSearchParams(previous)
                  next.delete('notifications')
                  return next
                },
                { replace: true }
              )
            }}
          >
            <ManagerNotificationPanel
              onOpen={(id) => {
                const next = new URLSearchParams({ tab: 'request-approval', id })
                const departmentId = params.get('departmentId')
                if (departmentId) next.set('departmentId', departmentId)
                void navigate({ pathname: '/dashboard/manager', search: next.toString() })
              }}
            />
          </Dialog>,
          document.body
        )}
    </>
  )
}
