import { Send, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, Notice, inputClassName, primaryButtonClassName, secondaryButtonClassName } from '../../dashboard-ui'

/** FIN-45: an approved total is never edited in place; Finance asks the Spending Approver with a reason. */
export function FinanceBudgetAdjustmentDialog({
  approvedTotal,
  costCenter,
  formatCurrency,
  onClose,
  onSubmit
}: {
  approvedTotal: number
  costCenter: string
  formatCurrency: (value: number) => string
  onClose: () => void
  onSubmit: (newTotal: number, reason: string) => void
}) {
  const { t } = useTranslation('dashboard')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const parsedAmount = Number(amount.replace(/\D/g, ''))
  const amountInvalid = parsedAmount <= 0 || parsedAmount === approvedTotal
  const reasonMissing = reason.trim().length === 0

  const submit = () => {
    if (amountInvalid || reasonMissing) {
      setShowErrors(true)
      return
    }
    onSubmit(parsedAmount, reason.trim())
  }

  return (
    <Dialog
      hint={t('budgetPlan.allocation.adjustment.hint')}
      onClose={onClose}
      title={t('budgetPlan.allocation.adjustment.title', { costCenter })}
    >
      <form
        className='space-y-4'
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <p className='text-xs text-muted-foreground'>
          {t('budgetPlan.allocation.adjustment.current', { amount: formatCurrency(approvedTotal) })}
        </p>
        <div>
          <label className='text-xs font-bold text-foreground' htmlFor='adjustment-total'>
            {t('budgetPlan.allocation.adjustment.newTotal')}
          </label>
          <input
            className={`${inputClassName} mt-2`}
            id='adjustment-total'
            inputMode='numeric'
            onChange={(event) => setAmount(event.target.value)}
            placeholder={t('budgetPlan.allocation.adjustment.newTotalPlaceholder')}
            value={amount}
          />
          {parsedAmount > 0 && (
            <p className='mt-1 text-[0.7rem] text-muted-foreground'>{formatCurrency(parsedAmount)}</p>
          )}
          {showErrors && amountInvalid && (
            <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
              {t('budgetPlan.allocation.adjustment.newTotalRequired')}
            </p>
          )}
        </div>
        <div>
          <label className='text-xs font-bold text-foreground' htmlFor='adjustment-reason'>
            {t('budgetPlan.allocation.adjustment.reason')}
          </label>
          <textarea
            className={`${inputClassName} mt-2 min-h-20`}
            id='adjustment-reason'
            onChange={(event) => setReason(event.target.value)}
            value={reason}
          />
          {showErrors && reasonMissing && (
            <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
              {t('budgetPlan.allocation.adjustment.reasonRequired')}
            </p>
          )}
        </div>

        <Notice icon={ShieldCheck}>{t('budgetPlan.allocation.adjustment.notice')}</Notice>

        <div className='flex flex-wrap justify-end gap-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={primaryButtonClassName} type='submit'>
            <Send aria-hidden='true' className='size-3.5' />
            {t('budgetPlan.allocation.adjustment.submit')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
