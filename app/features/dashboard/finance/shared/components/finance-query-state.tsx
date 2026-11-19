import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getFinanceError } from '../finance-errors'
import { recordFinanceRetry, useFinanceRetry } from '../hooks/use-finance-retry'
import { FinanceSkeleton, type FinanceSkeletonShape } from './finance-skeleton'

export function FinanceQueryState({
  query,
  children,
  skeleton = 'table',
  skeletonRows
}: {
  query: { isPending: boolean; isError: boolean; isFetching?: boolean; error: unknown; refetch: () => unknown }
  children: ReactNode
  /** Shape of the loading placeholder; match the content it stands in for. */
  skeleton?: FinanceSkeletonShape
  skeletonRows?: number
}) {
  const { t: translate } = useTranslation('finance')
  const queryClient = useQueryClient()
  const retrySeconds = useFinanceRetry()
  useEffect(() => {
    if (!query.isError) return
    recordFinanceRetry(queryClient, query.error)
    if (getFinanceError(query.error).key === 'forbidden') {
      void queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
    }
  }, [query.isError, query.error, queryClient])
  if (query.isPending) return <FinanceSkeleton label={translate('loading')} shape={skeleton} rows={skeletonRows} />
  if (query.isError) {
    const failure = getFinanceError(query.error)
    return (
      <div role='alert' className='space-y-3 rounded-xl border border-danger/25 bg-danger/5 p-6'>
        <p className='text-sm'>{translate(`errors.${failure.key}`)}</p>
        {failure.key !== 'forbidden' && (
          <button
            type='button'
            disabled={retrySeconds > 0}
            className='inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-3.5 text-sm font-medium transition-colors duration-150 hover:border-primary/40 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none enabled:active:bg-primary-soft enabled:active:text-primary-ink disabled:cursor-not-allowed disabled:opacity-50 md:min-h-10'
            onClick={() => void query.refetch()}
          >
            {retrySeconds ? translate('retryAfter', { seconds: retrySeconds }) : translate('retry')}
          </button>
        )}
      </div>
    )
  }
  return (
    <div
      aria-busy={query.isFetching || undefined}
      className={`space-y-4 transition-opacity duration-150 ${query.isFetching ? 'opacity-70' : ''}`}
    >
      {query.isFetching && (
        <p role='status' className='sr-only'>
          {translate('refreshing')}
        </p>
      )}
      {children}
    </div>
  )
}
