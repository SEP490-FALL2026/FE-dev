import { useState } from 'react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { OverviewTooltip, chartSlot } from '../../overview/components/overview-chart-card'
import { formatMoney } from '../../shared/finance-money'
import type { BudgetSummaryTotalsItem } from '../../shared/finance-api-extensions'

type Money = { amount: string; currency: string }

interface Part {
  key: string
  label: string
  money: Money
  value: number
  color: string
  negative?: boolean
}

function Card({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section
      aria-label={title}
      className='flex min-w-0 flex-col gap-4 rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] sm:p-5'
    >
      <header>
        <h3 className='text-sm font-semibold tracking-tight [text-wrap:balance]'>{title}</h3>
        <p className='text-xs text-muted-foreground'>{hint}</p>
      </header>
      {children}
    </section>
  )
}

/** Legend with the exact amounts: the wide rows leave room for any number, unlike a small card. */
function Legend({
  parts,
  total,
  lang,
  onHover
}: {
  parts: readonly Part[]
  total: number
  lang: string
  onHover?: (key?: string) => void
}) {
  const percent = new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 1 })
  return (
    <ul className='space-y-2'>
      {parts.map((part) => (
        <li
          key={part.key}
          className='flex items-center gap-2 text-sm'
          onMouseEnter={() => onHover?.(part.key)}
          onMouseLeave={() => onHover?.(undefined)}
        >
          <span aria-hidden className='size-2.5 shrink-0 rounded-sm' style={{ background: part.color }} />
          <span className='min-w-0 flex-1 truncate' title={part.label}>
            {part.label}
          </span>
          <span
            className={`font-mono text-xs tabular-nums ${part.negative ? 'font-semibold text-danger' : 'text-foreground'}`}
          >
            {formatMoney(part.money, lang)}
          </span>
          <span className='w-14 text-right font-mono text-xs text-muted-foreground tabular-nums'>
            {total > 0 ? percent.format(part.value / total) : '—'}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The year budget split into what was spent, what is held and what is left. */
function UsageChart({ totals, lang }: { totals: BudgetSummaryTotalsItem; lang: string }) {
  const { t: translate } = useTranslation('financeSettings')
  const spent = Math.max(0, Number(totals.spent.amount))
  const held = Math.max(0, Number(totals.committed.amount))
  const remainingValue = Number(totals.remaining.amount)
  const remaining = Math.max(0, remainingValue)
  const total = Number(totals.total.amount)
  const parts: Part[] = [
    { key: 'spent', label: translate('kpis.spent'), money: totals.spent, value: spent, color: chartSlot(0) },
    { key: 'held', label: translate('kpis.held'), money: totals.committed, value: held, color: chartSlot(1) },
    {
      key: 'remaining',
      label: translate('kpis.remaining'),
      money: totals.remaining,
      value: remaining,
      color: chartSlot(2),
      negative: remainingValue < 0
    }
  ]
  const scale = Math.max(total, spent + held + remaining)
  const row = { name: 'budget', spent, held, remaining }
  return (
    <Card title={translate('charts.usage')} hint={translate('charts.usageHint')}>
      {scale > 0 ? (
        <>
          <div role='img' aria-label={translate('charts.usage')} className='h-12 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={[row]} layout='vertical' margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis type='number' hide domain={[0, scale]} />
                <YAxis type='category' dataKey='name' hide />
                <Tooltip
                  cursor={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 20, pointerEvents: 'none' }}
                  content={({ active }) =>
                    active ? (
                      <OverviewTooltip
                        title={translate('kpis.total')}
                        rows={parts.map((part) => ({
                          color: part.color,
                          label: part.label,
                          value: formatMoney(part.money, lang)
                        }))}
                      />
                    ) : null
                  }
                />
                {parts.map((part, index) => (
                  <Bar
                    key={part.key}
                    dataKey={part.key}
                    stackId='budget'
                    fill={part.color}
                    radius={index === 0 ? [6, 0, 0, 6] : index === parts.length - 1 ? [0, 6, 6, 0] : 0}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Legend parts={parts} total={scale} lang={lang} />
          {remainingValue < 0 && (
            <p role='status' className='text-xs font-medium text-danger'>
              {translate('charts.overBudget')}
            </p>
          )}
        </>
      ) : (
        <p className='text-sm text-muted-foreground'>{translate('charts.empty')}</p>
      )}
    </Card>
  )
}

/** The budget split into the base figure and the reserve. */
function StructureChart({ totals, lang }: { totals: BudgetSummaryTotalsItem; lang: string }) {
  const { t: translate } = useTranslation('financeSettings')
  const base = Math.max(0, Number(totals.base.amount))
  const reserve = Math.max(0, Number(totals.reserve.amount))
  const sum = base + reserve
  const parts: Part[] = [
    { key: 'base', label: translate('kpis.base'), money: totals.base, value: base, color: chartSlot(0) },
    { key: 'reserve', label: translate('kpis.reserve'), money: totals.reserve, value: reserve, color: chartSlot(3) }
  ]
  const percent = new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 1 })
  // The centre shows only the share; the name and the full amount sit under the ring and follow the pointer.
  const [highlighted, setHighlighted] = useState<string>()
  const active = parts.find((part) => part.key === highlighted)
  const shownLabel = active ? active.label : translate('kpis.total')
  const shownMoney = active ? active.money : totals.total
  const shownShare = active && sum > 0 ? active.value / sum : 1
  return (
    <Card title={translate('charts.structure')} hint={translate('charts.structureHint')}>
      {sum > 0 ? (
        <div className='grid items-center gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]'>
          <div className='min-w-0 space-y-3'>
            <div role='img' aria-label={translate('charts.structure')} className='relative mx-auto size-40'>
              <div className='pointer-events-none absolute inset-0 grid place-items-center text-center'>
                <p className='font-mono text-2xl font-semibold tabular-nums'>{percent.format(shownShare)}</p>
              </div>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={parts}
                    dataKey='value'
                    nameKey='label'
                    innerRadius='64%'
                    outerRadius='100%'
                    paddingAngle={1}
                    stroke='var(--theme-surface)'
                    strokeWidth={2}
                    isAnimationActive={false}
                    onMouseEnter={(_, index) => setHighlighted(parts[index]?.key)}
                    onMouseLeave={() => setHighlighted(undefined)}
                  >
                    {parts.map((part) => (
                      <Cell
                        key={part.key}
                        fill={part.color}
                        fillOpacity={highlighted && highlighted !== part.key ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    allowEscapeViewBox={{ x: true, y: true }}
                    wrapperStyle={{ zIndex: 20, pointerEvents: 'none' }}
                    content={({ active, payload }) => {
                      const part = payload?.[0]?.payload as Part | undefined
                      return active && part ? (
                        <OverviewTooltip
                          title={part.label}
                          rows={[
                            { color: part.color, label: translate('kpis.total'), value: formatMoney(part.money, lang) }
                          ]}
                        />
                      ) : null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div aria-live='polite' className='space-y-1 text-center'>
              <p className='text-xs font-semibold tracking-wider text-muted-foreground uppercase [text-wrap:balance]'>
                {shownLabel}
              </p>
              <p className='font-mono text-base font-semibold tabular-nums [overflow-wrap:anywhere]'>
                {formatMoney(shownMoney, lang)}
              </p>
            </div>
          </div>
          <Legend parts={parts} total={sum} lang={lang} onHover={setHighlighted} />
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>{translate('charts.empty')}</p>
      )}
    </Card>
  )
}

export function CostCenterCharts({ totals }: { totals: BudgetSummaryTotalsItem }) {
  const { i18n } = useTranslation('financeSettings')
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <UsageChart totals={totals} lang={i18n.language} />
      <StructureChart totals={totals} lang={i18n.language} />
    </div>
  )
}
