// Sub-feature: overview
export { EmployeeOverviewView } from './overview/views/employee-overview-view'
export { EmployeeUsageSummaryCard } from './overview/components/employee-usage-summary-card'

// Sub-feature: software-request
export { EmployeeRequestNewSoftwareView } from './software-request/views/employee-request-new-software-view'
export { EmployeeRequestSoftwareDetailsView } from './software-request/views/employee-request-software-details-view'
export { EmployeeReviewRequestView } from './software-request/views/employee-review-request-view'
export { EmployeeSubmissionSuccessView } from './software-request/views/employee-submission-success-view'
export { EmployeeRequestStepper } from './software-request/components/employee-request-stepper'
export { EmployeeTeamRequestFields } from './software-request/components/employee-team-request-fields'
export { employeeRequestPlanOptions } from './software-request/employee-request-plan-options'
export { eligibleTeamMembers, parseTeamMemberIds } from './software-request/employee-team-request-draft'

// Sub-feature: my-software
export { EmployeeMySoftwareView } from './my-software/views/employee-my-software-view'
export { EmployeeSoftwareDetailView } from './my-software/views/employee-software-detail-view'
export { EmployeeCreateRequestView } from './my-software/views/employee-create-request-view'
export { EmployeeTemporaryRenewalView } from './my-software/views/employee-temporary-renewal-view'
export { EmployeeReturnLicenseView } from './my-software/views/employee-return-license-view'
export { useEmployeeSoftware } from './my-software/hooks/use-employee-software'

// Sub-feature: my-requests
export { EmployeeMyRequestsView } from './my-requests/views/employee-my-requests-view'
export { EmployeeRequestDetailView } from './my-requests/views/employee-request-detail-view'

// Sub-feature: profile-privacy
export { EmployeeProfileView } from './profile-privacy/views/employee-profile-view'
export { EmployeePrivacyView } from './profile-privacy/views/employee-privacy-view'
export { EmployeeDataUsageView } from './profile-privacy/views/employee-data-usage-view'
export { EmployeeDataExportView } from './profile-privacy/views/employee-data-export-view'

// Shared
export { EmployeePreviewNotice } from './shared/components/employee-preview-notice'
export * from './employee-data'
export {
  isValidEmployeeTab,
  type EmployeeSubMenuItem,
  type EmployeeMenuItem,
  employeeMenuItems,
  getParentEmployeeMenuKey
} from './employee-nav'
export * from './enums'
