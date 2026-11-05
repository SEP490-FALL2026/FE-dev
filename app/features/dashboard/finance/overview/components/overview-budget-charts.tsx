import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { budgetShare, type CostCenterRow } from '../overview-analytics'
import type { OverviewMoney } from '../use-overview-money'
import { OverviewDataTable, OverviewTooltip, chartAxisTick, chartSlot, chartSlotCount } from './overview-chart-card'

const budgetSeries = ['total', 'committed', 'spent'] as const

export function CostCenterBudgetChart({ rows, money }: { rows: readonly CostCenterRow[]; money: OverviewMoney }) {
  const { t: translate } = useTranslation('finance')
  return (
    <div className='space-y-3'>
      <ul className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
        {budgetSeries.map((series, index) => (
          <li key={series} className='flex items-center gap-1.5'>
            <span aria-hidden className='size-2.5 rounded-sm' style={{ background: chartSlot(index) }} />
            {translate(`analytics.series.${series}`)}
          </li>
        ))}
      </ul>
      <div role='img' aria-label={translate('analytics.charts.costCenters')} className='h-72 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={[...rows]} barGap={2} barCategoryGap='24%' margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <CartesianGrid vertical={false} stroke='var(--theme-border)' strokeDasharray='3 3' strokeOpacity={0.6} />
            <XAxis dataKey='code' axisLine={false} tickLine={false} tick={chartAxisTick} interval={0} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={chartAxisTick}
              width={56}
              tickFormatter={(value: number) => money.compact(value)}
            />
            <Tooltip
              cursor={{ fill: 'var(--theme-surface-subtle)' }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as CostCenterRow | undefined
                if (!active || !row) return null
                return (
                  <OverviewTooltip
                    title={row.name}
                    rows={[
                      ...budgetSeries.map((series, index) => ({
                        color: chartSlot(index),
                        label: translate(`analytics.series.${series}`),
                        value: money.full(row[series])
                      })),
                      { label: translate('analytics.series.remaining'), value: money.full(row.remaining) }
                    ]}
                  />
                )
              }}
            />
            {budgetSeries.map((series, index) => (
              <Bar
                key={series}
                dataKey={series}
                name={translate(`analytics.series.${series}`)}
                fill={chartSlot(index)}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function CostCenterBudgetTable({ rows, money }: { rows: readonly CostCenterRow[]; money: OverviewMoney }) {
  const { t: translate } = useTranslation('finance')
  return (
    <OverviewDataTable
      columns={[
        { key: 'name', label: translate('analytics.columns.costCenter') },
        { key: 'total', label: translate('analytics.series.total'), numeric: true },
        { key: 'committed', label: translate('analytics.series.committed'), numeric: true },
        { key: 'spent', label: translate('analytics.series.spent'), numeric: true },
        { key: 'remaining', label: translate('analytics.series.remaining'), numeric: true }
      ]}
      rows={rows.map((row) => ({
        key: row.code,
        cells: {
          name: <span title={row.name}>{row.name}</span>,
          total: money.full(row.total),
          committed: money.full(row.committed),
          spent: money.full(row.spent),
          remaining: money.full(row.remaining)
        }
      }))}
    />
  )
}

export function BudgetShareChart({ rows, money }: { rows: readonly CostCenterRow[]; money: OverviewMoney }) {
  const { t: translate, i18n } = useTranslation('finance')
  const slices = budgetShare(rows, chartSlotCount, translate('analytics.other'))
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const percent = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 1 }).format(
      total ? value / total : 0
    )
  const [highlighted, setHighlighted] = useState<string>()
  const colorOf = (slot: number | null) => (slot === null ? 'var(--theme-muted-foreground)' : chartSlot(slot))
  return (
    <div className='grid items-center gap-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]'>
      <div role='img' aria-label={translate('analytics.charts.share')} className='relative mx-auto size-44'>
        <div className='pointer-events-none absolute inset-0 grid place-items-center text-center'>
          <div>
            <p className='text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>
              {translate('analytics.series.total')}
            </p>
            <p className='font-mono text-sm font-semibold tabular-nums'>{money.compact(total)}</p>
          </div>
        </div>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={slices}
              dataKey='value'
              nameKey='label'
              innerRadius='64%'
              outerRadius='100%'
              paddingAngle={1}
              stroke='var(--theme-surface)'
              strokeWidth={2}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell
                  key={slice.key}
                  fill={colorOf(slice.slot)}
                  fillOpacity={highlighted && highlighted !== slice.key ? 0.3 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 20, pointerEvents: 'none' }}
              content={({ active, payload }) => {
                const slice = payload?.[0]?.payload as (typeof slices)[number] | undefined
                if (!active || !slice) return null
                return (
                  <OverviewTooltip
                    title={slice.label}
                    rows={[
                      {
                        color: colorOf(slice.slot),
                        label: translate('analytics.series.total'),
                        value: money.full(slice.value)
                      },
                      { label: translate('analytics.columns.share'), value: percent(slice.value) }
                    ]}
                  />
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className='min-w-0 space-y-2'>
        {slices.map((slice) => (
          <li
            key={slice.key}
            className='-mx-1.5 flex items-center gap-2 rounded-md px-1.5 py-0.5 text-sm transition-colors duration-150 hover:bg-surface-subtle'
            onMouseEnter={() => setHighlighted(slice.key)}
            onMouseLeave={() => setHighlighted(undefined)}
          >
            <span aria-hidden className='size-2.5 shrink-0 rounded-sm' style={{ background: colorOf(slice.slot) }} />
            <span className='min-w-0 flex-1 truncate' title={slice.label}>
              {slice.label}
            </span>
            <span className='font-mono text-xs text-muted-foreground tabular-nums'>{percent(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BudgetShareTable({ rows, money }: { rows: readonly CostCenterRow[]; money: OverviewMoney }) {
  const { t: translate, i18n } = useTranslation('finance')
  const slices = budgetShare(rows, chartSlotCount, translate('analytics.other'))
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const percent = new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 1 })
  return (
    <OverviewDataTable
      columns={[
        { key: 'name', label: translate('analytics.columns.costCenter') },
        { key: 'total', label: translate('analytics.series.total'), numeric: true },
        { key: 'share', label: translate('analytics.columns.share'), numeric: true }
      ]}
      rows={slices.map((slice) => ({
        key: slice.key,
        cells: {
          name: slice.label,
          total: money.full(slice.value),
          share: percent.format(total ? slice.value / total : 0)
        }
      }))}
    />
  )
}
