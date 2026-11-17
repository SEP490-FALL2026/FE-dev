import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { adminButtonClass, AdminFormDialog } from '~/shared/ui/form-dialog'
import { getBudgetVersionGetQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { getBudgetVersionHistoryListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetVersionDecide } from '~/shared/api/generated/operations/budget-versions/budget-version-decide'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { getApprovalsError } from '../../shared/approvals-errors'
import { DecisionChecklistPanel } from '../../shared/components/decision-checklist'
import { DecisionDeclineDialog } from '../../shared/components/decision-decline-dialog'
import { CHECKLIST_ANSWER, DECISION_STEP, useDecisionChecklist } from '../../shared/hooks/use-decision-checklist'
import { versionDecision } from '../enums/version-decision'

/**
 * The decision on a budget version, laid out like the spend decision: the checklist starts folded, two boxes confirm
 * the review, and the buttons are the decision. Approve needs every answer Yes; Return needs a criterion answered No
 * as its ground and asks for the reason in its own dialog.
 */
export function ApprovalAnnualBudgetDecision({
  itemId,
  disabled,
  onClose
}: {
  itemId: string
  disabled: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('approvalsBudget')
  const { t: translateChecklist } = useTranslation('approvals')
  const queryClient = useQueryClient()
  const submissionLocked = useRef(false)
  const [confirmed, setConfirmed] = useState(false)
  const [returning, setReturning] = useState(false)
  const [permissionBlocked, setPermissionBlocked] = useState(false)
  const feedback = useApprovalsFeedback(
    [
      getBudgetVersionGetQueryKey(itemId),
      getBudgetVersionListQueryKey(),
      getBudgetVersionHistoryListQueryKey(itemId),
      getBudgetTableQueryKey(),
      getBudgetProposalListQueryKey()
    ],
    onClose
  )
  const invalidateSpend = () =>
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        queryKey.some(
          (part) =>
            typeof part === 'string' &&
            /\/(budget-check|spend-approvals|spend-batches|budget-commitments|notifications)(\/|$)/.test(part)
        )
    })
  const checklist = useDecisionChecklist(DECISION_STEP.BUDGET_VERSION)
  const mutation = useBudgetVersionDecide({
    mutation: {
      onSettled: () => {
        submissionLocked.current = false
      },
      onSuccess: async () => {
        await invalidateSpend()
        await feedback.onSuccess()
      },
      onError: async (error) => {
        checklist.handleError(error)
        if (['ownVersion', 'forbidden'].includes(getApprovalsError(error).key)) setPermissionBlocked(true)
        if (getApprovalsError(error).key !== 'rateLimit') await invalidateSpend()
        await feedback.onError(error)
      }
    }
  })

  const open = !disabled && !permissionBlocked && !mutation.isPending
  const answered = open && confirmed && checklist.complete
  const hasPersonQuestions = checklist.items.some((item) => item.check === 'PERSON')
  const canApprove = answered && !checklist.hasNo
  const canReturn = answered && (checklist.hasNo || !hasPersonQuestions)
  const agreeAll = confirmed && checklist.complete && !checklist.hasNo

  const decide = (decision: typeof versionDecision.APPROVE | typeof versionDecision.RETURN, reason = '') => {
    const checklistPayload = checklist.payload()
    const allowed = decision === versionDecision.APPROVE ? canApprove : canReturn
    if (submissionLocked.current || !allowed || !checklistPayload) return
    submissionLocked.current = true
    mutation.mutate({
      id: itemId,
      data: { decision, checklist: checklistPayload, ...(decision === versionDecision.RETURN ? { reason } : {}) }
    })
  }

  return (
    <>
      <AdminFormDialog
        title={translate('reviewDecision')}
        pending={mutation.isPending}
        submitLabel={translate('approve')}
        submitDisabled={!canApprove}
        onClose={onClose}
        onSubmit={(event) => {
          event.preventDefault()
          decide(versionDecision.APPROVE)
        }}
        secondaryActions={
          <button type='button' className={adminButtonClass} disabled={!canReturn} onClick={() => setReturning(true)}>
            {translate('returnToFinance')}
          </button>
        }
      >
        <p className='text-sm text-muted-foreground'>{translate('approvalHint')}</p>
        <DecisionChecklistPanel checklist={checklist} disabled={!open} collapsible />
        <label className='flex min-h-11 items-start gap-3 text-sm'>
          <input
            className='mt-0.5 size-4 accent-primary'
            type='checkbox'
            checked={confirmed}
            disabled={!open}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          {translate('confirmReview')}
        </label>
        <label className='flex min-h-11 items-start gap-3 text-sm font-medium'>
          <input
            className='mt-0.5 size-4 accent-primary'
            type='checkbox'
            checked={agreeAll}
            disabled={!open}
            onChange={(event) => {
              setConfirmed(event.target.checked)
              checklist.setAll(event.target.checked ? CHECKLIST_ANSWER.YES : null)
            }}
          />
          {translateChecklist('checklist.agreeAll')}
        </label>
        {answered && !canReturn && (
          <p role='note' className='text-xs text-muted-foreground'>
            {translate('returnNeedsNo')}
          </p>
        )}
      </AdminFormDialog>
      {returning && (
        <DecisionDeclineDialog
          title={translate('returnTitle')}
          question={translate('returnAsk')}
          confirmLabel={translate('returnConfirm')}
          criteria={checklist.noItems.map((item) => item.text)}
          pending={mutation.isPending}
          onSubmit={(reason) => decide(versionDecision.RETURN, reason)}
          onClose={() => setReturning(false)}
        />
      )}
    </>
  )
}
