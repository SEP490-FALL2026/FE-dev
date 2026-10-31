import { useTranslation } from 'react-i18next'
import type { BudgetProposalBodyDtoLinesItem } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDtoLinesItem'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { resourceIdPattern } from '../../shared/manager-identifiers'
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
    <div className='grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3'>
      <ManagerField label={translate('description')}>
        <input
          name={name('description')}
          className={managerInputClass}
          required
          maxLength={200}
          defaultValue={initial?.description}
        />
      </ManagerField>
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
      <ManagerField label={translate('planId')}>
        <input
          name={name('planId')}
          className={managerInputClass}
          pattern={resourceIdPattern}
          defaultValue={initial?.planId}
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
      <ManagerField label={translate('serviceMonths')}>
        <input
          name={name('servicePeriodMonths')}
          required
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
      <ManagerField label={translate('quoteUntil')}>
        <input
          name={name('quoteValidUntil')}
          className={managerInputClass}
          type='date'
          defaultValue={initial?.quoteValidUntil}
        />
      </ManagerField>
      <ManagerField label={translate('repeatCycle')}>
        <select
          name={name('repeatCycle')}
          required
          className={managerInputClass}
          defaultValue={initial?.repeatCycle ?? ''}
        >
          <option value=''>{translate('repeatCycle')}</option>
          {Object.values(REPEAT_CYCLE).map((cycle) => (
            <option key={cycle} value={cycle}>
              {translate(`statuses.${cycle}`)}
            </option>
          ))}
        </select>
      </ManagerField>
      <ManagerField label={translate('note')}>
        <textarea name={name('note')} className={managerInputClass} maxLength={1000} defaultValue={initial?.note} />
      </ManagerField>
    </div>
  )
}
