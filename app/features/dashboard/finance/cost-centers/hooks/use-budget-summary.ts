import { useQuery } from '@tanstack/react-query'
import {
  getBudgetSummary,
  getBudgetSummaryQueryKey,
  type BudgetSummaryTotalsItem
} from '../../shared/finance-api-extensions'

const FALLBACK_CURRENCY = 'VND'

const zero = (currency: string) => ({ amount: '0', currency })

/** A year with no budget yet has no totals in the response; its figures are zero, not missing. */
function emptyTotals(currency: string): BudgetSummaryTotalsItem {
  return {
    currency,
    base: zero(currency),
    reserve: zero(currency),
    total: zero(currency),
    committed: zero(currency),
    spent: zero(currency),
    remaining: zero(currency),
    costCenterCount: 0,
    overBudgetCount: 0
  }
}

/**
 * Year totals from the budget summary API. The totals always belong to the year asked for: while that year loads
 * the query is pending and no figure of another year is shown.
 */
export function useBudgetSummary(year: number | undefined) {
  const query = useQuery({
    queryKey: getBudgetSummaryQueryKey(year),
    enabled: year !== undefined,
    queryFn: async ({ signal }) => {
      if (year === undefined) throw new Error('Year is required')
      return getBudgetSummary(year, signal)
    },
    retry: 1
  })
  const summary = query.data?.data
  const first = summary?.totals ? (Object.values(summary.totals)[0] ?? null) : null
  const currency =
    first?.currency ?? summary?.annualCeiling?.currency ?? summary?.sharedPoolReserve?.currency ?? FALLBACK_CURRENCY
  return {
    query,
    totals: summary ? (first ?? emptyTotals(currency)) : null,
    lastInvoiceRecordedAt: summary?.lastInvoiceRecordedAt ?? null
  }
}
