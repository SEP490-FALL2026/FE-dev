import { BudgetVersionListState } from '~/shared/api/generated/model/budget-versions/budgetVersionListState'

export const versionStates = Object.values(BudgetVersionListState)
export const versionState = BudgetVersionListState
export const canEditVersion = (state: string) =>
  state === versionState.DRAFT || state === versionState.CHANGES_REQUESTED
