import { Check, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import type { LinesResponseDtoDataItemsItem } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItem'
import { useAccessRequestLineNeedDecide } from '~/shared/api/generated/operations/group-requests/access-request-line-need-decide'
import { getAccessRequestLineListQueryKey } from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useAccessRequestNeedDecide } from '~/shared/api/generated/operations/access-requests/access-request-need-decide'
import { getNotificationListQueryKey } from '~/shared/api/generated/operations/notifications/notification-list'
import { getSpendApprovalListQueryKey } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import { ApprovalsButton, ApprovalsField, approvalsInputClass } from '../../shared/components/approvals-ui'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { NEED_DECISION } from '../enums/need-decision'
import { REQUEST_BRANCH } from '../enums/request-branch'
import { rejectPressedClass, segmentClass } from './segment-classes'
import { NeedMemberDecisions, type MemberDecision } from './need-member-decisions'

export function NeedDecisionForm({
  request,
  lines,
  canSetSpend,
  disabled = false
}: {
  request: AccessRequestResponseDtoDataRequest
  lines?: LinesResponseDtoDataItemsItem[]
  canSetSpend: boolean
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('approvalsNeed')
  const submissionLocked = useRef(false)
  const [decision, setDecision] = useState<(typeof NEED_DECISION)[keyof typeof NEED_DECISION]>(NEED_DECISION.APPROVE)
  const [reason, setReason] = useState('')
  const [termReason, setTermReason] = useState('')
  const [offPlan, setOffPlan] = useState(false)
  const [position, setPosition] = useState('')
  const [stillNeeded, setStillNeeded] = useState(false)
  const [expectedSpendOn, setExpectedSpendOn] = useState(request.expectedSpendOn ?? '')
  const [memberDecisions, setMemberDecisions] = useState<Record<string, MemberDecision>>({})
  const groupDecisions = (lines ?? []).flatMap((line) => {
    const selection = memberDecisions[line.employee.employeeId]
    return selection
      ? [
          {
            employeeId: line.employee.employeeId,
            decision: selection.decision,
            ...(selection.decision === NEED_DECISION.REJECT ? { reason: selection.reason.trim() } : {})
          }
        ]
      : []
  })
  const approving = lines
    ? groupDecisions.some((selection) => selection.decision === NEED_DECISION.APPROVE)
    : decision === NEED_DECISION.APPROVE
  const paid = canSetSpend && request.branch === REQUEST_BRANCH.PAID_IN_CATALOG
  const longTerm = Math.max(request.termMonths, request.renewal?.consecutiveMonths ?? 0) > 12
  const planPosition = Number(position)
  const validPosition = /^\d+$/.test(position) && Number.isSafeInteger(planPosition) && planPosition > 0
  const validDecision = lines
    ? groupDecisions.length === lines.length &&
      lines.length > 0 &&
      groupDecisions.every((selection) => selection.decision !== NEED_DECISION.REJECT || Boolean(selection.reason))
    : approving || Boolean(reason.trim())
  const valid =
    !disabled &&
    validDecision &&
    (!approving || ((!longTerm || Boolean(termReason.trim())) && (!paid || offPlan || validPosition)))
  const feedback = useApprovalsFeedback([
    getAccessRequestGetQueryKey(request.id),
    getAccessRequestLineListQueryKey(request.id),
    getNotificationListQueryKey(),
    getSpendApprovalListQueryKey()
  ])
  const mutationOptions = {
    ...feedback,
    onSettled: () => {
      submissionLocked.current = false
    }
  }
  const mutation = useAccessRequestNeedDecide({ mutation: mutationOptions })
  const groupMutation = useAccessRequestLineNeedDecide({ mutation: mutationOptions })
  const pending = mutation.isPending || groupMutation.isPending
  return (
    <form
      className='space-y-5 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
      onSubmit={(event) => {
        event.preventDefault()
        if (!valid || pending || submissionLocked.current) return
        submissionLocked.current = true
        const confirmation = {
          ...(approving && longTerm ? { termConfirmation: { reason: termReason.trim() } } : {}),
          ...(approving && paid
            ? {
                spend: {
                  ...(offPlan
                    ? { offPlan: true as const }
                    : { planLine: { position: planPosition, ...(stillNeeded ? { stillNeeded: true } : {}) } }),
                  ...(expectedSpendOn ? { expectedSpendOn } : {})
                }
              }
            : {})
        }
        if (lines) groupMutation.mutate({ id: request.id, data: { lines: groupDecisions, ...confirmation } })
        else
          mutation.mutate({
            id: request.id,
            data: { decision, ...(!approving ? { reason: reason.trim() } : {}), ...confirmation }
          })
      }}
    >
      <fieldset disabled={pending || disabled} className='space-y-5'>
        <legend className='sr-only'>{translate('decision')}</legend>
        {lines ? (
          <NeedMemberDecisions
            lines={lines}
            decisions={memberDecisions}
            onChange={(employeeId, selection) =>
              setMemberDecisions((previous) => ({ ...previous, [employeeId]: selection }))
            }
          />
        ) : (
          <div role='group' aria-label={translate('decision')} className={segmentClass}>
            <ApprovalsButton
              variant='ghost'
              aria-label={translate('approve')}
              aria-pressed={approving}
              onClick={() => setDecision(NEED_DECISION.APPROVE)}
            >
              <Check aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('approve')}
            </ApprovalsButton>
            <ApprovalsButton
              variant='ghost'
              aria-label={translate('reject')}
              aria-pressed={!approving}
              className={rejectPressedClass}
              onClick={() => setDecision(NEED_DECISION.REJECT)}
            >
              <X aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('reject')}
            </ApprovalsButton>
          </div>
        )}
        {!lines && !approving && (
          <ApprovalsField label={translate('reason')} required>
            <textarea
              aria-label={translate('reason')}
              className={approvalsInputClass}
              rows={3}
              required
              maxLength={1000}
              placeholder={translate('reasonPlaceholder')}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </ApprovalsField>
        )}
        {approving && longTerm && (
          <ApprovalsField label={translate('termReason')} required>
            <textarea
              aria-label={translate('termReason')}
              className={approvalsInputClass}
              rows={3}
              required
              maxLength={1000}
              placeholder={translate('termReasonPlaceholder')}
              value={termReason}
              onChange={(event) => setTermReason(event.target.value)}
            />
          </ApprovalsField>
        )}
        {approving && paid && (
          <fieldset className='space-y-4'>
            <legend className='mb-2 text-sm font-medium'>{translate('spendRoute')}</legend>
            <div role='group' aria-label={translate('spendRoute')} className={segmentClass}>
              <ApprovalsButton
                variant='ghost'
                aria-label={translate('planned')}
                aria-pressed={!offPlan}
                onClick={() => setOffPlan(false)}
              >
                {translate('planned')}
              </ApprovalsButton>
              <ApprovalsButton
                variant='ghost'
                aria-label={translate('offPlan')}
                aria-pressed={offPlan}
                onClick={() => setOffPlan(true)}
              >
                {translate('offPlan')}
              </ApprovalsButton>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              {!offPlan && (
                <ApprovalsField label={translate('planPosition')} hint={translate('planPositionHint')} required>
                  <input
                    type='number'
                    aria-label={translate('planPosition')}
                    min={1}
                    step={1}
                    className={`${approvalsInputClass} text-right font-mono tabular-nums sm:max-w-40`}
                    placeholder={translate('planPositionPlaceholder')}
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                    required
                  />
                </ApprovalsField>
              )}
              <ApprovalsField label={translate('expectedSpendOn')}>
                <input
                  type='date'
                  className={approvalsInputClass}
                  value={expectedSpendOn}
                  onChange={(event) => setExpectedSpendOn(event.target.value)}
                />
              </ApprovalsField>
            </div>
            {!offPlan && (
              <label className='flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  className='size-4 accent-primary'
                  checked={stillNeeded}
                  onChange={(event) => setStillNeeded(event.target.checked)}
                />
                {translate('stillNeeded')}
              </label>
            )}
          </fieldset>
        )}
      </fieldset>
      <div className='flex justify-end border-t border-border/60 pt-4'>
        <ApprovalsButton type='submit' variant='primary' pending={pending} disabled={!valid}>
          {translate('submit')}
        </ApprovalsButton>
      </div>
    </form>
  )
}
