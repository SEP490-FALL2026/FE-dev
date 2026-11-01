import { useId, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function DepartmentSection({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon: LucideIcon
  children: ReactNode
}) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className='min-w-0 rounded-lg border border-border/80 bg-surface shadow-sm'>
      <header className='flex items-center gap-3 border-b border-border/70 px-5 py-4 sm:px-6'>
        <span className='grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft/60 text-primary-ink'>
          <Icon aria-hidden className='size-[1.125rem]' strokeWidth={1.5} />
        </span>
        <h2 id={headingId} className='text-base font-semibold tracking-tight [text-wrap:balance]'>
          {title}
        </h2>
      </header>
      <div className='p-5 sm:p-6'>{children}</div>
    </section>
  )
}
