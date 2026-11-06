import { Landmark, Lock, PiggyBank, ReceiptText, ShieldPlus, Wallet, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { BudgetSummaryResponseDtoDataTotals } from '~/shared/api/generated/model/budgets/budgetSummaryResponseDtoDataTotals'
import { amountOf } from '../budget-usage'

type CurrencyTotals = BudgetSummaryResponseDtoDataTotals[string]

/** Icon tiles reuse the semantic tokens of the palette. */
const tones = {
  primary: 'bg-primary-soft text-primary-ink',
  info: 'bg-info/10 text-info-ink',
  warning: 'bg-warning/15 text-warning-ink',
  success: 'bg-success/10 text-success-ink',
  danger: 'bg-danger/10 text-danger-ink',
  neutral: 'bg-surface-subtle text-muted-foreground'
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

/** Year totals of every department budget, one block per reporting currency (usually one). */
export function CostCenterKpis({ totals }: { totals: CurrencyTotals }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const compact = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: totals.currency,
    notation: 'compact',
    maximumFractionDigits: 1
  })
  const money = (value: { amount: string }) => compact.format(amountOf(value))
  const overBudget = totals.overBudgetCount > 0
  return (
    <dl className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      <KpiCard
        label={translate('kpis.total')}
        value={money(totals.total)}
        caption={translate('kpis.totalCaption', { count: totals.costCenterCount })}
        icon={Wallet}
        tone='primary'
      />
      <KpiCard
        label={translate('kpis.base')}
        value={money(totals.base)}
        caption={translate('kpis.baseCaption')}
        icon={Landmark}
        tone='neutral'
      />
      <KpiCard
        label={translate('kpis.reserve')}
        value={money(totals.reserve)}
        caption={translate('kpis.reserveCaption')}
        icon={ShieldPlus}
        tone='info'
      />
      <KpiCard
        label={translate('kpis.held')}
        value={money(totals.committed)}
        caption={translate('kpis.heldCaption')}
        icon={Lock}
        tone='warning'
      />
      <KpiCard
        label={translate('kpis.spent')}
        value={money(totals.spent)}
        caption={translate('kpis.spentCaption')}
        icon={ReceiptText}
        tone='info'
      />
      <KpiCard
        label={translate('kpis.remaining')}
        value={money(totals.remaining)}
        caption={
          overBudget
            ? translate('kpis.overBudget', { count: totals.overBudgetCount })
            : translate('kpis.remainingCaption')
        }
        icon={PiggyBank}
        tone={overBudget ? 'danger' : 'success'}
      />
    </dl>
  )
}
