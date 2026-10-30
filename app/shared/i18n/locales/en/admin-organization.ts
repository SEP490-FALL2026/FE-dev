export const adminOrganization = {
  title: 'Organization',
  subtitle: 'Manage departments, leadership and department projects.',
  departments: 'Departments',
  projects: 'Projects',
  createDepartment: 'Create department',
  editDepartment: 'Edit department',
  createProject: 'Create project',
  editProject: 'Edit project',
  departmentDetails: 'Department details',
  projectDetails: 'Project details',
  code: 'Department code',
  name: 'Name',
  function: 'Function',
  description: 'Description',
  status: 'Status',
  search: 'Search departments',
  searchPlaceholder: 'Enter a department name or code',
  allStatuses: 'All statuses',
  head: 'Department head',
  successor: 'Successor',
  itAdmin: 'IT administrator',
  itAdminId: 'IT administrator employee ID',
  employeeId: 'Employee ID',
  candidateIdPlaceholder: 'Choose an employee below or enter their ID',
  costCenter: 'Cost center',
  members: 'Members',
  unassigned: 'Unassigned',
  unknown: 'Unknown status',
  back: 'Back to departments',
  viewDepartment: 'View {{name}}',
  actionsLabel: 'Actions',
  effectiveFrom: 'Effective from',
  hrBasis: 'HR authorization',
  basis: { type: 'Document type', reference: 'Reference', issuer: 'Issuer', issuedOn: 'Issued on' },
  departmentStatus: { ACTIVE: 'Active', INACTIVE: 'Retired' },
  projectStatus: { RUNNING: 'Running', FINISHED: 'Finished' },
  memberStatus: { ACTIVE: 'Active', TERMINATED: 'Terminated' },
  workState: { WORKING: 'Working', ON_LONG_LEAVE: 'On long leave', HANDING_OVER: 'Handing over', LEFT: 'Left' },
  warnings: {
    MISSING_HEAD: 'No department head',
    MISSING_IT_ADMIN: 'No usable IT administrator',
    MISSING_COST_CENTER: 'No cost center'
  },
  actions: {
    deactivate: 'Retire department',
    assignHead: 'Assign department head',
    vacateHead: 'Vacate department head',
    designateSuccessor: 'Designate successor',
    clearSuccessor: 'Clear successor'
  },
  actionHelp: {
    deactivate:
      'Retirement prevents new members and heads. The server checks for people, open work and outstanding obligations.',
    assignHead:
      'Choose a member on the effective date, today or later. The previous head ends the day before. The server checks eligibility.',
    vacateHead:
      'The department will have no head from the selected date, today or later. Requests use the configured fallback approver.',
    designateSuccessor:
      'A successor must start after today and be a department member on that date. A current head is required.',
    clearSuccessor: 'Withdraw the future successor. The current head continues without the planned end date.'
  },
  candidateHelp:
    'Browse activated, active accounts on every page. Super Admins are excluded. Select the employee, not the login ID. Department membership on the effective date is checked when saving. For an employee without a listed account, enter the official employee UUID; the API has no unrestricted employee directory.',
  itAdminHelp:
    'Browse activated, active IT Admin accounts on every page, or enter an official employee UUID. The server checks that the employee has a usable IT Admin account. Leave blank to remove the assignment.',
  participatingDepartments: 'Participating departments ({{count}} selected)',
  departmentSelectionHelp:
    'Browse all pages of active departments. Selections are retained between pages, up to 100 departments.',
  removeDepartment: 'Remove {{name}}',
  headHistory: 'Head history',
  noHistory: 'No head history',
  historyLimited: 'The API returns recent head history only; older entries are not available here.',
  ongoing: 'Ongoing',
  membersHelp: 'Membership is read from the personnel record. Record a personnel event to change departments.',
  hasEmail: 'Work email recorded',
  noEmail: 'No work email'
}
