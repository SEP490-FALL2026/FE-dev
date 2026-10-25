import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export default function EmployeeDashboardRoute() {
  return (
    <RoleGuard requiredRole='employee'>
      <DashboardPage role='employee' />
    </RoleGuard>
  )
}
