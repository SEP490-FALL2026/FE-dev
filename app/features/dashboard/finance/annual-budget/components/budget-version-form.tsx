import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeFullWidthFormClass, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'

const sectionTitleClass = 'text-xs font-semibold tracking-wider text-muted-foreground uppercase'
const amountClass = `${financeInputClass} text-right font-mono tabular-nums`
const quarterKeys = ['q1', 'q2', 'q3', 'q4'] as const

/** Default reserve share of the base when Finance does not set one (backend default, Đợt 1). */
export const defaultReservePercent = 10

type Amount = { amount: string }
export interface BudgetFigures {
  base: Amount
  reserve?: Amount
  reserveReason?: string | null
  quarters?: { q1: Amount; q2: Amount; q3: Amount; q4: Amount } | null
}

/** Default reserve for a base, in whole units of the reporting currency. */
export function defaultReserveOf(base: string) {
  const value = Number(base)
  return Number.isFinite(value) ? String(Math.round((value * defaultReservePercent) / 100)) : ''
}

export function BudgetVersionForm({
  initial,
  currency,
  title,
  serverDefault,
  onSubmit,
  onClose,
  pending,
  disabled = false
}: {
  initial: BudgetFigures
  currency: string
  title: string
  /** Default reserve the backend computed for a saved base; preferred over the local 10% estimate. */
  serverDefault?: { base: string; reserve: string }
  onSubmit: (figures: BudgetFigures) => void
  onClose: () => void
  pending: boolean
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [base, setBase] = useState(initial.base.amount)
  const [reserve, setReserve] = useState(initial.reserve?.amount ?? '')
  const [reserveReason, setReserveReason] = useState(initial.reserveReason ?? '')
  const [quarters, setQuarters] = useState({
    q1: initial.quarters?.q1.amount ?? '',
    q2: initial.quarters?.q2.amount ?? '',
    q3: initial.quarters?.q3.amount ?? '',
    q4: initial.quarters?.q4.amount ?? ''
  })
  const [invalid, setInvalid] = useState(false)
  const defaultReserve =
    serverDefault && serverDefault.base === base ? serverDefault.reserve : isDecimal(base) ? defaultReserveOf(base) : ''
  const customReserve = reserve.trim() !== '' && Number(reserve) !== Number(defaultReserve)
  const reasonMissing = customReserve && !reserveReason.trim()
  const quartersValid = Object.values(quarters).every((amount) => !amount) || Object.values(quarters).every(isDecimal)
  const valid = isDecimal(base) && (!reserve.trim() || isDecimal(reserve)) && quartersValid && !reasonMissing
  const fieldError = (failed: boolean) => (invalid && failed ? translate('fieldInvalid') : null)
  return (
    <div className={financeFullWidthFormClass}>
      <FinanceFormDialog
        page
        title={title}
        pending={pending}
        submitDisabled={disabled}
        onClose={onClose}
        submitLabel={translate('actions.save')}
        onSubmit={(event) => {
          event.preventDefault()
          if (disabled) return
          if (!valid) {
            setInvalid(true)
            return
          }
          onSubmit({
            base: { amount: base },
            ...(reserve.trim() ? { reserve: { amount: reserve.trim() } } : {}),
            reserveReason: customReserve ? reserveReason.trim() : null,
            quarters: quarters.q1
              ? {
                  q1: { amount: quarters.q1 },
                  q2: { amount: quarters.q2 },
                  q3: { amount: quarters.q3 },
                  q4: { amount: quarters.q4 }
                }
              : null
          })
        }}
      >
        <p className='inline-flex w-fit items-center gap-2 rounded-md bg-surface-subtle px-2.5 py-1 text-xs text-muted-foreground'>
          {translate('fields.currency')}
          <span className='font-mono font-semibold text-foreground'>{currency}</span>
        </p>
        <h3 className={sectionTitleClass}>{translate('sections.figures')}</h3>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FinanceField
            required
            label={translate('fields.base')}
            hint={translate('decimalHint')}
            error={fieldError(!isDecimal(base))}
          >
            <input
              required
              inputMode='decimal'
              maxLength={40}
              aria-invalid={invalid && !isDecimal(base)}
              className={amountClass}
              placeholder={translate('placeholders.amount')}
              value={base}
              onChange={(event) => setBase(event.target.value)}
            />
          </FinanceField>
          <FinanceField
            label={translate('fields.reserve')}
            hint={translate('reserveHint', { percent: defaultReservePercent, amount: defaultReserve || '—' })}
            error={fieldError(Boolean(reserve.trim()) && !isDecimal(reserve))}
          >
            <input
              inputMode='decimal'
              maxLength={40}
              aria-invalid={invalid && Boolean(reserve.trim()) && !isDecimal(reserve)}
              className={amountClass}
              placeholder={defaultReserve || translate('placeholders.reserve')}
              value={reserve}
              onChange={(event) => setReserve(event.target.value)}
            />
          </FinanceField>
        </div>
        {customReserve && (
          <FinanceField
            required
            label={translate('fields.reserveReason')}
            hint={translate('reserveReasonHint')}
            error={fieldError(reasonMissing)}
          >
            <textarea
              required
              rows={3}
              maxLength={1000}
              aria-invalid={invalid && reasonMissing}
              className={financeInputClass}
              placeholder={translate('placeholders.reserveReason')}
              value={reserveReason}
              onChange={(event) => setReserveReason(event.target.value)}
            />
          </FinanceField>
        )}
        <h3 className={sectionTitleClass}>{translate('sections.quarters')}</h3>
        <p className='text-sm text-muted-foreground'>{translate('optionalQuarters')}</p>
        <div className='grid gap-4 sm:grid-cols-2'>
          {quarterKeys.map((quarter) => (
            <FinanceField key={quarter} label={translate(`fields.${quarter}`)}>
              <input
                inputMode='decimal'
                maxLength={40}
                className={amountClass}
                placeholder={translate('placeholders.quarter')}
                value={quarters[quarter]}
                onChange={(event) => setQuarters({ ...quarters, [quarter]: event.target.value })}
              />
            </FinanceField>
          ))}
        </div>
        <p className='min-h-5 text-sm text-danger' role={invalid ? 'alert' : undefined}>
          {invalid ? translate('invalid') : null}
        </p>
      </FinanceFormDialog>
    </div>
  )
}
