import { BudgetAttachmentPageResponseDtoDataItemsItemStatus } from '~/shared/api/generated/model/budgets/budgetAttachmentPageResponseDtoDataItemsItemStatus'

/** Limits published in the contract examples of `budgetVersionAttachmentDeclare`; the server stays the authority. */
export const attachmentExtensions = ['pdf', 'xlsx', 'docx', 'csv', 'png', 'jpg', 'jpeg'] as const
export const attachmentMaxBytes = 10 * 1024 * 1024
export const attachmentAccept = attachmentExtensions.map((extension) => `.${extension}`).join(',')

export const attachmentStatus = BudgetAttachmentPageResponseDtoDataItemsItemStatus

export function attachmentFileProblem(file: File): 'attachmentType' | 'attachmentSize' | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!(attachmentExtensions as readonly string[]).includes(extension)) return 'attachmentType'
  if (file.size > attachmentMaxBytes) return 'attachmentSize'
  return null
}
