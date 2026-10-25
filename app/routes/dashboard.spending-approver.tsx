import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardPage } from '~/features/dashboard/dashboard-page'

export default function SpendingApproverDashboardRoute() {
  return (
    <RoleGuard requiredRole='spending-approver'>
      <DashboardPage role='spending-approver' />
    </RoleGuard>
  )
}
