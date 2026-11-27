import { CalendarClock, FileCheck2, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export type InvoiceMode = 'queue' | 'missing'

const modes: readonly { key: InvoiceMode; icon: LucideIcon }[] = [
  { key: 'queue', icon: FileCheck2 },
  { key: 'missing', icon: CalendarClock }
]

/** Segmented switch between the signing queue and the periods still missing an invoice, with the count of each. */
export function InvoiceModeTabs({
  mode,
  counts,
  onChange
}: {
  mode: InvoiceMode
  counts: Partial<Record<InvoiceMode, number>>
  onChange: (mode: InvoiceMode) => void
}) {
  const { t: translate } = useTranslation('financePurchases')
  const { formatNumber } = useWorkspaceFormat()
  return (
    <div
      role='tablist'
      aria-label={translate('invoice.title')}
      className='soft-panel inline-flex w-full gap-1 p-1 sm:w-auto'
    >
      {modes.map(({ key, icon: Icon }, index) => {
        const active = mode === key
        const count = counts[key]
        return (
          <button
            key={key}
            type='button'
            role='tab'
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(key)}
            onKeyDown={(event) => {
              const next =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? modes.length - 1
                    : event.key === 'ArrowRight'
                      ? (index + 1) % modes.length
                      : event.key === 'ArrowLeft'
                        ? (index + modes.length - 1) % modes.length
                        : null
              if (next === null) return
              event.preventDefault()
              onChange(modes[next].key)
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
            }}
            className={`inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none sm:flex-none md:min-h-10 ${
              active
                ? 'bg-surface text-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]'
                : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground'
            }`}
          >
            <Icon aria-hidden className={`size-4 shrink-0 ${active ? 'text-primary' : ''}`} strokeWidth={1.5} />
            <span className='min-w-0 [overflow-wrap:anywhere]'>{translate(`invoice.${key}`)}</span>
            {count !== undefined && (
              <span
                className={`shrink-0 rounded-md px-1.5 font-mono text-[11px] tabular-nums ${
                  active ? 'bg-primary-soft text-primary-ink' : 'bg-surface-subtle text-muted-foreground'
                }`}
              >
                {formatNumber(count)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
