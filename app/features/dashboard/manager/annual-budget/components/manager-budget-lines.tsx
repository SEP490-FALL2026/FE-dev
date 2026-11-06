import { useTranslation } from 'react-i18next'
import type { BudgetProposalBodyDtoLinesItem } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDtoLinesItem'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { ManagerBudgetPlanPicker } from './manager-budget-plan-picker'

export function budgetLineFromForm(form: FormData, index: number): BudgetProposalBodyDtoLinesItem {
  const value = (field: string) => String(form.get(`lines.${index}.${field}`) ?? '').trim()
  return {
    amount: { amount: value('amount.amount') },
    ...(value('description') ? { description: value('description') } : {}),
    ...(value('planId') ? { planId: value('planId') } : {}),
    ...(value('seats') ? { seats: Number(value('seats')) } : {}),
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
      <ManagerBudgetPlanPicker name={name('planId')} initialId={initial?.planId} />
      <ManagerField label={translate('note')}>
        <textarea name={name('note')} className={managerInputClass} maxLength={1000} defaultValue={initial?.note} />
      </ManagerField>
    </div>
  )
}
