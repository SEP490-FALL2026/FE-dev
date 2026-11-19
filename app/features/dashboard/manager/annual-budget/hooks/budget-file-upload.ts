import axios from 'axios'
import { budgetProposalAttachmentDeclare } from '~/shared/api/generated/operations/budgets/budget-proposal-attachment-declare'
import { budgetAttachmentComplete } from '~/shared/api/generated/operations/budgets/budget-attachment-complete'
import { BUDGET_ATTACHMENT_STATUS } from '../enums/attachment-status'

const fileTypes: Record<string, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg'
}
export const budgetFileAccept = Object.keys(fileTypes)
  .map((extension) => `.${extension}`)
  .join(',')
export function budgetFileType(file: File) {
  const type = fileTypes[file.name.split('.').at(-1)?.toLowerCase() ?? '']
  const unsafeName = [...file.name].some(
    (character) =>
      character === '/' || character === '\\' || character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127
  )
  return type && file.size > 0 && file.name.length <= 200 && !unsafeName ? type : null
}
export function budgetAttachmentErrorCode(error: unknown) {
  return axios.isAxiosError<{ error?: { code?: string } }>(error) ? error.response?.data?.error?.code : undefined
}
export async function completeBudgetUpload(id: string) {
  for (let attempt = 0; ; attempt++) {
    try {
      const result = await budgetAttachmentComplete(id)
      if (result.data?.attachment.status !== BUDGET_ATTACHMENT_STATUS.UPLOADED) throw new Error('UPLOAD_NOT_READY')
      return id
    } catch (error) {
      // Only this explicitly retryable conflict may be repeated automatically.
      if (budgetAttachmentErrorCode(error) !== 'BUDGET_ATTACHMENT.UPLOAD_PENDING' || attempt >= 2) throw error
      await new Promise((resolve) => window.setTimeout(resolve, 1500))
    }
  }
}
export async function uploadBudgetFile(file: File) {
  const contentType = budgetFileType(file)
  if (!contentType) throw new Error('INVALID_BUDGET_FILE')
  const result = await budgetProposalAttachmentDeclare({ fileName: file.name, contentType, sizeBytes: file.size })
  const upload = result.data?.upload
  const id = result.data?.attachment.id
  if (!upload || !id) throw new Error('UPLOAD_RESPONSE_EMPTY')
  const target = new URL(upload.url)
  if (!['https:', 'http:'].includes(target.protocol) || new Date(upload.expiresAt).getTime() <= Date.now())
    throw new Error('UPLOAD_LINK_INVALID')
  // Storage is outside the authenticated API client. Never forward bearer tokens or cookies.
  const response = await fetch(target.href, {
    method: upload.method,
    headers: { 'Content-Type': upload.headers['Content-Type'] ?? contentType },
    body: file,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error'
  })
  if (!response.ok) throw new Error('UPLOAD_STORAGE_FAILED')
  return completeBudgetUpload(id)
}
