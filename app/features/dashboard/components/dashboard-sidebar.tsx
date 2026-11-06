import {
  LogOut,
  X,
  Grid2X2,
  Boxes,
  PackageCheck,
  Building2,
  CircleDollarSign,
  UsersRound,
  FileChartColumn,
  BellRing,
  Sparkles,
  Settings
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { UserRole } from '~/entities/user-role/user-role'
import { BrandMark } from '~/shared/ui/brand-mark'
import { ItSidebarNav, type ItAdminTabKey } from '../it-admin'
import { employeeMenuItems, type EmployeeTabKey } from '../employee'
import { managerNavItems, type ManagerTabKey } from '../manager'
import { approvalNavItems, type ApprovalTabKey } from '../approvals'
import { FinanceSidebarNav, type FinanceTabKey } from '../finance'
import { superAdminNavItems, type SuperAdminTabKey } from '../super-admin'

const fallbackNavigationItems = [
  { icon: Grid2X2, key: 'overview' },
  { icon: Boxes, key: 'software' },
  { icon: PackageCheck, key: 'licenses' },
  { icon: Building2, key: 'vendors' },
  { icon: CircleDollarSign, key: 'costs' },
  { icon: UsersRound, key: 'people' },
  { icon: FileChartColumn, key: 'reports' },
  { icon: BellRing, key: 'alerts' },
  { icon: Sparkles, key: 'optimize' },
  { icon: Settings, key: 'settings' }
] as const

export interface DashboardSidebarProps {
  employeeSelfServiceOnly?: boolean
  activeApprovalParent: string
  activeApprovalTab: ApprovalTabKey
  activeEmployeeParent: string
  activeEmployeeTab: EmployeeTabKey
  activeFinanceTab: FinanceTabKey
  activeManagerParent: string
  activeManagerTab: ManagerTabKey
  activeParent: string
  activeSuperAdminTab: SuperAdminTabKey
  activeTab: ItAdminTabKey
  mobileNavigationOpen: boolean
  onCloseMobileNavigation: () => void
  onSelectApprovalTab: (tab: ApprovalTabKey) => void
  onSelectEmployeeTab: (tab: EmployeeTabKey) => void
  onSelectFinanceTab: (tab: FinanceTabKey) => void
  onSelectItAdminTab: (tab: ItAdminTabKey) => void
  onSelectManagerTab: (tab: ManagerTabKey, extraParams?: Record<string, string>) => void
  onSelectSuperAdminTab: (tab: SuperAdminTabKey) => void
  openSections: Record<string, boolean>
  role: UserRole
  toggleSection: (key: string) => void
}

export function DashboardSidebar({
  employeeSelfServiceOnly = false,
  activeApprovalParent,
  activeEmployeeParent,
  activeFinanceTab,
  activeManagerParent,
  activeParent,
  activeSuperAdminTab,
  activeTab,
  mobileNavigationOpen,
  onCloseMobileNavigation,
  onSelectApprovalTab,
  onSelectEmployeeTab,
  onSelectFinanceTab,
  onSelectItAdminTab,
  onSelectManagerTab,
  onSelectSuperAdminTab,
  openSections,
  role,
  toggleSection
}: DashboardSidebarProps) {
  const { t } = useTranslation('dashboard')
  const { t: tCommon } = useTranslation('common')
  const { t: translateAdmin } = useTranslation(role === 'super-admin' ? 'admin' : 'common')
  const { t: translateEmployee } = useTranslation(role === 'employee' ? 'employee' : 'common')
  const { t: translateManager } = useTranslation(role === 'manager' ? 'manager' : 'common')
  const { t: translateApprovals } = useTranslation(role === 'spending-approver' ? 'approvals' : 'common')

  const isItAdmin = role === 'it-admin'
  const isEmployee = role === 'employee'
  const isFinance = role === 'finance'
  const isManager = role === 'manager'
  const isApprover = role === 'spending-approver'
  const isSuperAdmin = role === 'super-admin'

  return (
    <>
      {mobileNavigationOpen && (
        <button
          aria-label={t('mobile.closeMenu')}
          className='fixed inset-0 z-40 bg-foreground/35 backdrop-blur-[2px] lg:hidden'
          onClick={onCloseMobileNavigation}
          type='button'
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          mobileNavigationOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id='dashboard-sidebar'
      >
        <div className='flex h-20 items-center justify-between border-b border-border px-5'>
          <div className='flex items-center gap-3'>
            <span className='relative grid size-11 place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_28px_var(--theme-primary-soft)]'>
              <span aria-hidden='true' className='absolute -top-2 -right-2 size-5 rounded-full bg-white/20' />
              <BrandMark className='size-6' />
            </span>
            <div>
              <p className='font-bold tracking-[-0.02em]'>{tCommon('brand')}</p>
              <p className='mt-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                {!isSuperAdmin && !isItAdmin && role !== 'finance' && t('demoNotice')}
              </p>
            </div>
          </div>
          <button
            aria-label={t('mobile.closeMenu')}
            className='grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-surface lg:hidden'
            onClick={onCloseMobileNavigation}
            type='button'
          >
            <X aria-hidden='true' className='size-5' />
          </button>
        </div>

        <nav aria-label={t('navigation.label')} className='flex-1 overflow-y-auto px-4 py-5'>
          {isItAdmin ? (
            <ItSidebarNav
              activeTab={activeTab}
              activeParent={activeParent}
              openSections={openSections}
              onSelectTab={onSelectItAdminTab}
              toggleSection={toggleSection}
            />
          ) : isEmployee ? (
            <ul className='space-y-1.5'>
              {employeeMenuItems
                .filter((item) => !employeeSelfServiceOnly || ['overview', 'handovers', 'privacy'].includes(item.key))
                .map((item) => {
                  const isCurrent = activeEmployeeParent === item.key
                  const Icon = item.icon

                  return (
                    <li key={item.key}>
                      <button
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
                            : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                        }`}
                        onClick={() => onSelectEmployeeTab(item.directTabKey!)}
                        type='button'
                      >
                        <div className='flex items-center gap-3'>
                          <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                          <span>{translateEmployee(item.translationKey)}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold ${
                              isCurrent ? 'bg-white/20 text-white' : 'bg-surface-subtle text-muted-foreground'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
            </ul>
          ) : isManager ? (
            <ul className='space-y-1.5'>
              {managerNavItems.map((item) => {
                const isCurrent = activeManagerParent === item.key
                const Icon = item.icon

                return (
                  <li key={item.key}>
                    <button
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                      onClick={() => onSelectManagerTab(item.key)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' strokeWidth={1.5} />
                        <span>{translateManager(item.liveLabel)}</span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : isApprover ? (
            <ul className='space-y-1.5'>
              {approvalNavItems.map((item) => {
                const isCurrent = activeApprovalParent === item.key
                const Icon = item.icon

                return (
                  <li key={item.key}>
                    <button
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                      onClick={() => onSelectApprovalTab(item.key)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        <span>{translateApprovals(`nav.${item.translationKey}`)}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-surface-subtle text-muted-foreground'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : isFinance ? (
            <FinanceSidebarNav activeTab={activeFinanceTab} onSelectTab={onSelectFinanceTab} />
          ) : isSuperAdmin ? (
            <ul className='space-y-1.5'>
              {superAdminNavItems.map((item) => {
                const isCurrent = activeSuperAdminTab === item.key
                const Icon = item.icon

                return (
                  <li key={item.key}>
                    <button
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                      onClick={() => onSelectSuperAdminTab(item.key)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' strokeWidth={1.5} className='size-[1.125rem] shrink-0' />
                        <span>{translateAdmin(`navigation.${item.translationKey}`)}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-surface-subtle text-muted-foreground'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <ul className='space-y-1.5'>
              {fallbackNavigationItems.map(({ icon: Icon, key }) => {
                const isCurrent = key === 'overview'

                return (
                  <li key={key}>
                    <button
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                      type='button'
                    >
                      <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                      {t(`navigation.${key}`)}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </nav>

        <div className='p-4'>
          <div className='rounded-xl border border-border bg-surface px-3 py-2'>
            <Link
              className='flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:bg-primary-soft hover:text-primary'
              to='/logout'
            >
              <LogOut aria-hidden='true' className='size-4' />
              {t('logout')}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
