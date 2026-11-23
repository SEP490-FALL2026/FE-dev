import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAccessRequestAssessmentSave } from '~/shared/api/generated/operations/access-requests/access-request-assessment-save'
import { useAccessRequestAssessmentComplete } from '~/shared/api/generated/operations/access-requests/access-request-assessment-complete'
import { useAccessRequestAssessmentReject } from '~/shared/api/generated/operations/access-requests/access-request-assessment-reject'
import { usePolicyStepGet } from '~/shared/api/generated/operations/policies/policy-step-get'
import type { AssessmentPatchDto } from '~/shared/api/generated/model/access-requests/assessmentPatchDto'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { ItFormDialog, ItField, itInputClass } from '../../shared/components/it-form'
import { getItError } from '../../shared/hooks/it-errors'
import { recordAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { AssessmentFields } from './assessment-fields'
import { ItQueryState } from '../../shared/components/it-query-state'
import { canSubmitAssessmentDecision } from '../hooks/assessment-decision'
import { CatalogLinkPlanPicker } from './catalog-link-plan-picker'

export function AssessmentDialog({
  item,
  mode,
  onClose
}: {
  item: AssessmentResponseDtoDataAssessment
  mode: 'save' | 'complete' | 'reject' | 'return'
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  const { t: translateError } = useTranslation('itAdmin')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const [draft, setDraft] = useState<AssessmentPatchDto>({})
  const [reason, setReason] = useState('')
  const [alternative, setAlternative] = useState('')
  const [alternativeApplication, setAlternativeApplication] = useState('')
  const [alternativePlan, setAlternativePlan] = useState('')
  const [kind, setKind] = useState<'UNCONTROLLABLE' | 'NOT_ELIGIBLE'>('NOT_ELIGIBLE')
  const [answers, setAnswers] = useState<{ version: string; values: Record<string, 'YES' | 'NO'> }>({
    version: '',
    values: {}
  })
  const lock = useRef(false)
  const client = useQueryClient()
  const save = useAccessRequestAssessmentSave()
  const complete = useAccessRequestAssessmentComplete()
  const reject = useAccessRequestAssessmentReject()
  const policy = usePolicyStepGet('POL-SAAS', '1.3', { query: { enabled: mode !== 'save' } })
  const policyData = policy.data?.data
  const questions = policyData?.step.checklist.filter((entry) => entry.check === 'PERSON') ?? []
  const checklistReady =
    !!policyData &&
    (questions.length === 0 ||
      (answers.version === policyData.policyVersionId && questions.every((entry) => answers.values[entry.code])))
  const checklist = policyData
    ? {
        policyVersionId: policyData.policyVersionId,
        answers: questions.map((entry) => ({ itemCode: entry.code, answer: answers.values[entry.code] }))
      }
    : null
  const decisionReady =
    mode === 'save' ||
    (checklistReady &&
      canSubmitAssessmentDecision(
        mode,
        reason,
        questions.map((entry) => answers.values[entry.code])
      ) &&
      (mode !== 'reject' || kind !== 'UNCONTROLLABLE' || !!alternative.trim() || !!alternativePlan))
  const pending = save.isPending || complete.isPending || reject.isPending
  async function submit() {
    if (lock.current || pending || (mode !== 'save' && (!decisionReady || !checklist))) return
    lock.current = true
    try {
      if (mode === 'save') await save.mutateAsync({ id: item.requestId, data: draft })
      if (mode === 'complete' && checklist) await complete.mutateAsync({ id: item.requestId, data: { checklist } })
      if (mode === 'reject' && checklist)
        await reject.mutateAsync({
          id: item.requestId,
          data: {
            decision: 'REJECT',
            kind,
            ...(reason.trim() ? { reason: reason.trim() } : {}),
            ...(alternative.trim() ? { alternativeNote: alternative.trim() } : {}),
            ...(alternativePlan ? { alternativePlanId: alternativePlan } : {}),
            checklist
          }
        })
      if (mode === 'return' && checklist)
        await reject.mutateAsync({
          id: item.requestId,
          data: { decision: 'RETURN', ...(reason.trim() ? { reason: reason.trim() } : {}), checklist }
        })
      await client.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) =>
              typeof key === 'string' &&
              /access-requests|assessment-queue|assessment-decisions|dashboards\/it-admin/.test(key)
          )
      })
      toast.success(translate('saved'), { id: 'it-assessment' })
      onClose()
    } catch (error) {
      recordAdminRetryDelay(client, error)
      if (mode !== 'save') {
        await policy.refetch()
      }
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
      submitDisabled={mode === 'save' ? Object.keys(draft).length === 0 : !decisionReady}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      {mode === 'complete' && <p className='text-sm'>{translate('completeHint')}</p>}
      {mode === 'save' && <AssessmentFields item={item} draft={draft} onChange={setDraft} />}
      {mode !== 'save' && (
        <ItQueryState query={policy}>
          {policyData && (
            <fieldset className='space-y-4'>
              <legend className='font-semibold'>{translate('checklistTitle')}</legend>
              <p className='text-sm text-muted-foreground'>{translate('checklistHint')}</p>
              {questions.map((question) => (
                <fieldset key={question.code} className='space-y-2 rounded-md border border-border p-3'>
                  <legend className='px-1 text-sm'>
                    {question.text}{' '}
                    <span className='text-danger' aria-hidden='true'>
                      *
                    </span>
                  </legend>
                  <div className='flex gap-4'>
                    {(['YES', 'NO'] as const).map((value) => (
                      <label key={value} className='flex min-h-11 items-center gap-2'>
                        <input
                          type='radio'
                          name={question.code}
                          checked={
                            answers.version === policyData.policyVersionId && answers.values[question.code] === value
                          }
                          onChange={() =>
                            setAnswers((previous) => ({
                              version: policyData.policyVersionId,
                              values: {
                                ...(previous.version === policyData.policyVersionId ? previous.values : {}),
                                [question.code]: value
                              }
                            }))
                          }
                        />
                        {translate(value === 'YES' ? 'yes' : 'no')}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </fieldset>
          )}
        </ItQueryState>
      )}
      {(mode === 'reject' || mode === 'return') && (
        <>
          {mode === 'reject' && (
            <fieldset className='space-y-2'>
              <legend>{translate('rejectionKind')}</legend>
              {(['NOT_ELIGIBLE', 'UNCONTROLLABLE'] as const).map((value) => (
                <label key={value} className='flex min-h-11 items-center gap-2'>
                  <input type='radio' name='kind' checked={kind === value} onChange={() => setKind(value)} />
                  {translate(`values.${value}`)}
                </label>
              ))}
            </fieldset>
          )}
          <ItField label={translate('reason')} hint={translate('reasonHint')}>
            <textarea
              placeholder={translatePlaceholder('reason')}
              className={itInputClass}
              maxLength={1000}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </ItField>
          {mode === 'reject' && (
            <ItField label={translate('alternative')} hint={translate('alternativeHint')}>
              <textarea
                placeholder={translatePlaceholder('alternative')}
                className={itInputClass}
                maxLength={1000}
                value={alternative}
                onChange={(event) => setAlternative(event.target.value)}
              />
            </ItField>
          )}
          {mode === 'reject' && (
            <fieldset className='space-y-2'>
              <legend className='font-medium'>{translate('fields.equivalentPlanId')}</legend>
              <CatalogLinkPlanPicker
                optional
                disabled={pending}
                applicationId={alternativeApplication}
                planId={alternativePlan}
                onApplicationChange={(id) => {
                  setAlternativeApplication(id)
                  setAlternativePlan('')
                }}
                onPlanChange={setAlternativePlan}
              />
            </fieldset>
          )}
        </>
      )}
    </ItFormDialog>
  )
}
