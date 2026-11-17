import { MineResponseDtoDataBudgetCycleStatus } from '~/shared/api/generated/model/budgets/mineResponseDtoDataBudgetCycleStatus'

/** Budget cycle of the year: proposals are only accepted while it is `OPEN`. */
export const CYCLE_STATUS = MineResponseDtoDataBudgetCycleStatus
export type CycleStatus = (typeof CYCLE_STATUS)[keyof typeof CYCLE_STATUS]

export function isCycleStatus(value: unknown): value is CycleStatus {
  return typeof value === 'string' && Object.values<string>(CYCLE_STATUS).includes(value)
}
