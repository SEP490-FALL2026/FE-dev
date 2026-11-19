import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { formatMoney } from '~/shared/lib/money'
import type { AmountRow } from '../approvals-insights'

const ROW_HEIGHT = 36

/** Short axis/label form of an amount; falls back to a plain number when the currency code is not usable. */
export function useCompactMoney(currency: string) {
  const { i18n } = useTranslation()
  let formatter: Intl.NumberFormat
  try {
    formatter = new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    })
  } catch {
    formatter = new Intl.NumberFormat(i18n.language, { notation: 'compact', maximumFractionDigits: 1 })
  }
  return (value: number) => formatter.format(value)
}

/** One series, one hue: bar length is the amount, the label at the end repeats it in short form. */
export function AmountBarChart({
  rows,
  currency,
  label
}: {
  rows: readonly AmountRow[]
  currency: string
  label: string
}) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const compact = useCompactMoney(currency)
  return (
    <div role='img' aria-label={label} className='w-full' style={{ height: rows.length * ROW_HEIGHT + 16 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={[...rows]} layout='vertical' margin={{ top: 4, right: 56, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke='var(--theme-border)' strokeDasharray='3 3' strokeOpacity={0.6} />
          <XAxis type='number' hide />
          <YAxis
            type='category'
            dataKey='label'
            width={96}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--theme-muted-foreground)', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'var(--theme-surface-subtle)' }}
            content={({ active, payload }) => {
              const row = payload?.[0]?.payload as AmountRow | undefined
              if (!active || !row) return null
              return (
                <div className='rounded-md border border-border/70 bg-surface px-3 py-2 text-xs shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]'>
                  <p className='font-medium text-foreground'>{row.label}</p>
                  <p className='font-mono text-foreground tabular-nums'>
                    {formatMoney({ amount: row.exact, currency }, i18n.language)}
                  </p>
                  <p className='text-muted-foreground'>{translate('insights.requestCount', { count: row.count })}</p>
                </div>
              )
            }}
          />
          <Bar
            dataKey='value'
            fill='var(--theme-primary)'
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
            isAnimationActive={false}
          >
            <LabelList
              dataKey='value'
              position='right'
              formatter={(value: unknown) => (typeof value === 'number' ? compact(value) : '')}
              style={{ fill: 'var(--theme-muted-foreground)', fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/** The same figures as the chart, exact to the last digit. */
export function AmountTable({
  rows,
  currency,
  firstColumn
}: {
  rows: readonly AmountRow[]
  currency: string
  firstColumn: string
}) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead className='border-b border-border/60 text-xs text-muted-foreground'>
          <tr>
            <th scope='col' className='py-2 pr-3 text-left font-medium'>
              {firstColumn}
            </th>
            <th scope='col' className='py-2 pr-3 text-right font-medium'>
              {translate('insights.columns.count')}
            </th>
            <th scope='col' className='py-2 text-right font-medium'>
              {translate('insights.columns.amount')}
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border/40'>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className='max-w-48 truncate py-2 pr-3' title={row.label}>
                {row.label}
              </td>
              <td className='py-2 pr-3 text-right font-mono tabular-nums'>{row.count}</td>
              <td className='py-2 text-right font-mono tabular-nums'>
                {formatMoney({ amount: row.exact, currency }, i18n.language)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
