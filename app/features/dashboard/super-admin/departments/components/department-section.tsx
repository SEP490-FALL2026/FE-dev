import { useId, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function DepartmentSection({
  title,
  icon: Icon,
  action,
  children
}: {
  title: string
  icon: LucideIcon
  action?: ReactNode
  children: ReactNode
}) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      className='min-w-0 rounded-xl border border-border/80 bg-surface shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)]'
    >
      <header className='flex flex-wrap items-center gap-3 border-b border-border/60 px-5 py-4 sm:px-6'>
        <span className='kpi-chip grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft/70 text-primary-ink'>
          <Icon aria-hidden className='size-[1.125rem]' strokeWidth={1.5} />
        </span>
        <h2 id={headingId} className='min-w-0 flex-1 text-base font-semibold tracking-tight [text-wrap:balance]'>
          {title}
        </h2>
        {action}
      </header>
      <div className='p-5 sm:p-6'>{children}</div>
    </section>
  )
}
