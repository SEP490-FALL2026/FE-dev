import { CalendarClock, FileCheck2, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  return (
    <div
      role='tablist'
      aria-label={translate('invoice.title')}
      className='soft-panel inline-flex w-full gap-1 p-1 sm:w-auto'
    >
      {modes.map(({ key, icon: Icon }) => {
        const active = mode === key
        const count = counts[key]
        return (
          <button
            key={key}
            type='button'
            role='tab'
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none sm:flex-none md:min-h-9 ${
              active
                ? 'bg-surface text-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]'
                : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground'
            }`}
          >
            <Icon aria-hidden className={`size-4 ${active ? 'text-primary' : ''}`} strokeWidth={1.5} />
            {translate(`invoice.${key}`)}
            {count !== undefined && (
              <span
                className={`rounded-full px-1.5 font-mono text-[11px] tabular-nums ${
                  active ? 'bg-primary-soft text-primary-ink' : 'bg-surface-subtle text-muted-foreground'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
