import { RoleGuard } from '~/features/auth/components/role-guard'
import { DashboardEntry } from '~/features/dashboard/dashboard-entry'
import { NotFoundPage } from '~/features/not-found/not-found-page'
import { parseUserRole } from '~/entities/user-role/user-role'

import type { Route } from './+types/dashboard'

export default function DashboardRoute({ params }: Route.ComponentProps) {
  const role = parseUserRole(params.role)

  if (!role) {
    return <NotFoundPage />
  }

  return (
    <RoleGuard requiredRole={role}>
      <DashboardEntry role={role} />
    </RoleGuard>
  )
}
