import { useBudgetCycleBaseline } from '~/shared/api/generated/operations/budget-cycles'

/**
 * Departments Finance can pick for a new Cost Center. Finance cannot read the department list (Super Admin and
 * IT Admin only), so BE points Finance to the baseline of the current year: its departments carry
 * `costCenterId`, and `null` means the department has no Cost Center yet. The year needs a budget cycle.
 */
export function useFinanceDepartments() {
  const year = new Date().getFullYear()
  const baseline = useBudgetCycleBaseline(year, undefined, { query: { retry: false } })
  const departments = (baseline.data?.data?.departments ?? []).filter((department) => department.costCenterId === null)
  return {
    year,
    isPending: baseline.isPending,
    /** The year has no budget cycle (or the baseline cannot be read), so there is nothing to pick from. */
    noCycle: baseline.isError,
    departments
  }
}
