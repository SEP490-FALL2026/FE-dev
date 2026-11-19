import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApprovalsButton } from '../../shared/components/approvals-ui'
import { DecisionChecklistPanel } from '../../shared/components/decision-checklist'
import { DecisionDeclineDialog } from '../../shared/components/decision-decline-dialog'
import { CHECKLIST_ANSWER, type DecisionChecklist } from '../../shared/hooks/use-decision-checklist'
import { SPEND_DECISION } from '../enums/spend-decision'
import { BATCH_SELECTION_LIMIT } from '../batch-constraints'

type BatchChoice = typeof SPEND_DECISION.APPROVE | typeof SPEND_DECISION.REJECT | typeof SPEND_DECISION.RETURN

/**
 * The decision on a batch, laid out like the decision on one request: the checklist starts folded, two boxes confirm
 * the review and the buttons are the decision. Approve needs every answer Yes; Reject and Return need a criterion
 * answered No as their ground and ask for the reason in their own dialog. A return takes the whole batch back to its
 * head, so it needs no selection; the other two decide the selected requests of the page.
 */
export function SpendBatchDecision({
  selectedCount,
  pending,
  disabled,
  checklist,
  onSubmit
}: {
  selectedCount: number
  pending: boolean
  disabled: boolean
  checklist: DecisionChecklist
  onSubmit: (decision: BatchChoice, reason: string) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { t: translateChecklist } = useTranslation('approvals')
  const [confirmed, setConfirmed] = useState(false)
  const [declining, setDeclining] = useState<typeof SPEND_DECISION.REJECT | typeof SPEND_DECISION.RETURN | null>(null)

  const open = !disabled && !pending
  const hasSelection = selectedCount > 0 && selectedCount <= BATCH_SELECTION_LIMIT
  const answered = open && confirmed && checklist.complete
  const hasPersonQuestions = checklist.items.some((item) => item.check === 'PERSON')
  const hasGround = checklist.hasNo || !hasPersonQuestions
  const canApprove = answered && hasSelection && !checklist.hasNo
  const canReject = answered && hasSelection && hasGround
  const canReturn = answered && hasGround
  const agreeAll = confirmed && checklist.complete && !checklist.hasNo

  return (
    <form
      className='space-y-4 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
      onSubmit={(event) => event.preventDefault()}
    >
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1 text-sm text-muted-foreground'>
          <p>{translate('batchHint')}</p>
          <p>{translate('batchPageScope')}</p>
        </div>
        <p className='font-mono text-sm font-medium tabular-nums'>{translate('selected', { count: selectedCount })}</p>
      </div>
      <fieldset disabled={!open} className='space-y-4 disabled:opacity-60'>
        <DecisionChecklistPanel checklist={checklist} disabled={!open} collapsible />
        <label className='flex min-h-11 items-start gap-3 text-sm'>
          <input
            className='mt-0.5 size-4 accent-primary'
            type='checkbox'
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          {translate('decisionConfirmation')}
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
        <span className='text-sm font-medium'>{translate('batchConfirm')}</span>
        <div className='flex flex-wrap justify-end gap-3'>
          <ApprovalsButton variant='danger' type='button' disabled={!canReject} onClick={() => setDeclining('REJECT')}>
            {translate('reject')}
          </ApprovalsButton>
          <ApprovalsButton
            variant='secondary'
            type='button'
            disabled={!canReturn}
            onClick={() => setDeclining('RETURN')}
          >
            {translate('return')}
          </ApprovalsButton>
          <ApprovalsButton
            variant='primary'
            type='button'
            pending={pending}
            disabled={!canApprove}
            onClick={() => onSubmit(SPEND_DECISION.APPROVE, '')}
          >
            {translate('approve')}
          </ApprovalsButton>
        </div>
      </div>
      {answered && !(canReject || canReturn) && (
        <p role='note' className='text-xs text-muted-foreground'>
          {translate('declineNeedsNo')}
        </p>
      )}
      {declining && (
        <DecisionDeclineDialog
          title={translate(declining === 'REJECT' ? 'batchRejectTitle' : 'batchReturnTitle')}
          question={translate(declining === 'REJECT' ? 'batchRejectAsk' : 'batchReturnAsk', { count: selectedCount })}
          confirmLabel={translate(declining === 'REJECT' ? 'declineRejectConfirm' : 'declineReturnConfirm')}
          danger={declining === 'REJECT'}
          criteria={checklist.noItems.map((item) => item.text)}
          pending={pending}
          onSubmit={(reason) => onSubmit(declining, reason)}
          onClose={() => setDeclining(null)}
        />
      )}
    </form>
  )
}
