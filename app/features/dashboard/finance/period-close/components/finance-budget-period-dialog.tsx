import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, inputClassName, primaryButtonClassName, secondaryButtonClassName } from '../../../dashboard-ui'
import type { FiscalPeriod } from '../../annual-budget-data'

type PeriodDates = Pick<FiscalPeriod, 'end' | 'planningOpensAt' | 'start'>
type DateField = keyof PeriodDates

const fields: readonly DateField[] = ['start', 'end', 'planningOpensAt']

/** FIN-43: edits the dates of one budget period. ISO dates (yyyy-mm-dd) compare correctly as strings. */
export function FinanceBudgetPeriodDialog({
  onClose,
  onSave,
  period
}: {
  onClose: () => void
  onSave: (dates: PeriodDates) => void
  period: FiscalPeriod
}) {
  const { t } = useTranslation('dashboard')
  const [dates, setDates] = useState<PeriodDates>({
    end: period.end,
    planningOpensAt: period.planningOpensAt,
    start: period.start
  })
  const [error, setError] = useState<string | null>(null)

  const labels: Record<DateField, string> = {
    end: t('budgetPlan.periods.end'),
    planningOpensAt: t('budgetPlan.periods.planningOpensAt'),
    start: t('budgetPlan.periods.start')
  }

  const submit = () => {
    if (!dates.start || !dates.end || !dates.planningOpensAt) {
      setError(t('budgetPlan.periods.missingDates'))
      return
    }
    if (dates.end <= dates.start) {
      setError(t('budgetPlan.periods.endBeforeStart'))
      return
    }
    if (dates.planningOpensAt >= dates.start) {
      setError(t('budgetPlan.periods.planningAfterStart'))
      return
    }
    onSave(dates)
  }

  return (
    <Dialog
      hint={t('budgetPlan.periods.dialogHint')}
      onClose={onClose}
      title={t('budgetPlan.periods.dialogTitle', { year: period.year })}
    >
      <form
        className='space-y-4'
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className='grid gap-4 sm:grid-cols-3'>
          {fields.map((field) => (
            <label className='space-y-1.5 text-xs font-bold text-foreground' key={field}>
              <span className='block'>{labels[field]}</span>
              <input
                className={inputClassName}
                onChange={(event) => {
                  setDates((current) => ({ ...current, [field]: event.target.value }))
                  setError(null)
                }}
                type='date'
                value={dates[field]}
              />
            </label>
          ))}
        </div>
        {error && (
          <p className='text-xs font-semibold text-danger' role='alert'>
            {error}
          </p>
        )}
        <div className='flex justify-end gap-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={primaryButtonClassName} type='submit'>
            {t('ui.save')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
