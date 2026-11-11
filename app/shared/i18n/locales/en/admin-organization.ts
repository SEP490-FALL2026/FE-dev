import { adminDepartmentEditor } from './admin-department-editor'

export const adminOrganization = {
  ...adminDepartmentEditor,
  title: 'Organization',
  subtitle: 'Manage departments and leadership.',
  departments: 'Departments',
  createDepartment: 'Create department',
  editDepartment: 'Edit department',
  departmentDetails: 'Department details',
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
  itAdminId: 'IT administrator',
  employeeId: 'Employee',
  candidateIdPlaceholder: 'Choose an employee below',
  costCenter: 'Cost center',
  members: 'Members',
  addEmployee: 'Add employee',
  addEmployeeHelp: 'Choose an employee without a department. Moving an existing member requires a department transfer.',
  chooseEmployee: 'Choose an employee',
  unassigned: 'Unassigned',
  unknown: 'Unknown status',
  back: 'Back to departments',
  viewDepartment: 'View {{name}}',
  viewDetails: 'Details',
  responsibilities: 'Responsible people',
  needsAttention: 'Needs attention',
  noFunction: 'No function description provided.',
  memberSince: 'Member since',
  actionsLabel: 'Actions',
  effectiveFrom: 'Effective from',
  hrBasis: 'HR authorization',
  basis: { type: 'Document type', reference: 'Reference', issuer: 'Issuer', issuedOn: 'Issued on' },
  departmentStatus: { ACTIVE: 'Active', INACTIVE: 'Retired' },
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
      'The department will have no head from the selected date, today or later. Department requests wait until a new head is assigned.',
    designateSuccessor:
      'A successor must start after today and be a department member on that date. A current head is required.',
    clearSuccessor: 'Withdraw the future successor. The current head continues without the planned end date.'
  },
  candidateHelp:
    'Browse active accounts or find employees without accounts by name or code. Super Admins are excluded. Department membership on the effective date is checked when saving.',
  itAdminHelp:
    'Browse active, activated IT administrator accounts on every page. The server checks eligibility. Choose Unassigned to remove the assignment.',
  headHistory: 'Head history',
  viewHeadHistory: 'View head history',
  openingHeadHistory: 'Opening history…',
  noHistory: 'No head history',
  historyLimited: 'The API returns recent head history only; older entries are not available here.',
  ongoing: 'Ongoing',
  membersHelp: 'Membership is read from the personnel record. Record a personnel event to change departments.',
  hasEmail: 'Work email recorded',
  noEmail: 'No work email'
}
