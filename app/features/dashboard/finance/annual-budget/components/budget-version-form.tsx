import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VersionBodyDto } from '~/shared/api/generated/model/budget-versions/versionBodyDto'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'

const sectionTitleClass = 'text-xs font-semibold tracking-wider text-muted-foreground uppercase'
const amountClass = `${financeInputClass} text-right font-mono tabular-nums`

export type BudgetFigures = Omit<VersionBodyDto, 'proposalId'> & { reason?: string }

export function BudgetVersionForm({
  initial,
  onSubmit,
  onClose,
  pending,
  revision = false,
  allowReason = true,
  reasonRequired = false,
  disabled = false
}: {
  initial: BudgetFigures
  onSubmit: (figures: BudgetFigures) => void
  onClose: () => void
  pending: boolean
  revision?: boolean
  allowReason?: boolean
  /** A revision cannot be sent without a reason (BUDGET.REVISION_REASON_REQUIRED). */
  reasonRequired?: boolean
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [base, setBase] = useState(initial.base.amount)
  const [reserve, setReserve] = useState(initial.reserve.amount)
  const [percent, setPercent] = useState(String(initial.highValuePercent))
  const [highValue, setHighValue] = useState(initial.highValueAmount?.amount ?? '')
  const [quarters, setQuarters] = useState({
    q1: initial.quarters?.q1.amount ?? '',
    q2: initial.quarters?.q2.amount ?? '',
    q3: initial.quarters?.q3.amount ?? '',
    q4: initial.quarters?.q4.amount ?? ''
  })
  const [reason, setReason] = useState(initial.reason ?? '')
  const [invalid, setInvalid] = useState(false)
  const currency = initial.base.currency
  const valid =
    isDecimal(base) &&
    isDecimal(reserve) &&
    percent.trim() !== '' &&
    Number.isInteger(Number(percent)) &&
    Number(percent) >= 0 &&
    Number(percent) <= 100 &&
    (!highValue || isDecimal(highValue)) &&
    (Object.values(quarters).every((amount) => !amount) || Object.values(quarters).every(isDecimal)) &&
    (!reasonRequired || reason.trim() !== '')
  const money = (amount: string) => ({ amount, currency })
  return (
    <FinanceFormDialog
      page
      title={translate(revision ? 'actions.revise' : 'actions.save')}
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
          base: money(base),
          reserve: money(reserve),
          highValuePercent: Number(percent),
          highValueAmount: highValue ? money(highValue) : null,
          quarters: quarters.q1
            ? { q1: money(quarters.q1), q2: money(quarters.q2), q3: money(quarters.q3), q4: money(quarters.q4) }
            : null,
          ...(reason.trim() ? { reason: reason.trim() } : {})
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
          error={invalid && !isDecimal(base) ? translate('fieldInvalid') : null}
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
          required
          label={translate('fields.reserve')}
          error={invalid && !isDecimal(reserve) ? translate('fieldInvalid') : null}
        >
          <input
            required
            inputMode='decimal'
            maxLength={40}
            aria-invalid={invalid && !isDecimal(reserve)}
            className={amountClass}
            placeholder={translate('placeholders.reserve')}
            value={reserve}
            onChange={(event) => setReserve(event.target.value)}
          />
        </FinanceField>
        <FinanceField required label={translate('fields.highValuePercent')} hint={translate('percentHint')}>
          <input
            required
            type='number'
            min={0}
            max={100}
            step={1}
            className={amountClass}
            placeholder={translate('placeholders.percent')}
            value={percent}
            onChange={(event) => setPercent(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.highValueAmount')} hint={translate('optionalHint')}>
          <input
            inputMode='decimal'
            maxLength={40}
            className={amountClass}
            placeholder={translate('placeholders.highValueAmount')}
            value={highValue}
            onChange={(event) => setHighValue(event.target.value)}
          />
        </FinanceField>
      </div>
      <h3 className={sectionTitleClass}>{translate('sections.quarters')}</h3>
      <p className='text-sm text-muted-foreground'>{translate('optionalQuarters')}</p>
      <div className='grid gap-4 sm:grid-cols-2'>
        {(Object.keys(quarters) as Array<keyof typeof quarters>).map((quarter) => (
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
      {allowReason && (
        <FinanceField
          required={reasonRequired}
          label={translate('fields.reason')}
          hint={reasonRequired ? translate('revisionReasonHint') : undefined}
          error={invalid && reasonRequired && !reason.trim() ? translate('fieldInvalid') : null}
        >
          <textarea
            required={reasonRequired}
            aria-invalid={invalid && reasonRequired && !reason.trim()}
            rows={3}
            maxLength={1000}
            className={financeInputClass}
            placeholder={translate('placeholders.versionReason')}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </FinanceField>
      )}
      <p className='min-h-5 text-sm text-danger' role={invalid ? 'alert' : undefined}>
        {invalid ? translate('invalid') : null}
      </p>
    </FinanceFormDialog>
  )
}
