import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useBudgetAttachmentComplete } from '~/shared/api/generated/operations/budgets/budget-attachment-complete'
import { useBudgetAttachmentDiscard } from '~/shared/api/generated/operations/budgets/budget-attachment-discard'
import { useBudgetVersionAttachmentDeclare } from '~/shared/api/generated/operations/budgets/budget-version-attachment-declare'
import { PresignedUploadError, uploadToPresignedUrl } from '~/shared/api/presigned-upload'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { attachmentFileProblem } from '../enums/attachment-rules'

const contentTypes: Record<string, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg'
}

function contentTypeOf(file: File) {
  return file.type || contentTypes[file.name.split('.').pop()?.toLowerCase() ?? ''] || 'application/octet-stream'
}

/** Declare -> upload to storage -> complete. A declared upload that never completes is discarded. */
export function useBudgetAttachmentUpload(versionId: string, queryKeys: readonly QueryKey[]) {
  const { t: translate } = useTranslation('finance')
  const queryClient = useQueryClient()
  const feedback = useFinanceFeedback(queryKeys)
  const declare = useBudgetVersionAttachmentDeclare()
  const complete = useBudgetAttachmentComplete()
  const discard = useBudgetAttachmentDiscard()
  const [uploadingName, setUploadingName] = useState<string>()

  const upload = async (file: File) => {
    if (uploadingName) return
    const problem = attachmentFileProblem(file)
    if (problem) {
      toast.error(translate(`errors.${problem}`), { id: 'finance-write' })
      return
    }
    setUploadingName(file.name)
    let declaredId: string | undefined
    try {
      const declared = await declare.mutateAsync({
        id: versionId,
        data: { fileName: file.name, contentType: contentTypeOf(file), sizeBytes: file.size }
      })
      if (!declared.data) throw new PresignedUploadError(null)
      declaredId = declared.data.attachment.id
      await uploadToPresignedUrl(declared.data.upload, file)
      await complete.mutateAsync({ id: declaredId })
      declaredId = undefined
      await feedback.onSuccess()
    } catch (error) {
      if (declaredId) await discard.mutateAsync({ id: declaredId }).catch(() => undefined)
      if (error instanceof PresignedUploadError) {
        await Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
        toast.error(translate('errors.attachmentUpload'), { id: 'finance-write' })
      } else await feedback.onError(error)
    } finally {
      setUploadingName(undefined)
    }
  }

  return { upload, uploadingName }
}
