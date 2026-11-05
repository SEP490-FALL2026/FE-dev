import { useTranslation } from 'react-i18next'

const amountOf = (value: { amount: string }) => {
  const parsed = Number(value.amount)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Committed share of a budget as a bar plus percent; over-commitment switches to the danger tone and says so. */
export function BudgetUtilization({
  total,
  committed,
  overCommitted
}: {
  total: { amount: string }
  committed: { amount: string }
  overCommitted: boolean
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const budget = amountOf(total)
  const ratio = budget > 0 ? amountOf(committed) / budget : 0
  const percent = new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 0 }).format(ratio)
  return (
    <div className='flex min-w-36 items-center justify-end gap-2'>
      <div aria-hidden className='h-1.5 w-20 overflow-hidden rounded-sm bg-surface-subtle'>
        <div
          className={`h-full rounded-sm ${overCommitted ? 'bg-danger' : ratio >= 0.85 ? 'bg-warning' : 'bg-primary'}`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
      <span className={`w-12 text-right ${overCommitted ? 'font-semibold text-danger-ink' : ''}`}>{percent}</span>
      {overCommitted && <span className='sr-only'>{translate('fields.overCommitted')}</span>}
    </div>
  )
}
