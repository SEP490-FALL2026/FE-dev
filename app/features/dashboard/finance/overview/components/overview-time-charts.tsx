import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import type { MonthPoint, QuarterPoint } from '../overview-analytics'
import type { OverviewMoney } from '../use-overview-money'
import { OverviewDataTable, OverviewTooltip, chartAxisTick, chartSlot } from './overview-chart-card'

/** Bars outside the selected period stay visible but recede, so the period reads in context of the year. */
const outsideOpacity = 0.28

function useMonthLabel() {
  const { i18n } = useTranslation()
  const short = new Intl.DateTimeFormat(i18n.language, { month: 'short' })
  const long = new Intl.DateTimeFormat(i18n.language, { month: 'long' })
  return {
    short: (month: number) => short.format(new Date(2000, month - 1, 1)),
    long: (month: number) => long.format(new Date(2000, month - 1, 1))
  }
}

export function CommitmentMonthChart({ points, money }: { points: readonly MonthPoint[]; money: OverviewMoney }) {
  const { t: translate } = useTranslation('finance')
  const monthLabel = useMonthLabel()
  return (
    <div role='img' aria-label={translate('analytics.charts.commitments')} className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={[...points]} barCategoryGap='22%' margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <CartesianGrid vertical={false} stroke='var(--theme-border)' strokeDasharray='3 3' strokeOpacity={0.6} />
          <XAxis
            dataKey='month'
            axisLine={false}
            tickLine={false}
            tick={chartAxisTick}
            interval={0}
            tickFormatter={(month: number) => monthLabel.short(month)}
          />
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
              const point = payload?.[0]?.payload as MonthPoint | undefined
              if (!active || !point) return null
              return (
                <OverviewTooltip
                  title={monthLabel.long(point.month)}
                  rows={[
                    {
                      color: chartSlot(0),
                      label: translate('analytics.series.committedAmount'),
                      value: money.full(point.amount)
                    },
                    { label: translate('analytics.series.commitmentCount'), value: String(point.count) }
                  ]}
                />
              )
            }}
          />
          <Bar dataKey='amount' radius={[4, 4, 0, 0]} maxBarSize={32} isAnimationActive={false}>
            {points.map((point) => (
              <Cell key={point.month} fill={chartSlot(0)} fillOpacity={point.inPeriod ? 1 : outsideOpacity} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CommitmentMonthTable({ points, money }: { points: readonly MonthPoint[]; money: OverviewMoney }) {
  const { t: translate } = useTranslation('finance')
  const monthLabel = useMonthLabel()
  return (
    <OverviewDataTable
      columns={[
        { key: 'month', label: translate('analytics.columns.month') },
        { key: 'count', label: translate('analytics.series.commitmentCount'), numeric: true },
        { key: 'amount', label: translate('analytics.series.committedAmount'), numeric: true }
      ]}
      rows={points.map((point) => ({
        key: String(point.month),
        muted: !point.inPeriod,
        cells: { month: monthLabel.long(point.month), count: point.count, amount: money.full(point.amount) }
      }))}
    />
  )
}

export function PlannedQuarterChart({ points, money }: { points: readonly QuarterPoint[]; money: OverviewMoney }) {
  const { t: translate } = useTranslation('finance')
  const quarterLabel = (quarter: string) => translate('analytics.quarterShort', { quarter: quarter.slice(1) })
  return (
    <div role='img' aria-label={translate('analytics.charts.quarters')} className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={[...points]} barCategoryGap='30%' margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <CartesianGrid vertical={false} stroke='var(--theme-border)' strokeDasharray='3 3' strokeOpacity={0.6} />
          <XAxis
            dataKey='quarter'
            axisLine={false}
            tickLine={false}
            tick={chartAxisTick}
            tickFormatter={quarterLabel}
          />
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
              const point = payload?.[0]?.payload as QuarterPoint | undefined
              if (!active || !point) return null
              return (
                <OverviewTooltip
                  title={quarterLabel(point.quarter)}
                  rows={[
                    {
                      color: chartSlot(2),
                      label: translate('analytics.series.planned'),
                      value: money.full(point.amount)
                    }
                  ]}
                />
              )
            }}
          />
          <Bar dataKey='amount' radius={[4, 4, 0, 0]} maxBarSize={56} isAnimationActive={false}>
            {points.map((point) => (
              <Cell key={point.quarter} fill={chartSlot(2)} fillOpacity={point.inPeriod ? 1 : outsideOpacity} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PlannedQuarterTable({ points, money }: { points: readonly QuarterPoint[]; money: OverviewMoney }) {
  const { t: translate } = useTranslation('finance')
  return (
    <OverviewDataTable
      columns={[
        { key: 'quarter', label: translate('analytics.columns.quarter') },
        { key: 'amount', label: translate('analytics.series.planned'), numeric: true }
      ]}
      rows={points.map((point) => ({
        key: point.quarter,
        muted: !point.inPeriod,
        cells: {
          quarter: translate('analytics.quarterShort', { quarter: point.quarter.slice(1) }),
          amount: money.full(point.amount)
        }
      }))}
    />
  )
}
