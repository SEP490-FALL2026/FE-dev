import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CreateDocumentBodyDtoPurpose } from '~/shared/api/generated/model/documents'
import { documentComplete } from '~/shared/api/generated/operations/documents/document-complete'
import { documentCreate } from '~/shared/api/generated/operations/documents/document-create'
import { uploadToPresignedUrl } from '~/shared/api/presigned-upload'
import { completeUpload } from '../../shared/complete-upload'

export const PURCHASE_DOCUMENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'] as const
export const PURCHASE_DOCUMENT_LIMIT = 20

/** The extension of the file must match its type (the API refuses a mismatch). */
const typeOfExtension: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg'
}

export function purchaseDocumentProblem(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return !(PURCHASE_DOCUMENT_TYPES as readonly string[]).includes(file.type) || typeOfExtension[extension] !== file.type
}

export interface UploadedDocument {
  id: string
  name: string
}

/**
 * Declares a PURCHASE_DOCUMENT, PUTs the bytes to the signed URL and completes it. The id is then sent in `documentIds`;
 * documentAttach is not called for this purpose.
 */
export function usePurchaseDocumentUpload() {
  const { t: translate } = useTranslation('financePurchases')
  return useMutation({
    retry: false,
    mutationFn: async (file: File): Promise<UploadedDocument> => {
      if (purchaseDocumentProblem(file)) throw new Error('UPLOAD_TYPE')
      const created = await documentCreate({
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        purpose: CreateDocumentBodyDtoPurpose.PURCHASE_DOCUMENT
      })
      if (!created.data) throw new Error('UPLOAD_RESPONSE_EMPTY')
      const { upload, document } = created.data
      await uploadToPresignedUrl(upload, file)
      await completeUpload(() => documentComplete(document.id))
      return { id: document.id, name: file.name }
    },
    onError: (error) =>
      toast.error(
        translate(
          error instanceof Error && error.message === 'UPLOAD_TYPE' ? 'errors.uploadType' : 'errors.uploadFailed'
        ),
        {
          id: 'finance-upload'
        }
      )
  })
}
