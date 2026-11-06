import { useTranslation } from 'react-i18next'

const amountOf = (value?: { amount: string }) => {
  if (!value) return 0
  const parsed = Number(value.amount)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Used share of a budget (committed + spent) as a bar plus percent; over-commitment switches to the danger tone. */
export function BudgetUtilization({
  total,
  committed,
  spent,
  overCommitted
}: {
  total: { amount: string }
  committed: { amount: string }
  spent?: { amount: string }
  overCommitted: boolean
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const budget = amountOf(total)
  const used = amountOf(committed) + amountOf(spent)
  const ratio = budget > 0 ? used / budget : 0
  const percent = new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 1 }).format(ratio)
  const isOver = overCommitted || ratio > 1

  return (
    <div className='flex min-w-36 items-center justify-end gap-2'>
      <div aria-hidden className='h-2 w-24 overflow-hidden rounded-full bg-surface-subtle border border-border/40'>
        <div
          className={`h-full rounded-full transition-all ${
            isOver ? 'bg-danger' : ratio >= 0.85 ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
      <span className={`w-14 text-right font-mono text-xs tabular-nums ${isOver ? 'font-bold text-danger' : 'font-medium'}`}>
        {percent}
      </span>
      {isOver && <span className='sr-only'>{translate('fields.overCommitted')}</span>}
    </div>
  )
}
