/** Spending Approver: decisions on subscription renewals (subscription-renewals API). */
export const approvalsRenewal = {
  title: 'Subscription renewals',
  detailTitle: 'Renewal decision',
  back: 'Back to list',
  invalidId: 'The renewal ID is not valid.',
  unknown: 'Unknown',
  notProvided: 'Not provided',
  yes: 'Yes',
  no: 'No',
  seats: '{{value}} seats',
  filters: {
    state: 'Status',
    late: 'Late flag',
    allStates: 'All statuses',
    lateAll: 'All',
    lateTrue: 'Past milestone without outcome',
    lateFalse: 'Not late'
  },
  columns: {
    software: 'Software',
    milestone: 'Milestone',
    proposal: 'Proposal',
    state: 'Status',
    late: 'Late flag',
    proposedAt: 'Proposed on'
  },
  emptyQueue: 'No renewals are waiting for your decision.',
  emptyFiltered: 'No renewals match the filters.',
  lateBadge: 'Late',
  waitingNoApprover: 'Waiting for a Spending Approver to be configured',
  stats: {
    purchased: 'Seats bought',
    inUse: 'Seats held',
    milestone: 'Milestone'
  },
  period: {
    title: 'Subscription period',
    startDate: 'Start',
    endDate: 'End',
    renewalDate: 'Renewal date',
    billingCycle: 'Billing cycle',
    autoRenew: 'Renews automatically',
    midTerm: 'Allows mid-term reduction',
    basis: 'Milestone basis'
  },
  usage: {
    title: 'Usage',
    AVAILABLE: 'Evidence of use is available.',
    NOT_AVAILABLE: 'Usage cannot be assessed yet. This does not mean zero users.',
    seatsHint: 'Seats held count granted access, not evidence of use.'
  },
  proposal: {
    title: 'IT Admin proposal',
    choice: 'Choice',
    note: 'Note',
    opinion: 'Business Owner opinion',
    opinionHint: 'Reference input, not an approval step.',
    proposedAt: 'Proposed at'
  },
  ranking: {
    title: 'Ranked seats in use',
    hint: 'Suggested order when reducing below the seats held. You choose the seats to take back.',
    orderOnly: 'No usage data yet: seats are listed oldest first, which is an order, not a judgement of use.',
    validFrom: 'Valid from',
    lastActivity: 'Last activity',
    noActivity: 'No data',
    select: 'Take back the seat of {{name}}',
    empty: 'This period has no personal seats in use.'
  },
  decision: {
    title: 'Your decision',
    choice: 'Decision',
    choiceHint: 'A decision holds no budget commitment and does not create a new period.',
    choiceRequired: 'Choose a decision.',
    quantity: 'Seats remaining after the reduction',
    quantityPlaceholder: 'For example: 8',
    quantityHint: 'Must be lower than the {{purchased}} seats bought.',
    quantityHintUnknown: 'Must be lower than the seats bought.',
    quantityInvalid: 'Enter a whole number from 0 and lower than {{purchased}}.',
    quantityInvalidUnknown: 'Enter a whole number from 0.',
    itSuggests: 'IT proposes {{count}} seats.',
    withinTerm: 'Reduce within the paid period',
    withinTermHint: 'Only when the subscription allows a mid-term reduction.',
    release: 'Seats to take back',
    releaseHint: 'Select exactly {{required}} seats from the ranking. Selected {{selected}}.',
    releaseInvalid: 'Select exactly {{required}} seats, {{selected}} selected.',
    acknowledge: 'I confirm the cancellation although {{count}} seats are still held',
    acknowledgeRequired: 'Confirm the cancellation while people still use it.',
    reason: 'Reason',
    reasonPlaceholder: 'For example: Two teams moved to another tool, keep 8 seats',
    reasonHint: 'Optional, up to 2,000 characters.',
    reasonTooLong: 'The reason can have up to 2,000 characters.',
    submit: 'Record decision',
    submitting: 'Recording decision',
    decided: 'Renewal decision recorded.',
    blocked: 'You cannot decide this renewal.'
  },
  record: {
    title: 'Recorded decision',
    choice: 'Decision',
    quantity: 'Seats remaining',
    reason: 'Reason',
    decidedAt: 'Decided at',
    deciderRole: 'Decided as',
    executionPoint: 'Carried out',
    afterDeadline: 'Decided after the milestone. The decision stands and is carried out at the time above.',
    seatsAtDecision: 'Seats held at decision',
    releasedSeats: 'Seats taken back',
    snapshot: 'Financial figures at decision',
    notConnected: 'Financial figures are not connected. Recorded at {{time}}.',
    budget: 'Budget',
    spent: 'Spent',
    committed: 'Committed',
    remaining: 'Remaining',
    pendingRequests: 'Pending requests',
    periodCost: 'Next period cost',
    periodTax: 'Deductible tax',
    fiscalYear: 'Fiscal year',
    asOf: 'Figures as of {{date}}',
    financialStatus: 'Budget status',
    awaitingOutcome: 'The IT Admin is working with the vendor to record the outcome.',
    lateFlaggedAt: 'Flagged late at {{time}}.'
  },
  outcome: {
    title: 'Vendor outcome',
    kind: 'Outcome',
    note: 'Note',
    recordedAt: 'Recorded at',
    followUp: 'Vendor follow-up is still open.',
    savings: 'Savings at renewal',
    nextPeriod: 'A following subscription period is recorded.'
  },
  deadline: {
    title: 'Milestones passed without a decision',
    kind: 'Event type',
    allKinds: 'All types',
    milestoneDate: 'Milestone',
    autoRenew: 'Auto-renewing at milestone',
    recordedOn: 'Recorded on',
    empty: 'No missed milestones.'
  },
  values: {
    state: {
      PROPOSED: 'Awaiting decision',
      DECIDED: 'Decided, awaiting outcome',
      OUTCOME_RECORDED: 'Outcome recorded'
    },
    choice: {
      RENEW: 'Renew as is',
      REDUCE: 'Reduce seats',
      CANCEL: 'Cancel subscription'
    },
    basis: {
      DECLARED: 'Declared cancellation deadline',
      INFERRED_UNCONFIRMED: 'Inferred deadline, unconfirmed',
      BY_END_DATE: 'Period end date'
    },
    executionPoint: {
      AS_PLANNED: 'At this renewal',
      MID_TERM: 'Mid-term',
      NEXT_RENEWAL: 'At the next renewal'
    },
    outcome: {
      AS_DECIDED: 'Vendor applied the decision',
      VENDOR_REFUSED: 'Vendor refused',
      DIFFERENT: 'Vendor did something different',
      UNCONFIRMED: 'Vendor has not confirmed'
    },
    group: {
      REVOCATION_DECIDED: 'Revocation already decided',
      HOLDER_LEFT: 'Holder has left',
      USAGE_FLAGGED: 'Flagged as waste',
      OTHER: 'Other seats'
    },
    kind: {
      AUTO_RENEWAL_INCIDENT: 'Unwanted automatic renewal',
      EXPIRY_MARKED: 'Marked to end'
    },
    deciderRole: {
      SPENDING_APPROVER: 'Spending Approver',
      CONFLICT_SUBSTITUTE: 'Substitute approver'
    },
    financialStatus: {
      BUDGET: 'Annual budget available',
      NO_BUDGET: 'No budget for this year',
      NO_COST_CENTER: 'Owner department has no Cost Center'
    }
  },
  errors: {
    readForbidden: 'You do not have access to this renewal.',
    notFound: 'The renewal was not found. The list has been reloaded.',
    notDecider: 'You are not the person who decides this renewal.',
    notAwaiting: 'This renewal is no longer awaiting a decision. The data has been reloaded.',
    activeUsers: '{{count}} seats are still held. Confirm the cancellation and send again.',
    activeUsersUnknown: 'Seats are still held. Confirm the cancellation and send again.',
    financeSetup: 'The owner department has no Cost Center in use, so this decision cannot be recorded yet.',
    revocationType: 'A selected seat cannot be taken back through the task queue. Choose another seat.',
    quantityInvalid: 'The seat count does not fit the decision. A reduction must be lower than the seats bought.',
    excessSelection: 'Select exactly {{required}} seats to take back, {{selected}} selected.',
    excessSelectionUnknown: 'The selected seats are not exactly the excess of this period.',
    midTerm: 'This subscription does not allow a mid-term reduction.',
    forbidden: 'You do not have access to missed milestones.'
  }
}
