import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export default function ItAdminDashboardRoute() {
  return (
    <RoleGuard requiredRole='it-admin'>
      <DashboardPage role='it-admin' />
    </RoleGuard>
  )
}
