import { useState } from 'react'
import { useNavigate } from 'react-router'
import { NotificationBell } from '~/entities/notification/components/notification-bell'

export function EmployeeNotificationBell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <NotificationBell
      open={open}
      onOpenChange={setOpen}
      onOpenRequest={(id) => {
        void navigate({
          pathname: '/dashboard/employee',
          search: new URLSearchParams({ tab: 'request-detail', id }).toString()
        })
      }}
    />
  )
}
