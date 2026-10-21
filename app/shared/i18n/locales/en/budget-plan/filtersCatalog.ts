/** Filter panels of the Finance catalog screens: FIN-47 decision history, FIN-46 software & cost, FIN-35 optimization. */
export const filtersCatalog = {
  history: {
    allCostCenters: 'All cost centers',
    allKinds: 'All decision types',
    allOutcomes: 'All outcomes',
    allYears: 'All years',
    costCenter: 'Cost center',
    kind: 'Decision type',
    outcome: 'Outcome',
    outcomeValue: {
      ADJUSTMENT_REQUESTED: 'Adjustment requested',
      APPROVED: 'Approved',
      REJECTED: 'Rejected'
    },
    search: 'Search decisions',
    searchPlaceholder: 'Search by note, actor or cost center',
    year: 'Fiscal year'
  },
  optimization: {
    allCostCenters: 'All cost centers',
    allKinds: 'All optimization types',
    allStatuses: 'All statuses',
    allTimings: 'All timings',
    costCenter: 'Cost center',
    kind: 'Optimization type',
    search: 'Search optimization proposals',
    searchPlaceholder: 'Search by proposal code, app or vendor',
    status: 'Status',
    timing: 'Applies',
    timingValue: {
      IMMEDIATE: 'Immediately',
      NEXT_RENEWAL: 'At renewal'
    }
  },
  saas: {
    allBudgets: 'All',
    allCostCenters: 'All cost centers',
    allGroups: 'All software groups',
    allStatuses: 'All statuses',
    budget: 'Group budget',
    budgetValue: {
      OVER: 'Over allocation',
      UNALLOCATED: 'Group not allocated',
      WITHIN: 'Within allocation'
    },
    costCenter: 'Cost center',
    group: 'Software group',
    search: 'Search software',
    searchPlaceholder: 'Search by software name or vendor',
    status: 'Catalog status'
  }
} as const
