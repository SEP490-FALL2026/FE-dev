import { superAdminAccounts } from './super-admin-accounts'
import { superAdminDepartments } from './super-admin-departments'
import { superAdminPersonnel } from './super-admin-personnel'
import { superAdminReminders } from './super-admin-reminders'
import { superAdminSystem } from './super-admin-system'

export const superAdmin = {
  navigation: {
    overview: 'Setup overview',
    departments: 'Departments',
    accounts: 'Accounts & permissions',
    personnel: 'Department personnel',
    reminders: 'Manager reminders'
  },
  departments: {
    ENG: 'IT & Engineering',
    FIN: 'Finance & Accounting',
    DES: 'Design & Experience',
    MKT: 'Marketing & Growth',
    HR: 'Human Resources & Training',
    EXEC: 'Executive Board'
  },
  positions: {
    SPENDING_APPROVER: 'Deputy CEO',
    FINANCE: 'Chief Accountant',
    IT_ADMIN: 'Systems & IT Administrator'
  },
  overview: {
    code: 'System administration',
    title: 'System Administration Overview',
    subtitle: 'Review the organization, departments, user accounts, and role assignments.',
    metricsLabel: 'Organization metrics',
    departmentListAction: 'View department list',
    configuredDepartments: '{{configured}} configured · {{incomplete}} awaiting a manager',
    totalDepartments: 'Total departments',
    accountListAction: 'View account list',
    activeAccounts: '{{count}} active accounts',
    totalAccounts: 'Total accounts',
    roleAssignmentsAction: 'View role assignments',
    approverAndFinance: 'Spending approver: {{approver}} · Finance: {{finance}}',
    unassigned: 'Unassigned',
    unspecified: 'Not designated',
    spendingApprover: 'Spending approver',
    reminderSettingsAction: 'Configure reminder deadline',
    reminderAfterHours: 'Automatic reminder after {{hours}} hours',
    managerReminderDeadline: 'Manager reminder deadline',
    days: '{{count}} days',
    viewAll: 'View all',
    departmentsHint: 'Departments and their approval managers',
    departmentStructure: 'Department structure',
    departmentCodeAndName: 'Code & department',
    responsibleManager: 'Approval manager',
    memberCount: 'Members',
    status: 'Status',
    noManager: 'No manager assigned',
    active: 'Active',
    details: 'Details',
    keyRolesHint: 'Assignments for important administrative and approval roles',
    keyRoles: 'Key role assignments',
    onePersonOnly: 'One person only',
    finance: 'Finance / Accounting',
    expenseControl: 'Expense control',
    itAdmin: 'IT administrator',
    provisioningAndLicenses: 'Provisioning & licenses',
    managerReminderPolicy: 'Manager reminder policy',
    edit: 'Edit',
    reminderPolicyDescription: 'Notify the department manager when a request has waited more than',
    reminderPolicyDuration: '{{days}} days ({{hours}} hours)'
  },
  accounts: superAdminAccounts,
  departmentsModule: superAdminDepartments,
  personnel: superAdminPersonnel,
  reminders: superAdminReminders,
  ...superAdminSystem
} as const
