import { useQueries, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import { useState } from 'react'

type PagedEnvelope = {
  data?: { items: readonly unknown[]; pagination: { page: number; totalPages: number } } | null
}
type PageItem<TEnvelope extends PagedEnvelope> = NonNullable<TEnvelope['data']>['items'][number]

/**
 * Accumulates server pages for a searchable picker: "load more" appends the next page, a new `resetKey`
 * (search text or filter) starts again from page 1. Every page is an ordinary cached query of the generated client.
 */
export function usePagedOptions<TEnvelope extends PagedEnvelope, TError>(
  resetKey: string,
  optionsFor: (page: number) => UseQueryOptions<TEnvelope, TError, TEnvelope, QueryKey>
) {
  const [loaded, setLoaded] = useState({ key: resetKey, pages: 1 })
  const pages = loaded.key === resetKey ? loaded.pages : 1
  const results = useQueries({ queries: Array.from({ length: pages }, (_, index) => optionsFor(index + 1)) })
  const first = results[0]
  const last = results[results.length - 1]
  const pagination = last?.data?.data?.pagination
  const items = results.flatMap((result) => (result.data?.data?.items ?? []) as PageItem<TEnvelope>[])
  return {
    /** First page drives the loading, error and retry state of the picker. */
    query: first,
    items,
    loading: results.some((result) => result.isFetching),
    hasMore: !!pagination && pagination.page < pagination.totalPages && !last?.isFetching,
    loadMore: () => setLoaded({ key: resetKey, pages: pages + 1 })
  }
}
