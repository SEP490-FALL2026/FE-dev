import { useTranslation } from 'react-i18next'
import type { BudgetProposalBodyDtoLinesItem } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDtoLinesItem'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { ManagerBudgetPlanPicker } from './manager-budget-plan-picker'
import { REPEAT_CYCLE } from '../enums/budget-status'

export function budgetLineFromForm(form: FormData, index: number): BudgetProposalBodyDtoLinesItem {
  const value = (field: string) => String(form.get(`lines.${index}.${field}`) ?? '').trim()
  const cycle = Object.values(REPEAT_CYCLE).find((item) => item === value('repeatCycle'))
  return {
    description: value('description'),
    amount: { amount: value('amount.amount'), currency: value('amount.currency') },
    ...(value('planId') ? { planId: value('planId') } : {}),
    ...(value('seats') ? { seats: Number(value('seats')) } : {}),
    ...(value('windowFrom') ? { windowFrom: value('windowFrom') } : {}),
    ...(value('windowTo') ? { windowTo: value('windowTo') } : {}),
    ...(value('servicePeriodMonths') ? { servicePeriodMonths: Number(value('servicePeriodMonths')) } : {}),
    ...(cycle ? { repeatCycle: cycle } : {}),
    ...(value('quoteValidUntil') ? { quoteValidUntil: value('quoteValidUntil') } : {}),
    ...(value('note') ? { note: value('note') } : {})
  }
}
export function ManagerBudgetLine({ index, initial }: { index: number; initial?: BudgetProposalBodyDtoLinesItem }) {
  const { t: translate } = useTranslation('manager')
  const name = (field: string) => `lines.${index}.${field}`
  return (
    <div className='grid items-start gap-x-5 gap-y-2 sm:grid-cols-2'>
      <div className='sm:col-span-2'>
        <ManagerField label={translate('description')}>
          <input
            name={name('description')}
            className={managerInputClass}
            required
            maxLength={200}
            defaultValue={initial?.description}
          />
        </ManagerField>
      </div>
      <ManagerField label={translate('amount')}>
        <input
          name={name('amount.amount')}
          className={managerInputClass}
          required
          inputMode='decimal'
          pattern='[0-9]{1,16}(\.[0-9]+)?'
          maxLength={40}
          defaultValue={initial?.amount.amount}
        />
      </ManagerField>
      <ManagerField label={translate('currency')}>
        <input
          name={name('amount.currency')}
          className={managerInputClass}
          required
          pattern='[A-Z]{3}'
          maxLength={3}
          defaultValue={initial?.amount.currency}
        />
      </ManagerField>
      <ManagerBudgetPlanPicker name={name('planId')} initialId={initial?.planId} />
      <ManagerField label={translate('seats')}>
        <input
          name={name('seats')}
          className={managerInputClass}
          type='number'
          min={1}
          max={100000}
          step={1}
          defaultValue={initial?.seats}
        />
      </ManagerField>
      <ManagerField label={translate('serviceMonths')}>
        <input
          name={name('servicePeriodMonths')}
          className={managerInputClass}
          type='number'
          min={1}
          max={120}
          step={1}
          defaultValue={initial?.servicePeriodMonths}
        />
      </ManagerField>
      <ManagerField label={translate('windowFrom')}>
        <input
          name={name('windowFrom')}
          required
          className={managerInputClass}
          type='date'
          defaultValue={initial?.windowFrom}
        />
      </ManagerField>
      <ManagerField label={translate('windowTo')}>
        <input
          name={name('windowTo')}
          required
          className={managerInputClass}
          type='date'
          defaultValue={initial?.windowTo}
        />
      </ManagerField>
      <ManagerField label={translate('repeatCycle')}>
        <select name={name('repeatCycle')} className={managerInputClass} defaultValue={initial?.repeatCycle ?? ''}>
          <option value=''>{translate('repeatCycle')}</option>
          {Object.values(REPEAT_CYCLE).map((cycle) => (
            <option key={cycle} value={cycle}>
              {translate(`statuses.${cycle}`)}
            </option>
          ))}
        </select>
      </ManagerField>
      <p className='text-xs text-muted-foreground sm:col-span-2'>{translate('budgetForm.periodHint')}</p>
      <details
        className='mt-3 border-t border-border/40 pt-4 sm:col-span-2'
        open={!!initial?.quoteValidUntil || !!initial?.note || undefined}
      >
        <summary className='min-h-11 cursor-pointer text-sm font-medium'>{translate('budgetForm.details')}</summary>
        <div className='grid gap-4 sm:grid-cols-2'>
          <ManagerField label={translate('quoteUntil')}>
            <input
              name={name('quoteValidUntil')}
              className={managerInputClass}
              type='date'
              defaultValue={initial?.quoteValidUntil}
            />
          </ManagerField>
          <ManagerField label={translate('note')}>
            <textarea name={name('note')} className={managerInputClass} maxLength={1000} defaultValue={initial?.note} />
          </ManagerField>
        </div>
      </details>
    </div>
  )
}
