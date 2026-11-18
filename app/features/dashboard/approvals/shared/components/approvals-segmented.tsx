import type { LucideIcon } from 'lucide-react'

/**
 * Switches between the lists of one screen (requests / batches, versions / proposals / cycles …). Rendered as a quiet
 * segmented bar so the lists read as parts of the same page rather than as separate actions.
 */
export function ApprovalsSegmented<Key extends string>({
  label,
  items,
  value,
  onChange
}: {
  label: string
  items: readonly { key: Key; label: string; icon?: LucideIcon }[]
  value: Key
  onChange: (key: Key) => void
}) {
  return (
    <div
      role='tablist'
      aria-label={label}
      className='soft-panel flex w-full gap-1 overflow-x-auto p-1 sm:inline-flex sm:w-auto'
    >
      {items.map(({ key, label: itemLabel, icon: Icon }) => {
        const selected = value === key
        return (
          <button
            key={key}
            type='button'
            role='tab'
            aria-selected={selected}
            onClick={() => onChange(key)}
            className={`inline-flex min-h-11 flex-1 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none sm:flex-none md:min-h-9 ${
              selected
                ? 'bg-surface text-primary-ink shadow-[0_1px_3px_0_rgba(35,39,65,0.12)]'
                : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground'
            }`}
          >
            {Icon && <Icon aria-hidden className='size-4' strokeWidth={1.5} />}
            {itemLabel}
          </button>
        )
      })}
    </div>
  )
}
