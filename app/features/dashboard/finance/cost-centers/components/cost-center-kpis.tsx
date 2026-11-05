import { Lock, PiggyBank, ReceiptText, Wallet, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { BudgetTablePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetTablePageResponseDtoDataItemsItem'

const amountOf = (value: { amount: string }) => {
  const parsed = Number(value.amount)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Icon tiles reuse the semantic tokens: primary for the budget, info for spend, warning for held, success for remaining. */
const tones = {
  budget: 'bg-primary-soft text-primary-ink',
  spent: 'bg-info/10 text-info-ink',
  held: 'bg-warning/15 text-warning-ink',
  remaining: 'bg-success/10 text-success-ink'
} as const

function KpiCard({
  label,
  value,
  caption,
  icon: Icon,
  tone
}: {
  label: string
  value: ReactNode
  caption: string
  icon: LucideIcon
  tone: keyof typeof tones
}) {
  return (
    <div className='flex min-w-0 flex-col gap-4 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'>
      <div className='flex items-start justify-between gap-3'>
        <dt className='text-sm font-medium text-muted-foreground'>{label}</dt>
        <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className='size-5' strokeWidth={1.5} />
        </span>
      </div>
      <div className='space-y-1'>
        <dd className='truncate font-mono text-2xl leading-none font-semibold tracking-tight tabular-nums'>{value}</dd>
        <dd className='text-xs text-muted-foreground [text-wrap:pretty]'>{caption}</dd>
      </div>
    </div>
  )
}

/** Totals of the current budgets of a year across every cost center that has one. */
export function CostCenterKpis({
  budgets,
  activeCenters
}: {
  budgets: readonly BudgetTablePageResponseDtoDataItemsItem[]
  activeCenters: number | undefined
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const currency = budgets[0]?.total.currency
  const compact = new Intl.NumberFormat(i18n.language, {
    ...(currency ? { style: 'currency' as const, currency } : {}),
    notation: 'compact',
    maximumFractionDigits: 1
  })
  const sum = (field: 'total' | 'spent' | 'committed' | 'remaining') =>
    compact.format(budgets.reduce((total, row) => total + amountOf(row[field]), 0))
  return (
    <dl className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KpiCard
        label={translate('kpis.total')}
        value={sum('total')}
        caption={translate('kpis.totalCaption', { budgeted: budgets.length, total: activeCenters ?? '—' })}
        icon={Wallet}
        tone='budget'
      />
      <KpiCard
        label={translate('kpis.spent')}
        value={sum('spent')}
        caption={translate('kpis.spentCaption')}
        icon={ReceiptText}
        tone='spent'
      />
      <KpiCard
        label={translate('kpis.held')}
        value={sum('committed')}
        caption={translate('kpis.heldCaption')}
        icon={Lock}
        tone='held'
      />
      <KpiCard
        label={translate('kpis.remaining')}
        value={sum('remaining')}
        caption={translate('kpis.remainingCaption')}
        icon={PiggyBank}
        tone='remaining'
      />
    </dl>
  )
}
