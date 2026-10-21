import { ChevronDown, CircleDollarSign, Sparkles, Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFormatPeriod } from '../../budget-figures'
import { PageHeader, Panel, PanelTitle, StatTile, useDashboardFormat } from '../../dashboard-ui'
import { sumPeriod } from '../../finance/budget-periods'
import { currentBudgetLines, monthlyBudgetLines } from '../../finance/finance-data'
import { BudgetPeriodFilter, useBudgetPeriod } from '../../finance/views/budget-period-filter'
import { approverReport } from '../approvals-data'
import { ApproverSpendChart, type CostCenterSpend } from './approver-spend-chart'

/** The report period (`Q3-2026`) already uses the period filter's quarter key format. */
const reportedQuarterKey = approverReport.period

/**
 * The approver's report: three headline figures, spend per Cost Center for the chosen period, then compact
 * usage and process summaries. Rarely needed detail (seats granted without the spend step) stays collapsed.
 */
export function ApproverReportsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatCompactCurrency, formatNumber, formatPercent } = useDashboardFormat()
  const report = approverReport
  const usage = report.usage

  // The report opens on its own closed quarter; the filter re-reads the same monthly figures Finance uses.
  const periodState = useBudgetPeriod('QUARTER', reportedQuarterKey)
  const chartPeriodLabel = periodState.periodLabel(periodState.period)
  const spendRows: CostCenterSpend[] = currentBudgetLines.map(({ costCenter }) => {
    const figures = sumPeriod(monthlyBudgetLines, costCenter, periodState.period.months)
    return { budget: figures.budget, code: costCenter, spend: figures.actual }
  })
  // The unallocated line is only known for the reported quarter; it still counts in that period's total spend.
  const showUnallocated = periodState.period.key === reportedQuarterKey
  const totalSpend = spendRows.reduce((sum, row) => sum + row.spend, 0) + (showUnallocated ? report.unallocated : 0)
  const totalBudget = spendRows.reduce((sum, row) => sum + (row.budget ?? 0), 0)

  const usageIndicators = [
    { key: 'kpi3', value: usage.active / usage.purchased },
    { key: 'coverage', value: usage.evaluated / usage.purchased },
    { key: 'activeInEvaluated', value: usage.active / usage.evaluated }
  ] as const
  const longestStep = Math.max(...report.stepDays.map((step) => step.value))

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('approvals.reports.subtitle', { period: formatPeriod(report.period) })}
        title={t('approvals.reports.title')}
      />

      <section aria-label={t('approvals.reports.savingsLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('approvals.reports.ofBudget', {
            budget: formatCompactCurrency(report.totalBudget),
            share: formatPercent(report.totalSpend / report.totalBudget)
          })}
          icon={CircleDollarSign}
          label={t('approvals.reports.totalSpend', { period: formatPeriod(report.period) })}
          value={formatCurrency(report.totalSpend)}
        />
        <StatTile
          hint={t('approvals.reports.reclaimedCount', { count: report.savings.reclaimedSeats })}
          icon={Sparkles}
          label={t('finance.report.savingsImmediate')}
          tone='success'
          value={formatCurrency(report.savings.immediate)}
        />
        <StatTile
          hint={t('finance.report.savingsSeparate')}
          icon={Sparkles}
          label={t('finance.report.savingsNextRenewal')}
          tone='info'
          value={formatCurrency(report.savings.nextRenewal)}
        />
      </section>

      <BudgetPeriodFilter {...periodState} />

      <Panel>
        <PanelTitle
          hint={t('approvals.reports.spendHint')}
          title={t('approvals.reports.spendTitle', {
            budget: formatCurrency(totalBudget),
            spend: formatCurrency(totalSpend)
          })}
        />
        <ApproverSpendChart
          costCenters={spendRows}
          formatCurrency={formatCurrency}
          label={t('approvals.reports.spendChartLabel', { period: chartPeriodLabel })}
        />
        {showUnallocated && (
          <p className='mt-3 flex justify-between gap-2 border-t border-dashed border-warning/50 pt-3 text-xs'>
            <span className='font-bold text-warning'>{t('finance.analysis.unallocated')}</span>
            <span className='font-bold text-warning'>{formatCurrency(report.unallocated)}</span>
          </p>
        )}
      </Panel>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Panel>
          <PanelTitle hint={t('approvals.reports.usageHint')} title={t('approvals.reports.usageTitle')} />
          <ul className='mt-4 space-y-3 text-xs'>
            {usageIndicators.map((indicator) => {
              const isMain = indicator.key === 'kpi3'
              return (
                <li key={indicator.key}>
                  <div className='flex justify-between gap-3'>
                    <span className={isMain ? 'font-bold text-foreground' : 'text-muted-foreground'}>
                      {t(`approvals.reports.usage.${indicator.key}`)}
                    </span>
                    <span className='font-bold tabular-nums'>{formatPercent(indicator.value)}</span>
                  </div>
                  <div className='mt-1 h-1.5 overflow-hidden rounded-full bg-surface-subtle'>
                    <div
                      className={`h-full rounded-full ${isMain ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                      style={{ width: `${Math.min(indicator.value, 1) * 100}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <p className='mt-3 text-[0.7rem] text-muted-foreground'>
            {t('approvals.reports.usageNote', {
              active: usage.active,
              evaluated: usage.evaluated,
              purchased: usage.purchased
            })}
          </p>
        </Panel>

        <Panel>
          <PanelTitle hint={t('approvals.reports.processHint')} title={t('approvals.reports.processTitle')} />
          <ul className='mt-4 space-y-2.5 text-xs'>
            {report.stepDays.map((step) => (
              <li className='grid grid-cols-[7rem_minmax(0,1fr)_3.5rem] items-center gap-3' key={step.key}>
                <span className='flex items-center gap-1.5 text-muted-foreground'>
                  <Timer aria-hidden='true' className='size-3.5 shrink-0' />
                  {t(`approvals.reports.step.${step.key}`)}
                </span>
                <span className='h-1.5 overflow-hidden rounded-full bg-surface-subtle'>
                  <span
                    className='block h-full rounded-full bg-primary'
                    style={{ width: `${(step.value / longestStep) * 100}%` }}
                  />
                </span>
                <span className='text-right font-bold tabular-nums'>
                  {t('approvals.reports.days', { value: formatNumber(step.value) })}
                </span>
              </li>
            ))}
          </ul>
          <dl className='mt-4 grid gap-2 border-t border-border pt-3 text-[0.7rem] sm:grid-cols-3'>
            <div>
              <dt className='text-muted-foreground'>{t('approvals.reports.financeResponse')}</dt>
              <dd className='font-bold'>
                {t('approvals.reports.days', { value: formatNumber(report.financeResponseDays) })}
              </dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('approvals.reports.financeRecording')}</dt>
              <dd className='font-bold'>
                {t('approvals.reports.days', { value: formatNumber(report.financeRecordingDays) })}
              </dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('approvals.reports.myOverdue')}</dt>
              <dd className='font-bold text-warning'>{formatPercent(report.myOverdueRate)}</dd>
            </div>
          </dl>

          <details className='group mt-4 rounded-xl border border-border px-3 py-2 text-xs'>
            <summary className='flex cursor-pointer list-none items-center justify-between gap-2 font-bold'>
              {t('approvals.reports.branchATitle', { count: report.branchASeats.length })}
              <ChevronDown
                aria-hidden='true'
                className='size-4 text-muted-foreground transition group-open:rotate-180'
              />
            </summary>
            <ul className='mt-2 space-y-1.5'>
              {report.branchASeats.map((row) => (
                <li className='flex justify-between gap-2' key={row.app}>
                  <span className='text-muted-foreground'>
                    {row.app} · <span className='font-mono'>{row.costCenter}</span>
                  </span>
                  <span className='font-bold'>{t('approvals.reports.seats', { count: row.seats })}</span>
                </li>
              ))}
            </ul>
          </details>
        </Panel>
      </div>
    </div>
  )
}
