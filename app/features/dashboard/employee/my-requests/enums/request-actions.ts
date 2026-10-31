import { ACCESS_REQUEST_STATE } from '~/entities/request/enums/access-request-state'
import { LinesResponseDtoDataItemsItemState } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItemState'
export { AccessRequestResponseDtoDataRequestType as REQUEST_TYPE } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequestType'

export function canOfferLineWithdrawal(state: string) {
  return [
    LinesResponseDtoDataItemsItemState.AWAITING_NEED,
    LinesResponseDtoDataItemsItemState.NEED_CONFIRMED,
    LinesResponseDtoDataItemsItemState.APPROVED,
    LinesResponseDtoDataItemsItemState.EXECUTING,
    LinesResponseDtoDataItemsItemState.FAILED
  ].some((value) => value === state)
}

/** Server still decides whether a queued grant can be withdrawn. Unknown states are denied. */
const withdrawableStates: readonly string[] = [
  ACCESS_REQUEST_STATE.PENDING,
  ACCESS_REQUEST_STATE.WAITING_CONTROLLED,
  ACCESS_REQUEST_STATE.AWAITING_IT_ASSESSMENT,
  ACCESS_REQUEST_STATE.AWAITING_SPEND_SUBMISSION,
  ACCESS_REQUEST_STATE.AWAITING_FINANCE_REVIEW,
  ACCESS_REQUEST_STATE.AWAITING_BUDGET,
  ACCESS_REQUEST_STATE.AWAITING_SPEND_DECISION,
  ACCESS_REQUEST_STATE.AWAITING_EXECUTION,
  ACCESS_REQUEST_STATE.EXECUTING,
  ACCESS_REQUEST_STATE.FAILED
]
export function canOfferWithdrawal(state: string) {
  return withdrawableStates.includes(state)
}
