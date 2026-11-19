/** Filter panels of the Spending Approver decision screens: APV-05 annual budget, APV-07 exceptions, APV-06 history. */
export const filtersApproverDecisions = {
  annual: {
    allDepartments: 'All departments',
    allStages: 'All stages',
    allYears: 'All years',
    department: 'Department',
    empty: 'No budget proposals match the filters.',
    search: 'Search budget proposals',
    searchPlaceholder: 'Search by department, cost center or manager',
    stage: 'Stage',
    year: 'Budget year'
  },
  exceptions: {
    allCostCenters: 'All cost centers',
    allDirections: 'All directions',
    allKinds: 'All exception types',
    allOptions: 'All options',
    allStatuses: 'All statuses',
    costCenter: 'Cost center',
    direction: 'Adjustment direction',
    directionValue: {
      decrease: 'Decrease',
      increase: 'Increase'
    },
    kind: 'Exception type',
    option: "Finance's option",
    search: 'Search exception cases',
    searchPlaceholder: 'Search by case code, software, cost center, reason or note',
    status: 'Status'
  },
  history: {
    allCostCenters: 'All cost centers',
    allGroups: 'All decision groups',
    allOutcomes: 'All outcomes',
    allYears: 'All years',
    costCenter: 'Cost center',
    group: 'Decision group',
    outcome: 'Outcome',
    search: 'Search the decision log',
    searchPlaceholder: 'Search by note, cost center or approver',
    year: 'Fiscal year'
  }
} as const
