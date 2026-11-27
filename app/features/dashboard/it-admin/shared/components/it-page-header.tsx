import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Compact page heading; contextual record information stays below the title. */
export function ItPageHeader({
  icon: Icon,
  context,
  title,
  subtitle,
  actions,
  children
}: {
  icon: LucideIcon
  context?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  /** Extra content below the title row, e.g. segmented section tabs. */
  children?: ReactNode
}) {
  return (
    <header className='min-w-0'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='min-w-0 flex-1 basis-64'>
          <h1 className='flex items-start gap-2.5 text-xl leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-2xl'>
            <Icon aria-hidden strokeWidth={1.5} className='mt-0.5 size-6 shrink-0 text-primary-ink' />
            {title}
          </h1>
          {context && <p className='mt-1.5 text-sm font-medium text-primary-ink [overflow-wrap:anywhere]'>{context}</p>}
          {subtitle && (
            <p className='mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
      </div>
      {children && <div className='mt-4'>{children}</div>}
    </header>
  )
}

/** Section heading with the brand accent bar, optional hint and trailing action. */
export function ItSectionTitle({
  title,
  hint,
  action,
  as: Heading = 'h2'
}: {
  title: string
  hint?: string
  action?: ReactNode
  as?: 'h2' | 'h3'
}) {
  return (
    <div className='flex flex-wrap items-end justify-between gap-3'>
      <div className='min-w-0'>
        <Heading className='section-accent text-base font-semibold tracking-tight text-foreground [text-wrap:balance]'>
          {title}
        </Heading>
        {hint && <p className='mt-1 pl-3 text-sm text-muted-foreground [text-wrap:pretty]'>{hint}</p>}
      </div>
      {action}
    </div>
  )
}

/** Segmented control for in-page sections (level 3 navigation), usually placed inside the page banner. */
export function ItSegmented<T extends string>({
  label,
  items,
  value,
  onChange
}: {
  label: string
  items: readonly { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
}) {
  return (
    <div
      role='group'
      aria-label={label}
      className='flex w-full gap-1 overflow-x-auto rounded-lg border border-border/70 bg-surface/80 p-1 whitespace-nowrap sm:w-fit'
    >
      {items.map((item) => (
        <button
          key={item.key}
          type='button'
          aria-pressed={value === item.key}
          className='min-h-11 shrink-0 rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-primary-soft aria-pressed:text-primary-ink md:min-h-10'
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
