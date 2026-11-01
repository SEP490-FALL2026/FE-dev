import { useNavigate, useSearchParams } from 'react-router'
import { NotificationBell } from '~/entities/notification/components/notification-bell'

export function ManagerNotificationBell() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  return (
    <NotificationBell
      open={params.get('notifications') === 'open'}
      onOpenChange={(open) => {
        setParams(
          (previous) => {
            const next = new URLSearchParams(previous)
            if (open) next.set('notifications', 'open')
            else next.delete('notifications')
            return next
          },
          { replace: true }
        )
      }}
      onOpenRequest={(id) => {
        const next = new URLSearchParams({ tab: 'request-approval', id })
        const departmentId = params.get('departmentId')
        if (departmentId) next.set('departmentId', departmentId)
        void navigate({ pathname: '/dashboard/manager', search: next.toString() })
      }}
    />
  )
}
