/** FIN-44: requests that failed the automatic budget check and need a Finance decision. */
export const exceptions = {
  title: 'Budget exceptions',
  subtitle: 'Requests over budget, outside the SaaS catalog, or on an expired cost center.',
  notice:
    'For each exception Finance picks one path: propose a budget top-up, move the cost center, ask the Manager for more documents, or submit an exception to the Spending Approver.',
  filterLabel: 'Filter by exception status',
  state: {
    open: 'Open',
    resolved: 'Resolved'
  },
  colRequest: 'Request',
  colKind: 'Exception type',
  colRaisedAt: 'Raised at',
  colManager: 'Manager',
  colStatus: 'Status',
  openDetail: 'View details',
  openDetailFor: 'View details of exception {{code}}',
  empty: 'No exceptions match the filter.',
  action: {
    PROPOSE_TOPUP: 'Propose budget top-up',
    REQUEST_INFO: 'Ask Manager for documents',
    SUBMIT_TO_APPROVER: 'Submit exception for approval',
    TRANSFER_COST_CENTER: 'Move cost center'
  },
  actionHint: {
    PROPOSE_TOPUP: 'Send the Spending Approver a budget increase; the request waits until it is topped up.',
    REQUEST_INFO: 'Return the request to the Manager for more documents, then check again.',
    SUBMIT_TO_APPROVER: 'Let the Spending Approver decide the exception, with the Finance note attached.',
    TRANSFER_COST_CENTER: 'Charge the request to an active cost center, then check again.'
  },
  factsTitle: 'Exception details',
  amount: 'Requested amount',
  manager: 'Responsible Manager',
  raisedAt: 'Raised at',
  checkTitle: 'Automatic check result',
  checkedAt: 'Checked at',
  remainingBefore: 'Remaining before request',
  retired: 'Retired',
  replacedBy: 'Replaced by {{code}}',
  decisionTitle: 'Resolution',
  decisionHint: 'Pick one path and state the reason; the decision is saved to the budget history.',
  topUpLabel: 'Proposed top-up amount',
  topUpRequired: 'Enter a top-up amount greater than 0.',
  targetLabel: 'New cost center',
  targetPlaceholder: 'Choose a cost center',
  targetRequired: 'Choose an active cost center other than the current one.',
  noteLabel: 'Resolution note',
  noteRequired: 'A resolution note is required.',
  submit: 'Record resolution',
  success: 'Resolution for exception {{code}} recorded.',
  resolvedTitle: 'Resolved: {{action}}',
  resolvedAt: 'On {{time}}',
  resolvedTarget: 'Moved to {{code}}',
  resolvedTopUp: 'Proposed top-up {{amount}}'
} as const
