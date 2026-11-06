export const FINANCE_TAB_KEYS = [
  'overview',
  'cost-centers',
  'annual-proposals',
  'budget-negotiation',
  'spend-batches',
  'invoice-intake',
  'commitments',
  'saas-cost',
  'vendor-tax',
  // Older links; see tabAliases in finance-nav.ts.
  'budgets',
  'department-budget',
  'budget-allocation',
  'department-summary',
  'decision-history'
] as const

export type FinanceTabKey = (typeof FINANCE_TAB_KEYS)[number]
