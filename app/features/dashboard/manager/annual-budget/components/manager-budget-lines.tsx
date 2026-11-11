import { useTranslation } from 'react-i18next'
import type { BudgetProposalBodyDtoLinesItem } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDtoLinesItem'
import { ManagerField, managerInputClass } from '../../shared/components/manager-api-ui'
import { ManagerBudgetPlanPicker } from './manager-budget-plan-picker'
import { useState } from 'react'
import { BudgetProposalBodyDtoLinesItemLineType } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDtoLinesItemLineType'
import { ManagerChoiceSelect } from '../../shared/components/manager-choice-select'

export function budgetLineFromForm(form: FormData, index: number): BudgetProposalBodyDtoLinesItem {
  const value = (field: string) => String(form.get(`lines.${index}.${field}`) ?? '').trim()
  return {
    lineType:
      Object.values(BudgetProposalBodyDtoLinesItemLineType).find((type) => type === value('lineType')) ??
      BudgetProposalBodyDtoLinesItemLineType.RENEW,
    priorityRank: Number(value('priorityRank')),
    ...(value('zbb.purpose') ||
    value('zbb.alternatives') ||
    value('zbb.consequenceIfNot') ||
    value('zbb.usageIndicator')
      ? {
          zbb: {
            purpose: value('zbb.purpose'),
            alternatives: value('zbb.alternatives'),
            consequenceIfNot: value('zbb.consequenceIfNot'),
            usageIndicator: value('zbb.usageIndicator')
          }
        }
      : {}),
    amount: { amount: value('amount.amount') },
    ...(value('description') ? { description: value('description') } : {}),
    ...(value('planId') ? { planId: value('planId') } : {}),
    ...(value('seats') ? { seats: Number(value('seats')) } : {}),
    ...(value('note') ? { note: value('note') } : {})
  }
}

export function ManagerBudgetLine({
  index,
  initial,
  explanationRequired
}: {
  index: number
  initial?: BudgetProposalBodyDtoLinesItem
  explanationRequired?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const { t: flow } = useTranslation('requestFlow')
  const [lineType, setLineType] = useState(initial?.lineType ?? BudgetProposalBodyDtoLinesItemLineType.RENEW)
  const [explain, setExplain] = useState(!!initial?.zbb)
  const [hasPlan, setHasPlan] = useState(!!initial?.planId)
  const requiresZbb = lineType === BudgetProposalBodyDtoLinesItemLineType.NEW || !!explanationRequired
  const name = (field: string) => `lines.${index}.${field}`
  return (
    <div className='grid items-start gap-5 sm:grid-cols-2'>
      <input type='hidden' name={name('lineType')} value={lineType} />
      <ManagerChoiceSelect
        placeholder={flow('lineType')}
        label={flow('lineType')}
        selected={[{ value: lineType, label: flow(lineType) }]}
        options={Object.values(BudgetProposalBodyDtoLinesItemLineType).map((type) => ({
          value: type,
          label: flow(type)
        }))}
        onChange={(choices) => {
          const type = Object.values(BudgetProposalBodyDtoLinesItemLineType).find(
            (value) => value === choices[0]?.value
          )
          if (type) setLineType(type)
        }}
      />
      <ManagerField label={flow('priorityRank')}>
        <input
          className={managerInputClass}
          name={name('priorityRank')}
          type='number'
          required
          min={1}
          max={100000}
          step={1}
          defaultValue={initial?.priorityRank ?? index + 1}
        />
      </ManagerField>
      <ManagerField label={translate('description')}>
        <input
          name={name('description')}
          className={managerInputClass}
          required={!hasPlan}
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
      <ManagerBudgetPlanPicker name={name('planId')} initialId={initial?.planId} onChange={(id) => setHasPlan(!!id)} />
      <ManagerField label={translate('note')}>
        <textarea name={name('note')} className={managerInputClass} maxLength={1000} defaultValue={initial?.note} />
      </ManagerField>
      {lineType === BudgetProposalBodyDtoLinesItemLineType.CANCEL && (
        <p className='text-sm text-muted-foreground sm:col-span-2'>{flow('cancelHint')}</p>
      )}
      <div className='space-y-3 sm:col-span-2'>
        <label className='flex min-h-11 items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={explain || requiresZbb}
            disabled={requiresZbb}
            onChange={(event) => setExplain(event.target.checked)}
          />
          {flow('zbb')}
        </label>
        <p className='text-xs text-muted-foreground'>{flow('zbbHint')}</p>
        {(explain || requiresZbb) && (
          <div className='grid gap-4 sm:grid-cols-2'>
            {(['purpose', 'alternatives', 'consequenceIfNot', 'usageIndicator'] as const).map((field) => (
              <ManagerField key={field} label={flow(field)}>
                <textarea
                  className={managerInputClass}
                  name={name(`zbb.${field}`)}
                  required
                  maxLength={1000}
                  rows={3}
                  defaultValue={initial?.zbb?.[field]}
                />
              </ManagerField>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
