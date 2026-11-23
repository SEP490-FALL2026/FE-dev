import { useState } from 'react'
import { useNavigate } from 'react-router'
import { NotificationBell } from '~/entities/notification/components/notification-bell'

export function ItNotificationBell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <NotificationBell
      audience='it-admin'
      open={open}
      onOpenChange={setOpen}
      onOpenRequest={(id) => {
        void navigate({
          pathname: '/dashboard/it-admin',
          search: new URLSearchParams({ tab: 'provisioning', id }).toString()
        })
      }}
      onOpenTarget={(target) => {
        void navigate({
          pathname: '/dashboard/it-admin',
          search: new URLSearchParams({ tab: target.tab, ...target.params }).toString()
        })
      }}
    />
  )
}
