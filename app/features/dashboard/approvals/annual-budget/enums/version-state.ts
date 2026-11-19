import { BudgetVersionListState } from '~/shared/api/generated/model/budget-versions/budgetVersionListState'

export const versionState = BudgetVersionListState
export type VersionState = (typeof versionState)[keyof typeof versionState]
