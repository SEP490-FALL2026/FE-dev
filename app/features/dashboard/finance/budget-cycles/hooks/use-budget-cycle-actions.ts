import {
  getBudgetCycleGetQueryKey,
  getBudgetCycleListQueryKey,
  getBudgetCyclePackageQueryKey,
  useBudgetCycleCreate,
  useBudgetCycleDelete,
  useBudgetCycleOpen,
  useBudgetCycleUpdate
} from '~/shared/api/generated/operations/budget-cycles'
import { useBudgetVersionCreate } from '~/shared/api/generated/operations/budget-versions/budget-version-create'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'

/** Mutations of budget cycles; each refreshes the list, the cycle and its package after BE confirms. */
export function useBudgetCycleActions(year: number | undefined, onCreated?: (createdYear: number) => void) {
  const cycleKeys = [
    getBudgetCycleListQueryKey(),
    ...(year === undefined ? [] : [getBudgetCycleGetQueryKey(year), getBudgetCyclePackageQueryKey(year)])
  ]
  const listFeedback = useFinanceFeedback([getBudgetCycleListQueryKey()])
  const feedback = useFinanceFeedback(cycleKeys)
  return {
    create: useBudgetCycleCreate({
      mutation: {
        onSuccess: async (response, variables) => {
          await listFeedback.onSuccess()
          onCreated?.(response.data?.year ?? variables.data.year)
        },
        onError: listFeedback.onError
      }
    }),
    update: useBudgetCycleUpdate({ mutation: feedback }),
    open: useBudgetCycleOpen({ mutation: feedback }),
    /** First version of a department that sent no proposal, built from the baseline (`source = BASELINE`). */
    buildFromBaseline: useBudgetVersionCreate({ mutation: feedback }),
    remove: useBudgetCycleDelete({ mutation: listFeedback })
  }
}
