export const FINANCE_TAB_KEYS = [
  'overview',
  'department-budget',
  'budgets',
  'budget-allocation',
  'budget-periods',
  'decision-history',
  'department-summary',
  'annual-proposals',
  'budget-negotiation',
  'cost-forecast',
  'cost-optimization',
  'spend-batches',
  'commitments',
  'saas-cost',
  'spend-import',
  'charge-exceptions',
  'period-close',
  'cost-analysis',
  'period-report',
  'cost-centers',
  'vendor-tax'
] as const

export type FinanceTabKey = (typeof FINANCE_TAB_KEYS)[number]
