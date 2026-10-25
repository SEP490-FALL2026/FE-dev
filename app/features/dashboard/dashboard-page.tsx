import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import type { UserRole } from '~/entities/user-role/user-role'
import { useDocumentTitle } from '~/shared/lib/use-document-title'

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

import {
  EmployeeCreateRequestView,
  EmployeeDataExportView,
  EmployeeDataUsageView,
  EmployeeMyRequestsView,
  EmployeeMySoftwareView,
  EmployeeOverviewView,
  EmployeeProfileView,
  EmployeePrivacyView,
  EmployeeRequestDetailView,
  EmployeeRequestNewSoftwareView,
  EmployeeRequestSoftwareDetailsView,
  EmployeeReturnLicenseView,
  EmployeeReviewRequestView,
  EmployeeSoftwareDetailView,
  EmployeeSubmissionSuccessView,
  EmployeeTemporaryRenewalView,
  getParentEmployeeMenuKey,
  isValidEmployeeTab,
  type EmployeeTabKey
} from './employee'

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

import {
  isValidSuperAdminTab,
  type SuperAdminTabKey,
  SuperAdminOverviewView,
  SuperAdminDepartmentsView,
  SuperAdminAccountsView,
  SuperAdminPersonnelView,
  SuperAdminRemindersView,
  SuperAdminAuditView
} from './super-admin'

export function DashboardPage({ role }: { role: UserRole }) {
  const { i18n, t } = useTranslation('dashboard')
  const shouldReduceMotion = useReducedMotion()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [employeeAvatarUrl, setEmployeeAvatarUrl] = useState<string | null>(null)
  const profile = roleProfiles[role]
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'

  const isItAdmin = role === 'it-admin'
  const isEmployee = role === 'employee'
  const isFinance = role === 'finance'
  const isManager = role === 'manager'
  const isApprover = role === 'spending-approver'
  const isSuperAdmin = role === 'super-admin'

  useEffect(() => {
    return () => {
      if (employeeAvatarUrl) URL.revokeObjectURL(employeeAvatarUrl)
    }
  }, [employeeAvatarUrl])

  const handleEmployeeAvatarSelect = (file: File) => {
    setEmployeeAvatarUrl(URL.createObjectURL(file))
  }

  const [searchParams, setSearchParams] = useSearchParams()
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
  const activeSuperAdminTab: SuperAdminTabKey = isSuperAdmin && isValidSuperAdminTab(tabParam) ? tabParam : 'overview'

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
    setSearchParams(nextParams)
    setMobileNavigationOpen(false)
  }

  const handleSelectTab = (tab: ItAdminTabKey, extraParams?: Record<string, string>) => updateTab(tab, extraParams)
  const handleSelectEmployeeTab = (tab: EmployeeTabKey, extraParams?: Record<string, string>) => updateTab(tab, extraParams)
  const handleSelectManagerTab = (tab: ManagerTabKey, extraParams?: Record<string, string>) => {
    if (tab === 'create-employee-request') setManagerCreateMenuOpen(true)
    updateTab(tab, extraParams)
  }
  const handleSelectApprovalTab = (tab: ApprovalTabKey, extraParams?: Record<string, string>) => updateTab(tab, extraParams)
  const handleSelectFinanceTab = (tab: FinanceTabKey, extraParams?: Record<string, string>) => updateTab(tab, extraParams)
  const handleSelectSuperAdminTab = (tab: SuperAdminTabKey, extraParams?: Record<string, string>) => updateTab(tab, extraParams)

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
    <div className='min-h-screen bg-background'>
      <DashboardSidebar
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

      <div className='min-w-0 lg:pl-72'>
        <DashboardHeader
          activeEmployeeTab={activeEmployeeTab}
          employeeAvatarUrl={employeeAvatarUrl}
          mobileNavigationOpen={mobileNavigationOpen}
          onOpenProfile={() => handleSelectEmployeeTab('profile')}
          onToggleMobileNavigation={() => setMobileNavigationOpen((open) => !open)}
          profile={profile}
          role={role}
        />

        <motion.main
          animate={{ opacity: 1, y: 0 }}
          className={`mx-auto max-w-[100rem] p-4 sm:p-6 lg:p-8 ${isManager ? 'manager-workspace' : ''}`}
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
                initialParams={Object.fromEntries(searchParams.entries())}
                onSelectTab={handleSelectEmployeeTab}
                preselectedSoftwareId={searchParams.get('softwareId') || undefined}
                requestType={searchParams.get('type') === 'changePlan' ? 'changePlan' : 'newSoftware'}
              />
            ) : activeEmployeeTab === 'request-software-details' ? (
              <EmployeeRequestSoftwareDetailsView
                initialParams={Object.fromEntries(searchParams.entries())}
                onSelectTab={handleSelectEmployeeTab}
              />
            ) : activeEmployeeTab === 'temporary-renewal' ? (
              <EmployeeTemporaryRenewalView
                initialParams={Object.fromEntries(searchParams.entries())}
                onSelectTab={handleSelectEmployeeTab}
                softwareId={searchParams.get('softwareId') || undefined}
              />
            ) : activeEmployeeTab === 'return-license' ? (
              <EmployeeReturnLicenseView
                initialParams={Object.fromEntries(searchParams.entries())}
                onSelectTab={handleSelectEmployeeTab}
                softwareId={searchParams.get('softwareId') || undefined}
              />
            ) : activeEmployeeTab === 'review-request' ? (
              <EmployeeReviewRequestView
                onSelectTab={handleSelectEmployeeTab}
                requestParams={Object.fromEntries(searchParams.entries())}
              />
            ) : activeEmployeeTab === 'submission-success' ? (
              <EmployeeSubmissionSuccessView onSelectTab={handleSelectEmployeeTab} />
            ) : activeEmployeeTab === 'profile' ? (
              <EmployeeProfileView avatarUrl={employeeAvatarUrl} onAvatarSelect={handleEmployeeAvatarSelect} />
            ) : activeEmployeeTab === 'privacy' ? (
              <EmployeePrivacyView onSelectTab={handleSelectEmployeeTab} />
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
            activeSuperAdminTab === 'overview' ? (
              <SuperAdminOverviewView onSelectTab={handleSelectSuperAdminTab} />
            ) : activeSuperAdminTab === 'departments' ? (
              <SuperAdminDepartmentsView onSelectTab={handleSelectSuperAdminTab} />
            ) : activeSuperAdminTab === 'accounts' ? (
              <SuperAdminAccountsView />
            ) : activeSuperAdminTab === 'personnel' ? (
              <SuperAdminPersonnelView onSelectTab={handleSelectSuperAdminTab} />
            ) : activeSuperAdminTab === 'reminders' ? (
              <SuperAdminRemindersView />
            ) : activeSuperAdminTab === 'settings' ? (
              <SuperAdminRemindersView />
            ) : activeSuperAdminTab === 'transfer' ? (
              <SuperAdminPersonnelView onSelectTab={handleSelectSuperAdminTab} />
            ) : (
              <SuperAdminAuditView />
            )
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
