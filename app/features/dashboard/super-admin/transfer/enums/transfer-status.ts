import { TransferPageResponseDtoDataItemsItemStatus } from '~/shared/api/generated/model/department-transfers'
export const transferStatuses = Object.values(TransferPageResponseDtoDataItemsItemStatus)
export const pendingTransfer = TransferPageResponseDtoDataItemsItemStatus.PENDING
