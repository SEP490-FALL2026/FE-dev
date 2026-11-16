export const budgetViews = ['annual', 'reviews', 'charges', 'adjustments'] as const
export type BudgetView = (typeof budgetViews)[number]
export function budgetView(value: string | null): BudgetView {
  return budgetViews.find((view) => view === value) ?? 'annual'
}

/** Details and pagination belong to the selected year and department. */
export function resetBudgetDetails(params: URLSearchParams) {
  for (const key of [
    'page',
    'proposalId',
    'versionId',
    'versionPage',
    'versionFilePage',
    'reviewId',
    'reviewPage',
    'reviewLinePage',
    'chargePage',
    'adjustmentPage'
  ])
    params.delete(key)
  return params
}
