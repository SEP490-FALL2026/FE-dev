import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getMeGetQueryKey, getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getApprovalsError } from '../approvals-errors'
import { recordApprovalsRetry, useApprovalsRetry } from '../hooks/use-approvals-retry'
import { ApprovalsSkeleton } from './approvals-skeleton'

export function ApprovalsQueryState({
  query,
  children
}: {
  query: {
    queryKey?: readonly unknown[]
    isPending: boolean
    isError: boolean
    isFetching?: boolean
    error: unknown
    refetch: () => unknown
  }
  children: ReactNode
}) {
  const { t: translate } = useTranslation('approvals')
  const queryClient = useQueryClient()
  const retrySeconds = useApprovalsRetry()
  const isIdentityQuery = query.queryKey?.[0] === getMeGetQueryKey()[0]
  useEffect(() => {
    if (!query.isError) return
    recordApprovalsRetry(queryClient, query.error)
    if (!isIdentityQuery && getApprovalsError(query.error).key === 'forbidden') {
      void queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
    }
  }, [query.isError, query.error, queryClient, isIdentityQuery])
  if (query.isPending) return <ApprovalsSkeleton label={translate('loading')} />
  if (query.isError) {
    const failure = getApprovalsError(query.error)
    return (
      <div role='alert' className='space-y-3 rounded-lg border border-border bg-surface p-6'>
        <p className='text-sm'>{translate(`errors.${failure.key}`)}</p>
        {failure.requestId && (
          <p className='text-right font-mono text-xs text-muted-foreground'>
            {translate('requestId', { value: failure.requestId })}
          </p>
        )}
        {failure.key !== 'forbidden' && (
          <button
            type='button'
            disabled={retrySeconds > 0 || query.isFetching}
            className='min-h-11 rounded-md border border-border px-3 text-sm disabled:opacity-50 md:min-h-9'
            onClick={() => void query.refetch()}
          >
            {retrySeconds > 0 ? translate('retryAfter', { seconds: retrySeconds }) : translate('retry')}
          </button>
        )}
      </div>
    )
  }
  return (
    <div aria-busy={query.isFetching || undefined} className='space-y-4'>
      {query.isFetching && (
        <p role='status' className='text-xs text-muted-foreground'>
          {translate('refreshing')}
        </p>
      )}
      {children}
    </div>
  )
}
