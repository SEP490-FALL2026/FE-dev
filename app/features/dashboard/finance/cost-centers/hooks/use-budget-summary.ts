import { useQuery } from '@tanstack/react-query'
import {
  getBudgetSummary,
  getBudgetSummaryQueryKey,
  type BudgetSummaryTotalsItem
} from '../../shared/finance-api-extensions'
import { useCurrentBudgetsByCostCenter } from './use-cost-center-budgets'

export interface ComputedBudgetSummary {
  totals: BudgetSummaryTotalsItem | null
  lastInvoiceRecordedAt: string | null
  isFallback: boolean
  isLoading: boolean
  isError: boolean
}

const amountOf = (value?: { amount: string } | null) => {
  if (!value) return 0
  const parsed = Number(value.amount)
  return Number.isFinite(parsed) ? parsed : 0
}

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

  const fallbackBudgets = useCurrentBudgetsByCostCenter(year)

  // 1. Dùng trực tiếp dữ liệu từ GET /api/v1/budgets/summary nếu thành công và có totals
  const summaryData = summaryQuery.data?.data
  if (summaryData?.totals) {
    const totalsList = Object.values(summaryData.totals)
    if (totalsList.length > 0) {
      return {
        totals: totalsList[0],
        lastInvoiceRecordedAt: summaryData.lastInvoiceRecordedAt,
        isFallback: false,
        isLoading: summaryQuery.isLoading,
        isError: false
      }
    }
  }

  // 2. Fallback: tự động tổng hợp từ bảng budgetTable
  const budgetRows = fallbackBudgets.data ? [...fallbackBudgets.data.byCostCenter.values()] : []
  if (budgetRows.length > 0) {
    const currency = budgetRows[0].total?.currency || 'VND'
    let totalSum = 0
    let committedSum = 0
    let spentSum = 0
    let remainingSum = 0
    let overBudgetCount = 0
    let baseSum = 0
    let reserveSum = 0

    for (const row of budgetRows) {
      const t = amountOf(row.total)
      const c = amountOf(row.committed)
      const s = amountOf(row.spent)
      const r = amountOf(row.remaining)

      totalSum += t
      committedSum += c
      spentSum += s
      remainingSum += r
      if (row.overCommitted || r < 0) overBudgetCount++

      baseSum += amountOf(row.base)
      reserveSum += amountOf(row.reserve)
    }

    const fallbackTotals: BudgetSummaryTotalsItem = {
      currency,
      base: { amount: String(baseSum), currency },
      reserve: { amount: String(reserveSum), currency },
      total: { amount: String(totalSum), currency },
      committed: { amount: String(committedSum), currency },
      spent: { amount: String(spentSum), currency },
      remaining: { amount: String(remainingSum), currency },
      costCenterCount: budgetRows.length,
      overBudgetCount
    }

    return {
      totals: fallbackTotals,
      lastInvoiceRecordedAt: null,
      isFallback: true,
      isLoading: fallbackBudgets.isLoading,
      isError: fallbackBudgets.isError
    }
  }

  return {
    totals: null,
    lastInvoiceRecordedAt: null,
    isFallback: false,
    isLoading: summaryQuery.isLoading || fallbackBudgets.isLoading,
    isError: summaryQuery.isError && fallbackBudgets.isError
  }
}
