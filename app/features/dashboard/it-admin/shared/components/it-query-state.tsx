import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
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
    <p role='status' className='p-6 text-sm text-muted-foreground'>
      {translate('empty')}
    </p>
  )
}
