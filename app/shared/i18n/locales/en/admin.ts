import { overviewRedesign } from './admin-overview'
import { parameterPresentation } from './admin-parameters'
import { operationPresentation } from './admin-operations-presentation'
import { overviewMetrics } from './admin-overview-metrics'
import { parameterContract } from './admin-parameter-contract'
import { adminFormHelp } from './admin-form-help'
import { adminOversight } from './admin-oversight'
import { policyLibrary } from './admin-policy-library'
import { operatingDefinitions } from './admin-operating-definitions'

export const admin = {
  ...adminFormHelp,
  ...adminOversight,
  retryIn: 'Try again in {{count}}s',
  navigation: {
    overview: 'Overview',
    accounts: 'Accounts and responsibilities',
    departments: 'Departments',
    personnel: 'Personnel',
    reminders: 'Operating parameters',
    policies: 'Policy library',
    operations: 'Workflow monitoring'
  },
  loading: 'Loading…',
  saving: 'Saving…',
  saved: 'Changes saved',
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  retry: 'Retry',
  empty: 'No matching records',
  unknown: 'Unknown status',
  none: 'Not set',
  all: 'All',
  pagination: 'Pagination',
  page: 'Page {{page}} / {{total}} · {{count}} records',
  previous: 'Previous',
  next: 'Next',
  requestId: 'Reference: {{id}}',
  actions: 'Actions',
  details: 'Details',
  edit: 'Edit',
  remove: 'Remove',
  create: 'Create',
  errors: {
    activeDepartureBlock: 'The departure case is still active. Cancel the departure before releasing its access block.',
    itAdminLimit:
      'This technology administrator already manages the maximum number of departments. Choose another person.',
    policyStepsFixed:
      'The system decision steps and automatic checks must be preserved. Reload the draft and edit their displayed text.',
    duplicate: 'This identifier, email or date already exists. Choose a different value.',
    financeAssigned: 'A Finance account is already assigned. Review the current assignment first.',
    derivedRole: 'This role comes from a department head assignment or approval responsibility.',
    transferOnly: 'The Super Admin role can only be changed by operations outside this application.',
    spendingApproverAssigned: 'A spending approver is already assigned. Review the current holder first.',
    managerStillHeading:
      'This person heads, will head, or is the designated successor of a department. End the department assignment before revoking Manager.',
    openWork: 'This person still has open work. Resolve it before granting Spending Approver.',
    managerRoleRequired: 'Grant Manager to the account before assigning a department head or successor.',
    parameterLocked: 'This parameter is locked because business records already use it.',
    alreadyActivated: 'This account is already activated. An invitation is no longer needed.',
    accountLocked: 'This account is locked. Unlock it before continuing.',
    roleCombination: 'These roles or responsibilities cannot be combined on this account.',
    unusableAccount: 'Choose an active employee with an activated, usable account.',
    dutyConflict: 'The substitute must be a different person from the current approver.',
    successorResponsibilities: 'Transfer the person’s current department or special responsibilities first.',
    departmentInUse: 'This department still has people or other dependencies. Resolve them before deactivating it.',
    headMembership: 'Choose an eligible member of the department on the effective date.',
    hrBasis:
      'Provide the complete authorized personnel document. A department head’s personnel change notice is not a personnel decision.',
    successorRequired: 'Name the head’s successor or explicitly confirm that there is none.',
    pendingEvent: 'This employee already has a conflicting personnel event. Review it first.',
    dateInvalid: 'This date is not allowed for the current personnel or calendar state.',
    transferCancellation: 'Provide a reason to cancel the pending department transfer.',
    eventMissing: 'No matching recorded event was found. Check the employee and event reference.',
    verificationRequired: 'Record the verification method and its supporting reference.',
    previewStale: 'The import preview changed. Refresh it and review the rows before confirming.',
    importExpired: 'This import expired. Upload the file again to create a new preview.',
    duplicateFile: 'Confirm that you intentionally want to import this duplicate file.',
    importConfirmed: 'This import is already confirmed. Review its result before taking another action.',
    fileInvalid: 'Check the file format, size, required columns and row limit.',
    parameterInvalid: 'The value is outside the allowed range for this operating parameter.',
    unavailable: 'Cannot load data. Please try again.',
    forbidden: 'Your current permissions do not allow this action.',
    missing: 'This record is unavailable. Refresh the list.',
    conflict: 'The record changed or has dependencies. Review the refreshed data before trying again.',
    validation: 'Check the entered values and required fields.',
    rateLimit: 'Too many requests. Wait before trying again.',
    unknownOutcome: 'The save result is unknown. Review the refreshed data before sending again.',
    lockedCurrency: 'Reporting currency is locked because financial records already use it.',
    selfAction: 'You cannot change your own account with this action.',
    ineligible: 'This person is not eligible for the selected responsibility.'
  },
  overview: {
    metrics: overviewMetrics,
    unknownStep: 'Unknown setup step',
    redesign: overviewRedesign,
    stepNames: {
      1: 'Organization and personnel',
      2: 'Application catalog',
      3: 'Plans and subscriptions',
      4: 'Seat baseline',
      5: 'Usage data'
    },
    setupStates: { DONE: 'Complete', INCOMPLETE: 'Incomplete', BLOCKED: 'Blocked', NOT_AVAILABLE: 'Not available' },
    setupReasons: {
      NO_DEPARTMENT: 'Create an active department.',
      NO_EMPLOYEE: 'Create or import employees.',
      NO_APPLICATION: 'An information technology administrator must configure the application catalog.',
      NO_SUBSCRIPTION: 'An information technology administrator must configure subscriptions.',
      NOT_BUILT_YET: 'This capability is not available yet.'
    },
    setupWarnings: {
      MISSING_HEAD: 'No department head',
      MISSING_IT_ADMIN: 'No information technology administrator in charge',
      MISSING_COST_CENTER: 'Finance has not configured a cost center'
    },
    facts: {
      activeDepartments: 'Active departments',
      activeEmployees: 'Active employees',
      departmentsWithoutCostCenter: 'Departments without cost center'
    },
    title: 'Organization setup',
    checklist: 'Setup checklist',
    watch: 'Super Admin availability',
    departments: 'Departments',
    accounts: 'Accounts and responsibilities',
    personnel: 'Personnel',
    operations: 'Workflow monitoring',
    steps: {
      ORGANIZATION: 'Organization',
      EMPLOYEES: 'Employees',
      ACCOUNTS: 'Accounts',
      ROLES: 'Responsibilities',
      CATALOG: 'Software catalog'
    },
    ready: 'Ready',
    missing: 'Needs configuration',
    warning: 'Needs attention',
    watchStates: {
      HEALTHY: 'Available',
      HOLDER_LEAVING_STILL_USABLE: 'Handing over · still available',
      HOLDER_UNUSABLE: 'Holder unavailable',
      NO_HOLDER: 'No holder'
    },
    warnings: {
      HOLDER_LEAVING: 'The holder is handing over responsibilities.',
      HANDOVER_OVERDUE: 'The last working day has passed. Complete the handover.'
    },
    reasons: {
      LOCKED: 'Account locked',
      LEFT: 'Employee has left',
      NOT_ACTIVATED: 'Invitation not activated',
      AWAITING_CREDENTIAL_RESET: 'Awaiting credential reset'
    }
  },
  parameters: {
    additionalDefinitions: operatingDefinitions,
    options: { ON: 'Enabled', OFF: 'Disabled', DAILY: 'Every day', WEEKLY: 'Every week' },
    groups: {
      WORKFLOW: 'Workflow',
      BUDGET: 'Budget',
      PERSONNEL: 'Personnel',
      PROVISIONING: 'Access provisioning',
      ACCOUNT: 'Accounts',
      DOCUMENT: 'Documents',
      SUBSCRIPTION: 'Subscriptions',
      USAGE: 'Software usage',
      AI: 'Artificial intelligence'
    },
    contract: parameterContract,
    ...parameterPresentation,
    title: 'Operating parameters',
    futureOnly: 'Changes apply to newly created work. Existing work keeps its original values.',
    key: 'Parameter',
    value: 'Current value',
    default: 'Default',
    unit: 'Unit',
    history: 'History',
    edit: 'Update parameter',
    numericArray: 'Enter numbers separated by commas.',
    invalid: 'Enter a value matching this parameter’s type.',
    olderHistory: 'Earlier changes are not included in this response.',
    changed: 'Changed at'
  },
  policies: {
    title: 'Policy library',
    description: 'Manage and publish operating policies and decision step checklists.',
    draftBadge: 'Draft open',
    applicableRoles: 'Applicable roles',
    publishedAt: 'Published date',
    viewDetails: 'Read policy',
    createDraft: 'Draft new version',
    editDraft: 'Edit draft',
    saveDraft: 'Save draft',
    discardDraft: 'Discard draft',
    publish: 'Publish',
    publishTitle: 'Publish policy {{code}}',
    publishConfirm: 'Confirm publish',
    publishNotice:
      'The policy takes effect immediately upon publishing. Subsequent decisions will enforce the new version.',
    changeNote: 'Issuing grounds',
    changeNotePlaceholder: 'Specify the directive, document number, date, and issuer…',
    requiresReacknowledgement: 'Require re-acknowledgement (users who read prior versions must read again)',
    draftTitle: 'Policy draft {{code}}',
    targetVersion: 'Target version: v{{version}}',
    titleLabel: 'Policy title',
    firstSectionHeading: 'Opening section heading',
    firstSectionBody: 'Policy body text',
    version: 'Version',
    versionNumber: 'Version {{version}}',
    sections: 'Sections',
    steps: 'Decision steps with checklists',
    report: 'Acknowledgement report',
    reportTitle: 'Acknowledgement report: {{code}}',
    filterState: 'Acknowledgement status',
    status: 'Status',
    stateDone: 'Acknowledged',
    statePending: 'Pending',
    state_DONE: 'Done',
    state_PENDING: 'Pending',
    ackVersion: 'Version read',
    acknowledgedAt: 'Acknowledged at',
    ...policyLibrary
  },
  operations: {
    descriptionPlaceholder: 'Describe the blockage, its impact and the action needed',
    ...operationPresentation,
    title: 'Workflow monitoring',
    congestion: 'Congested responsibilities',
    incident: 'Record incident',
    holder: 'Holder employee ID',
    description: 'Description',
    request: 'Request',
    since: 'Waiting since',
    department: 'Department',
    waitingSteps: 'Waiting steps',
    overdueSteps: 'Overdue steps',
    reminders: 'Reminders sent',
    incidentHistory: 'Recorded incidents',
    stepKinds: {
      NEED: 'Needs approval',
      FINANCE_REVIEW: 'Finance review',
      SPEND_APPROVAL: 'Spending approval',
      IT_ASSESSMENT: 'Information technology assessment'
    }
  }
} as const
