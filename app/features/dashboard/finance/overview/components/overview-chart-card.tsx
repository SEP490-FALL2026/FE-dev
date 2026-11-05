import { BarChart3, Table2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceEmpty, FinanceQueryState } from '../../shared/components/finance-ui'

type QueryLike = Parameters<typeof FinanceQueryState>[0]['query']

const toggleClass =
  'grid size-11 place-items-center rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:size-8'

export function OverviewChartCard({
  title,
  scope,
  query,
  empty,
  emptyMessage,
  chart,
  table,
  footer,
  className = ''
}: {
  title: string
  scope: string
  query: QueryLike
  empty: boolean
  emptyMessage?: string
  chart: ReactNode
  table: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const { t: translate } = useTranslation('finance')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  return (
    <section
      aria-label={title}
      className={`flex min-w-0 flex-col gap-4 rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] sm:p-5 ${className}`}
    >
      <header className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <h3 className='text-sm font-semibold tracking-tight [text-wrap:balance]'>{title}</h3>
          <p className='text-xs text-muted-foreground'>{scope}</p>
        </div>
        <div
          role='group'
          aria-label={translate('analytics.view')}
          className='flex gap-1 rounded-md bg-surface-subtle p-0.5'
        >
          {(['chart', 'table'] as const).map((option) => {
            const Icon = option === 'chart' ? BarChart3 : Table2
            const active = view === option
            return (
              <button
                key={option}
                type='button'
                aria-pressed={active}
                aria-label={translate(`analytics.views.${option}`)}
                title={translate(`analytics.views.${option}`)}
                className={`${toggleClass} ${
                  active
                    ? 'bg-surface text-primary-ink shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]'
                    : 'text-muted-foreground hover:text-foreground active:bg-primary-soft'
                }`}
                onClick={() => setView(option)}
              >
                <Icon aria-hidden className='size-4' strokeWidth={1.5} />
              </button>
            )
          })}
        </div>
      </header>
      <FinanceQueryState query={query}>
        {empty ? <FinanceEmpty message={emptyMessage} /> : view === 'chart' ? chart : table}
      </FinanceQueryState>
      {footer && <p className='text-xs text-muted-foreground [text-wrap:pretty]'>{footer}</p>}
    </section>
  )
}

export interface TooltipRow {
  color?: string
  label: string
  value: string
}

/** Small popover used by every overview chart, so tooltips read the same everywhere. */
export function OverviewTooltip({ title, rows }: { title: string; rows: readonly TooltipRow[] }) {
  return (
    <div className='min-w-44 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.08)]'>
      <p className='mb-1.5 font-semibold text-foreground'>{title}</p>
      <dl className='space-y-1'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center justify-between gap-4'>
            <dt className='flex items-center gap-1.5 text-muted-foreground'>
              {row.color && <span aria-hidden className='size-2 rounded-sm' style={{ background: row.color }} />}
              {row.label}
            </dt>
            <dd className='font-mono font-medium text-foreground tabular-nums'>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function OverviewDataTable({
  columns,
  rows
}: {
  columns: ReadonlyArray<{ key: string; label: string; numeric?: boolean }>
  rows: ReadonlyArray<{ key: string; cells: Record<string, ReactNode>; muted?: boolean }>
}) {
  return (
    <div className='overflow-x-auto rounded-md border border-border/70'>
      <table className='w-full text-sm'>
        <thead className='bg-surface-subtle/60'>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope='col'
                className={`px-3 py-2 text-[11px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase ${column.numeric ? 'text-right' : 'text-left'}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-border/40'>
          {rows.map((row) => (
            <tr key={row.key} className={row.muted ? 'text-muted-foreground' : ''}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-3 py-2 ${column.numeric ? 'text-right font-mono tabular-nums' : 'max-w-48 truncate text-left'}`}
                >
                  {row.cells[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Categorical slots are assigned in fixed order; callers fold anything past the sixth into "other". */
export const chartSlotCount = 6
export const chartSlot = (index: number) => `var(--theme-chart-${index + 1})`
export const chartAxisTick = { fill: 'var(--theme-muted-foreground)', fontSize: 11 }
