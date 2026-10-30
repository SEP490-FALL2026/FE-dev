import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function SuperAdminPersonnelRoute() {
  return (
    <RoleGuard requiredRole='super-admin'>
      <DashboardEntry role='super-admin' />
    </RoleGuard>
  )
}
