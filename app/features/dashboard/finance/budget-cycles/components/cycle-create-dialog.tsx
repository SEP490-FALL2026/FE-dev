import { useState, type FormEvent } from 'react'
import { MoneyInput } from '~/shared/ui/money-input'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { useBudgetCycleActions } from '../hooks/use-budget-cycle-actions'

const MIN_YEAR = 2000
const MAX_YEAR = 2999

export function CycleCreateDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (year: number) => void }) {
  const { t: translate } = useTranslation('financeBudget')
  const [year, setYear] = useState(String(new Date().getFullYear() + 1))
  const [submissionDeadline, setSubmissionDeadline] = useState('')
  const [decisionDeadline, setDecisionDeadline] = useState('')
  const [ceiling, setCeiling] = useState('')
  const [reserve, setReserve] = useState('')
  const [priorities, setPriorities] = useState('')
  const { create } = useBudgetCycleActions(undefined, (createdYear) => {
    onCreated(createdYear)
    onClose()
  })

  const yearNumber = Number(year)
  // The API opens the current year and the years to come, not a year that has passed.
  const yearValid =
    Number.isInteger(yearNumber) && yearNumber >= Math.max(MIN_YEAR, new Date().getFullYear()) && yearNumber <= MAX_YEAR
  const ceilingValid = isDecimal(ceiling)
  const reserveValid = isDecimal(reserve)
  // The API does not stop it, so the form does: the shared-pool reserve is a slice of the annual ceiling.
  const reserveOverCeiling = ceilingValid && reserveValid && Number(reserve) > Number(ceiling)
  const deadlinesOrdered = !submissionDeadline || !decisionDeadline || submissionDeadline <= decisionDeadline
  const valid =
    yearValid &&
    ceilingValid &&
    reserveValid &&
    !reserveOverCeiling &&
    Boolean(submissionDeadline) &&
    Boolean(decisionDeadline) &&
    deadlinesOrdered

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || create.isPending) return
    create.mutate({
      data: {
        year: yearNumber,
        submissionDeadline,
        decisionDeadline,
        annualCeiling: { amount: ceiling },
        sharedPoolReserve: { amount: reserve },
        ...(priorities.trim() ? { priorities: priorities.trim() } : {})
      }
    })
  }

  return (
    <AdminFormDialog
      title={translate('budgetCycle.createTitle')}
      pending={create.isPending}
      submitLabel={translate('budgetCycle.createSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className='sm:w-[calc(50%-0.375rem)]'>
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
      </div>
      <div className='grid gap-3 sm:grid-cols-2'>
        <FinanceField
          label={translate('budgetCycle.annualCeiling')}
          required
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
        <FinanceField
          label={translate('budgetCycle.sharedPoolReserve')}
          required
          error={
            reserve && !reserveValid
              ? translate('fieldInvalid')
              : reserveOverCeiling
                ? translate('budgetCycle.reserveOverCeiling')
                : null
          }
        >
          <MoneyInput
            maxLength={40}
            aria-invalid={Boolean(reserve) && !reserveValid}
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('placeholders.amount')}
            value={reserve}
            onValueChange={setReserve}
          />
        </FinanceField>
        <p className='text-xs text-muted-foreground [text-wrap:pretty] sm:col-span-2'>
          {translate('budgetCycle.ceilingHint')} {translate('budgetCycle.sharedPoolHint')}
        </p>
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
