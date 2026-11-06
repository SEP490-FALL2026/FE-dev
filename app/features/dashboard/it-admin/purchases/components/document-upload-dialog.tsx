import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useDocumentUpload } from '../hooks/use-document-upload'
import { DocumentPurpose } from '../enums/document-purpose'
export function DocumentUploadDialog({
  contractId,
  onClose,
  onUploaded
}: {
  contractId: string
  onClose: () => void
  onUploaded: (id: string) => void
}) {
  const { t: translate } = useTranslation('itPurchases')
  const [file, setFile] = useState<File>()
  const [purpose, setPurpose] = useState<DocumentPurpose>(DocumentPurpose.CONTRACT_ATTACHMENT)
  const operation = useDocumentUpload(contractId)
  const valid = !!file && file.size > 0 && file.size <= 1000000000 && file.name.length <= 400
  return (
    <ItFormDialog
      wide
      title={translate('upload')}
      onClose={onClose}
      pending={operation.upload.isPending}
      submitLabel={translate(operation.stage === 'done' ? 'done' : 'upload')}
      submitDisabled={!valid || operation.uncertain || operation.stage === 'done'}
      onSubmit={(event) => {
        event.preventDefault()
        if (valid && file && !operation.upload.isPending)
          operation.upload.mutate(
            { file, purpose },
            {
              onSuccess: (result) => {
                onUploaded(result.documentId)
                onClose()
              }
            }
          )
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('uploadHint')}</p>
      <ItField
        label={translate('file')}
        hint={translate('fileHint')}
        error={file && !valid ? translate('invalidFile') : undefined}
      >
        <input
          type='file'
          required
          disabled={operation.started || operation.uncertain}
          className={itInputClass}
          onChange={(event) => setFile(event.target.files?.[0])}
        />
      </ItField>
      <ItChoiceSelect
        label={translate('purpose')}
        hint={translate('help.purpose')}
        value={purpose}
        disabled={operation.started || operation.uncertain}
        options={Object.values(DocumentPurpose).map((value) => ({ value, label: translate(`values.${value}`) }))}
        onChange={(value) => {
          const next = Object.values(DocumentPurpose).find((item) => item === value)
          if (next) setPurpose(next)
        }}
      />
      {operation.documentId && (
        <p className='break-all font-mono text-xs tabular-nums'>
          {translate('documentRef', { id: operation.documentId })}
        </p>
      )}
      {operation.upload.isPending && (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate(`stages.${operation.stage}`)}
        </p>
      )}
      {operation.uncertain && !operation.upload.isPending && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
