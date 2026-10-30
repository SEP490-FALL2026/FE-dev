import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function FinanceDashboardRoute() {
  return (
    <RoleGuard requiredRole='finance'>
      <DashboardEntry role='finance' />
    </RoleGuard>
  )
}
