import { BudgetAttachmentPageResponseDtoDataItemsItemStatus } from '~/shared/api/generated/model/budgets/budgetAttachmentPageResponseDtoDataItemsItemStatus'

export const attachmentStatus = BudgetAttachmentPageResponseDtoDataItemsItemStatus
export type AttachmentStatus = (typeof attachmentStatus)[keyof typeof attachmentStatus]
