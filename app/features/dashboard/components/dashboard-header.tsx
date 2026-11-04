import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UserRole } from '~/entities/user-role/user-role'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'
import type { RoleProfile } from '../dashboard-data'
import { FinanceWorkspaceSearch } from '../finance'
import { ApprovalsWorkspaceSearch } from '../approvals'
import { EmployeeNotificationBell } from '../employee'
import { ManagerNotificationBell } from '../manager'

export interface DashboardHeaderProps {
  activeEmployeeTab?: string
  activeManagerTab?: string
  employeeAvatarUrl: string | null
  mobileNavigationOpen: boolean
  onOpenProfile?: () => void
  onToggleMobileNavigation: () => void
  profile: RoleProfile
  role: UserRole
}

export function DashboardHeader({
  activeEmployeeTab,
  activeManagerTab,
  employeeAvatarUrl,
  mobileNavigationOpen,
  onOpenProfile,
  onToggleMobileNavigation,
  profile,
  role
}: DashboardHeaderProps) {
  const { t } = useTranslation('dashboard')
  const { t: tAuth } = useTranslation('auth')
  const isEmployee = role === 'employee'
  const isProfileActive =
    (isEmployee && activeEmployeeTab === 'profile') || (role === 'manager' && activeManagerTab === 'profile')

  return (
    <header className='sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-[100rem] items-center gap-3'>
        <button
          aria-controls='dashboard-sidebar'
          aria-expanded={mobileNavigationOpen}
          aria-label={t(mobileNavigationOpen ? 'mobile.closeMenu' : 'mobile.openMenu')}
          className='grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground lg:hidden'
          onClick={onToggleMobileNavigation}
          type='button'
        >
          {mobileNavigationOpen ? (
            <X aria-hidden='true' className='size-5' />
          ) : (
            <Menu aria-hidden='true' className='size-5' />
          )}
        </button>

        {role === 'finance' && <FinanceWorkspaceSearch />}
        {role === 'spending-approver' && <ApprovalsWorkspaceSearch />}
        <div className={role === 'finance' || role === 'spending-approver' ? 'max-sm:ml-auto' : 'ml-auto'}>
          <ThemeSwitch />
        </div>
        <LanguageSwitch />
        {isEmployee && <EmployeeNotificationBell />}
        {role === 'manager' && <ManagerNotificationBell />}

        <button
          aria-current={isProfileActive ? 'page' : undefined}
          aria-label={
            isEmployee
              ? t('employee.profile.openProfile')
              : role === 'manager'
                ? t('manager.profile.openProfile', { defaultValue: 'Hồ sơ cá nhân' })
                : undefined
          }
          className='flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pr-3 pl-1.5 text-left transition enabled:hover:border-primary enabled:hover:bg-primary-soft/30 enabled:focus-visible:outline-2 enabled:focus-visible:outline-offset-2 enabled:focus-visible:outline-primary'
          disabled={!onOpenProfile}
          onClick={onOpenProfile}
          type='button'
        >
          <span className='grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary text-xs font-bold text-primary-foreground'>
            {isEmployee && employeeAvatarUrl ? (
              <img alt='' className='size-full object-cover' src={employeeAvatarUrl} />
            ) : (
              profile.initials
            )}
          </span>
          <div className='hidden min-w-0 md:block'>
            <p className='truncate text-xs font-bold'>{profile.displayName}</p>
            <p className='truncate text-[0.68rem] text-muted-foreground' data-testid='dashboard-role'>
              {tAuth(`roles.${role}.label`)}
            </p>
          </div>
        </button>
      </div>
    </header>
  )
}
