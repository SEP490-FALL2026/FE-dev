import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { useBudgetScope } from './use-budget-scope'
import { CYCLE_STATUS } from '../enums/cycle-status'

/** Budget of the department for a year, as the proposal screens read it (cycle status, deadlines, effective budget). */
export function useBudgetContext(year: number, costCenterId?: string) {
  const scope = useBudgetScope()
  const selectedCostCenter = costCenterId ?? scope.costCenterId
  const query = useBudgetMine(
    { year, ...(selectedCostCenter ? { costCenterId: selectedCostCenter } : {}) },
    { query: { enabled: !!costCenterId || (!scope.isPending && !scope.isError && !!scope.departmentId) } }
  )
  const budget = !query.isError ? (query.data?.data?.budget ?? null) : null
  return {
    query,
    budget,
    departmentId: scope.departmentId,
    /** Submit, withdraw and resubmit are only allowed while the cycle accepts proposals. */
    cycleOpen: budget?.cycle?.status === CYCLE_STATUS.OPEN
  }
}

export type BudgetContextState = ReturnType<typeof useBudgetContext>
