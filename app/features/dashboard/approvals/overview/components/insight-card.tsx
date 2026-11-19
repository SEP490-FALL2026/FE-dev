import { BarChart3, Table2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const toggleClass =
  'grid size-11 place-items-center rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:size-8'

/** A titled analysis panel; when it carries a chart it also offers the same figures as a table. */
export function InsightCard({
  title,
  scope,
  chart,
  table,
  footer,
  children,
  className = ''
}: {
  title: string
  scope?: string
  chart?: ReactNode
  table?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const { t: translate } = useTranslation('approvalsNeed')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const switchable = Boolean(chart && table)
  return (
    <section
      aria-label={title}
      className={`flex min-w-0 flex-col gap-4 rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] sm:p-5 ${className}`}
    >
      <header className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <h2 className='text-sm font-semibold tracking-tight [text-wrap:balance]'>{title}</h2>
          {scope && <p className='text-xs text-muted-foreground'>{scope}</p>}
        </div>
        {switchable && (
          <div
            role='group'
            aria-label={translate('insights.view')}
            className='flex shrink-0 gap-1 rounded-md bg-surface-subtle p-0.5'
          >
            {(['chart', 'table'] as const).map((option) => {
              const Icon = option === 'chart' ? BarChart3 : Table2
              const active = view === option
              return (
                <button
                  key={option}
                  type='button'
                  aria-pressed={active}
                  aria-label={translate(`insights.views.${option}`)}
                  title={translate(`insights.views.${option}`)}
                  className={`${toggleClass} ${
                    active
                      ? 'bg-surface text-primary-ink shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setView(option)}
                >
                  <Icon aria-hidden className='size-4' strokeWidth={1.5} />
                </button>
              )
            })}
          </div>
        )}
      </header>
      {children ?? (view === 'chart' || !table ? chart : table)}
      {footer && <p className='text-xs text-muted-foreground [text-wrap:pretty]'>{footer}</p>}
    </section>
  )
}
