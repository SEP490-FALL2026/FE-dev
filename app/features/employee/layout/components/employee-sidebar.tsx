import {
  ArrowRight,
  ChevronDown,
  CirclePlus,
  FileText,
  Home,
  Laptop,
  Lightbulb,
  LogOut,
  ShieldHalf,
  User
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'

const navItems = [
  { to: '/employee/dashboard', icon: Home, labelKey: 'layout.nav.dashboard' },
  { to: '/employee/my-software', icon: Laptop, labelKey: 'layout.nav.mySoftware' },
  { to: '/employee/my-requests', icon: FileText, labelKey: 'layout.nav.myRequests' },
  { to: '/employee/create-request', icon: CirclePlus, labelKey: 'layout.nav.createRequest' }
] as const

export function EmployeeSidebar() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <aside className='flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white'>
      {/* Logo */}
      <div className='mb-6 flex h-16 items-center border-b border-neutral-200 px-6'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white'>
            <ShieldHalf className='h-4 w-4' />
          </div>
          <div>
            <h1 className='text-lg font-bold leading-tight text-neutral-900'>{t('common.brand')}</h1>
            <p className='text-xs text-neutral-500'>{t('common.brandSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-8 overflow-y-auto px-4'>
        <div>
          <h2 className='mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500/70'>
            {t('layout.nav.sectionEmployee')}
          </h2>
          <ul className='space-y-1'>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-100 font-semibold text-brand-500'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                    }`
                  }
                  to={item.to}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-500' : ''}`} />
                      {t(item.labelKey)}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className='border-t border-neutral-200 pt-6'>
          <ul className='space-y-1'>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-100 font-semibold text-brand-600'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
                to='/employee/profile'
              >
                {({ isActive }) => (
                  <>
                    <span className='flex items-center gap-3'>
                      <User className={`h-5 w-5 ${isActive ? 'text-brand-500' : ''}`} />
                      {t('layout.nav.myProfile')}
                    </span>
                    {isActive && <ChevronDown className='h-4 w-4 text-brand-600' />}
                  </>
                )}
              </NavLink>

              {location.pathname === '/employee/profile' && (
                <div className='mt-1.5 ml-5 flex flex-col gap-1 border-l-2 border-neutral-200 pl-4'>
                  <a
                    className='py-1 text-xs font-medium text-neutral-500 transition-colors hover:text-brand-600'
                    href='#personal-info'
                  >
                    {t('profile.subnav.profile')}
                  </a>
                  <a
                    className='flex items-center gap-1.5 py-1 text-xs font-semibold text-brand-600 transition-colors'
                    href='#data-privacy'
                  >
                    <span className='h-1.5 w-1.5 rounded-full bg-brand-500' />
                    {t('profile.subnav.dataPrivacy')}
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Help Banner */}
      <div className='mt-auto p-4'>
        <div className='relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4'>
          <div className='relative z-10'>
            <h3 className='mb-1 text-sm font-semibold text-neutral-900'>{t('layout.helpBanner.title')}</h3>
            <p className='mb-3 text-xs text-neutral-500'>{t('layout.helpBanner.subtitle')}</p>
            <button
              className='flex w-full items-center justify-center gap-1 rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-500 transition-colors hover:bg-brand-100/40'
              type='button'
            >
              {t('layout.helpBanner.action')}
              <ArrowRight className='h-3 w-3' />
            </button>
          </div>
          <div className='absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100'>
            <Lightbulb className='h-5 w-5 text-brand-500' />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className='border-t border-neutral-200 p-4'>
        <button
          className='flex w-full items-center gap-3 px-3 py-2 text-sm text-neutral-500 transition-colors hover:text-brand-500'
          type='button'
        >
          <LogOut className='h-5 w-5' />
          {t('layout.nav.logout')}
        </button>
      </div>
    </aside>
  )
}
