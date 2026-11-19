import { useSyncExternalStore, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router'

import type { UserRole } from '~/entities/user-role/user-role'
import { PageLoading } from '~/shared/ui/page-loading'
import { getAuthState, initializeAuthSession, subscribeAuthSession } from '../auth-session'
import { ForbiddenPage } from '../views/forbidden-page'

interface RoleGuardProps {
  requiredRole: UserRole
  children: ReactNode
}

export function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const location = useLocation()
  const { t } = useTranslation('auth')
  const state = useSyncExternalStore(subscribeAuthSession, getAuthState, getAuthState)

  if (state.status === 'checking') {
    return <PageLoading message={t('session.checking')} />
  }
  if (state.status === 'unavailable') {
    return (
      <main className='grid min-h-screen place-items-center bg-background px-5'>
        <div className='max-w-sm text-center'>
          <p role='alert' className='text-sm text-foreground'>
            {t('session.unavailable')}
          </p>
          <button
            type='button'
            className='mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground'
            onClick={() => void initializeAuthSession()}
          >
            {t('session.retry')}
          </button>
        </div>
      </main>
    )
  }
  if (!state.session) {
    return <Navigate replace to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} />
  }
  if (!state.session.roles.includes(requiredRole)) {
    return <ForbiddenPage attemptedRole={requiredRole} currentUserRole={state.session.role} />
  }
  return <>{children}</>
}
