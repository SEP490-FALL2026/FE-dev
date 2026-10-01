import {
  Bell,
  BellRing,
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileChartColumn,
  Grid2X2,
  Layers3,
  Lightbulb,
  LogOut,
  Menu,
  PackageCheck,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'

import type { UserRole } from '~/entities/user-role/user-role'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'

import { CategoryChart, CostChart } from './dashboard-charts'
import { alerts, categoryCosts, notificationCount, recentSoftware, roleProfiles, topSoftware } from './dashboard-data'
import { getParentMenuKey, itAdminMenuItems, isValidItAdminTab, type ItAdminTabKey } from './it-admin/it-admin-nav'
import { ItDeviceCollectorsView } from './it-admin/views/it-device-collectors-view'
import { ItOffboardingView } from './it-admin/views/it-offboarding-view'
import { ItOptimizationView } from './it-admin/views/it-optimization-view'
import { ItOverviewView } from './it-admin/views/it-overview-view'
import { ItProvisioningView } from './it-admin/views/it-provisioning-view'
import { ItReconciliationView } from './it-admin/views/it-reconciliation-view'
import { ItShadowItView } from './it-admin/views/it-shadow-it-view'
import { ItUnmatchedIdentitiesView } from './it-admin/views/it-unmatched-identities-view'
import { ItUsageImportView } from './it-admin/views/it-usage-import-view'
import {
  employeeMenuItems,
  getParentEmployeeMenuKey,
  isValidEmployeeTab,
  type EmployeeTabKey
} from './employee/employee-nav'
import { EmployeeCreateRequestView } from './employee/views/employee-create-request-view'
import { EmployeeDataExportView } from './employee/views/employee-data-export-view'
import { EmployeeDataUsageView } from './employee/views/employee-data-usage-view'
import { EmployeeMyRequestsView } from './employee/views/employee-my-requests-view'
import { EmployeeMySoftwareView } from './employee/views/employee-my-software-view'
import { EmployeeOverviewView } from './employee/views/employee-overview-view'
import { EmployeeProfileView } from './employee/views/employee-profile-view'
import { EmployeeRequestDetailView } from './employee/views/employee-request-detail-view'
import { EmployeeRequestNewSoftwareView } from './employee/views/employee-request-new-software-view'
import { EmployeeReturnLicenseView } from './employee/views/employee-return-license-view'
import { EmployeeReviewRequestView } from './employee/views/employee-review-request-view'
import { EmployeeSoftwareDetailView } from './employee/views/employee-software-detail-view'
import { EmployeeSubmissionSuccessView } from './employee/views/employee-submission-success-view'
import { EmployeeTemporaryRenewalView } from './employee/views/employee-temporary-renewal-view'
import {
  approvalNavItems,
  getParentApprovalMenuKey,
  isValidApprovalTab,
  type ApprovalTabKey
} from './approvals/approvals-nav'
import { ApprovalQueueView } from './approvals/views/approval-queue-view'
import { ApprovalsOverviewView } from './approvals/views/approvals-overview-view'
import { ApproverReportsView } from './approvals/views/approver-reports-view'
import { ExpenseApprovalView } from './approvals/views/expense-approval-view'
import { RenewalDecisionView } from './approvals/views/renewal-decision-view'
import { financeNavItems, getParentFinanceMenuKey, isValidFinanceTab, type FinanceTabKey } from './finance/finance-nav'
import { FinanceBudgetSnapshotView } from './finance/views/finance-budget-snapshot-view'
import { FinanceHeldCommitmentsView } from './finance/views/finance-held-commitments-view'
import { FinanceOverviewView } from './finance/views/finance-overview-view'
import { FinanceRenewalScheduleView } from './finance/views/finance-renewal-schedule-view'
import { FinanceShadowItView } from './finance/views/finance-shadow-it-view'
import { FinanceSoftwareDirectoryView } from './finance/views/finance-software-directory-view'
import { managerNavItems, getParentManagerMenuKey, isValidManagerTab, type ManagerTabKey } from './manager/manager-nav'
import { ManagerAccessReviewView } from './manager/views/manager-access-review-view'
import { ManagerCreateEmployeeRequestView } from './manager/views/manager-create-employee-request-view'
import { ManagerEmployeeDetailView } from './manager/views/manager-employee-detail-view'
import { ManagerGhostSeatDetailView } from './manager/views/manager-ghost-seat-detail-view'
import { ManagerGhostSeatReviewView } from './manager/views/manager-ghost-seat-review-view'
import { ManagerMyTeamView } from './manager/views/manager-my-team-view'
import { ManagerOverviewView } from './manager/views/manager-overview-view'
import { ManagerRequestApprovalView } from './manager/views/manager-request-approval-view'
import { ManagerTeamRequestsView } from './manager/views/manager-team-requests-view'
import { ManagerTeamSoftwareView } from './manager/views/manager-team-software-view'

const navigationItems = [
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

const alertIcons: Record<(typeof alerts)[number]['key'], LucideIcon> = {
  expiring: ShieldAlert,
  inactive: BellRing,
  overLimit: CircleDollarSign,
  unclassified: Boxes
}

const alertToneClasses: Record<(typeof alerts)[number]['tone'], string> = {
  danger: 'bg-danger/12 text-danger',
  info: 'bg-info/12 text-info',
  warning: 'bg-warning/15 text-warning'
}

function DashboardCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>{children}</div>
}

export function DashboardPage({ role }: { role: UserRole }) {
  const { i18n, t } = useTranslation('dashboard')
  const { t: tAuth } = useTranslation('auth')
  const { t: tCommon } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const profile = roleProfiles[role]
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'

  const isItAdmin = role === 'it-admin'
  const isEmployee = role === 'employee'
  const isFinance = role === 'finance'
  const isManager = role === 'manager'
  const isApprover = role === 'spending-approver'
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: ItAdminTabKey = isItAdmin && isValidItAdminTab(tabParam) ? tabParam : 'overview'
  const activeParent = isItAdmin ? getParentMenuKey(activeTab) : 'overview'

  const activeEmployeeTab: EmployeeTabKey = isEmployee && isValidEmployeeTab(tabParam) ? tabParam : 'overview'
  const activeEmployeeParent = isEmployee ? getParentEmployeeMenuKey(activeEmployeeTab) : 'overview'

  const activeManagerTab: ManagerTabKey = isManager && isValidManagerTab(tabParam) ? tabParam : 'overview'
  const activeManagerParent = isManager ? getParentManagerMenuKey(activeManagerTab) : 'overview'

  const activeApprovalTab: ApprovalTabKey = isApprover && isValidApprovalTab(tabParam) ? tabParam : 'overview'
  const activeApprovalParent = isApprover ? getParentApprovalMenuKey(activeApprovalTab) : 'overview'

  const activeFinanceTab: FinanceTabKey = isFinance && isValidFinanceTab(tabParam) ? tabParam : 'overview'
  const activeFinanceParent = isFinance ? getParentFinanceMenuKey(activeFinanceTab) : 'overview'

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    licenses: true,
    optimize: true,
    people: true,
    'usage-sources': true
  })

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelectTab = (tab: ItAdminTabKey) => {
    if (tab === 'overview') {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('tab')
      setSearchParams(nextParams)
    } else {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('tab', tab)
      setSearchParams(nextParams)
    }
    setMobileNavigationOpen(false)
  }

  const handleSelectEmployeeTab = (tab: EmployeeTabKey, extraParams?: Record<string, string>) => {
    const nextParams = new URLSearchParams()
    if (tab !== 'overview') {
      nextParams.set('tab', tab)
    }
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => nextParams.set(k, v))
    }
    setSearchParams(nextParams)
    setMobileNavigationOpen(false)
  }

  const handleSelectManagerTab = (tab: ManagerTabKey, extraParams?: Record<string, string>) => {
    const nextParams = new URLSearchParams()
    if (tab !== 'overview') {
      nextParams.set('tab', tab)
    }
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => nextParams.set(k, v))
    }
    setSearchParams(nextParams)
    setMobileNavigationOpen(false)
  }

  const handleSelectApprovalTab = (tab: ApprovalTabKey, extraParams?: Record<string, string>) => {
    const nextParams = new URLSearchParams()
    if (tab !== 'overview') {
      nextParams.set('tab', tab)
    }
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => nextParams.set(k, v))
    }
    setSearchParams(nextParams)
    setMobileNavigationOpen(false)
  }

  const handleSelectFinanceTab = (tab: FinanceTabKey, extraParams?: Record<string, string>) => {
    const nextParams = new URLSearchParams()
    if (tab !== 'overview') {
      nextParams.set('tab', tab)
    }
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => nextParams.set(k, v))
    }
    setSearchParams(nextParams)
    setMobileNavigationOpen(false)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { currency: 'VND', maximumFractionDigits: 0, style: 'currency' }).format(value)
  const formatCompact = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1, notation: 'compact' }).format(value)
  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value)
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
      new Date(`${value}T00:00:00`)
    )
  const formatMonth = (value: string) =>
    new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(`${value}T00:00:00`))

  useDocumentTitle(t('documentTitle'))

  const metricCards = [
    {
      icon: Boxes,
      key: 'software',
      trendDown: false,
      value: formatNumber(128)
    },
    {
      icon: PackageCheck,
      key: 'licenses',
      trendDown: false,
      value: formatNumber(1_245)
    },
    {
      icon: CircleDollarSign,
      key: 'cost',
      trendDown: true,
      value: formatCurrency(1_245_800_000)
    },
    {
      icon: WalletCards,
      key: 'savings',
      trendDown: false,
      value: formatCurrency(245_800_000)
    }
  ] as const

  return (
    <div className='min-h-screen bg-background'>
      {mobileNavigationOpen && (
        <button
          aria-label={t('mobile.closeMenu')}
          className='fixed inset-0 z-40 bg-foreground/35 backdrop-blur-[2px] lg:hidden'
          onClick={() => setMobileNavigationOpen(false)}
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
              <Layers3 aria-hidden='true' className='size-5' />
            </span>
            <div>
              <p className='font-bold tracking-[-0.02em]'>{tCommon('brand')}</p>
              <p className='mt-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                {t('demoNotice')}
              </p>
            </div>
          </div>
          <button
            aria-label={t('mobile.closeMenu')}
            className='grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-surface lg:hidden'
            onClick={() => setMobileNavigationOpen(false)}
            type='button'
          >
            <X aria-hidden='true' className='size-5' />
          </button>
        </div>

        <nav aria-label={t('navigation.label')} className='flex-1 overflow-y-auto px-4 py-5'>
          {isItAdmin ? (
            <ul className='space-y-1.5'>
              {itAdminMenuItems.map((item) => {
                if (item.directTabKey) {
                  const isCurrent = activeTab === item.directTabKey
                  const Icon = item.icon

                  return (
                    <li key={item.key}>
                      <button
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
                            : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                        }`}
                        onClick={() => handleSelectTab(item.directTabKey!)}
                        type='button'
                      >
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        {t(`navigation.${item.translationKey}`)}
                      </button>
                    </li>
                  )
                }

                const isOpen = openSections[item.key] ?? false
                const isParentActive = activeParent === item.key
                const Icon = item.icon

                return (
                  <li className='space-y-1' key={item.key}>
                    <button
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                        isParentActive
                          ? 'border border-primary/20 bg-primary-soft/50 font-bold text-primary'
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                      onClick={() => toggleSection(item.key)}
                      type='button'
                    >
                      <div className='flex min-w-0 items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        <span className='truncate'>{t(`navigation.${item.translationKey}`)}</span>
                      </div>
                      <ChevronDown
                        aria-hidden='true'
                        className={`size-4 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && item.children && (
                      <ul className='ml-4 space-y-1 border-l-2 border-border/70 pl-2.5 pt-0.5'>
                        {item.children.map((subItem) => {
                          const isSubCurrent = activeTab === subItem.key
                          const SubIcon = subItem.icon

                          return (
                            <li key={subItem.key}>
                              <button
                                aria-current={isSubCurrent ? 'page' : undefined}
                                className={`group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                                  isSubCurrent
                                    ? 'bg-primary font-bold text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                                }`}
                                onClick={() => handleSelectTab(subItem.key)}
                                type='button'
                              >
                                <div className='flex min-w-0 items-center gap-2'>
                                  <SubIcon
                                    aria-hidden='true'
                                    className={`size-3.5 shrink-0 ${isSubCurrent ? 'opacity-100' : 'opacity-80'}`}
                                  />
                                  <span className='truncate'>{t(`itAdmin.nav.${subItem.translationKey}`)}</span>
                                </div>
                                {subItem.badge !== undefined && (
                                  <span
                                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold ${
                                      isSubCurrent
                                        ? 'bg-white/20 text-white'
                                        : 'bg-surface-subtle text-muted-foreground'
                                    }`}
                                  >
                                    {subItem.badge}
                                  </span>
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : isEmployee ? (
            <ul className='space-y-1.5'>
              {employeeMenuItems.map((item) => {
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
                      onClick={() => handleSelectEmployeeTab(item.directTabKey!)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        <span>{t(`employee.nav.${item.translationKey}`)}</span>
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
                      onClick={() => handleSelectManagerTab(item.key)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        <span>{t(`manager.nav.${item.translationKey}`)}</span>
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
                      onClick={() => handleSelectApprovalTab(item.key)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        <span>{t(`approvals.nav.${item.translationKey}`)}</span>
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
            <ul className='space-y-1.5'>
              {financeNavItems.map((item) => {
                const isCurrent = activeFinanceParent === item.key
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
                      onClick={() => handleSelectFinanceTab(item.key)}
                      type='button'
                    >
                      <div className='flex items-center gap-3'>
                        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
                        <span>{t(`finance.nav.${item.translationKey}`)}</span>
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
              {navigationItems.map(({ icon: Icon, key }) => {
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

        <div className='space-y-3 p-4'>
          <div className='rounded-2xl border border-primary/20 bg-primary-soft/65 p-4 text-center'>
            <span className='mx-auto grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground'>
              <WalletCards aria-hidden='true' className='size-5' />
            </span>
            <p className='mt-3 text-xs font-semibold text-muted-foreground'>{t('savings.title')}</p>
            <p className='mt-1 text-lg font-bold text-primary'>{formatCurrency(245_800_000)}</p>
            <p className='mt-1 text-xs text-muted-foreground'>{t('savings.period')}</p>
            <button className='mt-3 text-xs font-bold text-primary hover:underline' type='button'>
              {t('savings.action')}
            </button>
          </div>
          <div className='flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2'>
            <ThemeSwitch />
            <Link
              className='inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:bg-primary-soft hover:text-primary'
              to='/login'
            >
              <LogOut aria-hidden='true' className='size-4' />
              {t('logout')}
            </Link>
          </div>
        </div>
      </aside>

      <div className='min-w-0 lg:pl-72'>
        <header className='sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8'>
          <div className='mx-auto flex max-w-[100rem] items-center gap-3'>
            <button
              aria-controls='dashboard-sidebar'
              aria-expanded={mobileNavigationOpen}
              aria-label={t(mobileNavigationOpen ? 'mobile.closeMenu' : 'mobile.openMenu')}
              className='grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground lg:hidden'
              onClick={() => setMobileNavigationOpen((open) => !open)}
              type='button'
            >
              {mobileNavigationOpen ? (
                <X aria-hidden='true' className='size-5' />
              ) : (
                <Menu aria-hidden='true' className='size-5' />
              )}
            </button>

            <div className='relative ml-auto hidden w-full max-w-md sm:block'>
              <Search
                aria-hidden='true'
                className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground'
              />
              <input
                aria-label={t('header.searchLabel')}
                className='h-11 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary-soft'
                placeholder={t('header.searchPlaceholder')}
                type='search'
              />
            </div>

            <LanguageSwitch />
            <button
              aria-label={t('header.notifications')}
              className='relative grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary'
              type='button'
            >
              <Bell aria-hidden='true' className='size-[1.125rem]' />
              <span className='absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-danger text-[0.6rem] font-bold text-white'>
                {notificationCount}
              </span>
            </button>

            <div className='flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pr-3 pl-1.5'>
              <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground'>
                {profile.initials}
              </span>
              <div className='hidden min-w-0 md:block'>
                <p className='truncate text-xs font-bold'>{profile.displayName}</p>
                <p className='truncate text-[0.68rem] text-muted-foreground' data-testid='dashboard-role'>
                  {tAuth(`roles.${role}.label`)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          animate={{ opacity: 1, y: 0 }}
          className='mx-auto max-w-[100rem] p-4 sm:p-6 lg:p-8'
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          key={isItAdmin ? activeTab : isEmployee ? activeEmployeeTab : 'general'}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {isItAdmin ? (
            activeTab === 'overview' ? (
              <ItOverviewView
                formatCompact={formatCompact}
                formatCurrency={formatCurrency}
                formatMonth={formatMonth}
                formatNumber={formatNumber}
                onSelectTab={handleSelectTab}
              />
            ) : activeTab === 'provisioning' ? (
              <ItProvisioningView />
            ) : activeTab === 'reconciliation' ? (
              <ItReconciliationView />
            ) : activeTab === 'usage-import' ? (
              <ItUsageImportView />
            ) : activeTab === 'unmatched-identities' ? (
              <ItUnmatchedIdentitiesView />
            ) : activeTab === 'device-collectors' ? (
              <ItDeviceCollectorsView />
            ) : activeTab === 'license-optimization' ? (
              <ItOptimizationView formatCurrency={formatCurrency} />
            ) : activeTab === 'shadow-it' ? (
              <ItShadowItView />
            ) : (
              <ItOffboardingView />
            )
          ) : isEmployee ? (
            activeEmployeeTab === 'overview' ? (
              <EmployeeOverviewView
                displayName={profile.displayName}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
                onSelectTab={handleSelectEmployeeTab}
              />
            ) : activeEmployeeTab === 'my-software' ? (
              <EmployeeMySoftwareView onSelectTab={handleSelectEmployeeTab} />
            ) : activeEmployeeTab === 'software-detail' ? (
              <EmployeeSoftwareDetailView
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectEmployeeTab}
                softwareId={searchParams.get('id') || '1'}
              />
            ) : activeEmployeeTab === 'my-requests' ? (
              <EmployeeMyRequestsView onSelectTab={handleSelectEmployeeTab} />
            ) : activeEmployeeTab === 'request-detail' ? (
              <EmployeeRequestDetailView
                onSelectTab={handleSelectEmployeeTab}
                requestId={searchParams.get('id') || 'REQ-1024'}
              />
            ) : activeEmployeeTab === 'create-request' ? (
              <EmployeeCreateRequestView onSelectTab={handleSelectEmployeeTab} />
            ) : activeEmployeeTab === 'request-new-software' ? (
              <EmployeeRequestNewSoftwareView
                onSelectTab={handleSelectEmployeeTab}
                preselectedSoftwareId={searchParams.get('softwareId') || 'figma'}
              />
            ) : activeEmployeeTab === 'temporary-renewal' ? (
              <EmployeeTemporaryRenewalView
                onSelectTab={handleSelectEmployeeTab}
                softwareId={searchParams.get('softwareId') || undefined}
              />
            ) : activeEmployeeTab === 'return-license' ? (
              <EmployeeReturnLicenseView
                onSelectTab={handleSelectEmployeeTab}
                softwareId={searchParams.get('softwareId') || undefined}
              />
            ) : activeEmployeeTab === 'review-request' ? (
              <EmployeeReviewRequestView
                onSelectTab={handleSelectEmployeeTab}
                requestParams={Object.fromEntries(searchParams.entries())}
              />
            ) : activeEmployeeTab === 'submission-success' ? (
              <EmployeeSubmissionSuccessView
                onSelectTab={handleSelectEmployeeTab}
                requestId={searchParams.get('id') || 'REQ-1027'}
              />
            ) : activeEmployeeTab === 'profile' ? (
              <EmployeeProfileView onSelectTab={handleSelectEmployeeTab} />
            ) : activeEmployeeTab === 'data-export' ? (
              <EmployeeDataExportView onSelectTab={handleSelectEmployeeTab} />
            ) : (
              <EmployeeDataUsageView onSelectTab={handleSelectEmployeeTab} />
            )
          ) : isManager ? (
            activeManagerTab === 'overview' ? (
              <ManagerOverviewView
                displayName={profile.displayName}
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectManagerTab}
              />
            ) : activeManagerTab === 'my-team' ? (
              <ManagerMyTeamView onSelectTab={handleSelectManagerTab} />
            ) : activeManagerTab === 'employee-detail' ? (
              <ManagerEmployeeDetailView
                employeeId={searchParams.get('id') || undefined}
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectManagerTab}
              />
            ) : activeManagerTab === 'team-software' ? (
              <ManagerTeamSoftwareView formatCurrency={formatCurrency} onSelectTab={handleSelectManagerTab} />
            ) : activeManagerTab === 'team-requests' ? (
              <ManagerTeamRequestsView formatCurrency={formatCurrency} onSelectTab={handleSelectManagerTab} />
            ) : activeManagerTab === 'request-approval' ? (
              <ManagerRequestApprovalView
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectManagerTab}
                requestId={searchParams.get('id') || undefined}
              />
            ) : activeManagerTab === 'create-employee-request' ? (
              <ManagerCreateEmployeeRequestView
                employeeId={searchParams.get('employeeId') || undefined}
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectManagerTab}
              />
            ) : activeManagerTab === 'ghost-seat-review' ? (
              <ManagerGhostSeatReviewView formatCurrency={formatCurrency} onSelectTab={handleSelectManagerTab} />
            ) : activeManagerTab === 'ghost-seat-detail' ? (
              <ManagerGhostSeatDetailView
                formatCurrency={formatCurrency}
                ghostId={searchParams.get('id') || undefined}
                onSelectTab={handleSelectManagerTab}
              />
            ) : (
              <ManagerAccessReviewView onSelectTab={handleSelectManagerTab} />
            )
          ) : isApprover ? (
            activeApprovalTab === 'overview' ? (
              <ApprovalsOverviewView formatCurrency={formatCurrency} onSelectTab={handleSelectApprovalTab} />
            ) : activeApprovalTab === 'queue' ? (
              <ApprovalQueueView formatCurrency={formatCurrency} onSelectTab={handleSelectApprovalTab} />
            ) : activeApprovalTab === 'expense-approval' ? (
              <ExpenseApprovalView
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectApprovalTab}
                taskId={searchParams.get('id') || undefined}
              />
            ) : activeApprovalTab === 'renewal-decision' ? (
              <RenewalDecisionView
                formatCurrency={formatCurrency}
                onSelectTab={handleSelectApprovalTab}
                taskId={searchParams.get('id') || undefined}
              />
            ) : (
              <ApproverReportsView formatCurrency={formatCurrency} />
            )
          ) : isFinance ? (
            activeFinanceTab === 'overview' ? (
              <FinanceOverviewView formatCurrency={formatCurrency} onSelectTab={handleSelectFinanceTab} />
            ) : activeFinanceTab === 'budget-snapshot' ? (
              <FinanceBudgetSnapshotView formatCurrency={formatCurrency} onSelectTab={handleSelectFinanceTab} />
            ) : activeFinanceTab === 'renewal-schedule' ? (
              <FinanceRenewalScheduleView formatCurrency={formatCurrency} onSelectTab={handleSelectFinanceTab} />
            ) : activeFinanceTab === 'held-commitments' ? (
              <FinanceHeldCommitmentsView formatCurrency={formatCurrency} onSelectTab={handleSelectFinanceTab} />
            ) : activeFinanceTab === 'shadow-it' ? (
              <FinanceShadowItView formatCurrency={formatCurrency} onSelectTab={handleSelectFinanceTab} />
            ) : (
              <FinanceSoftwareDirectoryView formatCurrency={formatCurrency} onSelectTab={handleSelectFinanceTab} />
            )
          ) : (
            <>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold text-primary'>
                    {t('header.greeting', { name: profile.displayName })}
                  </p>
                  <h1 className='mt-1 text-3xl font-bold tracking-[-0.035em]'>{t('header.title')}</h1>
                  <p className='mt-2 text-sm text-muted-foreground'>{t('header.subtitle')}</p>
                </div>
                <span className='rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary'>
                  {t('demoNotice')}
                </span>
              </div>

              <section aria-label={t('metrics.regionLabel')} className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {metricCards.map(({ icon: Icon, key, trendDown, value }) => {
                  const TrendIcon = trendDown ? TrendingDown : TrendingUp

                  return (
                    <DashboardCard key={key}>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold text-muted-foreground'>{t(`metrics.${key}.title`)}</p>
                          <p className='mt-3 truncate text-2xl font-bold tracking-[-0.03em] text-primary'>{value}</p>
                        </div>
                        <span className='grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary'>
                          <Icon aria-hidden='true' className='size-5' />
                        </span>
                      </div>
                      <p className='mt-4 flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <TrendIcon aria-hidden='true' className='size-3.5 text-success' />
                        {t(`metrics.${key}.trend`)}
                      </p>
                    </DashboardCard>
                  )
                })}
              </section>

              <div className='mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,0.8fr)]'>
                <section aria-label={t('charts.costTitle')}>
                  <DashboardCard className='h-full'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      <h2 className='text-base font-bold'>{t('charts.costTitle')}</h2>
                      <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-2'>
                          <span className='h-0.5 w-5 rounded bg-primary' />
                          {t('charts.actual')}
                        </span>
                        <span className='flex items-center gap-2'>
                          <span className='w-5 border-t-2 border-dashed border-info' />
                          {t('charts.forecast')}
                        </span>
                      </div>
                    </div>
                    <CostChart
                      actualLabel={t('charts.actual')}
                      forecastLabel={t('charts.forecast')}
                      formatCompact={formatCompact}
                      formatCurrency={formatCurrency}
                      formatMonth={formatMonth}
                      label={t('charts.costTitle')}
                    />
                  </DashboardCard>
                </section>

                <DashboardCard>
                  <div className='flex items-center justify-between gap-3'>
                    <h2 className='text-base font-bold'>{t('alerts.title')}</h2>
                    <button className='text-xs font-bold text-primary hover:underline' type='button'>
                      {t('alerts.viewAll')}
                    </button>
                  </div>
                  <ul className='mt-4 divide-y divide-border'>
                    {alerts.map((alert) => {
                      const Icon = alertIcons[alert.key]

                      return (
                        <li className='flex items-center gap-3 py-3' key={alert.key}>
                          <span
                            className={`grid size-10 shrink-0 place-items-center rounded-xl ${alertToneClasses[alert.tone]}`}
                          >
                            <Icon aria-hidden='true' className='size-[1.125rem]' />
                          </span>
                          <div className='min-w-0 flex-1'>
                            <p className='truncate text-sm font-semibold'>{t(`alerts.${alert.key}.title`)}</p>
                            <p className='mt-0.5 truncate text-xs text-muted-foreground'>
                              {t(`alerts.${alert.key}.description`)}
                            </p>
                          </div>
                          <span className='text-lg font-bold text-primary'>{String(alert.count).padStart(2, '0')}</span>
                          <ChevronRight aria-hidden='true' className='size-4 text-muted-foreground' />
                        </li>
                      )
                    })}
                  </ul>
                </DashboardCard>
              </div>

              <div className='mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3'>
                <section aria-label={t('charts.categoryTitle')}>
                  <DashboardCard className='h-full'>
                    <h2 className='text-base font-bold'>{t('charts.categoryTitle')}</h2>
                    <div className='grid items-center gap-2 sm:grid-cols-[0.9fr_1.1fr]'>
                      <CategoryChart label={t('charts.categoryTitle')} />
                      <ul className='space-y-2'>
                        {categoryCosts.map((category) => (
                          <li className='flex items-center gap-2 text-xs' key={category.key}>
                            <span
                              className='size-2.5 shrink-0 rounded-full'
                              style={{ backgroundColor: category.color }}
                            />
                            <span className='min-w-0 flex-1 truncate text-muted-foreground'>
                              {t(`categories.${category.key}`)}
                            </span>
                            <span className='font-semibold'>{formatCurrency(category.value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </DashboardCard>
                </section>

                <DashboardCard>
                  <h2 className='text-base font-bold'>{t('lists.topSoftware')}</h2>
                  <ol className='mt-4 space-y-3'>
                    {topSoftware.map((software, index) => (
                      <li className='flex items-center gap-3' key={software.name}>
                        <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary'>
                          {index + 1}
                        </span>
                        <span className='min-w-0 flex-1 truncate text-sm font-semibold'>{software.name}</span>
                        <span className='text-xs font-semibold text-muted-foreground'>
                          {formatCurrency(software.cost)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </DashboardCard>

                <DashboardCard className='lg:col-span-2 xl:col-span-1'>
                  <h2 className='text-base font-bold'>{t('lists.recentSoftware')}</h2>
                  <ul className='mt-4 space-y-3'>
                    {recentSoftware.map((software) => (
                      <li className='flex items-center gap-3' key={software.name}>
                        <span className='grid size-9 shrink-0 place-items-center rounded-xl bg-surface-subtle text-sm font-black text-primary'>
                          {software.name.charAt(0)}
                        </span>
                        <span className='min-w-0 flex-1'>
                          <span className='block truncate text-sm font-semibold'>{software.name}</span>
                          <span className='text-xs text-muted-foreground'>
                            {t('lists.licenseCount', { count: software.seats })}
                          </span>
                        </span>
                        <span className='text-xs text-muted-foreground'>{formatDate(software.addedAt)}</span>
                      </li>
                    ))}
                  </ul>
                </DashboardCard>
              </div>

              <div className='mt-4 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-soft/60 p-5 sm:flex-row sm:items-center'>
                <span className='grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground'>
                  <Lightbulb aria-hidden='true' className='size-5' />
                </span>
                <div className='min-w-0 flex-1'>
                  <h2 className='font-bold'>{t('optimization.title')}</h2>
                  <p className='mt-1 text-sm text-muted-foreground'>{t('optimization.description')}</p>
                  <p className='mt-1 text-sm font-semibold text-primary'>
                    {t('optimization.savings', { amount: formatCurrency(245_800_000) })}
                  </p>
                </div>
                <button
                  className='inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-surface px-4 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground'
                  type='button'
                >
                  {t('optimization.action')}
                </button>
              </div>
            </>
          )}
        </motion.main>
      </div>
    </div>
  )
}
