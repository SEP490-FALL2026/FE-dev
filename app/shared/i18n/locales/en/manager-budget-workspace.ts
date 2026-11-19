export const managerBudgetWorkspace = {
  navigation: 'Department budget',
  views: {
    annual: 'Annual budget',
    reviews: 'Budget reviews',
    charges: 'Seat-month costs',
    adjustments: 'Adjustments'
  },
  currentOnly:
    'In-year figures are available for the department you currently manage. Select that department to continue.',
  unavailable: 'No budget data matches the selected department and year.',
  reviewHint: 'Review the snapshots and explain the lines requested by Finance.',
  month: 'Month',
  monthYear: '{{month}}/{{year}}',
  kind: 'Type',
  light: 'Budget indicators',
  reviewDetail: 'Review details',
  closedAt: 'Snapshot taken',
  dueOn: 'Explanation due',
  signedAt: 'Signed by Finance',
  snapshotHint:
    'The snapshot is retained. Later changes are shown separately. Explanations can be updated until Finance signs, including after the deadline.',
  figures: {
    base: 'Effective base at snapshot',
    reserve: 'Reserve at snapshot',
    spent: 'Spent through the month',
    spentAfterMonth: 'Spent after the month',
    changedAfterSnapshot: 'Changes after snapshot',
    committed: 'Committed',
    pendingSpend: 'Pending spending decision',
    remaining: 'Remaining',
    forecast: 'Year-end forecast',
    priceIncrease: 'Known price increases'
  },
  pace: 'Spending pace',
  explanation: 'Department explanation',
  explain: 'Add explanation',
  editExplanation: 'Update explanation',
  explanationHint:
    'Explain the cause, the action and the needs known through year-end. Enter 0 VND when there is no known cost. Saving replaces the entire explanation.',
  cause: 'Cause',
  persistenceLabel: 'Duration of the cause',
  persistence: { ONE_OFF: 'One-off', ONGOING: 'Ongoing' },
  action: 'Department action',
  knownAmount: 'Known needs through year-end (VND)',
  knownNote: 'Known needs through year-end',
  periodKinds: { MONTH: 'Monthly snapshot', QUARTER: 'Quarterly review' },
  periodStates: { SNAPSHOT: 'Snapshot saved', AWAITING_EXPLANATIONS: 'Awaiting explanations', SIGNED: 'Signed' },
  lights: { GREEN: 'Green', YELLOW: 'Yellow', RED: 'Red', UNDER: 'Underused' },
  explanationStates: {
    NOT_REQUIRED: 'Not required',
    PENDING: 'Explanation needed',
    EXPLAINED: 'Explained',
    UNEXPLAINED: 'Not explained before signature',
    NO_HEAD: 'No department head'
  },
  chargeHint: 'K2 seat costs allocated to your department by month. The server calculates these amounts.',
  employee: 'Employee',
  days: 'Charged days / days in month',
  monthlyPrice: 'Monthly unit price',
  chargeDetail: 'Seat-month cost details',
  subscriptionId: 'Subscription ID',
  appliedToCommitment: 'Applied to commitment',
  adjustmentHint:
    'Read adjustments involving your department. Finance proposes them and the spending approver decides. Only approved adjustments change the effective budget.',
  allStates: 'All statuses',
  from: 'Source cost center',
  to: 'Destination cost center',
  adjustmentDetail: 'Adjustment details',
  createdAt: 'Proposed on',
  decidedAt: 'Decided on',
  decisionReason: 'Decision reason',
  adjustmentKinds: {
    SUPPLEMENT: 'Supplement',
    TRANSFER: 'Transfer',
    RETURN: 'Return funds',
    CEILING_REDUCTION: 'Reduce annual ceiling'
  },
  adjustmentStates: { PENDING: 'Pending decision', APPROVED: 'Approved', REJECTED: 'Rejected' },
  errors: {
    budgetReviewClosed: 'This review no longer accepts explanations. The latest data has been loaded.',
    budgetExplanationNotRequired: 'This line does not require an explanation. Review the latest status.',
    budgetCostCenterScope: 'You no longer manage this cost center. Your permissions will be checked again.'
  }
} as const
