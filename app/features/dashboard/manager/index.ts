// Sub-feature: overview
export { ManagerOverviewView } from './overview/views/manager-overview-view'

// Sub-feature: team-requests
export { ManagerTeamRequestsView } from './team-requests/views/manager-team-requests-view'
export { ManagerRequestApprovalView } from './team-requests/views/manager-request-approval-view'
export { ManagerCreateEmployeeRequestView } from './team-requests/views/manager-create-employee-request-view'
export { ManagerWeeklyBatchView } from './team-requests/views/manager-weekly-batch-view'
export { ManagerMyRequestsView } from './team-requests/views/manager-my-requests-view'
export { useManagerRequests } from './team-requests/hooks/use-manager-requests'

// Sub-feature: team
export { ManagerMyTeamView } from './team/views/manager-my-team-view'
export { ManagerEmployeeDetailView } from './team/views/manager-employee-detail-view'
export { ManagerTeamSoftwareView } from './team/views/manager-team-software-view'

// Sub-feature: access-review
export { ManagerAccessReviewView } from './access-review/views/manager-access-review-view'

// Sub-feature: ghost-seats
export { ManagerGhostSeatReviewView } from './ghost-seats/views/manager-ghost-seat-review-view'
export { ManagerGhostSeatDetailView } from './ghost-seats/views/manager-ghost-seat-detail-view'

// Sub-feature: annual-budget
export { ManagerAnnualBudgetView } from './annual-budget/views/manager-annual-budget-view'

// Shared
export { ManagerConfirmDialog } from './shared/components/manager-confirm-dialog'
export { ManagerIdentityMark } from './shared/components/manager-identity-mark'
export { ManagerSummaryStrip } from './shared/components/manager-summary-strip'
export { useManagerTabs } from './shared/hooks/use-manager-tabs'
export * from './manager-data'
export {
  isValidManagerTab,
  getParentManagerMenuKey,
  type ManagerTranslationKey,
  type ManagerNavItem,
  managerNavItems
} from './manager-nav'
export * from './manager-preview-request'
export * from './manager-dialog-keyboard'
export * from './usage-workbook'
export * from './enums'
