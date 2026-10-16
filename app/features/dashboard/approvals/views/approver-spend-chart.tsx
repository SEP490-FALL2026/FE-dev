import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useDashboardFormat } from '../../dashboard-ui'

export interface CostCenterSpend {
  /** `null` when the Cost Center has no budget for the period. */
  budget: number | null
  code: string
  spend: number
}

const colors = { budget: 'var(--theme-muted-foreground)', spend: 'var(--theme-primary)' }

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-6 py-0.5'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='font-semibold tabular-nums'>{value}</span>
    </div>
  )
}

/** Budget vs period spend per Cost Center; hovering a Cost Center shows its figures. */
export function ApproverSpendChart({
  costCenters,
  formatCurrency,
  label
}: {
  costCenters: CostCenterSpend[]
  formatCurrency: (value: number) => string
  label: string
}) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency, formatPercent } = useDashboardFormat()

  return (
    <>
      <ul className='mt-3 flex flex-wrap gap-4 text-[0.7rem] text-muted-foreground'>
        <li className='inline-flex items-center gap-1.5'>
          <span
            aria-hidden='true'
            className='size-2.5 rounded-sm'
            style={{ background: colors.budget, opacity: 0.35 }}
          />
          {t('budget.budget')}
        </li>
        <li className='inline-flex items-center gap-1.5'>
          <span aria-hidden='true' className='size-2.5 rounded-sm' style={{ background: colors.spend }} />
          {t('approvals.reports.spendSeries')}
        </li>
      </ul>
      <div aria-label={label} className='mt-2 h-72 w-full' role='img'>
        <ResponsiveContainer height='100%' width='100%'>
          <BarChart
            barCategoryGap='28%'
            barGap={2}
            data={costCenters}
            margin={{ bottom: 0, left: 4, right: 8, top: 12 }}
          >
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
                const cc = payload?.[0]?.payload as CostCenterSpend | undefined
                if (!active || !cc) return null

                return (
                  <div className='rounded-xl border border-border bg-surface p-3 text-xs text-foreground shadow-lg'>
                    <p className='font-mono font-bold'>{cc.code}</p>
                    <div className='mt-1.5'>
                      <TooltipRow label={t('approvals.reports.spendSeries')} value={formatCurrency(cc.spend)} />
                      <TooltipRow
                        label={t('budget.budget')}
                        value={cc.budget === null ? t('budget.noBudget') : formatCurrency(cc.budget)}
                      />
                      {cc.budget ? (
                        <>
                          <TooltipRow label={t('budget.remaining')} value={formatCurrency(cc.budget - cc.spend)} />
                          <TooltipRow
                            label={t('finance.overview.usedShare')}
                            value={formatPercent(cc.spend / cc.budget)}
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
              dataKey={(cc: CostCenterSpend) => cc.budget ?? 0}
              fill={colors.budget}
              fillOpacity={0.35}
              isAnimationActive={false}
              name={t('budget.budget')}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='spend'
              fill={colors.spend}
              isAnimationActive={false}
              name={t('approvals.reports.spendSeries')}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
