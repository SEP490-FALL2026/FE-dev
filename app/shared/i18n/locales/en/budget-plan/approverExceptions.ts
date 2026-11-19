/** APV-07: the Spending Approver decides budget exceptions and changes to an approved budget that Finance submitted. */
export const approverExceptions = {
  adjustment: {
    after: 'Proposed new budget',
    before: 'Current approved budget',
    changeTitle: 'Proposed change',
    costCenter: 'Cost center',
    demoNote:
      "Approving records the decision in the history. The approved figure on Finance's allocation screen is demo data and does not change.",
    difference: 'Difference',
    kind: 'Change to an approved budget',
    optionDecrease: 'Decrease the annual budget',
    optionIncrease: 'Increase the annual budget',
    reason: "Finance's reason",
    requestedAt: 'Requested on',
    requestedBy: 'Requested by',
    subtitle: '{{costCenter}} · Fiscal year {{year}}',
    title: 'Budget adjustment for {{costCenter}}'
  },
  approve: 'Approve',
  backToList: 'Back to list',
  colKind: 'Type',
  colOption: "Finance's option",
  colProposed: 'Top-up / new budget',
  colReference: 'Reference',
  colStatus: 'Status',
  colSubject: 'Software / cost center',
  confirmReject: 'Confirm rejection',
  decisionHint: "Approve to let Finance's option take effect. Rejecting requires a reason.",
  decisionTitle: 'Decision',
  empty: 'No item matches the filter.',
  exception: {
    amount: 'Requested amount',
    checkAmount: 'Checked amount',
    checkTitle: 'Budget check result',
    checkedAt: 'Checked on',
    costCenter: 'Cost center',
    financeTitle: "Finance's resolution",
    kind: 'Exception type',
    manager: 'Responsible Manager',
    noCheck: 'No automatic check result was found for this request.',
    noTopUp: 'No top-up proposed',
    note: "Finance's note",
    option: 'Option',
    problemTitle: 'Exception record',
    proposedTopUp: 'Proposed top-up',
    raisedAt: 'Raised on',
    remainingBefore: 'Remaining before the request',
    remainingUnknown: 'Not applicable',
    requestCode: 'Request code',
    resolvedAt: 'Resolved by Finance on',
    shortfall: 'Shortfall',
    target: 'New cost center'
  },
  notice: {
    approved: 'Approved',
    by: '{{by}} · {{time}}',
    reason: 'Reason: {{reason}}',
    rejected: 'Rejected'
  },
  openDetail: 'View',
  openDetailFor: 'View {{reference}}',
  reasonLabel: 'Reason for rejecting',
  reasonRequired: 'A reason for rejecting is required.',
  reject: 'Reject',
  state: {
    decided: 'Decided',
    pending: 'Awaiting decision'
  },
  status: {
    approved: 'Approved',
    pending: 'Awaiting decision',
    rejected: 'Rejected'
  },
  subtitle:
    'Requests short of budget or for SaaS outside the catalog that Finance submitted with a resolution, and changes to approved budgets.',
  title: 'Exception approval',
  type: {
    adjustments: 'Budget adjustments',
    exceptions: 'Budget exceptions'
  },
  typeLabel: 'Item type'
} as const
