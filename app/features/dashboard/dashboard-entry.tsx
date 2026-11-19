import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserRole } from '~/entities/user-role/user-role'
import { PageLoading } from '~/shared/ui/page-loading'

const DashboardPage = lazy(() => import('./dashboard-page').then((module) => ({ default: module.DashboardPage })))

/** Mount inside RoleGuard so guests never download the protected workspace. */
export function DashboardEntry({ role }: { role: UserRole }) {
  const { t } = useTranslation('errors')

  return (
    <Suspense fallback={<PageLoading message={t('loading')} />}>
      <DashboardPage role={role} />
    </Suspense>
  )
}
