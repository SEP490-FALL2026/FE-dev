import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'

export type DonutTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface DonutSegment {
  key: string
  label: string
  count: number
  tone: DonutTone
}

/** Segments sharing a status hue step down in strength so they stay apart; the legend always names them. */
const SHADE_STEPS = [1, 0.6, 0.35] as const

function toneColor(tone: DonutTone) {
  return tone === 'neutral' ? 'var(--theme-muted-foreground)' : `var(--theme-${tone})`
}

function shadeSegments(segments: readonly DonutSegment[]) {
  const seen = new Map<DonutTone, number>()
  return segments.map((segment) => {
    const step = seen.get(segment.tone) ?? 0
    seen.set(segment.tone, step + 1)
    return { ...segment, color: toneColor(segment.tone), opacity: SHADE_STEPS[Math.min(step, SHADE_STEPS.length - 1)] }
  })
}

/** Part-to-whole of a few states: a donut with the total in the middle and a labelled legend beside it. */
export function StatusDonut({
  segments,
  label,
  totalLabel
}: {
  segments: readonly DonutSegment[]
  label: string
  totalLabel: string
}) {
  const { i18n } = useTranslation()
  const [highlighted, setHighlighted] = useState<string>()
  const shaded = shadeSegments(segments.filter((segment) => segment.count > 0))
  const total = shaded.reduce((sum, segment) => sum + segment.count, 0)
  const percent = new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 0 })
  return (
    <div className='grid items-center gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]'>
      <div role='img' aria-label={label} className='relative mx-auto size-40'>
        <div className='pointer-events-none absolute inset-0 grid place-items-center text-center'>
          <div>
            <p className='text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>{totalLabel}</p>
            <p className='font-mono text-2xl leading-tight font-semibold tabular-nums'>{total}</p>
          </div>
        </div>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={shaded}
              dataKey='count'
              nameKey='label'
              innerRadius='66%'
              outerRadius='100%'
              paddingAngle={shaded.length > 1 ? 1 : 0}
              stroke='var(--theme-surface)'
              strokeWidth={2}
              isAnimationActive={false}
              onMouseEnter={(_, index) => setHighlighted(shaded[index]?.key)}
              onMouseLeave={() => setHighlighted(undefined)}
            >
              {shaded.map((segment) => (
                <Cell
                  key={segment.key}
                  fill={segment.color}
                  fillOpacity={highlighted && highlighted !== segment.key ? segment.opacity * 0.35 : segment.opacity}
                />
              ))}
            </Pie>
            <Tooltip
              allowEscapeViewBox={{ x: true, y: true }}
              content={({ active, payload }) => {
                const segment = payload?.[0]?.payload as (typeof shaded)[number] | undefined
                if (!active || !segment) return null
                return (
                  <div className='rounded-md border border-border/70 bg-surface px-3 py-2 text-xs shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]'>
                    <p className='font-medium text-foreground'>{segment.label}</p>
                    <p className='font-mono text-muted-foreground tabular-nums'>
                      {segment.count} · {percent.format(segment.count / total)}
                    </p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className='space-y-1'>
        {shaded.map((segment) => (
          <li
            key={segment.key}
            onMouseEnter={() => setHighlighted(segment.key)}
            onMouseLeave={() => setHighlighted(undefined)}
            className='flex min-h-8 items-center justify-between gap-3 rounded-md px-2 text-sm transition-colors duration-150 hover:bg-surface-subtle'
          >
            <span className='flex min-w-0 items-center gap-2'>
              <span
                aria-hidden
                className='size-2.5 shrink-0 rounded-sm'
                style={{ background: segment.color, opacity: segment.opacity }}
              />
              <span className='truncate' title={segment.label}>
                {segment.label}
              </span>
            </span>
            <span className='shrink-0 font-mono text-xs text-muted-foreground tabular-nums'>
              <span className='text-foreground'>{segment.count}</span> · {percent.format(segment.count / total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
