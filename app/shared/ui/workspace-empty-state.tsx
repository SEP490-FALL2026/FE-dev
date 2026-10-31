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
      <span className='mb-4 grid size-12 place-items-center rounded-lg border border-border/60 bg-surface-subtle text-muted-foreground'>
        <Icon aria-hidden strokeWidth={1.5} className='size-6' />
      </span>
      <p className='text-sm font-semibold'>{title}</p>
      {description && (
        <p className='mt-2 max-w-md text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>{description}</p>
      )}
      {action && <div className='mt-5'>{action}</div>}
    </div>
  )
}
