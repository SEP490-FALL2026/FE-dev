import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VersionBodyDto } from '~/shared/api/generated/model/budget-versions/versionBodyDto'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'

export type BudgetFigures = Omit<VersionBodyDto, 'proposalId'> & { reason?: string }

export function BudgetVersionForm({
  initial,
  onSubmit,
  onClose,
  pending,
  revision = false,
  allowReason = true,
  disabled = false
}: {
  initial: BudgetFigures
  onSubmit: (figures: BudgetFigures) => void
  onClose: () => void
  pending: boolean
  revision?: boolean
  allowReason?: boolean
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
    (Object.values(quarters).every((amount) => !amount) || Object.values(quarters).every(isDecimal))
  const money = (amount: string) => ({ amount, currency })
  return (
    <FinanceFormDialog
      wide
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
      <p className='text-sm text-muted-foreground'>
        {translate('fields.currency')}: {currency}
      </p>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField label={translate('fields.base')} hint={translate('decimalHint')}>
          <input
            required
            inputMode='decimal'
            maxLength={40}
            aria-invalid={invalid && !isDecimal(base)}
            className={financeInputClass}
            value={base}
            onChange={(event) => setBase(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.reserve')}>
          <input
            required
            inputMode='decimal'
            maxLength={40}
            aria-invalid={invalid && !isDecimal(reserve)}
            className={financeInputClass}
            value={reserve}
            onChange={(event) => setReserve(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.highValuePercent')}>
          <input
            required
            type='number'
            min={0}
            max={100}
            step={1}
            className={financeInputClass}
            value={percent}
            onChange={(event) => setPercent(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.highValueAmount')}>
          <input
            inputMode='decimal'
            maxLength={40}
            className={financeInputClass}
            value={highValue}
            onChange={(event) => setHighValue(event.target.value)}
          />
        </FinanceField>
      </div>
      <p className='text-sm text-muted-foreground'>{translate('optionalQuarters')}</p>
      <div className='grid gap-4 sm:grid-cols-2'>
        {(Object.keys(quarters) as Array<keyof typeof quarters>).map((quarter) => (
          <FinanceField key={quarter} label={translate(`fields.${quarter}`)}>
            <input
              inputMode='decimal'
              maxLength={40}
              className={financeInputClass}
              value={quarters[quarter]}
              onChange={(event) => setQuarters({ ...quarters, [quarter]: event.target.value })}
            />
          </FinanceField>
        ))}
      </div>
      {allowReason && (
        <FinanceField label={translate('fields.reason')}>
          <textarea
            maxLength={1000}
            className={financeInputClass}
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
