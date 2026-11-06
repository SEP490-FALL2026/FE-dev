import { useTranslation } from 'react-i18next'

/** Used share of a budget as a bar plus percent; over budget switches to the danger tone and says so. */
export function BudgetUtilization({ share, overBudget }: { share: number; overBudget: boolean }) {
  const { t: translate, i18n } = useTranslation('finance')
  const percent = new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 0 }).format(share)
  return (
    <div className='flex min-w-36 items-center justify-end gap-2'>
      <div aria-hidden className='h-1.5 w-20 overflow-hidden rounded-sm bg-surface-subtle'>
        <div
          className={`h-full rounded-sm ${overBudget ? 'bg-danger' : share >= 0.85 ? 'bg-warning' : 'bg-primary'}`}
          style={{ width: `${Math.min(100, Math.max(0, share * 100))}%` }}
        />
      </div>
      <span className={`w-12 text-right ${overBudget ? 'font-semibold text-danger-ink' : ''}`}>{percent}</span>
      {overBudget && <span className='sr-only'>{translate('overBudget')}</span>}
    </div>
  )
}
