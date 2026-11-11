import { useQueries, useQuery } from '@tanstack/react-query'
import type { CommitmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-commitments/commitmentListResponseDtoDataItemsItem'
import {
  budgetCommitmentList,
  getBudgetCommitmentListQueryKey
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import { getBudgetVersionGetQueryOptions } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { useBudgetTable } from '~/shared/api/generated/operations/budgets/budget-table'

const pageSize = 100
/** Upper bound for the overview; a year with more commitments than this is reported as truncated. */
const maxCommitmentPages = 10

async function loadYearCommitments(year: number, signal: AbortSignal) {
  const items: CommitmentListResponseDtoDataItemsItem[] = []
  for (let page = 1; page <= maxCommitmentPages; page += 1) {
    const response = await budgetCommitmentList({ year, page, pageSize }, undefined, signal)
    items.push(...(response.data?.items ?? []))
    const totalPages = response.data?.pagination.totalPages ?? 1
    if (page >= totalPages) return { items, truncated: false }
  }
  return { items, truncated: true }
}

export function useOverviewAnalytics(year: number) {
  const budgets = useBudgetTable({ year, page: 1, pageSize })
  const commitments = useQuery({
    queryKey: [...getBudgetCommitmentListQueryKey({ year }), 'overview-all-pages'],
    queryFn: ({ signal }) => loadYearCommitments(year, signal)
  })
  const budgetRows = budgets.data?.data?.items ?? []
  const versions = useQueries({
    queries: budgetRows
      .filter((row) => row.versionId !== null)
      .map((row) => getBudgetVersionGetQueryOptions(row.versionId!)),
    combine: (results) => ({
      splits: results.flatMap((result) => (result.data?.data ? [result.data.data.version.quarters] : [])),
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
      isFetching: results.some((result) => result.isFetching),
      error: results.find((result) => result.isError)?.error ?? null,
      refetch: () => Promise.all(results.map((result) => result.refetch()))
    })
  })
  return {
    budgets,
    budgetRows,
    budgetsTruncated: (budgets.data?.data?.pagination.totalPages ?? 1) > 1,
    commitments,
    versions
  }
}
