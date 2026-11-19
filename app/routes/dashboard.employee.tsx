import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function EmployeeDashboardRoute() {
  return (
    <RoleGuard requiredRole='employee'>
      <DashboardEntry role='employee' />
    </RoleGuard>
  )
}
