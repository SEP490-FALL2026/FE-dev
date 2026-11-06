import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { documentCreate } from '~/shared/api/generated/operations/documents/document-create'
import { documentComplete } from '~/shared/api/generated/operations/documents/document-complete'
import { documentGet } from '~/shared/api/generated/operations/documents/document-get'
import { deviceSignatureRecordCreate } from '~/shared/api/generated/operations/devices/device-signature-record-create'
import { useMonitoringNoticeCurrentGet } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import type { CreateDocumentResponseDtoDataUpload } from '~/shared/api/generated/model/documents'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItQueryState } from '../../shared/components/it-query-state'
import { getItError } from '../../shared/hooks/it-errors'
import { useDeviceFeedback } from '../hooks/use-device-feedback'

export function SignatureDialog({
  deviceId,
  registrationId,
  onClose
}: {
  deviceId: string
  registrationId: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const notice = useMonitoringNoticeCurrentGet()
  const [version, setVersion] = useState<string>()
  const noticeVersionId = version ?? notice.data?.data?.id ?? ''
  const [documentId, setDocumentId] = useState('')
  const [file, setFile] = useState<File>()
  const [uncertain, setUncertain] = useState(false)
  const lock = useRef(false)
  const attempt = useRef<{ id: string; target: CreateDocumentResponseDtoDataUpload; uploaded: boolean } | null>(null)
  const feedback = useDeviceFeedback(deviceId, registrationId, onClose)
  const mutation = useMutation({
    retry: false,
    mutationFn: async () => {
      if (lock.current || uncertain) throw new Error('UPLOAD_BLOCKED')
      lock.current = true
      try {
        let id = documentId
        if (file) {
          if (!attempt.current) {
            setUncertain(true)
            try {
              const declared = await documentCreate({
                fileName: file.name,
                contentType: file.type || 'application/octet-stream',
                sizeBytes: file.size,
                purpose: 'SIGNATURE_RECORD'
              })
              if (!declared.data) throw new Error('UPLOAD_RESPONSE_EMPTY')
              attempt.current = { id: declared.data.document.id, target: declared.data.upload, uploaded: false }
              setDocumentId(declared.data.document.id)
              setUncertain(false)
            } catch (error) {
              if (
                getItError(error).key !== 'unknownOutcome' &&
                !(error instanceof Error && error.message === 'UPLOAD_RESPONSE_EMPTY')
              )
                setUncertain(false)
              throw error
            }
          }
          const current = attempt.current
          id = current.id
          if (!current.uploaded) {
            const target = new URL(current.target.url)
            if (
              !['https:', 'http:'].includes(target.protocol) ||
              new Date(current.target.expiresAt).getTime() <= Date.now()
            )
              throw new Error('UPLOAD_LINK_INVALID')
            const result = await fetch(target.href, {
              method: current.target.method,
              headers: current.target.headers,
              body: file,
              credentials: 'omit',
              referrerPolicy: 'no-referrer'
            })
            if (!result.ok) throw new Error('UPLOAD_STORAGE_FAILED')
            current.uploaded = true
          }
          const existing = await documentGet(id)
          if (existing.data?.document.status === 'AWAITING_UPLOAD') await documentComplete(id)
          else if (existing.data?.document.status !== 'PENDING_ATTACH') throw new Error('UPLOAD_DOCUMENT_UNAVAILABLE')
        }
        return await deviceSignatureRecordCreate(registrationId, { documentId: id, noticeVersionId })
      } finally {
        lock.current = false
      }
    },
    ...feedback
  })
  const valid =
    !!noticeVersionId &&
    (!!documentId || !!file) &&
    (!file || (file.size > 0 && file.size <= 1000000000 && file.name.length <= 400))
  return (
    <ItFormDialog
      wide
      title={translate('signature')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!valid || uncertain}
      submitLabel={translate(file ? 'upload' : 'signature')}
      onSubmit={(event) => {
        event.preventDefault()
        if (valid) mutation.mutate()
      }}
    >
      <ItQueryState query={notice}>
        {notice.data?.data && (
          <p className='break-all text-sm text-muted-foreground'>
            {translate('notice')}: {notice.data.data.id}
          </p>
        )}
      </ItQueryState>
      <ItField label={translate('noticeVersionId')} hint={translate('hints.noticeVersionId')}>
        <input
          className={itInputClass}
          required
          pattern='[0-9a-fA-F-]{36}'
          value={noticeVersionId}
          onChange={(event) => setVersion(event.target.value)}
        />
      </ItField>
      <ItField label={translate('documentId')} hint={translate('hints.documentId')}>
        <input
          className={itInputClass}
          disabled={!!file}
          pattern='[0-9a-fA-F-]{36}'
          value={documentId}
          onChange={(event) => setDocumentId(event.target.value)}
        />
      </ItField>
      <ItField label={translate('file')} hint={translate('hints.file')}>
        <input
          className={itInputClass}
          type='file'
          disabled={uncertain || !!documentId}
          onChange={(event) => setFile(event.target.files?.[0])}
        />
      </ItField>
      {file && documentId && <p className='text-sm text-muted-foreground'>{translate('recovery')}</p>}
      {uncertain && (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate('uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
