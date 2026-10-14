import { CalendarRange, Gauge, Sparkles, Timer } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  FilterChips,
  PageHeader,
  Panel,
  PanelTitle,
  StatTile,
  compactSelectClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { defaultPeriod, getPeriodFigures, periodOptions, type Granularity } from '../../finance/finance-period-figures'
import { approverReport } from '../approvals-data'
import { ApproverSpendChart } from './approver-spend-chart'

export function ApproverReportsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatMonthYear, formatNumber, formatPercent, formatPeriod } = useDashboardFormat()
  const report = approverReport
  const usage = report.usage
  const [granularity, setGranularity] = useState<Granularity>('quarter')
  const [period, setPeriod] = useState(report.period)

  const usageIndicators = [
    { key: 'kpi3', value: usage.active / usage.purchased },
    { key: 'coverage', value: usage.evaluated / usage.purchased },
    { key: 'activeInEvaluated', value: usage.active / usage.evaluated }
  ] as const

  const periodLabel = (value: string) =>
    granularity === 'month'
      ? formatMonthYear(`${value}-01`)
      : granularity === 'year'
        ? t('finance.charts.filter.yearValue', { year: value })
        : formatPeriod(value)

  const changeGranularity = (value: Granularity) => {
    setGranularity(value)
    setPeriod(value === 'quarter' ? report.period : defaultPeriod[value])
  }

  const { lines } = getPeriodFigures(granularity, period)
  const costCenters = lines.flatMap((line) =>
    line.costCenter !== null && line.budget !== null
      ? [{ budget: line.budget, code: line.costCenter, spend: line.actual }]
      : []
  )
  const unallocated = lines.find((line) => line.costCenter === null)?.actual ?? 0

  const spendTitle = t('approvals.reports.spendTitle', {
    budget: formatCurrency(costCenters.reduce((sum, cc) => sum + cc.budget, 0)),
    spend: formatCurrency(lines.reduce((sum, line) => sum + line.actual, 0))
  })
  const spendLegend = [
    { color: 'var(--theme-primary)', key: 'actual', label: t('budget.actual') },
    { color: 'var(--theme-warning)', key: 'nearLimit', label: t('approvals.reports.spendChart.nearLimit') },
    { color: 'var(--chart-track)', key: 'remaining', label: t('budget.remaining') },
    { color: 'var(--chart-neutral)', key: 'unallocated', label: t('finance.analysis.unallocated') }
  ]

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-15 · FR-5.9 → FR-5.11'
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

      <div className='flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm'>
        <span className='flex items-center gap-1.5 text-xs font-bold text-foreground'>
          <CalendarRange aria-hidden='true' className='size-4 text-primary' />
          {t('finance.charts.filter.title')}
        </span>
        <FilterChips<Granularity>
          label={t('finance.charts.filter.granularityLabel')}
          onChange={changeGranularity}
          options={[
            { label: t('finance.charts.filter.month'), value: 'month' },
            { label: t('finance.charts.filter.quarter'), value: 'quarter' },
            { label: t('finance.charts.filter.year'), value: 'year' }
          ]}
          value={granularity}
        />
        <select
          aria-label={t('finance.charts.filter.periodLabel')}
          className={compactSelectClassName}
          onChange={(event) => setPeriod(event.target.value)}
          value={period}
        >
          {periodOptions[granularity].map((option) => (
            <option key={option} value={option}>
              {periodLabel(option)}
            </option>
          ))}
        </select>
        {granularity !== 'quarter' && (
          <span className='text-[0.7rem] text-muted-foreground'>{t(`finance.charts.filter.note.${granularity}`)}</span>
        )}
      </div>

      <Panel>
        <PanelTitle hint={t('approvals.reports.spendHint')} title={spendTitle} />
        <ul className='mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground'>
          {spendLegend.map((item) => (
            <li className='flex items-center gap-1.5' key={item.key}>
              <span className='size-2.5 rounded-sm' style={{ backgroundColor: item.color }} />
              {item.label}
            </li>
          ))}
        </ul>
        <div className='mt-4'>
          <ApproverSpendChart
            costCenters={costCenters}
            formatCurrency={formatCurrency}
            label={spendTitle}
            unallocated={unallocated}
          />
        </div>
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
