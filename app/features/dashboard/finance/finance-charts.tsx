import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipValueType
} from 'recharts'

/*
 * Finance dashboard charts. Colors come from the validated `--chart-*` theme slots
 * (fixed order, light/dark stepped separately); text always uses text tokens.
 */

export interface ChartSeries {
  color: string
  key: string
  label: string
}

const axisTick = { fill: 'var(--theme-muted-foreground)', fontSize: 11 }

function ChartTooltip({
  active,
  formatValue,
  label,
  payload
}: Partial<TooltipContentProps<TooltipValueType, string | number>> & { formatValue: (value: number) => string }) {
  if (!active || !payload?.length) return null

  return (
    <div className='min-w-44 rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-lg'>
      {label !== undefined && <p className='mb-1.5 font-bold text-foreground'>{label}</p>}
      <ul className='space-y-1'>
        {payload.map((entry) => (
          <li className='flex items-center justify-between gap-4' key={String(entry.dataKey ?? entry.name)}>
            <span className='flex items-center gap-1.5 text-muted-foreground'>
              <span className='size-2.5 rounded-sm' style={{ backgroundColor: entry.color ?? entry.payload?.color }} />
              {entry.name}
            </span>
            <span className='font-semibold text-foreground tabular-nums'>{formatValue(Number(entry.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ChartLegend({ series }: { series: readonly ChartSeries[] }) {
  return (
    <ul className='flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground'>
      {series.map((item) => (
        <li className='flex items-center gap-1.5' key={item.key}>
          <span className='size-2.5 rounded-sm' style={{ backgroundColor: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/** Horizontal stacked bar: where each Cost Center's budget went (actual · held · remaining). */
export function StackedBudgetBarChart({
  data,
  formatCompact,
  formatCurrency,
  label,
  series
}: {
  data: readonly Record<string, number | string>[]
  formatCompact: (value: number) => string
  formatCurrency: (value: number) => string
  label: string
  series: readonly ChartSeries[]
}) {
  return (
    <div aria-label={label} className='h-72 w-full' role='img'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart data={[...data]} layout='vertical' margin={{ bottom: 0, left: 4, right: 16, top: 4 }}>
          <CartesianGrid horizontal={false} stroke='var(--theme-border)' strokeDasharray='4 6' />
          <XAxis axisLine={false} tick={axisTick} tickFormatter={formatCompact} tickLine={false} type='number' />
          <YAxis axisLine={false} dataKey='name' tick={axisTick} tickLine={false} type='category' width={92} />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatValue={formatCurrency} />}
            cursor={{ fill: 'var(--theme-surface-subtle)' }}
          />
          {series.map((item, index) => (
            <Bar
              barSize={18}
              dataKey={item.key}
              fill={item.color}
              isAnimationActive={false}
              key={item.key}
              name={item.label}
              radius={index === series.length - 1 ? [0, 4, 4, 0] : 0}
              stackId='budget'
              stroke='var(--theme-surface)'
              strokeWidth={2}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Grouped columns: budget next to actual per Cost Center, one shared y-axis. */
export function GroupedColumnChart({
  data,
  formatCompact,
  formatCurrency,
  label,
  series
}: {
  data: readonly Record<string, number | string>[]
  formatCompact: (value: number) => string
  formatCurrency: (value: number) => string
  label: string
  series: readonly ChartSeries[]
}) {
  return (
    <div aria-label={label} className='h-72 w-full' role='img'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barGap={2} data={[...data]} margin={{ bottom: 0, left: 4, right: 8, top: 8 }}>
          <CartesianGrid stroke='var(--theme-border)' strokeDasharray='4 6' vertical={false} />
          <XAxis axisLine={false} dataKey='name' interval={0} tick={axisTick} tickLine={false} />
          <YAxis axisLine={false} tick={axisTick} tickFormatter={formatCompact} tickLine={false} width={52} />
          <Tooltip
            content={(props) => <ChartTooltip {...props} formatValue={formatCurrency} />}
            cursor={{ fill: 'var(--theme-surface-subtle)' }}
          />
          {series.map((item) => (
            <Bar
              dataKey={item.key}
              fill={item.color}
              isAnimationActive={false}
              key={item.key}
              maxBarSize={22}
              name={item.label}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export interface DonutSlice {
  color: string
  key: string
  label: string
  value: number
}

/** Donut with the total in the hole; the legend list beside it carries values and shares. */
export function DonutChart({
  centerLabel,
  centerValue,
  data,
  formatCurrency,
  label
}: {
  centerLabel: string
  centerValue: string
  data: readonly DonutSlice[]
  formatCurrency: (value: number) => string
  label: string
}) {
  return (
    <div aria-label={label} className='relative h-56 w-full' role='img'>
      <ResponsiveContainer height='100%' width='100%'>
        <PieChart>
          <Tooltip content={(props) => <ChartTooltip {...props} formatValue={formatCurrency} />} />
          <Pie
            cx='50%'
            cy='50%'
            data={[...data]}
            dataKey='value'
            innerRadius='62%'
            isAnimationActive={false}
            nameKey='label'
            outerRadius='92%'
            paddingAngle={1}
            stroke='var(--theme-surface)'
            strokeWidth={2}
          >
            {data.map((slice) => (
              <Cell fill={slice.color} key={slice.key} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className='pointer-events-none absolute inset-0 grid place-items-center text-center'>
        <div>
          <p className='text-[0.7rem] font-semibold text-muted-foreground'>{centerLabel}</p>
          <p className='text-base font-extrabold text-foreground'>{centerValue}</p>
        </div>
      </div>
    </div>
  )
}

export function DonutLegendTable({
  data,
  formatCurrency,
  formatPercent,
  shareLabel,
  valueLabel,
  nameLabel
}: {
  data: readonly DonutSlice[]
  formatCurrency: (value: number) => string
  formatPercent: (value: number) => string
  nameLabel: string
  shareLabel: string
  valueLabel: string
}) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <table className='w-full text-left text-xs'>
      <thead className='sr-only'>
        <tr>
          <th>{nameLabel}</th>
          <th>{valueLabel}</th>
          <th>{shareLabel}</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-border'>
        {data.map((slice) => (
          <tr key={slice.key}>
            <td className='py-1.5'>
              <span className='flex items-center gap-2 text-muted-foreground'>
                <span className='size-2.5 shrink-0 rounded-sm' style={{ backgroundColor: slice.color }} />
                {slice.label}
              </span>
            </td>
            <td className='py-1.5 text-right font-semibold tabular-nums'>{formatCurrency(slice.value)}</td>
            <td className='w-12 py-1.5 text-right text-muted-foreground tabular-nums'>
              {formatPercent(total > 0 ? slice.value / total : 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
