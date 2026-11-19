import { customAxios } from '~/shared/api/mutator/custom-axios'
import { env } from '~/shared/config/env'

// --- 1. Budget Summary (Màn 1) ---
export interface BudgetSummaryTotalsItem {
  currency: string
  base: { amount: string; currency: string }
  reserve: { amount: string; currency: string }
  total: { amount: string; currency: string }
  /** Budget in force: the version plus approved adjustments. Everything below is measured against it. */
  effectiveBudget: {
    base: { amount: string; currency: string }
    reserve: { amount: string; currency: string }
    total: { amount: string; currency: string }
    adjustment: { amount: string; currency: string }
  }
  committed: { amount: string; currency: string }
  spent: { amount: string; currency: string }
  pendingSpend: { amount: string; currency: string }
  remaining: { amount: string; currency: string }
  remainingBase: { amount: string; currency: string }
  remainingWithReserve: { amount: string; currency: string }
  costCenterCount: number
  overBudgetCount: number
}

export interface BudgetSummaryResponseDto {
  success: boolean
  message: string
  data: {
    year: number
    annualCeiling?: { amount: string; currency: string } | null
    sharedPoolReserve?: { amount: string; currency: string } | null
    totals: Record<string, BudgetSummaryTotalsItem>
    lastInvoiceRecordedAt: string | null
    companySpent?: { amount: string; currency: string } | null
    sharedPoolUnallocated?: { amount: string; currency: string } | null
    sharedPoolOverReserve?: boolean | null
    seatMonthsWithoutCostCenter?: { amount: string; currency: string } | null
  }
}

export const getBudgetSummary = (year: number, signal?: AbortSignal) => {
  return customAxios<BudgetSummaryResponseDto>({
    url: `${env.API_BASE_URL}/api/v1/budgets/summary`,
    method: 'GET',
    params: { year },
    signal
  })
}

export const getBudgetSummaryQueryKey = (year?: number) => {
  return [`${env.API_BASE_URL}/api/v1/budgets/summary`, ...(year !== undefined ? [{ year }] : [])] as const
}

// --- 2. Spend Batches (Màn 3) ---
export interface SpendBatchListItem {
  id: string
  department: {
    id: string
    name: string
  }
  submittedBy: {
    employeeId: string
    employeeCode: string
    fullName: string
  }
  submittedAt: string
  itemCount: number
  approvedCount: number
  pendingCount: number
  approvedAmounts: Record<string, string>
}

export interface SpendBatchListResponseDto {
  success: boolean
  message: string
  data: {
    items: SpendBatchListItem[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
    }
  }
}

export interface SpendBatchListParams {
  page?: number
  pageSize?: number
  departmentId?: string
  submittedFrom?: string
  submittedTo?: string
}

export const getSpendBatchList = (params?: SpendBatchListParams, signal?: AbortSignal) => {
  return customAxios<SpendBatchListResponseDto>({
    url: `${env.API_BASE_URL}/api/v1/spend-batches`,
    method: 'GET',
    params,
    signal
  })
}

export const getSpendBatchListQueryKey = (params?: SpendBatchListParams) => {
  return [`${env.API_BASE_URL}/api/v1/spend-batches`, ...(params ? [params] : [])] as const
}
