import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function ManagerBudgetRevisionRoute() {
  return (
    <RoleGuard requiredRole='manager'>
      <DashboardEntry role='manager' />
    </RoleGuard>
  )
}
