import { getCostCenterListQueryKey, useCostCenterRename } from '~/shared/api/generated/operations/cost-centers'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'

/** Rename a cost center and refresh the list. */
export function useCostCenterActions(onDone?: () => void) {
  const feedback = useFinanceFeedback([getCostCenterListQueryKey()], onDone)
  return {
    rename: useCostCenterRename({ mutation: feedback })
  }
}
