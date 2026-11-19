import { useTranslation } from 'react-i18next'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsEmpty } from '../../shared/components/approvals-ui'
import {
  VERSION_STATE_ORDER,
  amountRows,
  approvedVersions,
  totalsByCurrency,
  versionStateCounts
} from '../approvals-insights'
import { useYearBudgetVersions } from '../hooks/use-approvals-insights'
import { AmountBarChart, AmountTable } from './amount-bar-chart'
import { InsightCard } from './insight-card'
import { StatusDonut, type DonutTone } from './status-donut'

/** One distinct hue per state, so the four parts of the donut never share a colour. */
const VERSION_TONE: Record<(typeof VERSION_STATE_ORDER)[number], DonutTone> = {
  SENT: 'info',
  CHANGES_REQUESTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger'
}

/** Annual budget of one year: approved totals per Cost Center and where every version stands. */
export function BudgetInsights({ year, onOpenBudgets }: { year: number; onOpenBudgets: () => void }) {
  const { t: translate } = useTranslation('approvalsNeed')
  const { t: translateStatus } = useTranslation('approvals')
  const query = useYearBudgetVersions(year)
  const versions = query.data?.items ?? []
  const approved = approvedVersions(versions)
  const totals = totalsByCurrency(approved.map((version) => version.total))
  const currency = totals[0]?.currency
  const rows = currency
    ? amountRows(
        approved.map((version) => ({
          key: version.costCenter.id,
          label: version.costCenter.code,
          money: version.total
        })),
        currency,
        translate('insights.other')
      )
    : []
  const versionSegments = versionStateCounts(versions).map((entry) => ({
    key: entry.state,
    label: translateStatus(`status.${entry.state}`, { defaultValue: translateStatus('unknown') }),
    count: entry.count,
    tone: VERSION_TONE[entry.state]
  }))
  const partial =
    query.data && !query.data.complete
      ? translate('insights.partial', { loaded: versions.length, total: query.data.totalItems })
      : undefined
  return (
    <div className='grid gap-4 lg:grid-cols-5'>
      <InsightCard
        className='lg:col-span-3'
        title={translate('insights.budgetTitle', { year })}
        scope={currency ? translate('insights.budgetScope', { currency }) : undefined}
        footer={partial ?? (totals.length > 1 ? translate('insights.otherCurrencies') : undefined)}
        chart={
          currency && rows.length ? (
            <AmountBarChart rows={rows} currency={currency} label={translate('insights.budgetTitle', { year })} />
          ) : undefined
        }
        table={
          currency && rows.length ? (
            <AmountTable rows={rows} currency={currency} firstColumn={translate('insights.columns.costCenter')} />
          ) : undefined
        }
      >
        {query.isPending || query.isError ? (
          <ApprovalsQueryState query={query}>{null}</ApprovalsQueryState>
        ) : rows.length === 0 ? (
          <ApprovalsEmpty message={translate('insights.noApprovedBudget', { year })} />
        ) : undefined}
      </InsightCard>
      <InsightCard className='lg:col-span-2' title={translate('insights.versionStates', { year })}>
        <ApprovalsQueryState query={query}>
          {versionSegments.some((segment) => segment.count > 0) ? (
            <StatusDonut
              segments={versionSegments}
              label={translate('insights.versionStates', { year })}
              totalLabel={translate('insights.totalVersions')}
            />
          ) : (
            <ApprovalsEmpty message={translate('insights.noVersions', { year })} />
          )}
          <button
            type='button'
            onClick={onOpenBudgets}
            className='mt-1 min-h-11 text-left text-xs text-primary-ink underline-offset-4 hover:underline md:min-h-8'
          >
            {translate('overview.openBudgets')}
          </button>
        </ApprovalsQueryState>
      </InsightCard>
    </div>
  )
}
