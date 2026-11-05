import { useTranslation } from 'react-i18next'
import { FinanceSection } from '../../shared/components/finance-ui'
import { useOverviewAnalytics } from '../hooks/use-overview-analytics'
import {
  budgetTotals,
  commitmentsByMonth,
  costCenterRows,
  plannedQuarters,
  sumPeriod,
  type OverviewPeriod
} from '../overview-analytics'
import { useOverviewMoney } from '../use-overview-money'
import {
  BudgetShareChart,
  BudgetShareTable,
  CostCenterBudgetChart,
  CostCenterBudgetTable
} from './overview-budget-charts'
import { OverviewChartCard } from './overview-chart-card'
import { OverviewKpis } from './overview-kpis'
import {
  CommitmentMonthChart,
  CommitmentMonthTable,
  PlannedQuarterChart,
  PlannedQuarterTable
} from './overview-time-charts'

export function usePeriodLabel(period: OverviewPeriod) {
  const { t: translate } = useTranslation('finance')
  if (period.mode === 'quarter')
    return translate('analytics.periodLabel.quarter', { quarter: period.quarter, year: period.year })
  if (period.mode === 'month')
    return translate('analytics.periodLabel.month', { month: period.month, year: period.year })
  return translate('analytics.periodLabel.year', { year: period.year })
}

export function OverviewAnalyticsSection({ period }: { period: OverviewPeriod }) {
  const { t: translate } = useTranslation('finance')
  const { budgets, budgetRows, budgetsTruncated, commitments, versions } = useOverviewAnalytics(period.year)
  const totals = budgetTotals(budgetRows)
  const money = useOverviewMoney(totals.currency)
  const rows = costCenterRows(budgetRows)
  const months = commitmentsByMonth(commitments.data?.items ?? [], period)
  const inPeriod = sumPeriod(months)
  const quarters = plannedQuarters(versions.splits, period)
  const periodLabel = usePeriodLabel(period)
  const yearScope = translate('analytics.scope.year', { year: period.year })
  const hasQuarterPlan = quarters.points.some((point) => point.amount > 0)
  return (
    <FinanceSection title={translate('analytics.title')}>
      <OverviewKpis
        query={budgets}
        totals={totals}
        money={money}
        periodLabel={periodLabel}
        periodCommitments={inPeriod}
        commitmentsPending={commitments.isPending}
      />
      <div className='grid gap-4 xl:grid-cols-5'>
        <OverviewChartCard
          className='xl:col-span-3'
          title={translate('analytics.charts.costCenters')}
          scope={yearScope}
          query={budgets}
          empty={!rows.length}
          emptyMessage={translate('analytics.empty.budgets', { year: period.year })}
          chart={<CostCenterBudgetChart rows={rows} money={money} />}
          table={<CostCenterBudgetTable rows={rows} money={money} />}
          footer={budgetsTruncated ? translate('analytics.truncated') : undefined}
        />
        <OverviewChartCard
          className='xl:col-span-2'
          title={translate('analytics.charts.share')}
          scope={yearScope}
          query={budgets}
          empty={totals.total <= 0}
          emptyMessage={translate('analytics.empty.budgets', { year: period.year })}
          chart={<BudgetShareChart rows={rows} money={money} />}
          table={<BudgetShareTable rows={rows} money={money} />}
        />
        <OverviewChartCard
          className='xl:col-span-3'
          title={translate('analytics.charts.commitments')}
          scope={translate('analytics.scope.highlight', { period: periodLabel })}
          query={commitments}
          empty={!commitments.data?.items.length}
          emptyMessage={translate('analytics.empty.commitments', { year: period.year })}
          chart={<CommitmentMonthChart points={months} money={money} />}
          table={<CommitmentMonthTable points={months} money={money} />}
          footer={
            commitments.data?.truncated ? translate('analytics.truncated') : translate('analytics.commitmentNote')
          }
        />
        <OverviewChartCard
          className='xl:col-span-2'
          title={translate('analytics.charts.quarters')}
          scope={translate('analytics.scope.highlight', { period: periodLabel })}
          query={versions}
          empty={!hasQuarterPlan}
          emptyMessage={translate('analytics.empty.quarters')}
          chart={<PlannedQuarterChart points={quarters.points} money={money} />}
          table={<PlannedQuarterTable points={quarters.points} money={money} />}
          footer={
            hasQuarterPlan && quarters.withoutSplit
              ? translate('analytics.withoutSplit', { count: quarters.withoutSplit })
              : undefined
          }
        />
      </div>
    </FinanceSection>
  )
}
