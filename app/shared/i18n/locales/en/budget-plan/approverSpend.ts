/** APV-01, APV-02 and the overview: budget checks on SaaS spend and annual budget files for the Spending Approver. */
export const approverSpend = {
  overview: {
    region: 'Waiting for your decision',
    spendPending: 'SaaS spend to approve',
    spendPendingHint: '{{count}} past the deadline',
    annualPending: 'Annual budgets to approve',
    annualPendingHint: 'Finance proposes {{amount}}',
    exceptions: 'Exceptions & adjustments to decide',
    exceptionsHint: '{{exceptions}} exceptions · {{adjustments}} budget adjustments',
    deadline: 'Nearest cancellation deadline',
    toReports: 'View spend report'
  },
  queue: {
    typeLabel: 'File type',
    typeSpend: 'SaaS spend',
    typeAnnual: 'Annual budget',
    checkLabel: 'Budget check result',
    colCheck: 'Budget check',
    empty: 'No item matches the filter.'
  },
  annual: {
    title: '{{year}} annual budget files pending',
    hint: 'Department budgets Finance reviewed, negotiated and sent to the Spending Approver.',
    note: 'Annual budgets are decided on the Annual budget approval screen, separate from in-year SaaS spend.',
    colDepartment: 'Department',
    colVersion: 'Version',
    colFinance: 'Finance total',
    colRequested: 'Manager requested',
    colSentAt: 'Sent at',
    version: 'Version {{version}}',
    open: 'Open',
    openItem: 'Open the annual budget of {{department}}',
    empty: 'No annual budget file is pending.'
  },
  result: {
    CC_EXPIRED: 'Budget expired',
    INSUFFICIENT: 'Insufficient budget',
    OUT_OF_CATALOG: 'Out of catalog',
    PASSED: 'Within budget'
  },
  check: {
    title: 'Budget check result',
    hint: '{{year}} annual budget of {{costCenter}}',
    result: 'Result',
    approved: 'Approved annual budget',
    used: 'Used',
    committed: 'Committed (approved, not yet paid)',
    amount: 'This spend',
    before: 'Remaining before this spend',
    after: 'Remaining after this spend',
    rule: 'Remaining = approved annual budget − used − committed. The check is a reference; the Spending Approver still makes the final decision.'
  },
  noSnapshot: 'Cost Center {{costCenter}} has no quarterly budget to compare with.'
} as const
