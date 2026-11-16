import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { documentLink } from '~/shared/api/generated/operations/documents/document-link'

/** Opens a stored file through a short-lived link; the link is never kept or logged. */
export function useDocumentLink() {
  const { t: translate } = useTranslation('financePurchases')
  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await documentLink(documentId)
      const url = response.data?.url
      if (!url) throw new Error('DOCUMENT_LINK_EMPTY')
      const target = new URL(url)
      if (!['https:', 'http:'].includes(target.protocol)) throw new Error('DOCUMENT_LINK_INVALID')
      window.open(target.href, '_blank', 'noopener,noreferrer')
    },
    onError: () => toast.error(translate('fileOpenFailed'), { id: 'finance-document-link' })
  })
}
