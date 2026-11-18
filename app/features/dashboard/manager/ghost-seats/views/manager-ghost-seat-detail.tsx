import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScanLine } from 'lucide-react'
import type { GhostSeatDecisionBodyDto } from '~/shared/api/generated/model'
import { getMeGetQueryKey, useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { getGhostSeatQueueListQueryKey } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-queue-list'
import {
  getGhostSeatRecommendationGetQueryKey,
  useGhostSeatRecommendationGet
} from '~/shared/api/generated/operations/ghost-seats/ghost-seat-recommendation-get'
import { ghostSeatDecisionCreate } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-decision-create'
import { usePolicyChecklist } from '~/entities/policy/hooks/use-policy-checklist'
import { POLICY_STEP } from '~/entities/policy/policy-steps'
import { PolicyChecklist } from '~/entities/policy/components/policy-checklist'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { GHOST_CHOICE } from '../enums/ghost-seat'
import { canDecideGhostSeat, canSubmitGhostDecision } from '../ghost-seat-decision'
import { ManagerGhostEvidence } from '../components/manager-ghost-evidence'

export function ManagerGhostSeatDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t } = useTranslation('manager')
  const me = useMeGet()
  const query = useGhostSeatRecommendationGet(id)
  const item = !query.isError ? query.data?.data?.recommendation : null
  const decidable = !!item && canDecideGhostSeat(item.state)
  const checklist = usePolicyChecklist(POLICY_STEP.GHOST_SEAT_DECISION, decidable)
  const [choice, setChoice] = useState<GhostSeatDecisionBodyDto['choice']>(GHOST_CHOICE.KEEP)
  const [reason, setReason] = useState('')
  const [until, setUntil] = useState('')
  const effectiveChoice = checklist.hasNo ? GHOST_CHOICE.RECLAIM : choice
  const action = useManagerAction({
    mutationFn: async (body: GhostSeatDecisionBodyDto) => {
      if (
        !item ||
        !canDecideGhostSeat(item.state) ||
        !checklist.matches(body.checklist) ||
        !canSubmitGhostDecision(body.choice, checklist.hasNo, checklist.body, body.reason)
      )
        throw new Error('Decision changed')
      return ghostSeatDecisionCreate(body)
    },
    invalidate: [getGhostSeatQueueListQueryKey(), getGhostSeatRecommendationGetQueryKey(id), getMeGetQueryKey()],
    onSuccess: onBack,
    successMessage: (result) => {
      const outcome = result.data?.items[0]?.outcome
      return outcome ? t(`ghost.outcomes.${outcome}`) : t('saved')
    },
    onError: () => checklist.reload()
  })
  const busy = action.blocked || query.isFetching
  return (
    <div className='space-y-5'>
      <ManagerPageHeader
        title={t('ghost.detail')}
        icon={ScanLine}
        actions={<ManagerButton onClick={onBack}>{t('back')}</ManagerButton>}
      />
      <ManagerQueryState query={query} empty={!item} />
      {item && (
        <>
          <ManagerSection title={`${item.application.applicationName} · ${item.plan.planName}`}>
            <p className='font-mono text-sm'>{item.holder?.employeeCode ?? t('empty')}</p>
            {item.holder?.employeeId === me.data?.data?.employee.id && (
              <p className='text-sm text-warning-ink'>{t('ghost.selfHint')}</p>
            )}
            <ManagerGhostEvidence item={item} />
          </ManagerSection>
          {decidable ? (
            <ManagerSection title={t('ghost.decision')}>
              <ManagerFormErrors fields={action.fields}>
                <form
                  className='space-y-5'
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (
                      busy ||
                      !canSubmitGhostDecision(effectiveChoice, checklist.hasNo, checklist.body, reason) ||
                      !checklist.body
                    )
                      return
                    action.mutate({
                      items: [{ recommendationId: id }],
                      choice: effectiveChoice,
                      reason: reason.trim(),
                      checklist: checklist.body,
                      ...(effectiveChoice === GHOST_CHOICE.EXEMPT ? { exemptUntil: until } : {})
                    })
                  }}
                >
                  <PolicyChecklist checklist={checklist} disabled={busy} noMessage={t('ghost.onlyReclaim')} />
                  <fieldset disabled={busy} className='space-y-4'>
                    <legend className='sr-only'>{t('ghost.decision')}</legend>
                    <div className='flex flex-wrap gap-2'>
                      {Object.values(GHOST_CHOICE).map((value) => (
                        <label
                          key={value}
                          className='flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm has-disabled:opacity-50'
                        >
                          <input
                            type='radio'
                            name='choice'
                            value={value}
                            checked={effectiveChoice === value}
                            disabled={checklist.hasNo && value !== GHOST_CHOICE.RECLAIM}
                            onChange={() => setChoice(value)}
                          />
                          {t(`ghost.choices.${value}`)}
                        </label>
                      ))}
                    </div>
                    {effectiveChoice === GHOST_CHOICE.EXEMPT && (
                      <ManagerField label={t('ghost.exemptUntil')}>
                        <input
                          type='date'
                          name='exemptUntil'
                          placeholder={t('ui.placeholders.date')}
                          required
                          className={managerInputClass}
                          value={until}
                          onChange={(event) => setUntil(event.target.value)}
                        />
                      </ManagerField>
                    )}
                    <ManagerField label={t('ghost.reason')}>
                      <textarea
                        name='reason'
                        placeholder={t('ui.placeholders.ghostReason')}
                        required
                        minLength={3}
                        maxLength={1000}
                        rows={3}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        className={managerInputClass}
                      />
                    </ManagerField>
                  </fieldset>
                  {effectiveChoice === GHOST_CHOICE.EXEMPT && (
                    <p className='text-sm text-muted-foreground'>{t('ghost.exemptionHint')}</p>
                  )}
                  {effectiveChoice === GHOST_CHOICE.RECLAIM && (
                    <p className='text-sm text-muted-foreground'>{t('ghost.reclaimHint')}</p>
                  )}
                  <ManagerButton
                    type='submit'
                    primary
                    busy={action.isPending}
                    disabled={
                      busy ||
                      !canSubmitGhostDecision(effectiveChoice, checklist.hasNo, checklist.body, reason) ||
                      (effectiveChoice === GHOST_CHOICE.EXEMPT && !until)
                    }
                  >
                    {action.retrySeconds ? t('retryAfter', { seconds: action.retrySeconds }) : t('ghost.submit')}
                  </ManagerButton>
                  <ManagerActionState action={action} />
                </form>
              </ManagerFormErrors>
            </ManagerSection>
          ) : (
            <p role='status' className='text-sm text-muted-foreground'>
              {t('ghost.notDecidable')}
            </p>
          )}
        </>
      )}
    </div>
  )
}
