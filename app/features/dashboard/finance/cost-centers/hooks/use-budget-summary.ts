import { useQuery } from '@tanstack/react-query'
import {
  getBudgetSummary,
  getBudgetSummaryQueryKey,
  type BudgetSummaryTotalsItem
} from '../../shared/finance-api-extensions'

export interface ComputedBudgetSummary {
  totals: BudgetSummaryTotalsItem | null
  lastInvoiceRecordedAt: string | null
  isLoading: boolean
  isError: boolean
}

/** Year totals from the budget summary API; nothing is estimated on the client when it is unavailable. */
export function useBudgetSummary(year: number | undefined): ComputedBudgetSummary {
  const summaryQuery = useQuery({
    queryKey: getBudgetSummaryQueryKey(year),
    enabled: year !== undefined,
    queryFn: async ({ signal }) => {
      if (year === undefined) throw new Error('Year is required')
      return getBudgetSummary(year, signal)
    },
    retry: 1
  })
  const summary = summaryQuery.data?.data
  const totals = summary?.totals ? (Object.values(summary.totals)[0] ?? null) : null
  return {
    totals,
    lastInvoiceRecordedAt: summary?.lastInvoiceRecordedAt ?? null,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError
  }
}
