import type { ComponentProps } from 'react'
import type { WorkspacePageHeader } from '~/shared/ui/workspace-page-header'

/** Keep page identity and its primary action together without a second workspace banner. */
export function EmployeePageHeader({
  title,
  description,
  icon: Icon,
  actions
}: Omit<ComponentProps<typeof WorkspacePageHeader>, 'eyebrow'>) {
  return (
    <header className='flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 bg-surface px-4 py-4 sm:px-5'>
      <div className='flex min-w-0 flex-1 basis-full items-center gap-3 sm:basis-auto'>
        <span className='grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'>
          <Icon aria-hidden strokeWidth={1.5} className='size-5' />
        </span>
        <div className='min-w-0'>
          <h1 className='text-xl font-semibold leading-tight tracking-tight [overflow-wrap:anywhere]'>{title}</h1>
          {description && (
            <p className='mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]'>
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
    </header>
  )
}
