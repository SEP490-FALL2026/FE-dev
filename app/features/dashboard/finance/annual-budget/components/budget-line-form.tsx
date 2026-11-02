import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AddLinesBodyDtoLinesItem } from '~/shared/api/generated/model/budget-versions/addLinesBodyDtoLinesItem'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { repeatCycles } from '../enums/repeat-cycle'

export type BudgetLineInput = AddLinesBodyDtoLinesItem & { financeComment?: string; adjustmentReason?: string }

export function BudgetLineForm({
  line,
  currency,
  pending,
  onSubmit,
  onClose,
  disabled = false
}: {
  line?: VersionLinePageResponseDtoDataItemsItem
  currency: string
  pending: boolean
  onSubmit: (line: BudgetLineInput) => void
  onClose: () => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('financeBudget')
  const [description, setDescription] = useState(line?.description ?? '')
  const [amount, setAmount] = useState(line?.amount.amount ?? '')
  const [planId, setPlanId] = useState(line?.planId ?? '')
  const [seats, setSeats] = useState(line?.seats === null || line?.seats === undefined ? '' : String(line.seats))
  const [from, setFrom] = useState(line?.windowFrom ?? '')
  const [to, setTo] = useState(line?.windowTo ?? '')
  const [months, setMonths] = useState(String(line?.servicePeriodMonths ?? 12))
  const [cycle, setCycle] = useState<AddLinesBodyDtoLinesItem['repeatCycle']>(line?.repeatCycle ?? repeatCycles[0])
  const [quote, setQuote] = useState(line?.quoteValidUntil ?? '')
  const [comment, setComment] = useState(line?.financeComment ?? '')
  const [reason, setReason] = useState(line?.adjustmentReason ?? '')
  const [invalid, setInvalid] = useState(false)
  const valid =
    description.trim() &&
    isDecimal(amount) &&
    (!from || !to || from <= to) &&
    Number.isInteger(Number(months)) &&
    Number(months) >= 1 &&
    Number(months) <= 120 &&
    (!seats || (Number.isInteger(Number(seats)) && Number(seats) >= 1 && Number(seats) <= 100000))
  return (
    <FinanceFormDialog
      page
      title={translate(line ? 'actions.editLine' : 'actions.addLine')}
      pending={pending}
      submitDisabled={disabled}
      onClose={onClose}
      submitLabel={translate('actions.saveLine')}
      onSubmit={(event) => {
        event.preventDefault()
        if (disabled) return
        if (!valid) {
          setInvalid(true)
          return
        }
        onSubmit({
          description: description.trim(),
          amount: { amount, currency },
          ...(planId.trim() ? { planId: planId.trim() } : {}),
          ...(seats ? { seats: Number(seats) } : {}),
          ...(from ? { windowFrom: from } : {}),
          ...(to ? { windowTo: to } : {}),
          servicePeriodMonths: Number(months),
          repeatCycle: cycle,
          ...(quote ? { quoteValidUntil: quote } : {}),
          ...(line
            ? { financeComment: comment.trim() || undefined, adjustmentReason: reason.trim() || undefined }
            : comment.trim()
              ? { note: comment.trim() }
              : {})
        })
      }}
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField label={translate('fields.description')}>
          <input
            required
            maxLength={200}
            className={financeInputClass}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.amount')} hint={currency}>
          <input
            required
            inputMode='decimal'
            maxLength={40}
            aria-invalid={invalid && !isDecimal(amount)}
            className={financeInputClass}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.planId')}>
          <input className={financeInputClass} value={planId} onChange={(event) => setPlanId(event.target.value)} />
        </FinanceField>
        <FinanceField label={translate('fields.seats')}>
          <input
            type='number'
            min={1}
            max={100000}
            className={financeInputClass}
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
          />
        </FinanceField>
      </div>
      <h3 className='font-semibold'>{translate('lines')}</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField label={translate('fields.windowFrom')}>
          <input
            required={Boolean(line)}
            type='date'
            className={financeInputClass}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.windowTo')}>
          <input
            required={Boolean(line)}
            type='date'
            min={from || undefined}
            className={financeInputClass}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.servicePeriodMonths')}>
          <input
            required
            type='number'
            min={1}
            max={120}
            className={financeInputClass}
            value={months}
            onChange={(event) => setMonths(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.quoteValidUntil')}>
          <input
            type='date'
            className={financeInputClass}
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
          />
        </FinanceField>
      </div>
      <fieldset className='space-y-2'>
        <legend className='text-sm font-medium'>{translate('fields.repeatCycle')}</legend>
        <div className='flex flex-wrap gap-3'>
          {repeatCycles.map((value) => (
            <label key={value} className='flex min-h-11 items-center gap-2 text-sm'>
              <input
                type='radio'
                name='repeatCycle'
                value={value}
                checked={cycle === value}
                onChange={() => setCycle(value)}
              />
              {translate(`cycles.${value}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <FinanceField label={translate(line ? 'fields.financeComment' : 'fields.note')}>
        <textarea
          maxLength={1000}
          className={financeInputClass}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </FinanceField>
      {line && (
        <FinanceField label={translate('fields.adjustmentReason')}>
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
