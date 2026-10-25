import { LogOut, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import type { UserRole } from '~/entities/user-role/user-role'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { clearAuthSession } from '../auth-session'

interface ForbiddenPageProps {
  currentUserRole?: UserRole | null
  attemptedRole?: UserRole | null
}

export function ForbiddenPage({ currentUserRole, attemptedRole }: ForbiddenPageProps) {
  const { t } = useTranslation('errors')
  const navigate = useNavigate()

  useDocumentTitle(t('forbiddenTitle'))

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  const fallbackDashboardUrl = currentUserRole ? `/dashboard/${currentUserRole}` : '/login'

  return (
    <main className='relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 py-16'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-48 -left-40 size-[32rem] rounded-full bg-danger/10 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute right-[-10rem] bottom-[-15rem] size-[36rem] rounded-full bg-primary/10 blur-3xl'
      />

      <div className='relative z-10 w-full max-w-lg rounded-3xl border border-danger/20 bg-surface/80 p-8 text-center shadow-xl backdrop-blur-md sm:p-10'>
        <div className='mx-auto grid size-16 place-items-center rounded-2xl border border-danger/30 bg-danger/10 text-danger-ink shadow-sm'>
          <ShieldAlert aria-hidden='true' className='size-8' />
        </div>

        <p className='mt-5 text-xs font-bold tracking-widest text-danger-ink uppercase'>403 · {t('forbiddenTitle')}</p>
        <h1 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('forbiddenSub')}</h1>
        <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
          {t('forbiddenDetails', {
            currentRole: currentUserRole ?? 'unknown',
            attemptedRole: attemptedRole ?? 'requested'
          })}
        </p>

        <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center'>
          <Link
            className='inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            to={fallbackDashboardUrl}
          >
            {t('forbiddenAction')}
          </Link>
          <button
            className='inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
            onClick={handleLogout}
            type='button'
          >
            <LogOut aria-hidden='true' className='size-4' />
            {t('forbiddenLoginAgain')}
          </button>
        </div>
      </div>
    </main>
  )
}
