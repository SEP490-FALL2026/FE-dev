export const financeRequests = {
  all: 'All',
  back: 'Back',
  none: '—',
  yes: 'Yes',
  no: 'No',
  title: 'Request monitor',
  description: 'Requests whose spend was approved, so a commitment was made (read only).',
  software: 'Software',
  plan: 'Plan',
  department: 'Department',
  costCenter: 'Cost center',
  requester: 'Requester',
  beneficiary: 'Beneficiary',
  termMonths: 'Term (months)',
  budgetYear: 'Budget year',
  submittedAt: 'Submitted',
  reserveUsed: 'Uses reserve',
  stateLabel: 'State',
  from: 'Sent from',
  to: 'Sent until',
  dateRangeInvalid: 'The start date must be on or before the end date.',
  groupLines: '{{count}} people (group request)',
  longTerm: 'Long-term use',
  oneTime: 'One-time purchase (licence for good)',
  view: {
    label: 'Progress',
    open: 'Open',
    ended: 'Ended'
  },
  type: {
    label: 'Type',
    GRANT: 'Access',
    SERVICE_ACCOUNT: 'Service account',
    RENEWAL: 'Renewal',
    GROUP_GRANT: 'Group access'
  },
  state: {
    PENDING: 'Pending',
    WAITING_CONTROLLED: 'Waiting (controlled)',
    AWAITING_EXECUTION: 'Approved, awaiting execution',
    AWAITING_IT_ASSESSMENT: 'Awaiting IT assessment',
    AWAITING_SPEND_SUBMISSION: 'Awaiting spend submission',
    AWAITING_SPEND_DECISION: 'Awaiting spend decision',
    AWAITING_REQUESTER_REVISION: 'Awaiting requester revision',
    REJECTED: 'Rejected',
    IT_REJECTED: 'Rejected by IT',
    EXECUTING: 'Executing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    AWAITING_IT_CLOSE: 'Awaiting IT close',
    WITHDRAWN: 'Withdrawn',
    CANCELLED: 'Cancelled'
  },
  detail: {
    title: 'Request',
    summary: 'Summary'
  },
  check: {
    title: 'Budget check',
    none: 'No budget check was recorded for this Request.',
    notReviewed: 'This Request has not been budget-checked yet (not submitted in a batch).',
    outcome: 'Outcome',
    bindingTotal: 'Amount checked',
    overBy: 'Over by',
    nextYear: 'Next year {{year}}: {{remaining}} left, {{after}} after this Request.',
    year: 'Year',
    cost: 'Cost',
    effectiveBudget: 'Effective budget',
    held: 'Held',
    remaining: 'Remaining',
    code: 'Result',
    outcomes: {
      WITHIN_BASE: 'Within the base budget',
      USES_RESERVE: 'Uses the reserve',
      BLOCKED: 'Blocked'
    },
    reasons: {
      PRICE_EXPIRED: 'The price evidence is out of date.',
      NO_APPROVED_BUDGET: 'There is no approved budget.',
      OVER_RESERVE: 'The cost is over the base budget and the reserve.'
    },
    codes: {
      BUDGET_OK: 'Budget is enough',
      HIGH_VALUE: 'High value',
      INSUFFICIENT_BUDGET: 'Budget is not enough',
      NO_ACTIVE_BUDGET: 'No active budget',
      CLOSED_OR_EXPIRED_BUDGET_PERIOD: 'Budget period closed or expired',
      STALE_COST_EVIDENCE: 'Cost evidence is out of date'
    }
  }
} as const
