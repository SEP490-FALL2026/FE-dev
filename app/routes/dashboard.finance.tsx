import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export default function FinanceDashboardRoute() {
  return (
    <RoleGuard requiredRole='finance'>
      <DashboardPage role='finance' />
    </RoleGuard>
  )
}
