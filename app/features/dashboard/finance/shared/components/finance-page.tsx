import type { ReactNode } from 'react'

export function FinancePage({
  title,
  description,
  children,
  actions
}: {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}) {
  const wrapper =
    'min-w-0 space-y-6 [&_button:enabled]:cursor-pointer [&_select:enabled]:cursor-pointer [&_summary]:cursor-pointer'
  return (
    <div className={wrapper}>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div className='min-w-0 flex-1 basis-64'>
          <h1 className='text-xl leading-tight font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-2xl'>
            {title}
          </h1>
          {description && (
            <p className='mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
              {description}
            </p>
          )}
        </div>
        {actions && <div className='relative flex flex-wrap items-center gap-2'>{actions}</div>}
      </header>
      {children}
    </div>
  )
}
