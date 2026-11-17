import { CycleResponseDtoDataStatus } from '~/shared/api/generated/model/budget-cycles'

/** Lifecycle of a budget cycle: a draft, then open for proposals, then locked after the submission deadline. */
export const CYCLE_STATUS = CycleResponseDtoDataStatus
export type CycleStatus = (typeof CYCLE_STATUS)[keyof typeof CYCLE_STATUS]

export function isCycleStatus(value: string): value is CycleStatus {
  return (Object.values(CYCLE_STATUS) as string[]).includes(value)
}

/** Only a draft can be opened (heads are notified) or deleted. */
export function canOpenCycle(status: CycleStatus): boolean {
  return status === CYCLE_STATUS.DRAFT
}

/** Ceiling, shared-pool reserve, deadlines and priorities change until the cycle locks. */
export function canEditCycle(status: CycleStatus): boolean {
  return status !== CYCLE_STATUS.LOCKED
}
