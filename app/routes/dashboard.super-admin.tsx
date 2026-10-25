import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export default function SuperAdminDashboardRoute() {
  return (
    <RoleGuard requiredRole='super-admin'>
      <DashboardPage role='super-admin' />
    </RoleGuard>
  )
}
