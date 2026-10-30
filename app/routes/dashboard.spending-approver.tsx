import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function SpendingApproverDashboardRoute() {
  return (
    <RoleGuard requiredRole='spending-approver'>
      <DashboardEntry role='spending-approver' />
    </RoleGuard>
  )
}
