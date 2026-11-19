/** Filter panels of the Spending Approver lists: the queue (APV-01) and optimization proposals (APV-04). */
export const filtersApproverQueue = {
  costCenter: 'Cost center',
  allCostCenters: 'All cost centers',
  queue: {
    search: 'Search pending items',
    searchPlaceholder: 'Search by reference, software, requester or department',
    kind: 'Item type',
    check: 'Budget check result',
    sla: 'SLA',
    slaState: {
      overdue: 'Overdue',
      soon: 'Due soon (≤ 8 hours)',
      onTime: 'On time'
    }
  },
  annual: {
    search: 'Search annual budget files',
    searchPlaceholder: 'Search by department or cost center',
    department: 'Department',
    allDepartments: 'All departments',
    empty: 'No annual budget file matches the filters.'
  },
  optimization: {
    search: 'Search optimization proposals',
    searchPlaceholder: 'Search by proposal code, app or vendor',
    status: 'Status',
    kind: 'Optimization type'
  }
} as const
