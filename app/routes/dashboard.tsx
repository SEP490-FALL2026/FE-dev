import { DashboardPage } from '~/features/dashboard/dashboard-page'
import { NotFoundPage } from '~/features/not-found/not-found-page'
import { parseUserRole } from '~/entities/user-role/user-role'

import type { Route } from './+types/dashboard'

export default function DashboardRoute({ params }: Route.ComponentProps) {
  const role = parseUserRole(params.role)

  return role ? <DashboardPage role={role} /> : <NotFoundPage />
}
