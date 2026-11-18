import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function WorkspaceEmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className='flex flex-col items-center px-4 py-10 text-center sm:py-12'>
      <span className='mb-4 grid size-14 place-items-center rounded-xl border border-primary/15 bg-primary-soft/60 text-primary-ink shadow-[0_8px_20px_-12px_var(--theme-primary)]'>
        <Icon aria-hidden strokeWidth={1.5} className='size-6' />
      </span>
      <p className='text-sm font-semibold'>{title}</p>
      {description && (
        <p className='mt-2 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground'>{description}</p>
      )}
      {action && <div className='mt-5'>{action}</div>}
    </div>
  )
}
