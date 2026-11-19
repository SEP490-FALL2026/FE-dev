import type { ReactNode } from 'react'
import { Inbox, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getItError } from '../hooks/it-errors'
import { itButtonClass } from './it-form'

export function ItQueryState({
  query,
  children
}: {
  query: { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown }
  children: ReactNode
}) {
  const { t: translate } = useTranslation('itAdmin')
  if (query.isPending)
    return (
      <div role='status' className='flex items-center gap-2 p-6'>
        <LoaderCircle aria-hidden strokeWidth={1.5} className='size-5 animate-spin' />
        {translate('loading')}
      </div>
    )
  if (query.isError) {
    const failure = getItError(query.error)
    return (
      <div role='alert' className='space-y-3 rounded-lg border border-border bg-surface p-6'>
        <p>{translate(`errors.${failure.key}`)}</p>
        <button className={itButtonClass} onClick={() => void query.refetch()} type='button'>
          {translate('retry')}
        </button>
      </div>
    )
  }
  return <>{children}</>
}

export function ItEmpty() {
  const { t: translate } = useTranslation('itAdmin')
  return (
    <div
      role='status'
      className='col-span-full flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/60 px-6 py-10 text-center text-sm text-muted-foreground'
    >
      <span className='grid size-12 place-items-center rounded-xl bg-primary-soft text-primary-ink'>
        <Inbox aria-hidden strokeWidth={1.5} className='size-6' />
      </span>
      {translate('empty')}
    </div>
  )
}
