import { CycleResponseDtoDataStatus } from '~/shared/api/generated/model/budget-cycles'

/** Publication state of a budget cycle, as the contract defines it. */
export const CYCLE_STATUS = CycleResponseDtoDataStatus
export type CycleStatus = (typeof CYCLE_STATUS)[keyof typeof CYCLE_STATUS]

export function isCycleStatus(value: string): value is CycleStatus {
  return (Object.values(CYCLE_STATUS) as string[]).includes(value)
}

/** The division of the ceiling can be published again only before the first publication or after a change. */
export function canPublishCycle(status: CycleStatus): boolean {
  return status !== CYCLE_STATUS.PUBLISHED
}

/** The deadlines, priorities and ceiling can be edited only while the cycle is not published. */
export function canEditCycle(status: CycleStatus): boolean {
  return status !== CYCLE_STATUS.PUBLISHED
}
