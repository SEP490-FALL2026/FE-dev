import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { getRemaining } from '../../../budget-figures'
import { Panel, PanelTitle, useDashboardFormat } from '../../../dashboard-ui'

export interface CostCenterPeriodRow {
  actual: number
  budget: number | null
  code: string
  held: number
  name: string
}

/** Fixed slot per Cost Center so a filter never repaints a survivor (entity → colour, never rank). */
const sliceColors = [1, 2, 3, 4, 5, 6].map((slot) => `var(--theme-chart-${slot})`)

const barColors = {
  actual: 'var(--theme-primary)',
  budget: 'var(--theme-muted-foreground)',
  held: 'var(--theme-primary)'
}

const tooltipClassName = 'rounded-xl border border-border bg-surface p-3 text-xs text-foreground shadow-lg'

function TooltipRow({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-6 py-0.5'>
      <span className='flex items-center gap-1.5 text-muted-foreground'>
        {color && <span aria-hidden='true' className='size-2.5 rounded-sm' style={{ background: color }} />}
        {label}
      </span>
      <span className='font-semibold tabular-nums'>{value}</span>
    </div>
  )
}

export function BudgetUsageBarChart({
  formatCurrency,
  periodLabel,
  rows
}: {
  formatCurrency: (value: number) => string
  periodLabel: string
  rows: CostCenterPeriodRow[]
}) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatPercent } = useDashboardFormat()
  const data = rows.map((row) => ({ ...row, budgetValue: row.budget ?? 0 }))

  const legend = [
    { color: barColors.budget, label: t('budget.budget'), opacity: 0.35 },
    { color: barColors.actual, label: t('budget.actual'), opacity: 1 },
    { color: barColors.held, label: t('budget.held'), opacity: 0.45 }
  ]

  return (
    <Panel>
      <PanelTitle
        hint={t('finance.overview.barHint')}
        title={t('finance.overview.barTitle', { period: periodLabel })}
      />
      <ul className='mt-3 flex flex-wrap gap-4 text-[0.7rem] text-muted-foreground'>
        {legend.map((item) => (
          <li className='inline-flex items-center gap-1.5' key={item.label}>
            <span
              aria-hidden='true'
              className='size-2.5 rounded-sm'
              style={{ background: item.color, opacity: item.opacity }}
            />
            {item.label}
          </li>
        ))}
      </ul>
      <div aria-label={t('finance.overview.barTitle', { period: periodLabel })} className='mt-2 h-72 w-full' role='img'>
        <ResponsiveContainer height='100%' width='100%'>
          <BarChart barCategoryGap='28%' barGap={2} data={data} margin={{ bottom: 0, left: 4, right: 8, top: 12 }}>
            <CartesianGrid stroke='var(--theme-border)' strokeDasharray='4 6' vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='code'
              fontSize={11}
              tick={{ fill: 'var(--theme-muted-foreground)' }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              fontSize={11}
              tick={{ fill: 'var(--theme-muted-foreground)' }}
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              width={64}
            />
            <Tooltip
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as CostCenterPeriodRow | undefined
                if (!active || !row) return null
                const remaining = getRemaining(row)

                return (
                  <div className={tooltipClassName}>
                    <p className='font-bold'>
                      {row.code} · {row.name}
                    </p>
                    <div className='mt-1.5'>
                      <TooltipRow
                        label={t('budget.budget')}
                        value={row.budget === null ? t('budget.noBudget') : formatCurrency(row.budget)}
                      />
                      <TooltipRow
                        color={barColors.actual}
                        label={t('budget.actual')}
                        value={formatCurrency(row.actual)}
                      />
                      <TooltipRow label={t('budget.held')} value={formatCurrency(row.held)} />
                      {remaining !== null && row.budget ? (
                        <>
                          <TooltipRow label={t('budget.remaining')} value={formatCurrency(remaining)} />
                          <TooltipRow
                            label={t('finance.overview.usedShare')}
                            value={formatPercent((row.actual + row.held) / row.budget)}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                )
              }}
              cursor={{ fill: 'var(--theme-surface-subtle)' }}
            />
            <Bar
              dataKey='budgetValue'
              fill={barColors.budget}
              fillOpacity={0.35}
              isAnimationActive={false}
              name={t('budget.budget')}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='actual'
              fill={barColors.actual}
              isAnimationActive={false}
              name={t('budget.actual')}
              stackId='used'
              stroke='var(--theme-surface)'
              strokeWidth={1}
            />
            <Bar
              dataKey='held'
              fill={barColors.held}
              fillOpacity={0.45}
              isAnimationActive={false}
              name={t('budget.held')}
              radius={[4, 4, 0, 0]}
              stackId='used'
              stroke='var(--theme-surface)'
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

export function SpendShareDonut({
  formatCurrency,
  periodLabel,
  rows
}: {
  formatCurrency: (value: number) => string
  periodLabel: string
  rows: CostCenterPeriodRow[]
}) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatPercent } = useDashboardFormat()
  const slices = rows.map((row, index) => ({ ...row, color: sliceColors[index % sliceColors.length] }))
  const total = slices.reduce((sum, slice) => sum + slice.actual, 0)
  // Hovering or focusing a slice or legend row shows its details in the hole, so no tooltip covers the chart.
  const [activeCode, setActiveCode] = useState<string | null>(null)
  const active = slices.find((slice) => slice.code === activeCode)
  const pieSlices = slices.filter((slice) => slice.actual > 0)
  const hoverProps = (code: string) => ({
    onBlur: () => setActiveCode(null),
    onFocus: () => setActiveCode(code),
    onMouseEnter: () => setActiveCode(code),
    onMouseLeave: () => setActiveCode(null)
  })

  return (
    <Panel>
      <PanelTitle
        hint={t('finance.overview.donutHint')}
        title={t('finance.overview.donutTitle', { period: periodLabel })}
      />
      {total === 0 ? (
        <p className='mt-6 rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground'>
          {t('finance.overview.donutEmpty')}
        </p>
      ) : (
        <div className='mt-3 grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
          <div
            aria-label={t('finance.overview.donutTitle', { period: periodLabel })}
            className='relative h-60 w-full'
            role='img'
          >
            <ResponsiveContainer height='100%' width='100%'>
              <PieChart>
                <Pie
                  cx='50%'
                  cy='50%'
                  data={pieSlices}
                  dataKey='actual'
                  innerRadius={62}
                  isAnimationActive={false}
                  nameKey='code'
                  onMouseEnter={(_, index) => setActiveCode(pieSlices[index]?.code ?? null)}
                  onMouseLeave={() => setActiveCode(null)}
                  outerRadius={92}
                  paddingAngle={1}
                  stroke='var(--theme-surface)'
                  strokeWidth={2}
                >
                  {pieSlices.map((slice) => (
                    <Cell
                      className='cursor-pointer transition-opacity'
                      fill={slice.color}
                      fillOpacity={activeCode === null || activeCode === slice.code ? 1 : 0.3}
                      key={slice.code}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className='pointer-events-none absolute inset-0 grid place-items-center'>
              <div aria-live='polite' className='max-w-[7.5rem] text-center'>
                {active ? (
                  <>
                    <p className='line-clamp-2 text-[0.7rem] leading-tight text-muted-foreground'>
                      <span className='font-mono font-bold text-foreground'>{active.code}</span> {active.name}
                    </p>
                    <p className='mt-0.5 text-base font-extrabold tabular-nums'>
                      {formatCompactCurrency(active.actual)}
                    </p>
                    <p className='text-[0.7rem] font-semibold text-muted-foreground tabular-nums'>
                      {formatPercent(active.actual / total)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className='text-[0.7rem] text-muted-foreground'>{t('finance.overview.donutTotal')}</p>
                    <p className='text-base font-extrabold tabular-nums'>{formatCompactCurrency(total)}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <ul className='space-y-0.5 text-xs'>
            {slices.map((slice) => (
              <li
                className={`flex cursor-default items-center justify-between gap-3 rounded-lg px-2 py-1 transition outline-none focus-visible:ring-2 focus-visible:ring-primary-soft ${
                  activeCode === slice.code ? 'bg-surface-subtle' : ''
                }`}
                key={slice.code}
                tabIndex={0}
                {...hoverProps(slice.code)}
              >
                <span className='flex min-w-0 items-center gap-2'>
                  <span
                    aria-hidden='true'
                    className='size-2.5 shrink-0 rounded-sm'
                    style={{ background: slice.color }}
                  />
                  <span className='truncate'>
                    <span className='font-mono font-bold'>{slice.code}</span>
                    <span className='ml-1.5 text-muted-foreground'>{slice.name}</span>
                  </span>
                </span>
                <span className='shrink-0 tabular-nums' title={formatCurrency(slice.actual)}>
                  <span className='font-semibold'>{formatCompactCurrency(slice.actual)}</span>
                  <span className='ml-1.5 text-muted-foreground'>{formatPercent(slice.actual / total)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  )
}
