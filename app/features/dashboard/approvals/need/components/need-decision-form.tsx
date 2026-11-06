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
import { rejectPressedClass, segmentClass } from './segment-classes'
import { NeedMemberDecisions, type MemberDecision } from './need-member-decisions'

export function NeedDecisionForm({
  request,
  lines,
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
  const validDecision = lines
    ? groupDecisions.length === lines.length &&
      lines.length > 0 &&
      groupDecisions.every((selection) => selection.decision !== NEED_DECISION.REJECT || Boolean(selection.reason))
    : approving || Boolean(reason.trim())
  const valid = !disabled && validDecision
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
        if (lines) groupMutation.mutate({ id: request.id, data: { lines: groupDecisions } })
        else
          mutation.mutate({
            id: request.id,
            data: { decision, ...(!approving ? { reason: reason.trim() } : {}) }
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
      </fieldset>
      <div className='flex justify-end border-t border-border/60 pt-4'>
        <ApprovalsButton type='submit' variant='primary' pending={pending} disabled={!valid}>
          {translate('submit')}
        </ApprovalsButton>
      </div>
    </form>
  )
}
