import {
  getCostCenterListQueryKey,
  useCostCenterDeactivate,
  useCostCenterRename
} from '~/shared/api/generated/operations/cost-centers'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'

/** Finance renames and retires Cost Centers; the creation has its own dialog because it shows BE answers at the fields. */
export function useCostCenterActions(onDone?: () => void) {
  const feedback = useFinanceFeedback([getCostCenterListQueryKey()], onDone)
  return {
    rename: useCostCenterRename({ mutation: feedback }),
    deactivate: useCostCenterDeactivate({ mutation: feedback })
  }
}
