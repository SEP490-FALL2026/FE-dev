import {
  BarChart3,
  Bell,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  Plus,
  Settings,
  Shield,
  UserRound,
  UsersRound
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

const items = [
  { key: 'notifications', icon: Bell, count: 6 },
  { key: 'profile', icon: UserRound },
  { key: 'settings', icon: Settings }
] as const

export function ManagerSidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { t, i18n } = useTranslation()
  const [support, setSupport] = useState(false)
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const unavailable = t('manager.unavailable')
  return (
    <aside
      className={
        mobile ? 'flex flex-col bg-white' : 'flex h-full min-h-0 w-64 flex-col border-r border-neutral-200 bg-white'
      }
    >
      <div className='flex h-16 shrink-0 items-center gap-3 border-b border-neutral-200 px-6'>
        <span className='flex size-8 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm'>
          <Shield size={20} aria-hidden='true' />
        </span>
        <div>
          <p className='text-base leading-tight font-bold'>{t('common.brand')}</p>
          <p className='text-xs text-neutral-500'>{t('common.brandSubtitle')}</p>
        </div>
      </div>
      <nav aria-label={t('manager.navigation')} className='flex-1 space-y-1 overflow-y-auto px-4 py-4 text-sm'>
        <NavLink
          to='/manager/dashboard'
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg hover:text-brand-600'}`
          }
        >
          <LayoutDashboard size={20} aria-hidden='true' />
          {t('manager.dashboard')}
        </NavLink>
        <NavLink
          to='/manager/my-team'
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg hover:text-brand-600'}`
          }
        >
          <UsersRound size={20} aria-hidden='true' />
          {t('manager.team')}
        </NavLink>
        <NavLink
          to='/manager/team-software'
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg hover:text-brand-600'}`
          }
        >
          <BarChart3 size={20} aria-hidden='true' />
          {t('manager.software')}
        </NavLink>
        <details open className='pt-2'>
          <summary className='flex cursor-pointer list-none items-center justify-between rounded-xl bg-brand-bg px-3 py-2'>
            <span className='flex items-center gap-3 font-semibold'>
              <ClipboardList size={20} aria-hidden='true' />
              {t('manager.requests')}
            </span>
            <ChevronDown size={14} aria-hidden='true' />
          </summary>
          <NavLink
            to='/manager/team-requests'
            onClick={onNavigate}
            className={({ isActive }) =>
              `mt-1 flex rounded-lg py-2 pr-3 pl-14 text-xs font-medium ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg'}`
            }
          >
            {t('teamRequests.title')}
          </NavLink>
          <button
            type='button'
            disabled
            title={unavailable}
            className='mt-1 flex w-full items-center justify-between py-2 pr-6 pl-14 text-left text-xs text-neutral-500 disabled:cursor-not-allowed'
          >
            {t('manager.pendingApprovals')}
            <span className='rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white'>
              {number.format(4)}
            </span>
          </button>
        </details>
        <details open className='pt-2'>
          <summary className='flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-neutral-500'>
            <span className='flex items-center gap-3'>
              <FileCheck2 size={20} aria-hidden='true' />
              {t('manager.licenseReview')}
            </span>
            <ChevronDown size={14} aria-hidden='true' />
          </summary>
          <NavLink
            to='/manager/ghost-seat-review'
            onClick={onNavigate}
            className={({ isActive }) =>
              `mt-1 flex rounded-lg py-2 pr-3 pl-14 text-xs font-medium ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg'}`
            }
          >
            {t('ghostSeat.title')}
          </NavLink>
          <NavLink
            to='/manager/access-review'
            onClick={onNavigate}
            className={({ isActive }) =>
              `mt-1 flex items-center justify-between rounded-lg py-2 pr-3 pl-14 text-xs font-medium ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg'}`
            }
          >
            {t('manager.accessReview')}
            <span className='rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white'>
              {number.format(7)}
            </span>
          </NavLink>
        </details>
        <div className='mt-4 space-y-1 border-t border-neutral-200 pt-4'>
          <NavLink
            to='/manager/create-request'
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 font-medium ${isActive ? 'bg-brand-100 text-brand-600' : 'text-neutral-500 hover:bg-brand-bg'}`
            }
          >
            <Plus size={20} aria-hidden='true' />
            {t('manager.createRequest')}
          </NavLink>
          {items.map((item) => (
            <button
              key={item.key}
              type='button'
              disabled
              title={unavailable}
              className='flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-neutral-500 disabled:cursor-not-allowed'
            >
              <item.icon size={20} aria-hidden='true' />
              <span className='flex-1'>{t(`manager.${item.key}`)}</span>
              {'count' in item && (
                <span className='rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white'>
                  {number.format(item.count)}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
      <div className='shrink-0 space-y-3 border-t border-neutral-200 p-4'>
        <div className='space-y-2.5 rounded-2xl border border-neutral-200 bg-brand-bg p-4'>
          <div className='flex items-center gap-2.5'>
            <span className='rounded-xl bg-brand-100 p-2 text-brand-600'>
              <LifeBuoy size={16} aria-hidden='true' />
            </span>
            <h2 className='text-xs font-semibold'>{t('manager.help')}</h2>
          </div>
          <p className='text-[11px] leading-relaxed text-neutral-500'>{t('manager.helpDescription')}</p>
          <button
            type='button'
            onClick={() => setSupport(!support)}
            aria-expanded={support}
            className='w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-100'
          >
            {t('manager.contact')}
          </button>
          {support && (
            <p role='status' className='text-xs text-neutral-500'>
              {t('manager.supportUnavailable')}
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
