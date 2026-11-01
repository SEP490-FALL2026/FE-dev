import { OffboardingState } from '../enums/offboarding-state'
import { ChecklistState } from '../enums/checklist-state'
type ClosureCase = {
  state: string
  closed: boolean
  accountLock: unknown
  heldRights: number
  blockers: Record<string, number>
  checklist: Record<string, { state: string }> | null
}
export function canCloseOffboarding(item: ClosureCase) {
  return (
    item.state === OffboardingState.LEFT &&
    !item.closed &&
    Boolean(item.accountLock) &&
    item.heldRights === 0 &&
    Object.values(item.blockers).every((value) => value === 0) &&
    Boolean(item.checklist) &&
    Object.values(item.checklist ?? {}).length === 4 &&
    Object.values(item.checklist ?? {}).every((step) => step.state === ChecklistState.DONE)
  )
}
