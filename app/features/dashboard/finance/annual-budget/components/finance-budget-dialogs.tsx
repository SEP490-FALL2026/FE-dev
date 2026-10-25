import { CheckCircle2, Link2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining } from '../../../budget-figures'
import { Dialog, inputClassName, primaryButtonClassName, secondaryButtonClassName } from '../../../dashboard-ui'
import type { CommitmentToRecord, CostCenter } from '../../finance-data'

type PeriodFigures = { actual: number; budget: number | null; held: number }

export function BudgetEditorDialog({
  costCenter,
  figures,
  formatCurrency,
  mode,
  onClose,
  onSave,
  periodLabel,
  unattached
}: {
  costCenter: string
  figures: PeriodFigures
  formatCurrency: (value: number) => string
  mode: 'create' | 'edit'
  onClose: () => void
  onSave: (amount: number, previewRemaining: number) => void
  periodLabel: string
  unattached: CommitmentToRecord[]
}) {
  const { t } = useTranslation('dashboard')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const parsedAmount = Number(amount.replace(/\D/g, ''))
  const previewRemaining = parsedAmount > 0 ? getRemaining({ ...figures, budget: parsedAmount }) : null

  const submit = () => {
    if (parsedAmount <= 0 || (mode === 'edit' && reason.trim().length === 0)) {
      setShowErrors(true)
      return
    }
    onSave(parsedAmount, previewRemaining ?? 0)
  }

  return (
    <Dialog
      hint={mode === 'create' ? t('finance.budgets.createHint') : t('finance.budgets.editHint')}
      onClose={onClose}
      size='lg'
      title={
        mode === 'create'
          ? t('finance.budgets.createTitle', { costCenter, period: periodLabel })
          : t('finance.budgets.editTitle', { costCenter, period: periodLabel })
      }
    >
      <form
        className='grid gap-5 md:grid-cols-2'
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className='space-y-4'>
          {mode === 'edit' && figures.budget !== null && (
            <p className='text-xs text-muted-foreground'>
              {t('finance.budgets.currentAmount', { amount: formatCurrency(figures.budget) })}
            </p>
          )}
          <div>
            <label className='text-xs font-bold text-foreground' htmlFor='budget-amount'>
              {t('finance.budgets.amountLabel')}
            </label>
            <input
              className={`${inputClassName} mt-2`}
              id='budget-amount'
              inputMode='numeric'
              onChange={(event) => setAmount(event.target.value)}
              placeholder={t('finance.budgets.amountPlaceholder')}
              value={amount}
            />
            {parsedAmount > 0 && (
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>{formatCurrency(parsedAmount)}</p>
            )}
            {showErrors && parsedAmount <= 0 && (
              <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                {t('finance.budgets.amountRequired')}
              </p>
            )}
          </div>

          {mode === 'edit' && (
            <div>
              <label className='text-xs font-bold text-foreground' htmlFor='budget-reason'>
                {t('finance.budgets.reasonLabel')}
              </label>
              <textarea
                className={`${inputClassName} mt-2 min-h-20`}
                id='budget-reason'
                onChange={(event) => setReason(event.target.value)}
                value={reason}
              />
              {showErrors && reason.trim().length === 0 && (
                <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                  {t('finance.budgets.reasonRequired')}
                </p>
              )}
            </div>
          )}
        </div>

        <div className='space-y-3 rounded-xl border border-border bg-background p-4 text-xs'>
          {mode === 'create' && unattached.length > 0 && (
            <div>
              <p className='flex items-center gap-1.5 font-bold text-foreground'>
                <Link2 aria-hidden='true' className='size-3.5 text-primary' />
                {t('finance.budgets.backfillTitle', { count: unattached.length })}
              </p>
              <ul className='mt-2 space-y-1 text-muted-foreground'>
                {unattached.map((item) => (
                  <li key={item.id}>
                    {item.code} · {item.software}
                  </li>
                ))}
              </ul>
              <p className='mt-2 text-[0.7rem] text-muted-foreground'>{t('finance.budgets.backfillNote')}</p>
            </div>
          )}
          <div className='flex items-center justify-between gap-2'>
            <span className='text-muted-foreground'>{t('budget.actual')}</span>
            <span className='font-semibold'>{formatCurrency(figures.actual)}</span>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-muted-foreground'>{t('budget.held')}</span>
            <span className='font-semibold text-warning'>{formatCurrency(figures.held)}</span>
          </div>
          <div className='flex items-center justify-between gap-2 border-t border-border pt-3'>
            <span className='font-semibold text-muted-foreground'>{t('finance.budgets.previewRemaining')}</span>
            {previewRemaining === null ? (
              <span className='text-muted-foreground'>—</span>
            ) : (
              <RemainingValue formatCurrency={formatCurrency} remaining={previewRemaining} />
            )}
          </div>
          {previewRemaining !== null && previewRemaining < 0 && (
            <p className='text-[0.7rem] font-semibold text-danger'>{t('finance.budgets.negativeExplain')}</p>
          )}
          {mode === 'edit' && <p className='text-[0.7rem] text-muted-foreground'>{t('finance.budgets.editNote')}</p>}
        </div>

        <div className='flex flex-wrap justify-end gap-2 md:col-span-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={primaryButtonClassName} type='submit'>
            <CheckCircle2 aria-hidden='true' className='size-3.5' />
            {mode === 'create' ? t('finance.budgets.submitCreate') : t('finance.budgets.submitEdit')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export function NewCostCenterDialog({
  existingCodes,
  onClose,
  onSave
}: {
  existingCodes: string[]
  onClose: () => void
  onSave: (center: Pick<CostCenter, 'code' | 'kind' | 'name'>) => void
}) {
  const { t } = useTranslation('dashboard')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [kind, setKind] = useState<CostCenter['kind']>('UNIT')
  const [showErrors, setShowErrors] = useState(false)

  const normalizedCode = code.trim().toUpperCase()
  const duplicate = existingCodes.includes(normalizedCode)
  const missing = normalizedCode.length === 0 || name.trim().length === 0

  const submit = () => {
    if (missing || duplicate) {
      setShowErrors(true)
      return
    }
    onSave({ code: normalizedCode, kind, name: name.trim() })
  }

  return (
    <Dialog hint={t('finance.budgets.catalogHint')} onClose={onClose} title={t('finance.budgets.addCenter')}>
      <form
        className='space-y-4'
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div>
          <label className='text-xs font-bold text-foreground' htmlFor='cost-center-code'>
            {t('finance.budgets.newCode')}
          </label>
          <input
            className={`${inputClassName} mt-2 font-mono uppercase`}
            id='cost-center-code'
            onChange={(event) => setCode(event.target.value)}
            placeholder={t('finance.budgets.newCodePlaceholder')}
            value={code}
          />
        </div>
        <div>
          <label className='text-xs font-bold text-foreground' htmlFor='cost-center-name'>
            {t('finance.budgets.newName')}
          </label>
          <input
            className={`${inputClassName} mt-2`}
            id='cost-center-name'
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
        <div>
          <label className='text-xs font-bold text-foreground' htmlFor='cost-center-kind'>
            {t('finance.budgets.colKind')}
          </label>
          <select
            className={`${inputClassName} mt-2`}
            id='cost-center-kind'
            onChange={(event) => setKind(event.target.value as CostCenter['kind'])}
            value={kind}
          >
            <option value='UNIT'>{t('finance.budgets.kind.UNIT')}</option>
            <option value='COMPANY'>{t('finance.budgets.kind.COMPANY')}</option>
          </select>
        </div>

        {showErrors && (missing || duplicate) && (
          <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
            {duplicate ? t('finance.budgets.newDuplicate') : t('finance.budgets.newRequired')}
          </p>
        )}

        <div className='flex flex-wrap justify-end gap-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={primaryButtonClassName} type='submit'>
            {t('ui.save')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
