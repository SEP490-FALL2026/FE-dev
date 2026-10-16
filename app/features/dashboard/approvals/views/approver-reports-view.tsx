import { Gauge, Sparkles, Timer } from 'lucide-react'
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

export function ApproverReportsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatNumber, formatPercent } = useDashboardFormat()
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

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('approvals.reports.subtitle', { period: formatPeriod(report.period) })}
        title={t('approvals.reports.title')}
      />

      <section aria-label={t('approvals.reports.savingsLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
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
        <StatTile
          hint={t('approvals.reports.reclaimedHint')}
          icon={Gauge}
          label={t('approvals.reports.reclaimedSeats')}
          tone='neutral'
          value={formatNumber(report.savings.reclaimedSeats)}
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
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {usageIndicators.map((indicator) => (
              <div
                className={`rounded-xl border p-3 ${indicator.key === 'kpi3' ? 'border-primary bg-primary-soft/30' : 'border-border'}`}
                key={indicator.key}
              >
                <p className='text-[0.7rem] font-bold text-muted-foreground'>
                  {t(`approvals.reports.usage.${indicator.key}`)}
                </p>
                <p className='mt-1 text-xl font-extrabold'>{formatPercent(indicator.value)}</p>
              </div>
            ))}
          </div>
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
          <ul className='mt-4 divide-y divide-border text-xs'>
            {report.stepDays.map((step) => (
              <li className='flex justify-between py-2' key={step.key}>
                <span className='flex items-center gap-1.5 text-muted-foreground'>
                  <Timer aria-hidden='true' className='size-3.5' />
                  {t(`approvals.reports.step.${step.key}`)}
                </span>
                <span className='font-bold'>{t('approvals.reports.days', { value: formatNumber(step.value) })}</span>
              </li>
            ))}
            <li className='flex justify-between py-2'>
              <span className='text-muted-foreground'>{t('approvals.reports.financeResponse')}</span>
              <span className='font-bold'>
                {t('approvals.reports.days', { value: formatNumber(report.financeResponseDays) })}
              </span>
            </li>
            <li className='flex justify-between py-2'>
              <span className='text-muted-foreground'>{t('approvals.reports.financeRecording')}</span>
              <span className='font-bold'>
                {t('approvals.reports.days', { value: formatNumber(report.financeRecordingDays) })}
              </span>
            </li>
            <li className='flex justify-between py-2'>
              <span className='text-muted-foreground'>{t('approvals.reports.myOverdue')}</span>
              <span className='font-bold text-warning'>{formatPercent(report.myOverdueRate)}</span>
            </li>
          </ul>

          <p className='mt-4 text-xs font-bold'>{t('approvals.reports.branchATitle')}</p>
          <ul className='mt-2 space-y-1.5 text-xs'>
            {report.branchASeats.map((row) => (
              <li className='flex justify-between gap-2' key={row.app}>
                <span className='text-muted-foreground'>
                  {row.app} · <span className='font-mono'>{row.costCenter}</span>
                </span>
                <span className='font-bold'>{t('approvals.reports.seats', { count: row.seats })}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
