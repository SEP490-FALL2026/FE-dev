import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function ItAdminDashboardRoute() {
  return (
    <RoleGuard requiredRole='it-admin'>
      <DashboardEntry role='it-admin' />
    </RoleGuard>
  )
}
