import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAccessRequestAssessmentSave } from '~/shared/api/generated/operations/access-requests/access-request-assessment-save'
import { useAccessRequestAssessmentComplete } from '~/shared/api/generated/operations/access-requests/access-request-assessment-complete'
import { useAccessRequestAssessmentReject } from '~/shared/api/generated/operations/access-requests/access-request-assessment-reject'
import type { AssessmentPatchDto } from '~/shared/api/generated/model/access-requests/assessmentPatchDto'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { ItFormDialog, ItField, itInputClass } from '../../shared/components/it-form'
import { getItError } from '../../shared/hooks/it-errors'
import { recordAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { AssessmentFields } from './assessment-fields'

export function AssessmentDialog({
  item,
  mode,
  onClose
}: {
  item: AssessmentResponseDtoDataAssessment
  mode: 'save' | 'complete' | 'reject'
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const { t: translateError } = useTranslation('itAdmin')
  const [draft, setDraft] = useState<AssessmentPatchDto>({})
  const [reason, setReason] = useState('')
  const [alternative, setAlternative] = useState('')
  const [kind, setKind] = useState<'UNCONTROLLABLE' | 'NOT_ELIGIBLE'>('NOT_ELIGIBLE')
  const lock = useRef(false)
  const client = useQueryClient()
  const save = useAccessRequestAssessmentSave()
  const complete = useAccessRequestAssessmentComplete()
  const reject = useAccessRequestAssessmentReject()
  const pending = save.isPending || complete.isPending || reject.isPending
  async function submit() {
    if (lock.current || pending || (mode === 'reject' && (!reason.trim() || !alternative.trim()))) return
    lock.current = true
    try {
      if (mode === 'save') await save.mutateAsync({ id: item.requestId, data: draft })
      if (mode === 'complete') await complete.mutateAsync({ id: item.requestId })
      if (mode === 'reject')
        await reject.mutateAsync({
          id: item.requestId,
          data: { kind, reason: reason.trim(), alternativeNote: alternative.trim() }
        })
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && /access-requests|assessment-queue|dashboards\/it-admin/.test(key)
          )
      })
      toast.success(translate('saved'), { id: 'it-assessment' })
      onClose()
    } catch (error) {
      recordAdminRetryDelay(client, error)
      if (getItError(error).key === 'forbidden')
        await client.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && /access-requests|assessment-queue|dashboards\/it-admin/.test(key)
          )
      })
      toast.error(translateError(`errors.${getItError(error).key}`), { id: 'it-assessment' })
    } finally {
      lock.current = false
    }
  }
  return (
    <ItFormDialog
      title={translate(mode)}
      page={mode === 'save'}
      pending={pending}
      onClose={onClose}
      submitLabel={translate('confirm')}
      submitDisabled={
        mode === 'save' ? Object.keys(draft).length === 0 : mode === 'reject' && (!reason.trim() || !alternative.trim())
      }
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      {mode === 'complete' && <p className='text-sm'>{translate('completeHint')}</p>}
      {mode === 'save' && <AssessmentFields item={item} draft={draft} onChange={setDraft} />}
      {mode === 'reject' && (
        <>
          <fieldset className='space-y-2'>
            <legend>{translate('rejectionKind')}</legend>
            {(['NOT_ELIGIBLE', 'UNCONTROLLABLE'] as const).map((value) => (
              <label key={value} className='flex min-h-11 items-center gap-2'>
                <input type='radio' name='kind' checked={kind === value} onChange={() => setKind(value)} />
                {translate(`values.${value}`)}
              </label>
            ))}
          </fieldset>
          <ItField label={translate('reason')}>
            <textarea
              className={itInputClass}
              required
              maxLength={1000}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </ItField>
          <ItField label={translate('alternative')}>
            <textarea
              className={itInputClass}
              required
              maxLength={1000}
              value={alternative}
              onChange={(event) => setAlternative(event.target.value)}
            />
          </ItField>
        </>
      )}
    </ItFormDialog>
  )
}
