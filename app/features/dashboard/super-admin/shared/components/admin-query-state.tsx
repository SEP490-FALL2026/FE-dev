import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getAdminError } from '../hooks/admin-errors'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'

export function AdminQueryState({
  query,
  children
}: {
  query: { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown }
  children: ReactNode
}) {
  const { t: translate } = useTranslation('admin')
  const queryClient = useQueryClient()
  useEffect(() => {
    if (query.isError && getAdminError(query.error).key === 'forbidden') {
      void queryClient
        .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
        .catch(() => undefined)
    }
  }, [query.isError, query.error, queryClient])
  if (query.isPending)
    return (
      <div role='status' className='flex items-center gap-2 p-6'>
        <LoaderCircle aria-hidden className='size-5 animate-spin' strokeWidth={1.5} />
        {translate('loading')}
      </div>
    )
  if (query.isError) {
    const failure = getAdminError(query.error)
    return (
      <div role='alert' className='space-y-3 rounded-lg border border-border bg-surface p-6'>
        <p>{translate(`errors.${failure.key}`)}</p>
        {failure.requestId && (
          <p className='break-all text-xs text-muted-foreground'>{translate('requestId', { id: failure.requestId })}</p>
        )}
        <button
          type='button'
          className='min-h-11 rounded-md border border-border px-4 md:min-h-9'
          onClick={() => void query.refetch()}
        >
          {translate('retry')}
        </button>
      </div>
    )
  }
  return <>{children}</>
}

export function AdminEmpty() {
  const { t: translate } = useTranslation('admin')
  return (
    <p role='status' className='p-6 text-sm text-muted-foreground'>
      {translate('empty')}
    </p>
  )
}
