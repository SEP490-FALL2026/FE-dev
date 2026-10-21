import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Panel, PanelTitle, useDashboardFormat } from '../../dashboard-ui'

/*
 * Chart panels shared by Finance screens (FIN-33 forecast, FIN-09 department budget). Column charts compare one
 * measure across months or scenarios (single hue); donuts show a part-to-whole split with fixed categorical slots (validated on both surfaces). Every chart carries a legend with the
 * values, so colour is never the only way to read it.
 */

/** Fixed categorical slots, validated in both themes; a slice may set its own colour (e.g. a neutral remainder). */
const slotColors = [1, 2, 3, 4, 5, 6].map((slot) => `var(--theme-chart-${slot})`)
const tooltipClassName = 'rounded-xl border border-border bg-surface p-3 text-xs text-foreground shadow-lg'
const axisTick = { fill: 'var(--theme-muted-foreground)' }

export interface ColumnDatum {
  /** Emphasised column (e.g. the base scenario); the others are drawn lighter. */
  highlight?: boolean
  key: string
  label: string
  value: number
}

export interface SliceDatum {
  color?: string
  key: string
  label: string
  value: number
}

function ValueTooltip({
  formatCurrency,
  label,
  value
}: {
  formatCurrency: (value: number) => string
  label: string
  value: number
}) {
  return (
    <div className={tooltipClassName}>
      <p className='font-bold'>{label}</p>
      <p className='mt-1 font-semibold tabular-nums'>{formatCurrency(value)}</p>
    </div>
  )
}

export function ColumnChartPanel({
  data,
  formatCurrency,
  hint,
  title
}: {
  data: ColumnDatum[]
  formatCurrency: (value: number) => string
  hint: string
  title: string
}) {
  const { formatCompactCurrency } = useDashboardFormat()

  return (
    <Panel>
      <PanelTitle hint={hint} title={title} />
      <div aria-label={title} className='mt-3 h-64 w-full' role='img'>
        <ResponsiveContainer height='100%' width='100%'>
          <BarChart barCategoryGap='30%' data={data} margin={{ bottom: 0, left: 4, right: 8, top: 12 }}>
            <CartesianGrid stroke='var(--theme-border)' strokeDasharray='4 6' vertical={false} />
            <XAxis axisLine={false} dataKey='label' fontSize={11} interval={0} tick={axisTick} tickLine={false} />
            <YAxis
              axisLine={false}
              fontSize={11}
              tick={axisTick}
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              width={64}
            />
            <Tooltip
              content={({ active, payload }) => {
                const datum = payload?.[0]?.payload as ColumnDatum | undefined
                if (!active || !datum) return null
                return <ValueTooltip formatCurrency={formatCurrency} label={datum.label} value={datum.value} />
              }}
              cursor={{ fill: 'var(--theme-surface-subtle)' }}
            />
            <Bar dataKey='value' isAnimationActive={false} radius={[4, 4, 0, 0]}>
              {data.map((datum) => (
                <Cell fill='var(--theme-primary)' fillOpacity={datum.highlight === false ? 0.45 : 1} key={datum.key} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className='mt-3 grid gap-x-4 gap-y-1 text-[0.7rem] sm:grid-cols-2'>
        {data.map((datum) => (
          <li className='flex justify-between gap-2' key={datum.key}>
            <span className='text-muted-foreground'>{datum.label}</span>
            <span className='font-semibold tabular-nums'>{formatCurrency(datum.value)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/**
 * Donut with its details in the hole: hovering (or focusing) a slice or its legend row shows that slice's name, value
 * and share in the centre and dims the others, so no floating tooltip ever covers the chart. At rest the centre
 * shows the total.
 */
export function DonutChartPanel({
  action,
  centerLabel,
  data,
  formatCurrency,
  hint,
  title
}: {
  action?: React.ReactNode
  centerLabel: string
  data: SliceDatum[]
  formatCurrency: (value: number) => string
  hint: string
  title: string
}) {
  const { formatCompactCurrency, formatPercent } = useDashboardFormat()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const total = data.reduce((sum, slice) => sum + slice.value, 0)
  const active = activeIndex === null ? undefined : data[activeIndex]
  const colorOf = (slice: SliceDatum, index: number) => slice.color ?? slotColors[index % slotColors.length]
  const share = (value: number) => (total > 0 ? formatPercent(value / total) : '—')

  return (
    <Panel>
      <PanelTitle action={action} hint={hint} title={title} />
      <div className='mt-3 grid items-center gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]'>
        <div aria-label={title} className='relative mx-auto size-48' role='img'>
          <ResponsiveContainer height='100%' width='100%'>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                innerRadius='64%'
                isAnimationActive={false}
                nameKey='label'
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                outerRadius='100%'
                paddingAngle={0}
                stroke='var(--theme-surface)'
                strokeWidth={2}
              >
                {data.map((slice, index) => (
                  <Cell
                    className='cursor-pointer transition-opacity'
                    fill={colorOf(slice, index)}
                    fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                    key={slice.key}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className='pointer-events-none absolute inset-0 grid place-items-center'>
            <div aria-live='polite' className='max-w-[6.5rem] text-center'>
              {active ? (
                <>
                  <p className='line-clamp-2 text-[0.65rem] leading-tight text-muted-foreground'>{active.label}</p>
                  <p className='mt-0.5 text-sm font-extrabold tabular-nums'>{formatCompactCurrency(active.value)}</p>
                  <p className='text-[0.65rem] font-semibold text-muted-foreground tabular-nums'>
                    {share(active.value)}
                  </p>
                </>
              ) : (
                <>
                  <p className='line-clamp-2 text-[0.65rem] leading-tight text-muted-foreground'>{centerLabel}</p>
                  <p className='mt-0.5 text-sm font-extrabold tabular-nums'>{formatCompactCurrency(total)}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <ul className='space-y-1 text-xs'>
          {data.map((slice, index) => (
            <li
              className={`flex cursor-default items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition outline-none focus-visible:ring-2 focus-visible:ring-primary-soft ${
                activeIndex === index ? 'bg-surface-subtle' : ''
              }`}
              key={slice.key}
              onBlur={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              tabIndex={0}
            >
              <span className='flex min-w-0 items-center gap-2'>
                <span
                  aria-hidden='true'
                  className='size-2.5 shrink-0 rounded-sm'
                  style={{ background: colorOf(slice, index) }}
                />
                <span className='truncate text-muted-foreground'>{slice.label}</span>
              </span>
              <span className='shrink-0 text-right'>
                <span className='font-semibold tabular-nums'>{formatCurrency(slice.value)}</span>
                <span className='ml-1.5 text-muted-foreground tabular-nums'>{share(slice.value)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
