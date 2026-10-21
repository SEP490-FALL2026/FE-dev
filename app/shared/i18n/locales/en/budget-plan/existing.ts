/** Annual budget additions to the existing Finance screens: overview, Cost Center budgets and commitments. */
export const existing = {
  departments: {
    colBase: 'Base budget',
    colBuffer: 'Buffer',
    colDepartment: 'Department / Cost Center',
    colManager: 'Manager',
    colStatus: 'Status',
    colTotal: 'Annual total',
    companyRow: 'Whole company (approved total)',
    empty: 'No budget for this fiscal year yet.',
    hint: 'Annual budget of each department by fiscal year, with its status in the budget lifecycle.',
    legend: 'Budget statuses',
    notApplicable: '—',
    title: 'Annual budgets by department',
    total: 'Total',
    yearLabel: 'Fiscal year',
    yearOption: 'FY {{year}}'
  },
  overview: {
    approved: 'Approved annual budget',
    approvedBadge: 'Approved',
    base: 'Base budget',
    buffer: 'Buffer',
    committed: 'Committed',
    committedHint: 'Approved, not yet paid',
    formula: 'Remaining = Approved total − Used − Committed.',
    hint: 'Only budgets the Spending Approver approved for the active fiscal year.',
    openSummary: 'View department summary',
    proposalCount: 'Proposals',
    proposedBadge: 'Not approved',
    proposedHint: 'The FY {{year}} budget is being planned; it is not counted in the approved or remaining figures.',
    proposedTitle: 'Proposed — not approved',
    proposedTotal: 'Total proposed',
    region: 'Annual budget',
    remaining: 'Remaining',
    title: 'Approved FY {{year}} budget',
    used: 'Used'
  },
  unpaid: {
    colAmount: 'Amount',
    colApproved: 'Approved on',
    colCode: 'Commitment',
    colPayment: 'Expected payment',
    colSoftware: 'Software',
    colStage: 'Stage',
    count: '{{count}} items',
    hint: 'Spending the Spending Approver approved that is not yet recorded or not yet paid.',
    note: 'These amounts are subtracted from the remaining budget (Remaining = Budget − Used − Approved but unpaid) so the system does not overstate what is left.',
    overdue: 'Overdue',
    stage: {
      NOT_RECORDED: 'Not recorded',
      RECORDED: 'Recorded — not paid'
    },
    title: 'Approved but not yet paid',
    total: 'Total unpaid'
  }
} as const
