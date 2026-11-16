import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ItField, itInputClass, itButtonClass } from './it-form'
import { useDocumentUpload } from '../hooks/use-document-upload'

export function ItProofUpload({
  onUploaded,
  onPendingChange,
  label,
  hint,
  required = true
}: {
  onUploaded: (id: string, name: string) => void
  onPendingChange: (pending: boolean) => void
  label?: string
  hint?: string
  required?: boolean
}) {
  const { t: translate } = useTranslation('itInvoices')
  const [file, setFile] = useState<File>()
  const upload = useDocumentUpload(undefined)
  return (
    <div className='space-y-3'>
      <ItField label={label ?? translate('document')} hint={hint ?? translate('hints.document')}>
        <input
          type='file'
          className={itInputClass}
          accept='.pdf,.png,.jpg,.jpeg'
          required={required}
          disabled={upload.upload.isPending || upload.started || upload.uncertain}
          onChange={(event) => setFile(event.target.files?.[0])}
        />
      </ItField>
      <button
        type='button'
        className={itButtonClass}
        disabled={!file || upload.upload.isPending || upload.uncertain}
        aria-busy={upload.upload.isPending}
        onClick={() => {
          if (!file || upload.upload.isPending) return
          onPendingChange(true)
          upload.upload.mutate(
            { file, purpose: 'PURCHASE_DOCUMENT' },
            { onSuccess: (result) => onUploaded(result.documentId, file.name), onSettled: () => onPendingChange(false) }
          )
        }}
      >
        {translate(upload.upload.isPending ? 'pending' : 'upload')}
      </button>
      {upload.uncertain && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('unknownOutcome')}
        </p>
      )}
    </div>
  )
}
