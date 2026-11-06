import { customAxios } from '~/shared/api/mutator/custom-axios'
import { env } from '~/shared/config/env'

// --- 1. Budget Summary (Màn 1) ---
export interface BudgetSummaryTotalsItem {
  currency: string
  base: { amount: string; currency: string }
  reserve: { amount: string; currency: string }
  total: { amount: string; currency: string }
  committed: { amount: string; currency: string }
  spent: { amount: string; currency: string }
  remaining: { amount: string; currency: string }
  costCenterCount: number
  overBudgetCount: number
}

export interface BudgetSummaryResponseDto {
  success: boolean
  message: string
  data: {
    year: number
    totals: Record<string, BudgetSummaryTotalsItem>
    lastInvoiceRecordedAt: string | null
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

// --- 3. Invoices & Extended Commitments (Màn 4) ---
export type InvoiceMatchResult = 'MATCHED' | 'TAX_ONLY' | 'PRICE_QUANTITY_EXCEPTION'

export interface InvoiceItem {
  id: string
  number: string
  issuedOn: string
  netAmount: { amount: string; currency: string }
  deductibleTax: { amount: string; currency: string }
  nonDeductibleTax: { amount: string; currency: string }
  actualCost: { amount: string; currency: string }
  matchResult: InvoiceMatchResult
  note: string | null
  recordedBy: {
    employeeId: string
    employeeCode: string
    fullName: string
  } | null
  recordedAt: string
}

export interface InvoiceListResponseDto {
  success: boolean
  message: string
  data: {
    items: InvoiceItem[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
    }
  }
}

export interface CreateInvoiceBody {
  number: string
  issuedOn: string
  netAmount: { amount: string }
  deductibleTax?: { amount: string }
  nonDeductibleTax?: { amount: string }
  note?: string
}

export interface InvoiceRecordedResponseDto {
  success: boolean
  message: string
  data: {
    invoice: InvoiceItem
    commitment: ExtendedCommitmentItem
  }
}

export interface ExtendedCommitmentItem {
  id: string
  requestId: string
  costCenter: { id: string; code: string; name: string }
  year: number
  amount: { amount: string; currency: string }
  released: { amount: string; currency: string }
  held: { amount: string; currency: string }
  invoiced?: { amount: string; currency: string }
  invoiceCount?: number
  hasDiscrepancy?: boolean
  state: 'HELD' | 'RELEASED' | 'EXPENSED'
  attached: boolean
  attachedAt: string | null
  unattachedReason: 'NO_BUDGET' | null
  createdAt: string
  request?: {
    id: string
    software: { name: string }
    plan: { name: string } | null
    requester: { employeeCode: string; fullName: string }
    beneficiaryCount: number
    spendApprovedAt: string | null
  } | null
}

export interface ExtendedCommitmentListResponseDto {
  success: boolean
  message: string
  data: {
    items: ExtendedCommitmentItem[]
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
    }
  }
}

export interface ExtendedCommitmentListParams {
  attached?: boolean
  costCenterId?: string
  page?: number
  pageSize?: number
  requestId?: string
  state?: 'HELD' | 'RELEASED' | 'EXPENSED'
  year?: number
}

export const getCommitmentInvoices = (commitmentId: string, params?: { page?: number; pageSize?: number }, signal?: AbortSignal) => {
  return customAxios<InvoiceListResponseDto>({
    url: `${env.API_BASE_URL}/api/v1/budget-commitments/${commitmentId}/invoices`,
    method: 'GET',
    params,
    signal
  })
}

export const getCommitmentInvoicesQueryKey = (commitmentId: string, params?: { page?: number; pageSize?: number }) => {
  return [
    `${env.API_BASE_URL}/api/v1/budget-commitments/${commitmentId}/invoices`,
    ...(params ? [params] : [])
  ] as const
}

export const recordCommitmentInvoice = (commitmentId: string, data: CreateInvoiceBody) => {
  return customAxios<InvoiceRecordedResponseDto>({
    url: `${env.API_BASE_URL}/api/v1/budget-commitments/${commitmentId}/invoices`,
    method: 'POST',
    data
  })
}

export const getExtendedCommitmentList = (params?: ExtendedCommitmentListParams, signal?: AbortSignal) => {
  return customAxios<ExtendedCommitmentListResponseDto>({
    url: `${env.API_BASE_URL}/api/v1/budget-commitments`,
    method: 'GET',
    params,
    signal
  })
}

export const getExtendedCommitmentListQueryKey = (params?: ExtendedCommitmentListParams) => {
  return [`${env.API_BASE_URL}/api/v1/budget-commitments`, ...(params ? [params] : [])] as const
}

