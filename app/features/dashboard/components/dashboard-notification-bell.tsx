import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import type { UserRole } from '~/entities/user-role/user-role'
import { NotificationBell } from '~/entities/notification/components/notification-bell'

export function DashboardNotificationBell({ role }: { role: UserRole }) {
  const [localOpen, setLocalOpen] = useState(false)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const audience = role
  const open = role === 'manager' ? params.get('notifications') === 'open' : localOpen
  return (
    <NotificationBell
      audience={audience}
      open={open}
      onOpenChange={(nextOpen) => {
        if (role !== 'manager') return setLocalOpen(nextOpen)
        setParams(
          (previous) => {
            const next = new URLSearchParams(previous)
            if (nextOpen) next.set('notifications', 'open')
            else next.delete('notifications')
            return next
          },
          { replace: true }
        )
      }}
      onOpenTarget={
        audience
          ? (target) => {
              void navigate({
                pathname: `/dashboard/${role}`,
                search: new URLSearchParams({
                  tab: target.tab,
                  ...(role === 'manager' && target.tab === 'request-approval' && params.get('departmentId')
                    ? { departmentId: params.get('departmentId')! }
                    : {}),
                  ...target.params
                }).toString()
              })
            }
          : undefined
      }
    />
  )
}
