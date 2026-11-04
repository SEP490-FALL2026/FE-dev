import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { documentCreate } from '~/shared/api/generated/operations/documents/document-create'
import { documentComplete } from '~/shared/api/generated/operations/documents/document-complete'
import { documentAttach } from '~/shared/api/generated/operations/documents/document-attach'
import { documentGet, getDocumentGetQueryKey } from '~/shared/api/generated/operations/documents/document-get'
import type { CreateDocumentResponseDtoDataUpload } from '~/shared/api/generated/model/documents'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { DocumentStatus } from '../enums/document-status'
import type { DocumentPurpose } from '../enums/document-purpose'

export function useDocumentUpload(contractId: string, onComplete?: () => void) {
  const [documentId, setDocumentId] = useState('')
  const [stage, setStage] = useState<'idle' | 'declaring' | 'uploading' | 'completing' | 'attaching' | 'done'>('idle')
  const [uncertain, setUncertain] = useState(false)
  // Signed URLs stay out of the mutation cache and are never persisted.
  const attempt = useRef<
    | {
        id: string
        file: File
        purpose: DocumentPurpose
        target: CreateDocumentResponseDtoDataUpload
        uploaded: boolean
      }
    | undefined
  >(undefined)
  const feedback = useItMutationFeedback(documentId ? [getDocumentGetQueryKey(documentId)] : [], onComplete)
  const lock = useRef(false)
  const upload = useMutation({
    retry: false,
    mutationFn: async ({ file, purpose }: { file: File; purpose: DocumentPurpose }) => {
      if (lock.current || uncertain) throw new Error('UPLOAD_BLOCKED')
      lock.current = true
      try {
        if (!attempt.current) {
          setStage('declaring')
          setUncertain(true)
          const result = await documentCreate({
            fileName: file.name,
            contentType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
            purpose
          })
          if (!result.data) throw new Error('UPLOAD_RESPONSE_EMPTY')
          attempt.current = { id: result.data.document.id, file, purpose, target: result.data.upload, uploaded: false }
          setDocumentId(result.data.document.id)
          setUncertain(false)
        }
        const current = attempt.current
        if (current.file !== file || current.purpose !== purpose) throw new Error('UPLOAD_FILE_CHANGED')
        if (!current.uploaded) {
          if (new Date(current.target.expiresAt).getTime() <= Date.now()) throw new Error('UPLOAD_LINK_EXPIRED')
          setStage('uploading')
          const target = new URL(current.target.url)
          if (!['https:', 'http:'].includes(target.protocol)) throw new Error('UPLOAD_URL_INVALID')
          const response = await fetch(target.href, {
            method: current.target.method,
            headers: current.target.headers,
            body: file,
            credentials: 'omit',
            referrerPolicy: 'no-referrer'
          })
          if (!response.ok) throw new Error('UPLOAD_STORAGE_FAILED')
          current.uploaded = true
          setStage('completing')
          await documentComplete(current.id)
        }
        const latest = await documentGet(current.id)
        const document = latest.data?.document
        if (document?.status === DocumentStatus.AWAITING_UPLOAD) {
          setStage('completing')
          await documentComplete(current.id)
        } else if (document?.status === DocumentStatus.READY) {
          if (document.contractId !== contractId) throw new Error('UPLOAD_ATTACHED_ELSEWHERE')
          setStage('done')
          return { documentId: current.id }
        } else if (document?.status !== DocumentStatus.PENDING_ATTACH) throw new Error('UPLOAD_DOCUMENT_UNAVAILABLE')
        setStage('attaching')
        const attached = await documentAttach(current.id, { contractId })
        if (attached.data?.document.status !== DocumentStatus.READY) throw new Error('UPLOAD_NOT_READY')
        setStage('done')
        return { documentId: current.id }
      } catch (error) {
        if (
          !attempt.current &&
          getItError(error).key !== 'unknownOutcome' &&
          !(error instanceof Error && error.message === 'UPLOAD_RESPONSE_EMPTY')
        )
          setUncertain(false)
        throw error
      } finally {
        lock.current = false
      }
    },
    onSuccess: feedback.onSuccess,
    onError: feedback.onError
  })
  return { upload, documentId, stage, uncertain, started: !!documentId }
}
