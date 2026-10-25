import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export default function ManagerDashboardRoute() {
  return (
    <RoleGuard requiredRole='manager'>
      <DashboardPage role='manager' />
    </RoleGuard>
  )
}
