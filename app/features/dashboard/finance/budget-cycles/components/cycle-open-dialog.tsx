import { useState, type FormEvent } from 'react'
import { MoneyInput } from '~/shared/ui/money-input'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'

const MIN_YEAR = 2000
const MAX_YEAR = 2999

export function CycleOpenDialog({ onClose, onOpened }: { onClose: () => void; onOpened: (year: number) => void }) {
  const { t: translate } = useTranslation('financeBudget')
  const [year, setYear] = useState(String(new Date().getFullYear() + 1))
  const [submissionDeadline, setSubmissionDeadline] = useState('')
  const [decisionDeadline, setDecisionDeadline] = useState('')
  const [ceiling, setCeiling] = useState('')
  const [priorities, setPriorities] = useState('')
  const { open } = useBudgetCycleActions(undefined, (openedYear) => {
    onOpened(openedYear)
    onClose()
  })

  const yearNumber = Number(year)
  // The API opens the current year and the years to come, not a year that has passed.
  const yearValid =
    Number.isInteger(yearNumber) && yearNumber >= Math.max(MIN_YEAR, new Date().getFullYear()) && yearNumber <= MAX_YEAR
  const ceilingValid = isDecimal(ceiling)
  const deadlinesOrdered = !submissionDeadline || !decisionDeadline || submissionDeadline <= decisionDeadline
  const valid =
    yearValid && ceilingValid && Boolean(submissionDeadline) && Boolean(decisionDeadline) && deadlinesOrdered

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || open.isPending) return
    open.mutate({
      data: {
        year: yearNumber,
        submissionDeadline,
        decisionDeadline,
        annualCeiling: { amount: ceiling },
        ...(priorities.trim() ? { priorities: priorities.trim() } : {})
      }
    })
  }

  return (
    <AdminFormDialog
      title={translate('budgetCycle.openTitle')}
      pending={open.isPending}
      submitLabel={translate('budgetCycle.openSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className='grid gap-3 sm:grid-cols-2'>
        <FinanceField
          label={translate('fields.year')}
          required
          error={yearValid ? null : translate('budgetCycle.yearPast')}
        >
          <input
            type='number'
            inputMode='numeric'
            min={Math.max(MIN_YEAR, new Date().getFullYear())}
            max={MAX_YEAR}
            aria-invalid={!yearValid}
            className={`${financeInputClass} font-mono tabular-nums`}
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
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
