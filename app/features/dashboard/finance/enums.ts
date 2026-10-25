export const FINANCE_TAB_KEYS = [
  'overview',
  'department-budget',
  'budgets',
  'budget-allocation',
  'budget-check',
  'commitments',
  'budget-questions',
  'budget-exceptions',
  'budget-periods',
  'decision-history',
  'department-summary',
  'annual-proposals',
  'budget-negotiation',
  'cost-forecast',
  'cost-optimization',
  'saas-cost',
  'spend-import',
  'charge-exceptions',
  'period-close',
  'cost-analysis',
  'period-report'
] as const

export type FinanceTabKey = (typeof FINANCE_TAB_KEYS)[number]

export const BUDGET_STATUSES = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const
export type BudgetStatus = (typeof BUDGET_STATUSES)[number]

export const ALLOCATION_STATUSES = ['ALLOCATED', 'PARTIAL', 'UNALLOCATED'] as const
export type AllocationStatus = (typeof ALLOCATION_STATUSES)[number]

export const PERIOD_CLOSE_STATUSES = ['OPEN', 'PENDING_REVIEWS', 'BALANCED', 'CLOSED'] as const
export type PeriodCloseStatus = (typeof PERIOD_CLOSE_STATUSES)[number]
