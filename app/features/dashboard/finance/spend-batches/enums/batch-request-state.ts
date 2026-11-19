import { BatchItemListResponseDtoDataItemsItemRequestState as BATCH_REQUEST_STATE } from '~/shared/api/generated/model/spend-submission/batchItemListResponseDtoDataItemsItemRequestState'

export { BATCH_REQUEST_STATE }
export type BatchRequestState = (typeof BATCH_REQUEST_STATE)[keyof typeof BATCH_REQUEST_STATE]

const knownStates = new Set<string>(Object.values(BATCH_REQUEST_STATE))

export function isBatchRequestState(value: string | null | undefined): value is BatchRequestState {
  return Boolean(value && knownStates.has(value))
}
