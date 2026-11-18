import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Decorated page band shared by every IT Admin screen: icon tile, eyebrow, title, short hint and actions. */
export function ItPageHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  actions,
  children
}: {
  icon: LucideIcon
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  /** Extra content below the title row, e.g. segmented section tabs. */
  children?: ReactNode
}) {
  return (
    <header className='page-banner'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex min-w-0 flex-1 items-start gap-4'>
          <span className='grid size-12 shrink-0 place-items-center rounded-xl bg-surface text-primary shadow-[0_1px_2px_rgb(0_0_0/6%),0_8px_18px_-12px_var(--theme-primary)] ring-1 ring-primary/15'>
            <Icon aria-hidden strokeWidth={1.5} className='size-6' />
          </span>
          <div className='min-w-0'>
            {eyebrow && (
              <p className='mb-1 text-[11px] font-semibold uppercase tracking-widest text-primary-ink'>{eyebrow}</p>
            )}
            <h1 className='break-words text-2xl leading-tight font-semibold tracking-tight [text-wrap:balance]'>
              {title}
            </h1>
            {subtitle && (
              <p className='mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
                {subtitle}
              </p>
            )}
          </div>
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
          className='min-h-10 shrink-0 rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground aria-pressed:bg-primary-soft aria-pressed:text-primary-ink'
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
