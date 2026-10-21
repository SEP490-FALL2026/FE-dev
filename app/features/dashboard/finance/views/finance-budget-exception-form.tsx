import { Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { inputClassName, primaryButtonClassName } from '../../dashboard-ui'
import type { BudgetException, ExceptionAction } from '../annual-budget-data'
import { resolveBudgetException } from '../annual-budget-store'
import { costCenters } from '../finance-data'

const actions: readonly ExceptionAction[] = [
  'PROPOSE_TOPUP',
  'TRANSFER_COST_CENTER',
  'REQUEST_INFO',
  'SUBMIT_TO_APPROVER'
]

const defaultAction: Record<BudgetException['kind'], ExceptionAction> = {
  CC_EXPIRED: 'TRANSFER_COST_CENTER',
  INSUFFICIENT: 'PROPOSE_TOPUP',
  OUT_OF_CATALOG: 'SUBMIT_TO_APPROVER'
}

/** FIN-44 decision: one of four paths, a note always, plus the top-up amount or the new cost center when needed. */
export function FinanceBudgetExceptionForm({
  item,
  onResolved,
  suggestedTopUp
}: {
  item: BudgetException
  onResolved: () => void
  suggestedTopUp: number
}) {
  const { t } = useTranslation('dashboard')
  const current = costCenters.find((entry) => entry.code === item.costCenter)
  const targets = costCenters.filter((entry) => entry.status === 'ACTIVE' && entry.code !== item.costCenter)
  const [action, setAction] = useState<ExceptionAction>(defaultAction[item.kind])
  const [topUp, setTopUp] = useState(String(suggestedTopUp))
  const [target, setTarget] = useState(current?.status === 'RETIRED' ? (current.replacedBy ?? '') : '')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const topUpAmount = Number(topUp)
  const topUpError = action === 'PROPOSE_TOPUP' && !(Number.isFinite(topUpAmount) && topUpAmount > 0)
  const targetError = action === 'TRANSFER_COST_CENTER' && !targets.some((entry) => entry.code === target)
  const noteError = note.trim().length === 0

  return (
    <form
      className='space-y-4'
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
        if (topUpError || targetError || noteError) return
        resolveBudgetException(item.id, {
          action,
          note: note.trim(),
          ...(action === 'PROPOSE_TOPUP' && { topUp: topUpAmount }),
          ...(action === 'TRANSFER_COST_CENTER' && { targetCostCenter: target })
        })
        onResolved()
      }}
    >
      <fieldset className='space-y-2'>
        <legend className='sr-only'>{t('budgetPlan.exceptions.decisionTitle')}</legend>
        {actions.map((value) => (
          <label
            className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
              action === value ? 'border-primary bg-primary-soft' : 'border-border bg-background'
            }`}
            key={value}
          >
            <input
              checked={action === value}
              className='mt-0.5'
              name='exception-action'
              onChange={() => setAction(value)}
              type='radio'
              value={value}
            />
            <span>
              <span className='block font-bold text-foreground'>{t(`budgetPlan.exceptions.action.${value}`)}</span>
              <span className='mt-0.5 block text-muted-foreground'>
                {t(`budgetPlan.exceptions.actionHint.${value}`)}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      {action === 'PROPOSE_TOPUP' && (
        <div className='space-y-1.5'>
          <label className='text-xs font-bold' htmlFor='exception-topup'>
            {t('budgetPlan.exceptions.topUpLabel')}
          </label>
          <input
            className={inputClassName}
            id='exception-topup'
            inputMode='numeric'
            min={0}
            onChange={(event) => setTopUp(event.target.value)}
            type='number'
            value={topUp}
          />
          {submitted && topUpError && (
            <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
              {t('budgetPlan.exceptions.topUpRequired')}
            </p>
          )}
        </div>
      )}

      {action === 'TRANSFER_COST_CENTER' && (
        <div className='space-y-1.5'>
          <label className='text-xs font-bold' htmlFor='exception-target'>
            {t('budgetPlan.exceptions.targetLabel')}
          </label>
          <select
            className={inputClassName}
            id='exception-target'
            onChange={(event) => setTarget(event.target.value)}
            value={target}
          >
            <option value=''>{t('budgetPlan.exceptions.targetPlaceholder')}</option>
            {targets.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {`${entry.code} · ${entry.name}`}
              </option>
            ))}
          </select>
          {submitted && targetError && (
            <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
              {t('budgetPlan.exceptions.targetRequired')}
            </p>
          )}
        </div>
      )}

      <div className='space-y-1.5'>
        <label className='text-xs font-bold' htmlFor='exception-note'>
          {t('budgetPlan.exceptions.noteLabel')}
        </label>
        <textarea
          className={`${inputClassName} min-h-20`}
          id='exception-note'
          onChange={(event) => setNote(event.target.value)}
          value={note}
        />
        {submitted && noteError && (
          <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
            {t('budgetPlan.exceptions.noteRequired')}
          </p>
        )}
      </div>

      <button className={`${primaryButtonClassName} w-full`} type='submit'>
        <Send aria-hidden='true' className='size-3.5' />
        {t('budgetPlan.exceptions.submit')}
      </button>
    </form>
  )
}
