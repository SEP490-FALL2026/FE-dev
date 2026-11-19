/** Filter panels of the Finance spend-control lists (FIN-05, FIN-20, FIN-44, FIN-07). */
export const filtersSpend = {
  allCostCenters: 'All cost centers',
  costCenter: 'Cost center',
  status: 'Status',
  questions: {
    search: 'Search budget requests',
    searchPlaceholder: 'Search by request code, software, requester, asker or question',
    opinion: 'Budget opinion'
  },
  commitments: {
    search: 'Search commitments',
    searchPlaceholder: 'Search by commitment code, request code, software or approver',
    budget: 'Budget',
    due: 'Recording due',
    dueState: {
      onTime: 'On time',
      overdue: 'Overdue'
    },
    empty: 'No commitments match the filters.'
  },
  budgetExceptions: {
    search: 'Search budget exceptions',
    searchPlaceholder: 'Search by request code, software, Manager or exception detail',
    kind: 'Exception type',
    action: 'Handling option',
    listTitle: 'Exception list',
    listHint: '{{shown}} shown · {{open}} open · {{resolved}} resolved'
  },
  chargeExceptions: {
    search: 'Search charge exceptions',
    searchPlaceholder: 'Search by code, vendor, card last 4 digits or IT note',
    reason: 'Reason'
  }
} as const
