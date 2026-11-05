import { LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceQueryState } from '../../shared/components/finance-ui'
import type { BudgetTotals } from '../overview-analytics'
import type { OverviewMoney } from '../use-overview-money'

type QueryLike = Parameters<typeof FinanceQueryState>[0]['query']

function KpiTile({
  label,
  value,
  caption,
  ratio,
  tone = 'primary'
}: {
  label: string
  value: ReactNode
  caption: ReactNode
  ratio?: number
  tone?: 'primary' | 'danger'
}) {
  return (
    <div className='flex min-w-0 flex-col gap-2 bg-surface p-4 sm:p-5'>
      <dt className='text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>{label}</dt>
      <dd className='truncate font-mono text-2xl leading-none font-semibold tracking-tight tabular-nums'>{value}</dd>
      {ratio !== undefined && (
        <div aria-hidden className='h-1.5 w-full overflow-hidden rounded-sm bg-surface-subtle'>
          <div
            className={`h-full rounded-sm ${tone === 'danger' ? 'bg-danger' : 'bg-primary'}`}
            style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%` }}
          />
        </div>
      )}
      <dd className='text-xs text-muted-foreground'>{caption}</dd>
    </div>
  )
}

export function OverviewKpis({
  query,
  totals,
  money,
  periodLabel,
  periodCommitments,
  commitmentsPending
}: {
  query: QueryLike
  totals: BudgetTotals
  money: OverviewMoney
  periodLabel: string
  periodCommitments: { amount: number; count: number }
  commitmentsPending: boolean
}) {
  const { t: translate, i18n } = useTranslation('finance')
  const percent = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 1 }).format(value)
  const ratio = (value: number) => (totals.total > 0 ? value / totals.total : 0)
  return (
    <FinanceQueryState query={query}>
      <dl className='grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 sm:grid-cols-2 xl:grid-cols-4'>
        <KpiTile
          label={translate('analytics.kpis.total')}
          value={money.full(totals.total)}
          caption={translate('analytics.kpis.remaining', { value: money.full(totals.remaining) })}
        />
        <KpiTile
          label={translate('analytics.kpis.committed')}
          value={money.full(totals.committed)}
          ratio={ratio(totals.committed)}
          tone={totals.overCommittedCount ? 'danger' : 'primary'}
          caption={
            totals.overCommittedCount
              ? translate('analytics.kpis.overCommitted', { count: totals.overCommittedCount })
              : translate('analytics.kpis.ofBudget', { value: percent(ratio(totals.committed)) })
          }
        />
        <KpiTile
          label={translate('analytics.kpis.spent')}
          value={money.full(totals.spent)}
          ratio={ratio(totals.spent)}
          caption={translate('analytics.kpis.ofBudget', { value: percent(ratio(totals.spent)) })}
        />
        <KpiTile
          label={translate('analytics.kpis.period', { period: periodLabel })}
          value={
            commitmentsPending ? (
              <LoaderCircle aria-label={translate('loading')} className='size-5 animate-spin' strokeWidth={1.5} />
            ) : (
              money.full(periodCommitments.amount)
            )
          }
          caption={translate('analytics.kpis.periodCount', { count: periodCommitments.count })}
        />
      </dl>
    </FinanceQueryState>
  )
}
