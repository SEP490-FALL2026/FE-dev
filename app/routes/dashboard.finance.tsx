import { RoleGuard } from '~/features/auth/components/role-guard'
import { PolicyAcknowledgementGate } from '~/features/dashboard/components/policy-acknowledgement-gate'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'

export default function FinanceDashboardRoute() {
  return (
    <RoleGuard requiredRole='finance'>
      <PolicyAcknowledgementGate>
        <DashboardEntry role='finance' />
      </PolicyAcknowledgementGate>
    </RoleGuard>
  )
}
