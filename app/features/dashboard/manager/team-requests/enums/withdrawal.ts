import { ACCESS_REQUEST_STATE } from '~/entities/request/enums/access-request-state'
export { LinesResponseDtoDataItemsItemState as LINE_STATE } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItemState'
export function isHeadWithdrawalStage(state: string) {
  return [
    ACCESS_REQUEST_STATE.AWAITING_SPEND_SUBMISSION,
    ACCESS_REQUEST_STATE.AWAITING_BUDGET,
    ACCESS_REQUEST_STATE.WAITING_CONTROLLED
  ].some((value) => value === state)
}
