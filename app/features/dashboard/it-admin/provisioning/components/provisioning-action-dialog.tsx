import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { RevocationCompletionBodyDto, TaskResponseDtoDataTask } from '~/shared/api/generated/model'
import * as api from '~/shared/api/generated/operations/provisioning-tasks'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { getAssignmentExpiryQueueListQueryKey } from '~/shared/api/generated/operations/assignment-expiry'
import { getGrantQueueListQueryKey } from '~/shared/api/generated/operations/grant-queue/grant-queue-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import type { TaskAction } from '../task-actions'

export function ProvisioningActionDialog({
  task,
  action,
  onClose
}: {
  task: TaskResponseDtoDataTask
  action: TaskAction
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const [evidence, setEvidence] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [completion, setCompletion] = useState<RevocationCompletionBodyDto['completion']>(
    task.plan?.provisioningType === 'K1'
      ? 'RENEWAL_CANCELLED'
      : task.plan?.provisioningType === 'K5'
        ? 'OFF_SYSTEM_REVOKED'
        : 'ACCOUNT_REMOVED'
  )
  const [accessState, setAccessState] = useState<'CUT' | 'UNTIL_PAID_END'>('UNTIL_PAID_END')
  const [paidThroughOn, setPaidThroughOn] = useState('')
  const [accessCutOn, setAccessCutOn] = useState('')
  const [accessEvidence, setAccessEvidence] = useState('')
  const feedback = useItMutationFeedback(
    [
      ['it-provisioning'],
      ['it-grant-queue'],
      api.getProvisioningTaskListQueryKey(),
      api.getProvisioningTaskGetQueryKey(task.id),
      getSubscriptionListQueryKey(),
      getAssignmentExpiryQueueListQueryKey(),
      getGrantQueueListQueryKey()
    ],
    onClose
  )
  const mutation = useMutation({
    mutationFn: async () => {
      const id = task.id
      switch (action) {
        case 'claim':
          return api.provisioningTaskClaim(id)
        case 'complete':
          return api.provisioningTaskComplete(id, { evidence: evidence.trim() })
        case 'failure':
          return api.provisioningTaskReportFailure(id, { reason: reason.trim() })
        case 'retry':
          return api.provisioningTaskRetry(id)
        case 'handOff':
          return api.provisioningTaskHandOff(id, {})
        case 'closeFailed':
          return api.provisioningTaskCloseFailed(id, { reason: reason.trim() })
        case 'cancel':
          return api.provisioningTaskCancel(id)
        case 'accessCut':
          return api.provisioningTaskRecordAccessCut(id, { accessCutOn, evidence: evidence.trim() })
        case 'revocation':
          return api.provisioningTaskCompleteRevocation(id, {
            completion,
            ...(completion === 'ALREADY_GONE' ? { note: note.trim() } : { evidence: evidence.trim() }),
            ...(completion === 'RENEWAL_CANCELLED'
              ? {
                  paidThroughOn,
                  accessState,
                  ...(accessState === 'CUT' ? { accessCutOn, accessEvidence: accessEvidence.trim() } : {})
                }
              : {})
          })
      }
    },
    ...feedback
  })
  const needsEvidence =
    ['complete', 'accessCut'].includes(action) || (action === 'revocation' && completion !== 'ALREADY_GONE')
  return (
    <ItFormDialog
      wide={action === 'revocation'}
      title={translate(`actions.${action}`)}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (!mutation.isPending) mutation.mutate()
      }}
      pending={mutation.isPending}
      submitLabel={translate('confirm')}
      submitDisabled={
        (needsEvidence && !evidence.trim()) ||
        (['failure', 'closeFailed'].includes(action) && !reason.trim()) ||
        (action === 'revocation' && completion === 'ALREADY_GONE' && !note.trim())
      }
    >
      <p className='text-sm text-muted-foreground'>{translate(action === 'cancel' ? 'cancelHint' : 'confirmHint')}</p>
      {action === 'revocation' && task.plan?.provisioningType === 'K2' && (
        <ItChoiceSelect
          label={translate('completion')}
          value={completion}
          options={(['ACCOUNT_REMOVED', 'ALREADY_GONE'] as const).map((value) => ({
            value,
            label: translate(`values.${value}`)
          }))}
          onChange={(value) => {
            if (value === 'ACCOUNT_REMOVED' || value === 'ALREADY_GONE') setCompletion(value)
          }}
        />
      )}
      {needsEvidence && (
        <ItField label={translate('evidence')}>
          <textarea
            className={itInputClass}
            required
            maxLength={2000}
            placeholder={translate('placeholders.evidence')}
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
          />
        </ItField>
      )}
      {['failure', 'closeFailed'].includes(action) && (
        <ItField label={translate('reason')}>
          <textarea
            className={itInputClass}
            required
            maxLength={1000}
            placeholder={translate('placeholders.reason')}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </ItField>
      )}
      {action === 'revocation' && completion === 'ALREADY_GONE' && (
        <ItField label={translate('note')}>
          <textarea
            required
            className={itInputClass}
            maxLength={1000}
            placeholder={translate('placeholders.note')}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </ItField>
      )}
      {action === 'revocation' && completion === 'RENEWAL_CANCELLED' && (
        <>
          <ItField label={translate('paidThroughOn')}>
            <input
              required
              type='date'
              className={itInputClass}
              value={paidThroughOn}
              onChange={(event) => setPaidThroughOn(event.target.value)}
            />
          </ItField>
          <ItChoiceSelect
            label={translate('accessState')}
            value={accessState}
            options={(['UNTIL_PAID_END', 'CUT'] as const).map((value) => ({
              value,
              label: translate(`values.${value}`)
            }))}
            onChange={(value) => {
              if (value === 'UNTIL_PAID_END' || value === 'CUT') setAccessState(value)
            }}
          />
          {accessState === 'CUT' && (
            <ItField label={translate('accessEvidence')}>
              <textarea
                required
                maxLength={2000}
                className={itInputClass}
                placeholder={translate('placeholders.accessEvidence')}
                value={accessEvidence}
                onChange={(event) => setAccessEvidence(event.target.value)}
              />
            </ItField>
          )}
        </>
      )}
      {(action === 'accessCut' ||
        (action === 'revocation' && completion === 'RENEWAL_CANCELLED' && accessState === 'CUT')) && (
        <ItField label={translate('accessCutOn')}>
          <input
            required
            type='date'
            className={itInputClass}
            value={accessCutOn}
            onChange={(event) => setAccessCutOn(event.target.value)}
          />
        </ItField>
      )}
    </ItFormDialog>
  )
}
