import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipValueType
} from 'recharts'

import { useDashboardFormat } from '../../dashboard-ui'

/** Above this share of its budget a Cost Center column turns to the warning color. */
const nearLimitRatio = 0.9

const axisTick = { fill: 'var(--theme-muted-foreground)', fontSize: 11 }

interface SpendColumn {
  budget: number | null
  key: string
  name: string
  ratio: number | null
  remaining: number
  spend: number
}

function spendColor(column: SpendColumn) {
  if (column.budget === null) return 'var(--chart-neutral)'
  return column.ratio !== null && column.ratio > nearLimitRatio ? 'var(--theme-warning)' : 'var(--theme-primary)'
}

/**
 * Cost Center spend as columns: the colored part is spend, the track above it is the
 * remaining budget, so a full column equals the budget. The Unallocated line has no
 * budget and renders as a neutral spend-only column.
 */
export function ApproverSpendChart({
  costCenters,
  formatCurrency,
  label,
  unallocated
}: {
  costCenters: readonly { budget: number; code: string; spend: number }[]
  formatCurrency: (value: number) => string
  label: string
  unallocated: number
}) {
  const { t } = useTranslation('dashboard')
  const { formatCompact, formatPercent } = useDashboardFormat()

  const columns: SpendColumn[] = [
    ...costCenters.map((cc) => ({
      budget: cc.budget,
      key: cc.code,
      name: cc.code,
      ratio: cc.spend / cc.budget,
      remaining: Math.max(0, cc.budget - cc.spend),
      spend: cc.spend
    })),
    {
      budget: null,
      key: 'unallocated',
      name: t('finance.analysis.unallocated'),
      ratio: null,
      remaining: 0,
      spend: unallocated
    }
  ]

  const renderTooltip = ({ active, payload }: Partial<TooltipContentProps<TooltipValueType, string | number>>) => {
    const column = payload?.[0]?.payload as SpendColumn | undefined
    if (!active || !column) return null

    const rows =
      column.budget === null
        ? [{ key: 'actual', label: t('budget.actual'), value: formatCurrency(column.spend) }]
        : [
            { key: 'actual', label: t('budget.actual'), value: formatCurrency(column.spend) },
            { key: 'budget', label: t('budget.budget'), value: formatCurrency(column.budget) },
            { key: 'remaining', label: t('budget.remaining'), value: formatCurrency(column.remaining) },
            {
              key: 'used',
              label: t('approvals.reports.spendChart.usedShare'),
              value: formatPercent(column.ratio ?? 0)
            }
          ]

    return (
      <div className='min-w-52 rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-lg'>
        <p className='mb-1.5 flex items-center gap-1.5 font-mono font-bold text-foreground'>
          <span className='size-2.5 rounded-sm' style={{ backgroundColor: spendColor(column) }} />
          {column.name}
        </p>
        <ul className='space-y-1'>
          {rows.map((row) => (
            <li className='flex items-center justify-between gap-4' key={row.key}>
              <span className='text-muted-foreground'>{row.label}</span>
              <span className='font-semibold text-foreground tabular-nums'>{row.value}</span>
            </li>
          ))}
        </ul>
        {column.budget === null && (
          <p className='mt-1.5 text-[0.7rem] text-muted-foreground'>{t('approvals.reports.spendChart.noBudget')}</p>
        )}
        {column.ratio !== null && column.ratio > nearLimitRatio && (
          <p className='mt-1.5 text-[0.7rem] font-bold text-warning'>{t('approvals.reports.spendChart.nearLimit')}</p>
        )}
      </div>
    )
  }

  return (
    <div aria-label={label} className='h-72 w-full' role='img'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart data={columns} margin={{ bottom: 0, left: 4, right: 8, top: 8 }}>
          <CartesianGrid stroke='var(--theme-border)' strokeDasharray='4 6' vertical={false} />
          <XAxis axisLine={false} dataKey='name' interval={0} tick={axisTick} tickLine={false} />
          <YAxis axisLine={false} tick={axisTick} tickFormatter={formatCompact} tickLine={false} width={52} />
          <Tooltip content={renderTooltip} cursor={{ fill: 'var(--theme-surface-subtle)' }} />
          <Bar dataKey='spend' isAnimationActive={false} maxBarSize={44} name={t('budget.actual')} stackId='budget'>
            {columns.map((column) => (
              <Cell fill={spendColor(column)} key={column.key} />
            ))}
          </Bar>
          <Bar
            dataKey='remaining'
            fill='var(--chart-track)'
            isAnimationActive={false}
            maxBarSize={44}
            name={t('budget.remaining')}
            radius={[4, 4, 0, 0]}
            stackId='budget'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
