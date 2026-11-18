import { useBudgetCycleList } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-list'

/**
 * Budget years the approver can filter by: the years of the budget cycles (`budgetCycleList`, readable by this role),
 * plus the current year so in-year work stays reachable before its cycle exists. Newest first.
 */
export function useBudgetYearOptions() {
  // Same params as the department options, so both pickers share one cached request.
  const cycles = useBudgetCycleList({ page: 1, pageSize: 20 })
  const years = new Set((cycles.data?.data?.items ?? []).map((cycle) => cycle.year).filter(Number.isFinite))
  years.add(new Date().getFullYear())
  return {
    loading: cycles.isPending,
    options: [...years].sort((a, b) => b - a).map((year) => ({ value: String(year), label: String(year) }))
  }
}
