import { useTranslation } from 'react-i18next'
import type { BatchDecisionBodyDtoDecision } from '~/shared/api/generated/model/spend-approvals/batchDecisionBodyDtoDecision'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsSelect,
  approvalsInputClass
} from '../../shared/components/approvals-ui'
import { DecisionChecklistPanel } from '../../shared/components/decision-checklist'
import type { DecisionChecklist } from '../../shared/hooks/use-decision-checklist'
import { SPEND_DECISION } from '../enums/spend-decision'
import { BATCH_SELECTION_LIMIT } from '../batch-constraints'

export function SpendBatchDecision({
  decision,
  reason,
  selectedCount,
  pending,
  disabled,
  checklist,
  onDecision,
  onReason,
  onSubmit
}: {
  decision: BatchDecisionBodyDtoDecision
  reason: string
  selectedCount: number
  pending: boolean
  disabled: boolean
  checklist: DecisionChecklist
  onDecision: (decision: BatchDecisionBodyDtoDecision) => void
  onReason: (reason: string) => void
  onSubmit: () => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const needsReason = decision === SPEND_DECISION.REJECT || decision === SPEND_DECISION.RETURN
  const approving = decision === SPEND_DECISION.APPROVE
  const returning = decision === SPEND_DECISION.RETURN
  // A return takes the whole batch back to the head, so it needs no selection.
  const valid =
    (returning || (selectedCount > 0 && selectedCount <= BATCH_SELECTION_LIMIT)) &&
    (!needsReason || Boolean(reason.trim())) &&
    checklist.complete &&
    !(approving && checklist.hasNo)
  return (
    <form
      className='space-y-4 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
      onSubmit={(event) => {
        event.preventDefault()
        if (!pending && !disabled && valid) onSubmit()
      }}
    >
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1 text-sm text-muted-foreground'>
          <p>{translate('batchHint')}</p>
          <p>{translate(returning ? 'batchReturnScope' : 'batchPageScope')}</p>
        </div>
        {!returning && (
          <p className='font-mono text-sm font-medium tabular-nums'>
            {translate('selected', { count: selectedCount })}
          </p>
        )}
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <ApprovalsSelect
          label={translate('decision')}
          value={decision}
          options={[
            { value: SPEND_DECISION.APPROVE, label: translate('approve') },
            { value: SPEND_DECISION.REJECT, label: translate('reject') },
            { value: SPEND_DECISION.RETURN, label: translate('return') }
          ]}
          onChange={(value) => {
            if (value === SPEND_DECISION.APPROVE || value === SPEND_DECISION.REJECT || value === SPEND_DECISION.RETURN)
              onDecision(value)
          }}
          disabled={pending || disabled}
        />
        {needsReason && (
          <ApprovalsField
            label={translate(decision === SPEND_DECISION.RETURN ? 'returnReason' : 'rejectReason')}
            required
          >
            <textarea
              aria-label={translate(decision === SPEND_DECISION.RETURN ? 'returnReason' : 'rejectReason')}
              required
              maxLength={1000}
              rows={3}
              className={approvalsInputClass}
              placeholder={translate(decision === SPEND_DECISION.RETURN ? 'returnPlaceholder' : 'rejectPlaceholder')}
              value={reason}
              disabled={pending}
              onChange={(event) => onReason(event.target.value)}
            />
          </ApprovalsField>
        )}
      </div>
      <DecisionChecklistPanel checklist={checklist} disabled={pending || disabled} />
      <div className='flex justify-end border-t border-border/60 pt-4'>
        <ApprovalsButton type='submit' variant='primary' pending={pending} disabled={disabled || !valid}>
          {translate('batchConfirm')}
        </ApprovalsButton>
      </div>
    </form>
  )
}
