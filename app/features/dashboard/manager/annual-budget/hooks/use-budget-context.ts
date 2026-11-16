import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { useBudgetScope } from './use-budget-scope'
import { CYCLE_STATUS } from '../enums/cycle-status'
import { isResourceId } from '../../shared/manager-identifiers'

/** Budget of the department for a year, as the proposal screens read it (cycle status, deadlines, effective budget). */
export function useBudgetContext(year: number, costCenterId?: string) {
  const scope = useBudgetScope()
  const selectedCostCenter = scope.costCenterId
  const enabled =
    !scope.isPending &&
    !scope.isError &&
    isResourceId(selectedCostCenter ?? '') &&
    (!costCenterId || costCenterId === selectedCostCenter)
  const query = useBudgetMine(
    { year, ...(selectedCostCenter ? { costCenterId: selectedCostCenter } : {}) },
    { query: { enabled } }
  )
  const response = enabled && !query.isError ? query.data?.data?.budget : null
  const budget = response?.year === year && response.costCenter?.id === selectedCostCenter ? response : null
  return {
    query: scope.isPending || scope.isError ? scope.query : { ...query, isPending: enabled && query.isPending },
    budget,
    scope,
    enabled,
    departmentId: scope.departmentId,
    /** Submit, withdraw and resubmit are only allowed while the cycle accepts proposals. */
    cycleOpen: !query.isFetching && budget?.cycle?.status === CYCLE_STATUS.OPEN
  }
}

export type BudgetContextState = ReturnType<typeof useBudgetContext>
