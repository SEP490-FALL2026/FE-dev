import { CalendarDays, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { UserRole } from '~/entities/user-role/user-role'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { SentryMascot } from '~/shared/ui/sentry-mascot'
import { ThemeSwitch } from '~/shared/ui/theme-switch'
import type { RoleProfile } from '../dashboard-data'
import { EmployeeNotificationBell } from '../employee'
import { ManagerNotificationBell } from '../manager'
import { ItNotificationBell } from '../it-admin'

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
  const { t: translate, i18n } = useTranslation('dashboard')
  const { t: translateAuth } = useTranslation('auth')
  const [now] = useState(() => new Date())
  const hour = now.getHours()
  const greetingKey =
    hour < 11 ? 'shell.greetingMorning' : hour < 18 ? 'shell.greetingAfternoon' : 'shell.greetingEvening'
  // Display names can be role titles ("Quản trị hệ thống"), so the full name is shown rather than a guessed given name.
  const displayName = profile.displayName.trim()
  const today = new Intl.DateTimeFormat(i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  }).format(now)
  const mascotMessages = [
    translate('shell.mascot.hello'),
    translate(`shell.mascot.tips.${role}.first`),
    translate(`shell.mascot.tips.${role}.second`),
    translate('shell.mascot.goodbye')
  ]
  const isEmployee = role === 'employee'
  const isManager = role === 'manager'
  const [brokenAvatar, setBrokenAvatar] = useState<string | null>(null)
  const isProfileActive =
    (isEmployee && activeEmployeeTab === 'profile') || (isManager && activeManagerTab === 'profile')

  return (
    <header className='dashboard-topbar-wrap sticky top-0 z-30 px-3 pt-3 pb-1 sm:px-6 lg:px-8 lg:pt-3'>
      <div className='dashboard-topbar mx-auto flex max-w-[100rem] items-center gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-4'>
        <button
          aria-controls='dashboard-sidebar'
          aria-expanded={mobileNavigationOpen}
          aria-label={translate(mobileNavigationOpen ? 'mobile.closeMenu' : 'mobile.openMenu')}
          className='grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground lg:hidden'
          onClick={onToggleMobileNavigation}
          type='button'
        >
          {mobileNavigationOpen ? (
            <X aria-hidden='true' className='size-5' strokeWidth={1.5} />
          ) : (
            <Menu aria-hidden='true' className='size-5' strokeWidth={1.5} />
          )}
        </button>

        <div className='hidden shrink-0 sm:block'>
          <SentryMascot interactive={{ label: translate('shell.mascot.label'), messages: mascotMessages }} size={60} />
        </div>

        <div className='hidden min-w-0 sm:block'>
          <p className='truncate text-lg leading-tight font-semibold tracking-tight'>
            {displayName
              ? translate('shell.greetingNamed', { greeting: translate(greetingKey), name: displayName })
              : translate(greetingKey)}
          </p>
          <p className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
            <CalendarDays aria-hidden='true' className='size-3.5 shrink-0' strokeWidth={1.5} />
            <span className='truncate first-letter:uppercase'>{today}</span>
          </p>
        </div>

        <div className='ml-auto flex items-center gap-2 sm:gap-2.5'>
          <ThemeSwitch />
          <LanguageSwitch />
          {isEmployee && <EmployeeNotificationBell />}
          {isManager && <ManagerNotificationBell />}
          {role === 'it-admin' && <ItNotificationBell />}

          <button
            aria-current={isProfileActive ? 'page' : undefined}
            aria-label={
              isEmployee
                ? translate('employee.profile.openProfile')
                : isManager
                  ? translate('manager.profile.openProfile', { defaultValue: 'Hồ sơ cá nhân' })
                  : undefined
            }
            className='flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pr-1.5 pl-1.5 text-left transition-colors enabled:hover:border-primary/50 enabled:hover:bg-primary-soft/30 enabled:focus-visible:outline-2 enabled:focus-visible:outline-offset-2 enabled:focus-visible:outline-primary md:pr-3'
            disabled={!onOpenProfile}
            onClick={onOpenProfile}
            type='button'
          >
            <span className='grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary text-xs font-bold text-primary-foreground ring-1 ring-black/10 ring-inset'>
              {(isEmployee || isManager) && employeeAvatarUrl && employeeAvatarUrl !== brokenAvatar ? (
                <img
                  alt=''
                  className='size-full object-cover'
                  src={employeeAvatarUrl}
                  onError={() => setBrokenAvatar(employeeAvatarUrl)}
                />
              ) : (
                profile.initials
              )}
            </span>
            <div className='hidden min-w-0 md:block'>
              <p className='max-w-40 truncate text-xs font-bold' title={profile.displayName}>
                {profile.displayName}
              </p>
              <p className='truncate text-[0.68rem] text-muted-foreground' data-testid='dashboard-role'>
                {translateAuth(`roles.${role}.label`)}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
