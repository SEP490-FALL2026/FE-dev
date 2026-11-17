import type { GhostSeatDecisionBodyDto } from '~/shared/api/generated/model'
import type { PolicyChecklistBody } from '~/entities/policy/hooks/use-policy-checklist'
import { GHOST_CHOICE, GHOST_STATE } from './enums/ghost-seat'

export function canDecideGhostSeat(state: string) {
  return state === GHOST_STATE.AWAITING_DECISION || state === GHOST_STATE.RETURNED_TO_HEAD
}
export function canSubmitGhostDecision(
  choice: GhostSeatDecisionBodyDto['choice'],
  hasNo: boolean,
  checklist: PolicyChecklistBody | undefined,
  reason: string
) {
  return (
    !!checklist &&
    reason.trim().length >= 3 &&
    reason.trim().length <= 1000 &&
    (!hasNo || choice === GHOST_CHOICE.RECLAIM)
  )
}
