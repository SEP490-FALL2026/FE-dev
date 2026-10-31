import { motion, useReducedMotion } from 'motion/react'
import { useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import type { UserRole } from '~/entities/user-role/user-role'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { getAuthState, subscribeAuthSession } from '../auth/auth-session'

import { roleProfiles } from './dashboard-data'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardSidebar } from './components/dashboard-sidebar'
import { DefaultDashboardView } from './components/default-dashboard-view'

// Role views
import {
  getParentMenuKey,
  isValidItAdminTab,
  type ItAdminTabKey,
  ItDeviceCollectorsView,
  ItOptimizationView,
  ItOverviewView,
  ItProvisioningView,
  ItReconciliationView,
  ItShadowItView,
  ItUsageImportView,
  ItDeptCatalogView
} from './it-admin'

import { EmployeeScreen, getParentEmployeeMenuKey, isValidEmployeeTab, type EmployeeTabKey } from './employee'

import { getParentApprovalMenuKey, isValidApprovalTab, type ApprovalTabKey, ApprovalScreen } from './approvals'

import { isValidFinanceTab, type FinanceTabKey, FinanceScreen } from './finance'

import {
  getParentManagerMenuKey,
  isValidManagerTab,
  type ManagerTabKey,
  MOCK_TEAM_REQUESTS,
  ManagerAccessReviewView,
  ManagerAnnualBudgetView,
  ManagerCreateEmployeeRequestView,
  ManagerEmployeeDetailView,
  ManagerGhostSeatDetailView,
  ManagerGhostSeatReviewView,
  ManagerMyTeamView,
  ManagerMyRequestsView,
  ManagerOverviewView,
  ManagerRequestApprovalView,
  ManagerTeamRequestsView,
  ManagerTeamSoftwareView,
  ManagerWeeklyBatchView,
  type ManagerPreviewRequest,
  type ManagerPreviewRequestInput
} from './manager'
import './manager/manager-workspace.css'

import { isValidSuperAdminTab, type SuperAdminTabKey, SuperAdminScreen } from './super-admin'

export function DashboardPage({ role }: { role: UserRole }) {
  const { i18n, t } = useTranslation('dashboard')
  const shouldReduceMotion = useReducedMotion()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const auth = useSyncExternalStore(subscribeAuthSession, getAuthState, getAuthState)
  const fullName = auth.session?.user.employee.fullName ?? ''
  const profile =
    role === 'super-admin' || role === 'employee'
      ? {
          displayName: fullName,
          initials: fullName
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .slice(-2)
            .join('')
        }
      : roleProfiles[role]
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'

  const isItAdmin = role === 'it-admin'
  const isEmployee = role === 'employee'
  const isFinance = role === 'finance'
  const isManager = role === 'manager'
  const isApprover = role === 'spending-approver'
  const isSuperAdmin = role === 'super-admin'

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const tabParam = searchParams.get('tab')

  // IT Admin Tabs
  const activeTab: ItAdminTabKey = isItAdmin && isValidItAdminTab(tabParam) ? tabParam : 'overview'
  const activeParent = isItAdmin ? getParentMenuKey(activeTab) : 'overview'

  // Employee Tabs
  const activeEmployeeTab: EmployeeTabKey = isEmployee && isValidEmployeeTab(tabParam) ? tabParam : 'overview'
  const activeEmployeeParent = isEmployee ? getParentEmployeeMenuKey(activeEmployeeTab) : 'overview'

  // Manager Tabs
  const activeManagerTab: ManagerTabKey = isManager && isValidManagerTab(tabParam) ? tabParam : 'overview'
  const activeManagerParent = isManager
    ? getParentManagerMenuKey(activeManagerTab, searchParams.get('from'))
    : 'overview'
  const [managerPreviewRequests, setManagerPreviewRequests] = useState<ManagerPreviewRequest[]>([])
  const [managerMarkedRequestIds, setManagerMarkedRequestIds] = useState<string[]>([])
  const [managerSentRequestIds, setManagerSentRequestIds] = useState<string[]>([])
  const managerRequestScope = searchParams.get('scope') === 'team' ? 'team' : 'individual'
  const [managerCreateMenuOpen, setManagerCreateMenuOpen] = useState(activeManagerTab === 'create-employee-request')

  // Approval Tabs
  const activeApprovalTab: ApprovalTabKey = isApprover && isValidApprovalTab(tabParam) ? tabParam : 'overview'
  const activeApprovalParent = isApprover ? getParentApprovalMenuKey(activeApprovalTab) : 'overview'

  // Finance Tabs
  const activeFinanceTab: FinanceTabKey = isFinance && isValidFinanceTab(tabParam) ? tabParam : 'overview'

  // Super Admin Tabs
  const personnelFormPage = isSuperAdmin && location.pathname.startsWith('/dashboard/super-admin/personnel/')
  const activeSuperAdminTab: SuperAdminTabKey = personnelFormPage
    ? 'personnel'
    : isSuperAdmin && isValidSuperAdminTab(tabParam)
      ? tabParam
      : 'overview'

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    licenses: true,
    optimize: true,
    people: true,
    'usage-sources': true
  })

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const updateTab = (tab: string, extraParams?: Record<string, string>) => {
    const nextParams = new URLSearchParams()
    if (tab !== 'overview') {
      nextParams.set('tab', tab)
    }
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => nextParams.set(k, v))
    }
    if (personnelFormPage) void navigate({ pathname: '/dashboard/super-admin', search: nextParams.toString() })
    else setSearchParams(nextParams)
    setMobileNavigationOpen(false)
  }

  const handleSelectTab = (tab: ItAdminTabKey, extraParams?: Record<string, string>) => updateTab(tab, extraParams)
  const handleSelectEmployeeTab = (tab: EmployeeTabKey, extraParams?: Record<string, string>) =>
    updateTab(tab, extraParams)
  const handleSelectManagerTab = (tab: ManagerTabKey, extraParams?: Record<string, string>) => {
    if (tab === 'create-employee-request') setManagerCreateMenuOpen(true)
    updateTab(tab, extraParams)
  }
  const handleSelectApprovalTab = (tab: ApprovalTabKey, extraParams?: Record<string, string>) =>
    updateTab(tab, extraParams)
  const handleSelectFinanceTab = (tab: FinanceTabKey, extraParams?: Record<string, string>) =>
    updateTab(tab, extraParams)
  const handleSelectSuperAdminTab = (tab: SuperAdminTabKey, extraParams?: Record<string, string>) =>
    updateTab(tab, extraParams)

  const handleSaveManagerPreview = (request: ManagerPreviewRequestInput) => {
    const createdAt = new Date().toISOString()
    setManagerPreviewRequests((current) => [
      { ...request, id: `preview-${Date.now()}-${current.length}`, createdAt },
      ...current
    ])
    handleSelectManagerTab('my-requests')
  }

  const handleMarkManagerRequest = (requestId: string) => {
    setManagerMarkedRequestIds((current) => (current.includes(requestId) ? current : [...current, requestId]))
    handleSelectManagerTab('weekly-batch')
  }

  const handleSendMarkedRequests = () => {
    setManagerSentRequestIds((current) => [...new Set([...current, ...managerMarkedRequestIds])])
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

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      <DashboardSidebar
        employeeSelfServiceOnly={isEmployee && auth.session?.user.selfServiceOnly === true}
        activeApprovalParent={activeApprovalParent}
        activeApprovalTab={activeApprovalTab}
        activeEmployeeParent={activeEmployeeParent}
        activeEmployeeTab={activeEmployeeTab}
        activeFinanceTab={activeFinanceTab}
        activeManagerParent={activeManagerParent}
        activeManagerTab={activeManagerTab}
        activeParent={activeParent}
        activeSuperAdminTab={activeSuperAdminTab}
        activeTab={activeTab}
        managerCreateMenuOpen={managerCreateMenuOpen}
        managerMarkedRequestIds={managerMarkedRequestIds}
        managerRequestScope={managerRequestScope}
        managerSentRequestIds={managerSentRequestIds}
        mobileNavigationOpen={mobileNavigationOpen}
        onCloseMobileNavigation={() => setMobileNavigationOpen(false)}
        onSelectApprovalTab={handleSelectApprovalTab}
        onSelectEmployeeTab={handleSelectEmployeeTab}
        onSelectFinanceTab={handleSelectFinanceTab}
        onSelectItAdminTab={handleSelectTab}
        onSelectManagerTab={handleSelectManagerTab}
        onSelectSuperAdminTab={handleSelectSuperAdminTab}
        openSections={openSections}
        role={role}
        setManagerCreateMenuOpen={setManagerCreateMenuOpen}
        toggleSection={toggleSection}
      />

      <div className='flex h-full min-w-0 flex-1 flex-col lg:pl-72'>
        <DashboardHeader
          activeEmployeeTab={activeEmployeeTab}
          employeeAvatarUrl={null}
          mobileNavigationOpen={mobileNavigationOpen}
          onOpenProfile={() => handleSelectEmployeeTab('profile')}
          onToggleMobileNavigation={() => setMobileNavigationOpen((open) => !open)}
          profile={profile}
          role={role}
        />

        <motion.main
          animate={{ opacity: 1, y: 0 }}
          className={`mx-auto min-h-0 w-full max-w-[100rem] flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isManager ? 'manager-workspace' : ''}`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          key={
            isItAdmin
              ? activeTab
              : isEmployee
                ? activeEmployeeTab
                : isFinance
                  ? activeFinanceTab
                  : isApprover
                    ? `${activeApprovalTab}-${searchParams.get('id') ?? ''}`
                    : 'general'
          }
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
              <ItProvisioningView initialTaskId={searchParams.get('id') || undefined} onSelectTab={handleSelectTab} />
            ) : activeTab === 'reconciliation' ? (
              <ItReconciliationView onSelectTab={handleSelectTab} />
            ) : activeTab === 'usage-import' ? (
              <ItUsageImportView onSelectTab={handleSelectTab} />
            ) : activeTab === 'device-collectors' ? (
              <ItDeviceCollectorsView
                alertId={searchParams.get('alertId') || undefined}
                fromTab={searchParams.get('from') || undefined}
                initialDeptId={searchParams.get('deptId') || undefined}
                initialEmployeeId={searchParams.get('employeeId') || undefined}
                onSelectTab={handleSelectTab}
              />
            ) : activeTab === 'license-optimization' ? (
              <ItOptimizationView
                formatCurrency={formatCurrency}
                initialAlertId={searchParams.get('alertId') || undefined}
                onSelectTab={handleSelectTab}
              />
            ) : activeTab === 'shadow-it' ? (
              <ItShadowItView onSelectTab={handleSelectTab} />
            ) : (
              <ItDeptCatalogView onSelectTab={handleSelectTab} />
            )
          ) : isEmployee ? (
            <EmployeeScreen tab={activeEmployeeTab} onSelectTab={handleSelectEmployeeTab} />
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
                backToReview={searchParams.get('from') === 'access-review'}
                employeeId={searchParams.get('id') || undefined}
                onSelectTab={handleSelectManagerTab}
              />
            ) : activeManagerTab === 'team-software' ? (
              <ManagerTeamSoftwareView formatCurrency={formatCurrency} onSelectTab={handleSelectManagerTab} />
            ) : activeManagerTab === 'team-requests' ? (
              <ManagerTeamRequestsView
                markedRequestIds={managerMarkedRequestIds}
                sentRequestIds={managerSentRequestIds}
                onSelectTab={handleSelectManagerTab}
              />
            ) : activeManagerTab === 'my-requests' ? (
              <ManagerMyRequestsView
                managerName={profile.displayName}
                onSelectTab={handleSelectManagerTab}
                requests={managerPreviewRequests}
              />
            ) : activeManagerTab === 'request-approval' ? (
              <ManagerRequestApprovalView
                formatCurrency={formatCurrency}
                isMarked={managerMarkedRequestIds.includes(searchParams.get('id') || '')}
                isSent={managerSentRequestIds.includes(searchParams.get('id') || '')}
                onMarkForPreparation={handleMarkManagerRequest}
                onSelectTab={handleSelectManagerTab}
                requestId={searchParams.get('id') || undefined}
              />
            ) : activeManagerTab === 'create-employee-request' ? (
              <ManagerCreateEmployeeRequestView
                employeeId={searchParams.get('employeeId') || undefined}
                formatCurrency={formatCurrency}
                key={managerRequestScope}
                onSelectTab={handleSelectManagerTab}
                onSavePreview={handleSaveManagerPreview}
                scope={managerRequestScope}
              />
            ) : activeManagerTab === 'weekly-batch' ? (
              <ManagerWeeklyBatchView
                onSelectTab={handleSelectManagerTab}
                onSendAll={handleSendMarkedRequests}
                requests={MOCK_TEAM_REQUESTS.filter(
                  (item) => managerMarkedRequestIds.includes(item.id) && !managerSentRequestIds.includes(item.id)
                )}
                sentCount={managerSentRequestIds.length}
              />
            ) : activeManagerTab === 'annual-budget' ? (
              <ManagerAnnualBudgetView />
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
            <ApprovalScreen
              displayName={profile.displayName}
              formatCurrency={formatCurrency}
              itemId={searchParams.get('id') || undefined}
              onSelectTab={handleSelectApprovalTab}
              tab={activeApprovalTab}
            />
          ) : isFinance ? (
            <FinanceScreen
              formatCurrency={formatCurrency}
              itemId={searchParams.get('id') || undefined}
              onSelectTab={handleSelectFinanceTab}
              tab={activeFinanceTab}
            />
          ) : isSuperAdmin ? (
            <SuperAdminScreen tab={activeSuperAdminTab} onSelectTab={handleSelectSuperAdminTab} />
          ) : (
            <DefaultDashboardView
              displayName={profile.displayName}
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              formatMonth={formatMonth}
              formatNumber={formatNumber}
            />
          )}
        </motion.main>
      </div>
    </div>
  )
}
