import type { ReactNode } from 'react'

export function WorkspaceSection({
  title,
  children,
  action,
  description
}: {
  title?: string
  children: ReactNode
  action?: ReactNode
  description?: string
}) {
  return (
    <section className='min-w-0 rounded-lg border border-border/60 bg-surface shadow-sm'>
      {title && (
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-4 py-4 sm:px-5'>
          <div>
            <h2 className='text-sm font-semibold [text-wrap:balance]'>{title}</h2>
            {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className='space-y-4 p-4 sm:p-5'>{children}</div>
    </section>
  )
}
