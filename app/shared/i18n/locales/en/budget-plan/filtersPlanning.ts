/** Filter bars of the planning and close lists (FIN-40, FIN-41, FIN-42, FIN-30). */
export const filtersPlanning = {
  allDepartments: 'All departments',
  budgetStatus: 'Budget status',
  department: 'Department',
  negotiation: {
    difference: 'Difference',
    differenceOption: {
      CUT: 'Cut by Finance',
      KEPT: 'Kept as requested'
    },
    search: 'Search negotiation files',
    searchPlaceholder: 'Search by department, cost center or Manager'
  },
  periodClose: {
    empty: 'No cost center matches the filters.',
    remainder: 'Remainder',
    remainderOption: {
      HELD: 'Has held remainder',
      NONE: 'None'
    },
    search: 'Search cost centers to close',
    searchPlaceholder: 'Search by cost center code or name',
    status: 'Close status'
  },
  proposals: {
    allYears: 'All years',
    search: 'Search budget proposals',
    searchPlaceholder: 'Search by department, cost center, Manager or software',
    year: 'Budget year'
  },
  stage: 'Stage',
  summary: {
    empty: 'No department matches the filters.',
    footerVisible: 'Total of visible rows',
    readiness: 'Ready to send',
    readinessOption: {
      NOT_READY: 'Not ready',
      READY: 'Ready to send'
    },
    search: 'Search departments in the summary',
    searchPlaceholder: 'Search by department or cost center'
  }
} as const
