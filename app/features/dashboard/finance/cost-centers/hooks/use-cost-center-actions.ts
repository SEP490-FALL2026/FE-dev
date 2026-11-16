import {
  getCostCenterListQueryKey,
  useCostCenterCreate,
  useCostCenterDeactivate,
  useCostCenterRename
} from '~/shared/api/generated/operations/cost-centers'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'

/** Finance keeps the Cost Center catalogue: create, rename and retire. Each write refreshes the list. */
export function useCostCenterActions(onDone?: () => void) {
  const feedback = useFinanceFeedback([getCostCenterListQueryKey()], onDone)
  return {
    create: useCostCenterCreate({ mutation: feedback }),
    rename: useCostCenterRename({ mutation: feedback }),
    deactivate: useCostCenterDeactivate({ mutation: feedback })
  }
}
