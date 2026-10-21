/** FIN-45: allocating the approved annual budget to departments, Cost Centers and SaaS cost groups. */
export const allocation = {
  adjustment: {
    current: 'Current approved budget: {{amount}}',
    hint: 'An approved budget cannot be edited directly. An adjustment needs a reason and a Spending Approver decision.',
    newTotal: 'Proposed budget total',
    newTotalPlaceholder: 'For example: 150000000',
    newTotalRequired: 'Enter a new budget total that differs from the approved amount.',
    notice:
      'The request goes to the Spending Approver and is recorded in the decision history. The approved budget stays unchanged until it is approved.',
    reason: 'Adjustment reason',
    reasonRequired: 'A reason is required.',
    sent: 'Adjustment request for {{costCenter}} from {{before}} to {{after}} sent to the Spending Approver. The approved budget stays unchanged until it is approved.',
    submit: 'Send adjustment request',
    title: 'Budget adjustment request · {{costCenter}}'
  },
  allocated: 'Allocated',
  amountFor: 'Allocation for the {{group}} group',
  approved: 'Approved budget',
  colAllocated: 'Allocated',
  colApproved: 'Approved total',
  colBase: 'Base budget',
  colBuffer: 'Buffer',
  colCurrent: 'Current allocation',
  colDepartment: 'Department',
  colGroup: 'SaaS cost group',
  colNew: 'New allocation',
  colUnallocated: 'Unallocated',
  companyHint: 'Company budget total {{amount}}. Approved amounts are locked; only the allocation below can change.',
  companyTitle: 'Approved budget by department',
  editorHint: 'The total allocated to groups cannot exceed the Cost Center approved budget.',
  editorTitle: 'Allocation by SaaS cost group · {{costCenter}}',
  filters: {
    allDepartments: 'All departments',
    allocation: 'Allocation status',
    department: 'Department',
    empty: 'No department matches the filters.',
    notAllocatable:
      'FY{{year}} ({{status}}) has no approved department budget to allocate. Choose the active year to allocate.',
    state: {
      FULL: 'Fully allocated',
      NONE: 'Not allocated',
      PARTIAL: 'Partly unallocated'
    },
    status: 'Budget status',
    year: 'Budget year'
  },
  invalidAmount: 'Enter a valid amount of 0 or more.',
  locked: 'Locked',
  lockedLabel: 'Approved budget, not editable directly',
  overApproved:
    'Not saved: the allocated total {{allocated}} would exceed the approved budget {{approved}}. Lower another group or request an adjustment.',
  pickCostCenter: 'Choose a Cost Center',
  requestAdjustment: 'Request an approved budget adjustment',
  saveFor: 'Save allocation for the {{group}} group',
  saved: 'Allocation for the {{group}} group saved.',
  subtitle:
    'Split the approved {{year}} budget to each department, Cost Center and SaaS cost group. Changing an approved amount requires an adjustment request.',
  summaryLabel: 'Allocation summary {{costCenter}}',
  title: 'Approved budget allocation',
  unallocated: 'Unallocated'
} as const
