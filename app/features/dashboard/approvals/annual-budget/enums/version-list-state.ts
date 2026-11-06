import { BudgetVersionListState } from '~/shared/api/generated/model/budget-versions/budgetVersionListState'

/** States the version list accepts as a filter; `SUPERSEDED` only appears on legacy records. */
export const versionListState = BudgetVersionListState
export type VersionListState = (typeof versionListState)[keyof typeof versionListState]
