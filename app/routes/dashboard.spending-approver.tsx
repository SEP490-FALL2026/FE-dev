import { RoleGuard } from '~/features/auth/components/role-guard'
import { PolicyAcknowledgementGate } from '~/features/dashboard/components/policy-acknowledgement-gate'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function SpendingApproverDashboardRoute() {
  return (
    <RoleGuard requiredRole='spending-approver'>
      <PolicyAcknowledgementGate>
        <DashboardEntry role='spending-approver' />
      </PolicyAcknowledgementGate>
    </RoleGuard>
  )
}
