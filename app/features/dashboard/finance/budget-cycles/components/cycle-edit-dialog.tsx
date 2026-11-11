import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { CycleResponseDtoData } from '~/shared/api/generated/model/budget-cycles'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { MoneyInput } from '~/shared/ui/money-input'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'

type Cycle = NonNullable<CycleResponseDtoData>

/** 1000.50 and 1000.5 are the same amount; compare them without the zeros after the point. */
const sameAmount = (left: string, right: string) =>
  left.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '') === right.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')

/** Edit of a cycle that is not published: deadlines, priorities and the annual ceiling (a new ceiling needs a reason). */
export function CycleEditDialog({ cycle, onClose }: { cycle: Cycle; onClose: () => void }) {
  const { t: translate } = useTranslation('financeBudget')
  const [submissionDeadline, setSubmissionDeadline] = useState(cycle.submissionDeadline)
  const [decisionDeadline, setDecisionDeadline] = useState(cycle.decisionDeadline)
  const [ceiling, setCeiling] = useState(cycle.annualCeiling.amount)
  const [priorities, setPriorities] = useState(cycle.priorities ?? '')
  const [reason, setReason] = useState('')
  const { update } = useBudgetCycleActions(cycle.year)

  const ceilingValid = isDecimal(ceiling)
  const ceilingChanged = ceilingValid && !sameAmount(ceiling, cycle.annualCeiling.amount)
  const deadlinesOrdered = !submissionDeadline || !decisionDeadline || submissionDeadline <= decisionDeadline
  const prioritiesChanged = priorities.trim() !== (cycle.priorities ?? '')
  const changed =
    ceilingChanged ||
    prioritiesChanged ||
    submissionDeadline !== cycle.submissionDeadline ||
    decisionDeadline !== cycle.decisionDeadline
  const valid =
    ceilingValid &&
    Boolean(submissionDeadline) &&
    Boolean(decisionDeadline) &&
    deadlinesOrdered &&
    (!ceilingChanged || Boolean(reason.trim())) &&
    changed

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || update.isPending) return
    update.mutate(
      {
        year: cycle.year,
        data: {
          ...(submissionDeadline !== cycle.submissionDeadline ? { submissionDeadline } : {}),
          ...(decisionDeadline !== cycle.decisionDeadline ? { decisionDeadline } : {}),
          ...(prioritiesChanged ? { priorities: priorities.trim() || null } : {}),
          ...(ceilingChanged ? { annualCeiling: { amount: ceiling }, reason: reason.trim() } : {})
        }
      },
      { onSuccess: onClose }
    )
  }

  return (
    <AdminFormDialog
      title={translate('budgetCycle.editTitle', { year: cycle.year })}
      pending={update.isPending}
      submitLabel={translate('budgetCycle.editSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className='grid gap-3 sm:grid-cols-2'>
        <FinanceField label={translate('fields.year')}>
          <input readOnly className={`${financeInputClass} font-mono tabular-nums`} value={cycle.year} />
        </FinanceField>
        <FinanceField
          label={translate('budgetCycle.annualCeiling')}
          required
          hint={translate('budgetCycle.ceilingHint')}
          error={ceiling && !ceilingValid ? translate('fieldInvalid') : null}
        >
          <MoneyInput
            maxLength={40}
            aria-invalid={Boolean(ceiling) && !ceilingValid}
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('placeholders.amount')}
            value={ceiling}
            onValueChange={setCeiling}
          />
        </FinanceField>
        <FinanceField label={translate('budgetCycle.submissionDeadline')} required>
          <input
            type='date'
            className={financeInputClass}
            value={submissionDeadline}
            onChange={(event) => setSubmissionDeadline(event.target.value)}
          />
        </FinanceField>
        <FinanceField
          label={translate('budgetCycle.decisionDeadline')}
          required
          error={deadlinesOrdered ? null : translate('budgetCycle.deadlineOrder')}
        >
          <input
            type='date'
            aria-invalid={!deadlinesOrdered}
            className={financeInputClass}
            value={decisionDeadline}
            onChange={(event) => setDecisionDeadline(event.target.value)}
          />
        </FinanceField>
      </div>
      {ceilingChanged && (
        <FinanceField
          required
          label={translate('budgetCycle.ceilingReason')}
          hint={translate('budgetCycle.ceilingReasonHint')}
        >
          <textarea
            required
            rows={2}
            maxLength={1000}
            className={`${financeInputClass} max-h-40 min-h-20 resize-y`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </FinanceField>
      )}
      <FinanceField label={translate('budgetCycle.priorities')} hint={translate('optionalHint')}>
        <textarea
          rows={3}
          maxLength={2000}
          className={`${financeInputClass} max-h-48 min-h-24 resize-y`}
          value={priorities}
          onChange={(event) => setPriorities(event.target.value)}
        />
      </FinanceField>
    </AdminFormDialog>
  )
}
