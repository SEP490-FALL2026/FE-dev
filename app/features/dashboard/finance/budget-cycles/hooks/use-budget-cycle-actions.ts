import {
  getBudgetCycleGetQueryKey,
  getBudgetCycleListQueryKey,
  getBudgetCyclePackageQueryKey,
  useBudgetCycleOpen,
  useBudgetCyclePublish,
  useBudgetCycleUpdate,
  useBudgetDepartmentCeilingsSet
} from '~/shared/api/generated/operations/budget-cycles'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'

/** Mutations of one budget cycle; each refreshes the list, the cycle and its package after BE confirms. */
export function useBudgetCycleActions(year: number | undefined, onOpened?: (openedYear: number) => void) {
  const cycleKeys = [
    getBudgetCycleListQueryKey(),
    ...(year === undefined ? [] : [getBudgetCycleGetQueryKey(year), getBudgetCyclePackageQueryKey(year)])
  ]
  const openFeedback = useFinanceFeedback([getBudgetCycleListQueryKey()])
  const feedback = useFinanceFeedback(cycleKeys)
  return {
    open: useBudgetCycleOpen({
      mutation: {
        onSuccess: async (response, variables) => {
          await openFeedback.onSuccess()
          onOpened?.(response.data?.year ?? variables.data.year)
        },
        onError: openFeedback.onError
      }
    }),
    update: useBudgetCycleUpdate({ mutation: feedback }),
    setCeilings: useBudgetDepartmentCeilingsSet({ mutation: feedback }),
    publish: useBudgetCyclePublish({ mutation: feedback })
  }
}
