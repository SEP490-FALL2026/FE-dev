import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getBudgetVersionGetQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { getBudgetVersionHistoryListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetVersionDecide } from '~/shared/api/generated/operations/budget-versions/budget-version-decide'
import { ApprovalsButton, ApprovalsSection } from '../../shared/components/approvals-ui'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { getApprovalsError } from '../../shared/approvals-errors'
import { DecisionChecklistPanel } from '../../shared/components/decision-checklist'
import { DecisionDeclineDialog } from '../../shared/components/decision-decline-dialog'
import { CHECKLIST_ANSWER, DECISION_STEP, useDecisionChecklist } from '../../shared/hooks/use-decision-checklist'
import { versionDecision } from '../enums/version-decision'

/** Where the page scrolls to when the decision is asked for from the top of the version. */
export const VERSION_DECISION_ANCHOR = 'version-decision'

/**
 * The decision on a budget version, at the bottom of the page like the spend decision: the checklist starts folded,
 * two boxes confirm the review, and the buttons are the decision. Approve needs every answer Yes; Return needs a
 * criterion answered No as its ground and asks for the reason in its own dialog.
 */
export function ApprovalAnnualBudgetDecision({ itemId, disabled }: { itemId: string; disabled: boolean }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const { t: translateChecklist } = useTranslation('approvals')
  const queryClient = useQueryClient()
  const submissionLocked = useRef(false)
  const [confirmed, setConfirmed] = useState(false)
  const [returning, setReturning] = useState(false)
  const [permissionBlocked, setPermissionBlocked] = useState(false)
  const feedback = useApprovalsFeedback([
    getBudgetVersionGetQueryKey(itemId),
    getBudgetVersionListQueryKey(),
    getBudgetVersionHistoryListQueryKey(itemId),
    getBudgetTableQueryKey(),
    getBudgetProposalListQueryKey()
  ])
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
        setReturning(false)
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
    <div id={VERSION_DECISION_ANCHOR} className='scroll-mt-6'>
      <ApprovalsSection title={translate('decision')}>
        {!open && !mutation.isPending && <p className='text-sm text-muted-foreground'>{translate('decisionClosed')}</p>}
        <form
          onSubmit={(event) => event.preventDefault()}
          className='space-y-4 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
        >
          <fieldset disabled={!open} className='space-y-4 disabled:opacity-60'>
            <p className='text-sm text-muted-foreground'>{translate('approvalHint')}</p>
            <DecisionChecklistPanel checklist={checklist} disabled={!open} collapsible />
            <label className='flex min-h-11 items-start gap-3 text-sm'>
              <input
                className='mt-0.5 size-4 accent-primary'
                type='checkbox'
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              {translate('confirmReview')}
            </label>
            <label className='flex min-h-11 items-start gap-3 text-sm font-medium'>
              <input
                className='mt-0.5 size-4 accent-primary'
                type='checkbox'
                checked={agreeAll}
                onChange={(event) => {
                  setConfirmed(event.target.checked)
                  checklist.setAll(event.target.checked ? CHECKLIST_ANSWER.YES : null)
                }}
              />
              {translateChecklist('checklist.agreeAll')}
            </label>
          </fieldset>
          <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4'>
            <span className='text-sm font-medium'>{translate('confirmDecision')}</span>
            <div className='flex flex-wrap justify-end gap-3'>
              <ApprovalsButton
                variant='secondary'
                type='button'
                disabled={!canReturn}
                onClick={() => setReturning(true)}
              >
                {translate('returnToFinance')}
              </ApprovalsButton>
              <ApprovalsButton
                variant='primary'
                type='button'
                disabled={!canApprove}
                pending={mutation.isPending}
                onClick={() => decide(versionDecision.APPROVE)}
              >
                {translate('approve')}
              </ApprovalsButton>
            </div>
          </div>
          {answered && !canReturn && (
            <p role='note' className='text-xs text-muted-foreground'>
              {translate('returnNeedsNo')}
            </p>
          )}
        </form>
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
      </ApprovalsSection>
    </div>
  )
}
