import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import './workspace.css'

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions
}: {
  eyebrow: string
  title: string
  description?: string
  icon: LucideIcon
  actions?: ReactNode
}) {
  return (
    <header className='flex flex-wrap items-start justify-between gap-4'>
      <div className='flex min-w-0 items-start gap-3'>
        <span className='grid size-11 shrink-0 place-items-center rounded-lg border border-primary/15 bg-primary-soft text-primary-ink'>
          <Icon aria-hidden strokeWidth={1.5} className='size-5' />
        </span>
        <div className='min-w-0'>
          <p className='mb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>{eyebrow}</p>
          <h1 className='text-2xl font-semibold leading-tight tracking-tight [text-wrap:balance]'>{title}</h1>
          {description && (
            <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
    </header>
  )
}
