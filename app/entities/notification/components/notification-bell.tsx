import { Bell } from 'lucide-react'
import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotificationUnreadCount } from '~/shared/api/generated/operations/notifications/notification-unread-count'
import { AnchoredPopover } from '~/shared/ui/anchored-popover'
import { NotificationInbox } from './notification-inbox'

export function NotificationBell({
  open,
  onOpenChange,
  onOpenRequest
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenRequest: (id: string) => void
}) {
  const { t: translate } = useTranslation('common')
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const query = useNotificationUnreadCount({ query: { refetchInterval: 60000 } })
  const count = !query.isError ? query.data?.data?.unread : undefined
  const close = () => onOpenChange(false)
  return (
    <>
      <button
        ref={trigger}
        type='button'
        aria-label={translate('notifications.label')}
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className={`relative grid size-11 shrink-0 place-items-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${open ? 'border-primary/20 bg-primary-soft text-primary-ink' : 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'}`}
        onClick={() => onOpenChange(!open)}
      >
        <Bell aria-hidden strokeWidth={1.5} className='size-5' />
        {count !== undefined && count > 0 && (
          <span className='absolute -top-1 -right-1 grid min-w-4.5 place-items-center rounded-full bg-danger px-1 font-mono text-[0.65rem] leading-4.5 text-white tabular-nums'>
            {count > 99 ? translate('notifications.countOverflow') : count}
          </span>
        )}
      </button>
      {open && (
        <AnchoredPopover anchor={trigger} id={id} labelId={`${id}-label`} onClose={close}>
          <NotificationInbox
            labelId={`${id}-label`}
            unreadCount={count}
            onClose={() => {
              close()
              trigger.current?.focus()
            }}
            onOpenRequest={(requestId) => {
              close()
              onOpenRequest(requestId)
            }}
          />
        </AnchoredPopover>
      )}
    </>
  )
}
