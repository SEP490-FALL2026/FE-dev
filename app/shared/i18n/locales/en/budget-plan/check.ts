/** FIN-08: automatic budget check before a request reaches the Spending Approver. */
export const check = {
  title: 'Budget check before spending approval',
  subtitle: 'Automatic check results for each SaaS purchase request before it reaches the Spending Approver.',
  ruleNotice:
    'The system checks the budget automatically when a Manager submits a request. Requests within budget go straight to the Spending Approver; Finance does not review them again. Only requests over budget, outside the SaaS catalog, or on an expired cost center become exceptions for Finance to handle.',
  summaryLabel: 'Budget check summary',
  checked: 'Requests checked',
  checkedHint: 'Checked automatically on Manager submission',
  passed: 'Within budget, auto-forwarded',
  passedHint: 'Sent to the Spending Approver without Finance review',
  exceptions: 'Open exceptions',
  exceptionsHint: '{{count}} requests failed the check',
  forwardedAmount: 'Amount auto-forwarded',
  forwardedAmountHint: 'Total value of requests within budget',
  filters: {
    allCostCenters: 'All cost centers',
    allYears: 'All years',
    costCenter: 'Cost center / Department',
    exceptionKind: 'Exception type',
    nextStep: 'Next step',
    search: 'Search requests',
    searchPlaceholder: 'Search by request code, software or requester',
    step: {
      FORWARDED: 'Sent to the Spending Approver',
      NEEDS_HANDLING: 'Exception to handle',
      RESOLVED: 'Resolved'
    },
    year: 'Budget year'
  },
  result: {
    CC_EXPIRED: 'Cost center expired',
    INSUFFICIENT: 'Insufficient budget',
    OUT_OF_CATALOG: 'SaaS outside catalog',
    PASSED: 'Within budget'
  },
  colRequest: 'Request',
  colRequester: 'Requester',
  colAmount: 'Amount',
  colRemainingBefore: 'Remaining before request',
  colResult: 'Result',
  colCheckedAt: 'Checked at',
  colNext: 'Next step',
  forwarded: 'Sent to Spending Approver',
  handle: 'Handle exception',
  handleFor: 'Handle exception {{code}}',
  viewResolution: 'View resolution',
  viewResolutionFor: 'View resolution of exception {{code}}',
  empty: 'No requests match the filter.'
} as const
