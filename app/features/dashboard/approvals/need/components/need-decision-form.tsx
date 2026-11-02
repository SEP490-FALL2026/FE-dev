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
      className='space-y-5 rounded-lg border border-border bg-surface p-5'
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
        <legend className='mb-3 font-semibold'>{translate('decision')}</legend>
        {lines ? (
          <NeedMemberDecisions
            lines={lines}
            decisions={memberDecisions}
            onChange={(employeeId, selection) =>
              setMemberDecisions((previous) => ({ ...previous, [employeeId]: selection }))
            }
          />
        ) : (
          <div className='flex flex-wrap gap-5'>
            <label className='inline-flex min-h-11 items-center gap-2 text-sm'>
              <input
                type='radio'
                name='need-decision'
                checked={approving}
                onChange={() => setDecision(NEED_DECISION.APPROVE)}
              />
              {translate('approve')}
            </label>
            <label className='inline-flex min-h-11 items-center gap-2 text-sm'>
              <input
                type='radio'
                name='need-decision'
                checked={!approving}
                onChange={() => setDecision(NEED_DECISION.REJECT)}
              />
              {translate('reject')}
            </label>
          </div>
        )}
        {!lines && !approving && (
          <ApprovalsField label={translate('reason')}>
            <textarea
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
          <ApprovalsField label={translate('termReason')}>
            <textarea
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
            <div className='flex flex-wrap gap-5'>
              <label className='inline-flex min-h-11 items-center gap-2 text-sm'>
                <input type='radio' name='need-plan' checked={!offPlan} onChange={() => setOffPlan(false)} />
                {translate('planned')}
              </label>
              <label className='inline-flex min-h-11 items-center gap-2 text-sm'>
                <input type='radio' name='need-plan' checked={offPlan} onChange={() => setOffPlan(true)} />
                {translate('offPlan')}
              </label>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              {!offPlan && (
                <ApprovalsField label={translate('planPosition')} hint={translate('planPositionHint')}>
                  <input
                    type='number'
                    aria-label={translate('planPosition')}
                    min={1}
                    step={1}
                    className={approvalsInputClass}
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
                  placeholder={translate('datePlaceholder')}
                  value={expectedSpendOn}
                  onChange={(event) => setExpectedSpendOn(event.target.value)}
                />
              </ApprovalsField>
            </div>
            {!offPlan && (
              <label className='flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={stillNeeded}
                  onChange={(event) => setStillNeeded(event.target.checked)}
                />
                {translate('stillNeeded')}
              </label>
            )}
          </fieldset>
        )}
      </fieldset>
      <div className='flex justify-end'>
        <ApprovalsButton type='submit' variant='primary' pending={pending} disabled={!valid}>
          {translate('submit')}
        </ApprovalsButton>
      </div>
    </form>
  )
}
