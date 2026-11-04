import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getItError } from '../../shared/hooks/it-errors'
import { recordAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { useOffboardingCaseRecordAccountLock } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-record-account-lock'
import { useOffboardingCaseOpenRevocations } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-open-revocations'
import { useOffboardingCaseClose } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-close'
import { useAccessRequestCancelForDeparture } from '~/shared/api/generated/operations/access-requests/access-request-cancel-for-departure'
import { useAccessRequestLineCloseForDeparture } from '~/shared/api/generated/operations/group-requests/access-request-line-close-for-departure'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'

export type OffboardingAction = {
  caseId: string
  assignmentIds?: string[]
} & ({ kind: 'lock' | 'revoke' | 'close' } | { kind: 'cancel'; requestId: string; employeeId: string; group: boolean })
export function OffboardingActionDialog({ action, onClose }: { action: OffboardingAction; onClose: () => void }) {
  const { t: translate } = useTranslation('itOffboarding')
  const { t: translateError } = useTranslation('itAdmin')
  const [note, setNote] = useState('')
  const [evidence, setEvidence] = useState('')
  const sending = useRef(false)
  const client = useQueryClient()
  const lock = useOffboardingCaseRecordAccountLock()
  const revoke = useOffboardingCaseOpenRevocations()
  const close = useOffboardingCaseClose()
  const cancel = useAccessRequestCancelForDeparture()
  const closeLine = useAccessRequestLineCloseForDeparture()
  const pending = lock.isPending || revoke.isPending || close.isPending || cancel.isPending || closeLine.isPending
  async function submit() {
    if (sending.current || pending || (action.kind !== 'close' && !note.trim())) return
    sending.current = true
    try {
      if (action.kind === 'lock') await lock.mutateAsync({ id: action.caseId, data: { note: note.trim() } })
      if (action.kind === 'revoke')
        await revoke.mutateAsync({
          id: action.caseId,
          data: { assignmentIds: action.assignmentIds, count: action.assignmentIds?.length ?? 0, reason: note.trim() }
        })
      if (action.kind === 'close') await close.mutateAsync({ id: action.caseId })
      if (action.kind === 'cancel') {
        const data = {
          cause: 'BENEFICIARY_LEFT' as const,
          note: note.trim(),
          ...(evidence.trim() ? { evidence: evidence.trim() } : {})
        }
        if (action.group) await closeLine.mutateAsync({ id: action.requestId, employeeId: action.employeeId, data })
        else await cancel.mutateAsync({ id: action.requestId, data })
      }
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) =>
              typeof key === 'string' &&
              /offboarding-cases|provisioning-tasks|access-requests|dashboards\/it-admin|subscription-renewals/.test(
                key
              )
          )
      })
      toast.success(translate('saved'), { id: 'it-offboarding-action' })
      onClose()
    } catch (error) {
      recordAdminRetryDelay(client, error)
      if (getItError(error).key === 'forbidden')
        await client.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
      toast.error(translateError(`errors.${getItError(error).key}`), { id: 'it-offboarding-action' })
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && /offboarding-cases|dashboards\/it-admin|\/me$/.test(key)
          )
      })
    } finally {
      sending.current = false
    }
  }
  return (
    <ItFormDialog
      title={translate(action.kind === 'cancel' && action.group ? 'actions.closeLine' : `actions.${action.kind}`)}
      pending={pending}
      onClose={onClose}
      submitLabel={translate('confirm')}
      submitDisabled={action.kind !== 'close' && !note.trim()}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate(`hints.${action.kind}`)}</p>
      {action.kind === 'cancel' && action.group && <p className='text-sm'>{translate('hints.closeLine')}</p>}
      {action.kind !== 'close' && (
        <ItField label={translate(action.kind === 'cancel' ? 'cancellationReason' : 'note')}>
          <textarea
            required
            maxLength={1000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={itInputClass}
          />
        </ItField>
      )}
      {action.kind === 'cancel' && (
        <ItField label={translate('cancellationEvidence')} hint={translate('hints.cancellationEvidence')}>
          <textarea
            maxLength={1000}
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
            className={itInputClass}
          />
        </ItField>
      )}
    </ItFormDialog>
  )
}
