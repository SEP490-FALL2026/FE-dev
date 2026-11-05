import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AddLinesBodyDtoLinesItem } from '~/shared/api/generated/model/budget-versions/addLinesBodyDtoLinesItem'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, FinanceSelect, financeInputClass } from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'
import { repeatCycles } from '../enums/repeat-cycle'

export type BudgetLineInput = AddLinesBodyDtoLinesItem & { financeComment?: string; adjustmentReason?: string }

const sectionTitleClass = 'text-xs font-semibold tracking-wider text-muted-foreground uppercase'

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
  const plans = usePlanList({ page: 1, pageSize: 100 })
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
  const planOptions = plans.data?.data?.items ?? []
  const monthsValid = Number.isInteger(Number(months)) && Number(months) >= 1 && Number(months) <= 120
  const seatsValid = !seats || (Number.isInteger(Number(seats)) && Number(seats) >= 1 && Number(seats) <= 100000)
  const windowValid = !from || !to || from <= to
  const valid = description.trim() && isDecimal(amount) && windowValid && monthsValid && seatsValid
  const fieldError = (failed: boolean) => (invalid && failed ? translate('fieldInvalid') : null)
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
      <h3 className={sectionTitleClass}>{translate('sections.item')}</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='sm:col-span-2'>
          <FinanceField required label={translate('fields.description')} error={fieldError(!description.trim())}>
            <input
              required
              maxLength={200}
              aria-invalid={invalid && !description.trim()}
              className={financeInputClass}
              placeholder={translate('placeholders.description')}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FinanceField>
        </div>
        <FinanceField
          required
          label={translate('fields.amount')}
          hint={translate('amountHint', { currency })}
          error={fieldError(!isDecimal(amount))}
        >
          <input
            required
            inputMode='decimal'
            maxLength={40}
            aria-invalid={invalid && !isDecimal(amount)}
            className={`${financeInputClass} text-right font-mono tabular-nums`}
            placeholder={translate('placeholders.amount')}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </FinanceField>
        <FinanceField label={translate('fields.seats')} error={fieldError(!seatsValid)}>
          <input
            type='number'
            min={1}
            max={100000}
            aria-invalid={invalid && !seatsValid}
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('placeholders.seats')}
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
          />
        </FinanceField>
        <div className='sm:col-span-2'>
          <FinanceField label={translate('fields.planId')} hint={translate('planHint')}>
            <FinanceSelect value={planId} onChange={(event) => setPlanId(event.target.value)}>
              <option value=''>{translate('placeholders.plan')}</option>
              {planId && !planOptions.some((plan) => plan.id === planId) && <option value={planId}>{planId}</option>}
              {planOptions.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.applicationName} · {plan.name}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
      </div>
      <h3 className={sectionTitleClass}>{translate('sections.schedule')}</h3>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField required={Boolean(line)} label={translate('fields.windowFrom')}>
          <input
            required={Boolean(line)}
            type='date'
            className={financeInputClass}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </FinanceField>
        <FinanceField
          required={Boolean(line)}
          label={translate('fields.windowTo')}
          error={invalid && !windowValid ? translate('windowOrder') : null}
        >
          <input
            required={Boolean(line)}
            type='date'
            min={from || undefined}
            aria-invalid={invalid && !windowValid}
            className={financeInputClass}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </FinanceField>
        <FinanceField
          required
          label={translate('fields.servicePeriodMonths')}
          hint={translate('monthsHint')}
          error={fieldError(!monthsValid)}
        >
          <input
            required
            type='number'
            min={1}
            max={120}
            aria-invalid={invalid && !monthsValid}
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('placeholders.months')}
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
        <legend className='mb-2 text-sm font-medium'>{translate('fields.repeatCycle')}</legend>
        <div className='flex flex-wrap gap-2'>
          {repeatCycles.map((value) => (
            <label
              key={value}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors duration-150 has-focus-visible:ring-2 has-focus-visible:ring-primary/40 md:min-h-10 ${
                cycle === value
                  ? 'border-primary/50 bg-primary-soft text-primary-ink'
                  : 'border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              <input
                type='radio'
                name='repeatCycle'
                value={value}
                className='accent-primary'
                checked={cycle === value}
                onChange={() => setCycle(value)}
              />
              {translate(`cycles.${value}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <h3 className={sectionTitleClass}>{translate('sections.notes')}</h3>
      <FinanceField label={translate(line ? 'fields.financeComment' : 'fields.note')}>
        <textarea
          rows={3}
          maxLength={1000}
          className={financeInputClass}
          placeholder={translate(line ? 'placeholders.financeComment' : 'placeholders.note')}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </FinanceField>
      {line && (
        <FinanceField label={translate('fields.adjustmentReason')}>
          <textarea
            rows={3}
            maxLength={1000}
            className={financeInputClass}
            placeholder={translate('placeholders.adjustmentReason')}
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
