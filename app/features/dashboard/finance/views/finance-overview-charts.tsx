import { CalendarRange } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getRemaining } from '../../budget-figures'
import { FilterChips, Panel, PanelTitle, compactSelectClassName, useDashboardFormat } from '../../dashboard-ui'
import {
  ChartLegend,
  DonutChart,
  DonutLegendTable,
  GroupedColumnChart,
  StackedBudgetBarChart,
  type ChartSeries,
  type DonutSlice
} from '../finance-charts'
import { defaultPeriod, getPeriodFigures, periodOptions, type Granularity } from '../finance-period-figures'

/** Cost Center identity colors: fixed slot order, the Unallocated report line stays neutral. */
const costCenterColors: Record<string, string> = {
  'CC-COMPANY': 'var(--chart-6)',
  'CC-DES': 'var(--chart-2)',
  'CC-ENG': 'var(--chart-1)',
  'CC-MKT': 'var(--chart-4)',
  'CC-OPS': 'var(--chart-3)',
  'CC-SAL': 'var(--chart-5)'
}

export function FinanceOverviewCharts({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatCompact, formatMonthYear, formatPercent, formatPeriod } = useDashboardFormat()
  const [granularity, setGranularity] = useState<Granularity>('quarter')
  const [period, setPeriod] = useState(defaultPeriod.quarter)

  const periodLabel = (value: string) =>
    granularity === 'month'
      ? formatMonthYear(`${value}-01`)
      : granularity === 'year'
        ? t('finance.charts.filter.yearValue', { year: value })
        : formatPeriod(value)
  const label = periodLabel(period)

  const changeGranularity = (value: Granularity) => {
    setGranularity(value)
    setPeriod(defaultPeriod[value])
  }

  const { lines, structure } = getPeriodFigures(granularity, period)
  const costCenterLines = lines.filter((line) => line.costCenter !== null)

  const usageSeries: ChartSeries[] = [
    { color: 'var(--chart-1)', key: 'actual', label: t('budget.actual') },
    { color: 'var(--chart-2)', key: 'held', label: t('budget.held') },
    { color: 'var(--chart-track)', key: 'remaining', label: t('budget.remaining') }
  ]
  const usageData = costCenterLines.map((line) => ({
    actual: line.actual,
    held: line.held,
    name: line.costCenter ?? '',
    remaining: Math.max(0, getRemaining(line) ?? 0)
  }))

  const spendSlices: DonutSlice[] = lines.map((line) => ({
    color: line.costCenter ? costCenterColors[line.costCenter] : 'var(--chart-neutral)',
    key: line.costCenter ?? 'unallocated',
    label: line.costCenter ?? t('finance.analysis.unallocated'),
    value: line.actual
  }))
  const spendTotal = spendSlices.reduce((sum, slice) => sum + slice.value, 0)

  const bvaSeries: ChartSeries[] = [
    { color: 'var(--chart-neutral)', key: 'budget', label: t('budget.budget') },
    { color: 'var(--chart-1)', key: 'actual', label: t('budget.actual') }
  ]
  const bvaData = costCenterLines.map((line) => ({
    actual: line.actual,
    budget: line.budget ?? 0,
    name: line.costCenter ?? ''
  }))

  const structureSlices: DonutSlice[] = (
    [
      ['personalSeats', 'var(--chart-1)'],
      ['sharedByRatio', 'var(--chart-2)'],
      ['sharedAccounts', 'var(--chart-3)'],
      ['internal', 'var(--chart-4)']
    ] as const
  ).map(([key, color]) => ({ color, key, label: t(`finance.analysis.${key}`), value: Math.round(structure[key]) }))
  const structureTotal = structureSlices.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <section aria-label={t('finance.charts.regionLabel')} className='space-y-4'>
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

      <div className='grid gap-6 xl:grid-cols-2'>
        <Panel>
          <PanelTitle
            action={<ChartLegend series={usageSeries} />}
            hint={t('finance.charts.usage.hint')}
            title={t('finance.charts.usage.title', { period: label })}
          />
          <div className='mt-4'>
            <StackedBudgetBarChart
              data={usageData}
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              label={t('finance.charts.usage.title', { period: label })}
              series={usageSeries}
            />
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            hint={t('finance.charts.share.hint')}
            title={t('finance.charts.share.title', { period: label })}
          />
          <div className='mt-4 grid items-center gap-4 sm:grid-cols-[0.9fr_1.1fr]'>
            <DonutChart
              centerLabel={t('finance.analysis.total')}
              centerValue={formatCompact(spendTotal)}
              data={spendSlices}
              formatCurrency={formatCurrency}
              label={t('finance.charts.share.title', { period: label })}
            />
            <DonutLegendTable
              data={spendSlices}
              formatCurrency={formatCurrency}
              formatPercent={formatPercent}
              nameLabel={t('budget.costCenter')}
              shareLabel={t('finance.charts.shareColumn')}
              valueLabel={t('budget.actual')}
            />
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            action={<ChartLegend series={bvaSeries} />}
            hint={t('finance.charts.bva.hint')}
            title={t('finance.charts.bva.title', { period: label })}
          />
          <div className='mt-4'>
            <GroupedColumnChart
              data={bvaData}
              formatCompact={formatCompact}
              formatCurrency={formatCurrency}
              label={t('finance.charts.bva.title', { period: label })}
              series={bvaSeries}
            />
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            hint={t('finance.charts.structure.hint')}
            title={t('finance.charts.structure.title', { period: label })}
          />
          <div className='mt-4 grid items-center gap-4 sm:grid-cols-[0.9fr_1.1fr]'>
            <DonutChart
              centerLabel={t('finance.analysis.total')}
              centerValue={formatCompact(structureTotal)}
              data={structureSlices}
              formatCurrency={formatCurrency}
              label={t('finance.charts.structure.title', { period: label })}
            />
            <DonutLegendTable
              data={structureSlices}
              formatCurrency={formatCurrency}
              formatPercent={formatPercent}
              nameLabel={t('finance.charts.structure.basis')}
              shareLabel={t('finance.charts.shareColumn')}
              valueLabel={t('budget.actual')}
            />
          </div>
        </Panel>
      </div>
    </section>
  )
}
