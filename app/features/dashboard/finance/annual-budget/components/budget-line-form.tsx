import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceField,
  FinanceSelect,
  financeFullWidthFormClass,
  financeInputClass
} from '../../shared/components/finance-ui'
import { isDecimal } from '../../shared/finance-money'

/** Money is sent as `{ amount }` only: the backend applies the reporting currency. */
export interface BudgetLineInput {
  description: string
  amount: { amount: string }
  planId?: string
  seats?: number
  note?: string
  financeComment?: string
  adjustmentReason?: string
}

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
  const [comment, setComment] = useState(line?.financeComment ?? '')
  const [reason, setReason] = useState(line?.adjustmentReason ?? '')
  const [invalid, setInvalid] = useState(false)
  const planOptions = plans.data?.data?.items ?? []
  const seatsValid = !seats || (Number.isInteger(Number(seats)) && Number(seats) >= 1 && Number(seats) <= 100000)
  const valid = description.trim() !== '' && isDecimal(amount) && seatsValid
  const fieldError = (failed: boolean) => (invalid && failed ? translate('fieldInvalid') : null)
  return (
    <div className={financeFullWidthFormClass}>
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
            amount: { amount },
            ...(planId ? { planId } : {}),
            ...(seats ? { seats: Number(seats) } : {}),
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
    </div>
  )
}
