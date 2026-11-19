import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, FinanceSelect, financeInputClass } from '../../shared/components/finance-ui'
import { useReviewPeriodActions } from '../hooks/use-in-year-actions'

const MIN_YEAR = 2000
const MAX_YEAR = 2100
const months = Array.from({ length: 12 }, (_, index) => index + 1)

/** A month can be closed from the first day of the next one. */
export function monthHasEnded(year: number, month: number, now: Date) {
  return year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth())
}

/** The last finished month: the month that can be closed today. */
function lastFinishedMonth(now: Date) {
  const month = now.getMonth()
  return month === 0 ? { year: now.getFullYear() - 1, month: 12 } : { year: now.getFullYear(), month }
}

export function ReviewCloseDialog({
  onClose,
  onClosed
}: {
  onClose: () => void
  onClosed: (periodId: string) => void
}) {
  const { t: translate } = useTranslation('financeReview')
  const initial = lastFinishedMonth(new Date())
  const [year, setYear] = useState(String(initial.year))
  const [month, setMonth] = useState(String(initial.month))
  const { close } = useReviewPeriodActions(undefined, (periodId) => {
    onClosed(periodId)
    onClose()
  })

  const yearNumber = Number(year)
  const yearValid = Number.isInteger(yearNumber) && yearNumber >= MIN_YEAR && yearNumber <= MAX_YEAR
  const ended = yearValid && monthHasEnded(yearNumber, Number(month), new Date())

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ended || close.isPending) return
    close.mutate({ data: { year: yearNumber, month: Number(month) } })
  }

  return (
    <AdminFormDialog
      title={translate('periods.closeTitle')}
      pending={close.isPending}
      submitLabel={translate('periods.closeSubmit')}
      submitDisabled={!ended}
      onClose={onClose}
      onSubmit={submit}
    >
      <p className='soft-panel px-4 py-3 text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
        {translate('periods.closeHint')}
      </p>
      <div className='grid gap-3 sm:grid-cols-2'>
        <FinanceField label={translate('year')} required error={yearValid ? null : translate('yearInvalid')}>
          <input
            type='number'
            inputMode='numeric'
            min={MIN_YEAR}
            max={MAX_YEAR}
            aria-invalid={!yearValid}
            placeholder={translate('ui.yearPlaceholder', { year: new Date().getFullYear() })}
            className={`${financeInputClass} font-mono tabular-nums`}
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </FinanceField>
        <FinanceField
          label={translate('month')}
          required
          error={yearValid && !ended ? translate('periods.monthNotEnded') : null}
        >
          <FinanceSelect
            value={month}
            required
            invalid={yearValid && !ended}
            placeholder={translate('ui.monthPlaceholder')}
            onChange={(event) => setMonth(event.target.value)}
          >
            {months.map((value) => (
              <option key={value} value={value} disabled={yearValid && !monthHasEnded(yearNumber, value, new Date())}>
                {translate('monthName', { month: value })}
              </option>
            ))}
          </FinanceSelect>
        </FinanceField>
      </div>
    </AdminFormDialog>
  )
}
