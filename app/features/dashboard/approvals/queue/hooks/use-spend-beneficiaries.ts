import { useQueries } from '@tanstack/react-query'
import {
  getAccessRequestLineListQueryOptions,
  useAccessRequestLineList
} from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { BENEFICIARY_STATE } from '../enums/beneficiary-state'

/** Bounded by the Request group limit; decisions must cover every confirmed beneficiary, never just page one. */
export function useSpendBeneficiaries(requestId: string, enabled: boolean, expectedCount: number) {
  const first = useAccessRequestLineList(requestId, { page: 1, pageSize: 100 }, { query: { enabled } })
  const totalPages = first.data?.data?.pagination.totalPages ?? 0
  const remaining = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      getAccessRequestLineListQueryOptions(requestId, { page: index + 2, pageSize: 100 }, { query: { enabled } })
    )
  })
  const allQueries = remaining.slice()
  allQueries.unshift(first)
  const lines = allQueries.flatMap((query) => query.data?.data?.items ?? [])
  const totalItems = first.data?.data?.pagination.totalItems
  const knownStates: readonly string[] = Object.values(BENEFICIARY_STATE)
  const isComplete =
    enabled &&
    totalItems === lines.length &&
    lines.length === expectedCount &&
    new Set(lines.map((line) => line.employee.employeeId)).size === lines.length &&
    allQueries.every((query) => query.isSuccess && !query.isFetching) &&
    lines.every((line) => knownStates.includes(line.state))
  return {
    lines,
    isComplete,
    isPending: enabled && allQueries.some((query) => query.isPending),
    isError: enabled && allQueries.some((query) => query.isError),
    error: allQueries.find((query) => query.isError)?.error ?? null,
    refetch: () => Promise.all(allQueries.map((query) => query.refetch()))
  }
}
