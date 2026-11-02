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
  'period-report',
  'cost-centers',
  'exchange-rates',
  'vendor-tax'
] as const

export type FinanceTabKey = (typeof FINANCE_TAB_KEYS)[number]
