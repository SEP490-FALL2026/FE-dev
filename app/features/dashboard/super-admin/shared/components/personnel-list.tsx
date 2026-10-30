import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminEmpty } from './admin-query-state'
import { adminButtonClass } from './admin-form'

export function PersonnelList({ children, empty }: { children: ReactNode; empty: boolean }) {
  return empty ? <AdminEmpty /> : <div className='grid gap-3'>{children}</div>
}
export function PersonnelCard({
  title,
  children,
  actions
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  return (
    <article className='rounded-lg border border-border bg-surface p-4'>
      <div className='flex items-start justify-between gap-3'>
        <h3 className='min-w-0 truncate font-semibold' title={title}>
          {title}
        </h3>
        {actions && (
          <details className='relative shrink-0'>
            <summary className={`${adminButtonClass} cursor-pointer list-none`}>{translate('actions')}</summary>
            <div className='absolute right-0 z-10 mt-1 grid min-w-48 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
              {actions}
            </div>
          </details>
        )}
      </div>
      <div className='mt-2 grid gap-1 text-sm text-muted-foreground'>{children}</div>
    </article>
  )
}
export function PersonnelCode({
  code,
  values,
  plain = false
}: {
  code: string
  values: readonly string[]
  plain?: boolean
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  return (
    <span className={plain ? 'text-xs text-muted-foreground' : 'w-fit rounded-md bg-surface-subtle px-2 py-1 text-xs'}>
      {values.includes(code)
        ? translate(`codes.${code}`, { defaultValue: translate('unknown') })
        : translate('unknown')}
    </span>
  )
}
