import { useQueries } from '@tanstack/react-query'
import {
  getBudgetCheckYearListQueryOptions,
  useBudgetCheckYearList
} from '~/shared/api/generated/operations/budget-checks/budget-check-year-list'
import { BUDGET_YEAR_CODE } from '../enums/budget-year-code'

export function useSpendYears(requestId: string) {
  const first = useBudgetCheckYearList(requestId, { page: 1, pageSize: 100 })
  const totalPages = first.data?.data?.pagination.totalPages ?? 0
  const rest = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      getBudgetCheckYearListQueryOptions(requestId, { page: index + 2, pageSize: 100 })
    )
  })
  const queries = rest.slice()
  queries.unshift(first)
  const years = queries.flatMap((query) => query.data?.data?.items ?? [])
  const knownCodes: readonly (string | null)[] = [null, ...Object.values(BUDGET_YEAR_CODE)]
  const isComplete =
    queries.every((query) => query.isSuccess && !query.isFetching) &&
    first.data?.data?.pagination.totalItems === years.length &&
    years.every((year) => knownCodes.includes(year.code)) &&
    new Set(years.map((year) => year.year)).size === years.length
  return {
    years,
    isComplete,
    isPending: queries.some((query) => query.isPending),
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.isError)?.error ?? null,
    refetch: () => Promise.all(queries.map((query) => query.refetch()))
  }
}
