import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { getManagerDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, CheckCircle2, Undo2, XCircle, type LucideIcon } from 'lucide-react'
import type { NeedDecisionBodyDto } from '~/shared/api/generated/model/access-requests/needDecisionBodyDto'
import { accessRequestNeedDecide } from '~/shared/api/generated/operations/access-requests/access-request-need-decide'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { NEED_DECISION } from '../enums/need-decision'
import { POLICY_STEP } from '~/entities/policy/policy-steps'
import { usePolicyChecklist } from '~/entities/policy/hooks/use-policy-checklist'
import { PolicyChecklist, useChecklistNoReason } from '~/entities/policy/components/policy-checklist'
import { isPolicyVersionChanged } from '~/entities/policy/policy-errors'

type NeedDecision = NeedDecisionBodyDto['decision']

const decisionOptions = [
  { value: NEED_DECISION.APPROVE, icon: CheckCircle2, label: 'approve' },
  { value: NEED_DECISION.REJECT, icon: XCircle, label: 'reject' },
  { value: NEED_DECISION.RETURN, icon: Undo2, label: 'requestDetail.returnLabel' }
] as const satisfies readonly { value: NeedDecision; icon: LucideIcon; label: string }[]

const confirmText = {
  APPROVE: 'requestDetail.confirmApproveText',
  REJECT: 'requestDetail.confirmRejectText',
  RETURN: 'requestDetail.confirmReturnText'
} as const satisfies Record<NeedDecision, string>

/** Need review of one request (step 1.2): the policy checklist is answered first; a No locks Approve. */
export function ManagerNeedForm({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const [decision, setDecision] = useState<NeedDecision>(NEED_DECISION.APPROVE)
  const [reason, setReason] = useState('')
  const [confirmation, setConfirmation] = useState<NeedDecisionBodyDto | null>(null)
  const checklist = usePolicyChecklist(POLICY_STEP.NEED_REVIEW)
  const noReason = useChecklistNoReason(checklist)
  const action = useManagerAction({
    mutationFn: (body: NeedDecisionBodyDto) => accessRequestNeedDecide(id, body),
    invalidate: [
      getAccessRequestGetQueryKey(id),
      getAccessRequestTimingsGetQueryKey(id),
      getSpendQueueListQueryKey(),
      getNeedDecisionListQueryKey(),
      getManagerDashboardGetQueryKey()
    ],
    onSuccess: () => setConfirmation(null),
    onError: (error) => {
      if (!isPolicyVersionChanged(error)) return
      setConfirmation(null)
      checklist.reload()
    }
  })
  const effectiveDecision = checklist.hasNo && decision === NEED_DECISION.APPROVE ? NEED_DECISION.REJECT : decision
  const needsReason = effectiveDecision !== NEED_DECISION.APPROVE
  const reasonText = reason.trim() || (needsReason ? noReason : '')
  const ready = !!checklist.body && (!needsReason || !!reasonText)
  return (
    <ManagerFormErrors fields={action.fields}>
      <form
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (action.blocked || !ready || !checklist.body) return
          setConfirmation({
            decision: effectiveDecision,
            checklist: checklist.body,
            ...(needsReason ? { reason: reasonText } : {})
          })
        }}
      >
        <fieldset disabled={action.blocked} className='space-y-4'>
          <PolicyChecklist checklist={checklist} disabled={action.blocked} />
          <div className='grid gap-3 sm:grid-cols-3'>
            {decisionOptions.map((option) => {
              const Icon = option.icon
              const selected = effectiveDecision === option.value
              const locked = option.value === NEED_DECISION.APPROVE && checklist.hasNo
              return (
                <div
                  key={option.value}
                  className={`rounded-md border p-3.5 transition-colors ${
                    selected
                      ? 'border-primary/50 bg-primary-soft/40 ring-1 ring-primary/30'
                      : 'border-border/70 bg-surface hover:bg-surface-subtle/60'
                  } ${locked ? 'opacity-50' : ''}`}
                >
                  <label className='flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-foreground'>
                    <input
                      name='decision'
                      type='radio'
                      checked={selected}
                      disabled={locked}
                      onChange={() => setDecision(option.value)}
                      className='size-4'
                    />
                    <Icon
                      aria-hidden
                      strokeWidth={1.5}
                      className={`size-4 ${selected ? 'text-primary-ink' : 'text-muted-foreground'}`}
                    />
                    {translate(option.label)}
                  </label>
                </div>
              )
            })}
          </div>
          {needsReason && (
            <ManagerField
              label={translate(
                effectiveDecision === NEED_DECISION.RETURN
                  ? 'requestDetail.returnReason'
                  : 'requestForm.rejectionReason'
              )}
            >
              <textarea
                className={managerInputClass}
                name='reason'
                rows={3}
                maxLength={1000}
                required={!noReason}
                value={reason}
                placeholder={
                  noReason ||
                  translate(
                    effectiveDecision === NEED_DECISION.RETURN
                      ? 'requestDetail.reasonPlaceholderReturn'
                      : 'requestDetail.reasonPlaceholderReject'
                  )
                }
                onChange={(event) => setReason(event.target.value)}
              />
            </ManagerField>
          )}
        </fieldset>
        <ManagerActionState action={action} />
        <div className='flex justify-end border-t border-border/50 pt-4'>
          <ManagerButton primary type='submit' busy={action.isPending} disabled={action.blocked || !ready}>
            <Check aria-hidden strokeWidth={1.5} className='size-4' />
            {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
          </ManagerButton>
        </div>
      </form>
      {confirmation && (
        <Dialog
          presentation='sheet'
          title={translate('decision')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirmation(null)
          }}
        >
          <div className='space-y-4'>
            <div className='rounded-lg border border-border/60 bg-surface-subtle/50 p-4'>
              <p className='text-sm text-foreground'>{translate(confirmText[confirmation.decision])}</p>
              {confirmation.reason && (
                <p className='mt-2.5 border-l-2 border-border pl-3 text-xs text-muted-foreground [overflow-wrap:anywhere]'>
                  {confirmation.reason}
                </p>
              )}
            </div>
            <div className='flex justify-end gap-3'>
              <ManagerButton disabled={action.isPending} onClick={() => setConfirmation(null)}>
                {translate('cancel')}
              </ManagerButton>
              <ManagerButton
                primary
                busy={action.isPending}
                disabled={action.blocked || !checklist.matches(confirmation.checklist)}
                onClick={() => {
                  if (!action.blocked && checklist.matches(confirmation.checklist)) action.mutate(confirmation)
                }}
              >
                {translate('confirm')}
              </ManagerButton>
            </div>
          </div>
        </Dialog>
      )}
    </ManagerFormErrors>
  )
}
