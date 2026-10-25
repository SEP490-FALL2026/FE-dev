import { CheckCircle2, Lightbulb } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InfoRow, Pill, inputClassName, secondaryButtonClassName, useDashboardFormat } from '../../../dashboard-ui'
import { financeAmount, requestedAmount, type ProposalLine } from '../../annual-budget-data'
import { setLineFinanceAmount } from '../../annual-budget-store'
import { financeDemoText } from '../../finance-demo-labels'

/** A line cut below the Manager request needs a reason before the analysis can be completed. */
export const lineMissingReason = (item: ProposalLine) =>
  financeAmount(item) < requestedAmount(item) && !item.finance?.reason.trim()

/** FIN-41: one SaaS line — Manager request and usage evidence, with Finance's negotiated amount and reason. */
export function NegotiationLine({
  formatCurrency,
  item,
  proposalId,
  readOnly
}: {
  formatCurrency: (value: number) => string
  item: ProposalLine
  proposalId: string
  readOnly: boolean
}) {
  const { t } = useTranslation('dashboard')
  const { formatNumber } = useDashboardFormat()
  const fieldId = useId()
  const requested = requestedAmount(item)
  const [amount, setAmount] = useState(String(financeAmount(item)))
  const [reason, setReason] = useState(item.finance?.reason ?? '')
  const [error, setError] = useState<'amount' | 'reason' | null>(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    const value = Number(amount)
    if (amount.trim() === '' || !Number.isFinite(value) || value < 0) {
      setError('amount')
      return
    }
    if (value < requested && !reason.trim()) {
      setError('reason')
      return
    }
    setLineFinanceAmount(proposalId, item.id, Math.round(value), value < requested ? reason.trim() : '')
    setError(null)
    setSaved(true)
  }

  return (
    <li className='rounded-xl border border-border bg-background p-4'>
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div className='min-w-0'>
          <p className='text-sm font-bold text-foreground'>{item.software}</p>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {t('budgetPlan.negotiation.lineMeta', {
              months: formatNumber(item.months),
              plan: item.plan,
              users: formatNumber(item.users)
            })}
          </p>
        </div>
        <Pill tone={item.inCatalog ? 'success' : 'warning'}>
          {item.inCatalog ? t('budgetPlan.negotiation.inCatalog') : t('budgetPlan.negotiation.newTool')}
        </Pill>
      </div>

      <div className='mt-3 divide-y divide-border'>
        <InfoRow label={t('budgetPlan.negotiation.requestedLine')} value={formatCurrency(requested)} />
        <InfoRow
          label={t('budgetPlan.proposals.colUsers')}
          value={
            item.activeUsers === undefined
              ? t('budgetPlan.negotiation.noUsage')
              : t('budgetPlan.negotiation.activeUsers', {
                  active: formatNumber(item.activeUsers),
                  requested: formatNumber(item.users)
                })
          }
        />
        <InfoRow label={t('budgetPlan.proposals.colNeed')} value={financeDemoText(item.need)} />
      </div>

      {item.hint && (
        <p className='mt-2 flex items-start gap-1.5 text-xs text-info'>
          <Lightbulb aria-hidden='true' className='mt-0.5 size-3.5 shrink-0' />
          <span>
            <span className='font-bold'>{t('budgetPlan.negotiation.hint')}: </span>
            {financeDemoText(item.hint)}
          </span>
        </p>
      )}

      {readOnly ? (
        <div className='mt-3 divide-y divide-border border-t border-border'>
          <InfoRow label={t('budgetPlan.negotiation.financeProposed')} value={formatCurrency(financeAmount(item))} />
          {item.finance?.reason && <InfoRow label={t('budgetPlan.negotiation.reason')} value={financeDemoText(item.finance.reason)} />}
        </div>
      ) : (
        <div className='mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-[12rem_minmax(0,1fr)]'>
          <div className='space-y-1'>
            <label className='text-xs font-bold' htmlFor={`${fieldId}-amount`}>
              {t('budgetPlan.negotiation.amountLabel', { software: item.software })}
            </label>
            <input
              aria-invalid={error === 'amount'}
              className={inputClassName}
              id={`${fieldId}-amount`}
              inputMode='numeric'
              min={0}
              onChange={(event) => {
                setAmount(event.target.value)
                setSaved(false)
              }}
              type='number'
              value={amount}
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-bold' htmlFor={`${fieldId}-reason`}>
              {t('budgetPlan.negotiation.reasonLabel', { software: item.software })}
            </label>
            <input
              aria-invalid={error === 'reason'}
              className={inputClassName}
              id={`${fieldId}-reason`}
              onChange={(event) => {
                setReason(event.target.value)
                setSaved(false)
              }}
              value={financeDemoText(reason)}
            />
          </div>
          <div className='flex flex-wrap items-center gap-3 sm:col-span-2'>
            <button
              aria-label={t('budgetPlan.negotiation.saveLineFor', { software: item.software })}
              className={secondaryButtonClassName}
              onClick={save}
              type='button'
            >
              {t('budgetPlan.negotiation.saveLine')}
            </button>
            {error && (
              <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                {error === 'amount'
                  ? t('budgetPlan.negotiation.amountInvalid')
                  : t('budgetPlan.negotiation.reasonRequired')}
              </p>
            )}
            {saved && !error && (
              <span className='inline-flex items-center gap-1 text-xs font-semibold text-success'>
                <CheckCircle2 aria-hidden='true' className='size-3.5' />
                {t('budgetPlan.negotiation.saved')}
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
