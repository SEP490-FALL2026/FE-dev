import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { categoryCosts, monthlyCosts } from './dashboard-data'

type CostChartProps = {
  actualLabel: string
  formatCompact: (value: number) => string
  forecastLabel: string
  formatCurrency: (value: number) => string
  formatMonth: (value: string) => string
  label: string
}

export function CostChart({
  actualLabel,
  forecastLabel,
  formatCompact,
  formatCurrency,
  formatMonth,
  label
}: CostChartProps) {
  return (
    <div aria-label={label} className='h-72 w-full' role='img'>
      <ResponsiveContainer height='100%' width='100%'>
        <AreaChart data={monthlyCosts} margin={{ bottom: 0, left: 8, right: 8, top: 16 }}>
          <defs>
            <linearGradient id='actualCostFill' x1='0' x2='0' y1='0' y2='1'>
              <stop offset='0%' stopColor='var(--theme-primary)' stopOpacity={0.35} />
              <stop offset='100%' stopColor='var(--theme-primary)' stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke='var(--theme-border)' strokeDasharray='4 6' vertical={false} />
          <XAxis
            axisLine={false}
            dataKey='date'
            fontSize={11}
            tick={{ fill: 'var(--theme-muted-foreground)' }}
            tickFormatter={formatMonth}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            fontSize={11}
            tick={{ fill: 'var(--theme-muted-foreground)' }}
            tickFormatter={formatCompact}
            tickLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
              borderRadius: '12px',
              color: 'var(--theme-foreground)'
            }}
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(value) => formatMonth(String(value))}
          />
          <Area
            dataKey='projected'
            dot={false}
            fill='transparent'
            isAnimationActive={false}
            name={forecastLabel}
            stroke='var(--theme-info)'
            strokeDasharray='5 6'
            strokeWidth={2}
            type='monotone'
          />
          <Area
            dataKey='actual'
            fill='url(#actualCostFill)'
            isAnimationActive={false}
            name={actualLabel}
            stroke='var(--theme-primary)'
            strokeWidth={3}
            type='monotone'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryChart({ label }: { label: string }) {
  return (
    <div aria-label={label} className='h-60 w-full' role='img'>
      <ResponsiveContainer height='100%' width='100%'>
        <PieChart>
          <Pie
            cx='50%'
            cy='50%'
            data={categoryCosts}
            dataKey='value'
            innerRadius={64}
            isAnimationActive={false}
            outerRadius={92}
            paddingAngle={2}
            stroke='transparent'
          >
            {categoryCosts.map((category) => (
              <Cell fill={category.color} key={category.key} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
