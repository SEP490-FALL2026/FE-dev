import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** White rounded panel with an accented title; the Employee counterpart of WorkspaceSection. */
export function EmployeeSection({
  title,
  description,
  action,
  icon: Icon,
  children
}: {
  title?: string
  description?: string
  action?: ReactNode
  icon?: LucideIcon
  children: ReactNode
}) {
  return (
    <section className='min-w-0 rounded-2xl border border-border/60 bg-surface shadow-sm'>
      {title && (
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-4 py-4 sm:px-5'>
          <div className='flex min-w-0 items-start gap-3'>
            {Icon && (
              <span
                aria-hidden='true'
                className='grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-ink'
              >
                <Icon strokeWidth={1.5} className='size-4' />
              </span>
            )}
            <div className='min-w-0'>
              <h2 className='section-accent text-base font-semibold [text-wrap:balance]'>{title}</h2>
              {description && (
                <p className='mt-1 text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>{description}</p>
              )}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className='space-y-4 p-4 sm:p-5'>{children}</div>
    </section>
  )
}

/** Tinted toolbar that holds the filters of a list. */
export function EmployeeToolbar({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role='group' aria-label={label} className='soft-panel space-y-3 p-3 sm:p-4'>
      {children}
    </div>
  )
}

export interface EmployeeSegment<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

/** Pill switcher for sibling views of one page (lists, request modes, involvement). */
export function EmployeeSegmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled
}: {
  label: string
  value: T
  options: readonly EmployeeSegment<T>[]
  onChange: (value: T) => void
  disabled?: boolean
}) {
  return (
    <div
      role='group'
      aria-label={label}
      className='flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border/60 bg-surface p-1 shadow-sm sm:inline-flex'
    >
      {options.map((option) => {
        const Icon = option.icon
        const active = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-primary-soft hover:text-primary-ink'}`}
          >
            {Icon && <Icon aria-hidden strokeWidth={1.5} className='size-4' />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Numbered group inside a long form so related fields read as one step. */
export function EmployeeFormStep({
  step,
  title,
  hint,
  children
}: {
  step: number
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <fieldset className='min-w-0 space-y-4 rounded-xl border border-border/50 p-4 sm:p-5'>
      <legend className='flex items-center gap-2 px-1 text-sm font-semibold'>
        <span
          aria-hidden='true'
          className='grid size-6 place-items-center rounded-md bg-primary-soft font-mono text-xs text-primary-ink tabular-nums'
        >
          {step}
        </span>
        {title}
      </legend>
      {hint && <p className='-mt-1 text-sm leading-relaxed text-muted-foreground'>{hint}</p>}
      {children}
    </fieldset>
  )
}
