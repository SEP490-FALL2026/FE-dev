import {
  AlertTriangle,
  Clock,
  Layers,
  Lock,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Wallet,
  type LucideIcon
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { formatMoney } from '../../shared/finance-money'
import type { BudgetSummaryTotalsItem } from '../../shared/finance-api-extensions'

const tones = {
  budget: 'bg-primary-soft text-primary-ink',
  base: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  reserve: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  spent: 'bg-info/10 text-info-ink',
  held: 'bg-warning/15 text-warning-ink',
  remaining: 'bg-success/10 text-success-ink',
  danger: 'bg-danger/10 text-danger'
} as const

function KpiCard({
  label,
  value,
  caption,
  icon: Icon,
  tone,
  badge
}: {
  label: string
  value: ReactNode
  caption: ReactNode
  icon: LucideIcon
  tone: keyof typeof tones
  badge?: ReactNode
}) {
  return (
    <div className='flex min-w-0 flex-col gap-3 rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-all'>
      <div className='flex items-start justify-between gap-3'>
        <dt className='truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{label}</dt>
        <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className='size-4' strokeWidth={1.5} />
        </span>
      </div>
      <div className='space-y-1'>
        <div className='flex items-baseline justify-between gap-2'>
          <dd className='min-w-0 font-mono text-xl leading-tight font-bold tracking-tight tabular-nums [overflow-wrap:anywhere]'>
            {value}
          </dd>
          {badge}
        </div>
        <dd className='text-xs text-muted-foreground [text-wrap:pretty]'>{caption}</dd>
      </div>
    </div>
  )
}

export function CostCenterKpis({
  totals,
  lastInvoiceRecordedAt,
  activeCenters
}: {
  totals: BudgetSummaryTotalsItem | null
  lastInvoiceRecordedAt?: string | null
  activeCenters?: number
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  if (!totals) {
    return null
  }

  const lang = i18n.language
  const full = (value: { amount: string; currency: string }) => formatMoney(value, lang)

  const overBudget = totals.overBudgetCount > 0
  const remainingTone = Number(totals.remaining.amount) < 0 ? 'danger' : 'remaining'

  return (
    <dl className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      <KpiCard
        label={translate('kpis.total')}
        value={full(totals.total)}
        caption={translate('kpis.totalCaption', {
          budgeted: totals.costCenterCount,
          total: activeCenters ?? totals.costCenterCount
        })}
        icon={Wallet}
        tone='budget'
      />
      <KpiCard
        label={translate('kpis.base')}
        value={full(totals.base)}
        caption={translate('kpis.baseCaption')}
        icon={Layers}
        tone='base'
      />
      <KpiCard
        label={translate('kpis.reserve')}
        value={full(totals.reserve)}
        caption={translate('kpis.reserveCaption')}
        icon={ShieldCheck}
        tone='reserve'
      />
      <KpiCard
        label={translate('kpis.held')}
        value={full(totals.committed)}
        caption={translate('kpis.heldCaption')}
        icon={Lock}
        tone='held'
      />
      <KpiCard
        label={translate('kpis.spent')}
        value={full(totals.spent)}
        caption={
          lastInvoiceRecordedAt ? (
            <span className='flex items-center gap-1'>
              <Clock className='size-3 shrink-0' />
              {translateFinance('lastInvoiceAt', {
                time: new Date(lastInvoiceRecordedAt).toLocaleDateString(lang)
              })}
            </span>
          ) : (
            translate('kpis.spentCaption')
          )
        }
        icon={ReceiptText}
        tone='spent'
      />
      <KpiCard
        label={translate('kpis.remaining')}
        value={full(totals.remaining)}
        caption={
          overBudget ? (
            <span className='font-medium text-danger flex items-center gap-1'>
              <AlertTriangle className='size-3 shrink-0' />
              {translateFinance('overBudgetWarning', { count: totals.overBudgetCount })}
            </span>
          ) : (
            translate('kpis.remainingCaption')
          )
        }
        icon={overBudget ? AlertTriangle : PiggyBank}
        tone={remainingTone}
        badge={
          overBudget ? (
            <span className='inline-flex items-center rounded-full bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold text-danger'>
              {totals.overBudgetCount}
            </span>
          ) : undefined
        }
      />
    </dl>
  )
}
