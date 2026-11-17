import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  BudgetCommitmentListParams,
  CommitmentListResponseDtoDataItemsItem
} from '~/shared/api/generated/model/budget-commitments'
import {
  budgetCommitmentInvoiceList,
  getBudgetCommitmentInvoiceListQueryKey
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-invoice-list'
import {
  budgetCommitmentList,
  getBudgetCommitmentListQueryKey
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import { budgetCommitmentRelease } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-release'
import {
  budgetCommitmentReleases,
  getBudgetCommitmentReleasesQueryKey
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-releases'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getBudgetSummaryQueryKey } from '../../shared/finance-api-extensions'

export type CommitmentItem = CommitmentListResponseDtoDataItemsItem

/** What the list row already knows; it narrows the list so one commitment can be found by id (there is no GET by id). */
export interface CommitmentHints {
  requestId?: string
  costCenterId?: string
  year?: number
}

const LOOKUP_PAGE_SIZE = 100
const LOOKUP_MAX_PAGES = 10

export function useFinanceCommitments(params?: BudgetCommitmentListParams) {
  return useQuery({
    queryKey: getBudgetCommitmentListQueryKey(params),
    queryFn: async ({ signal }) => {
      const response = await budgetCommitmentList(params, undefined, signal)
      return response.data
    }
  })
}

/**
 * One commitment by id. The API has no `GET /budget-commitments/{id}`, so the commitment is found in the list narrowed by
 * what the row knew (Request, Cost Center, year); a direct link without hints scans the pages of the current year.
 */
export function useCommitmentLookup(commitmentId: string | undefined, hints: CommitmentHints) {
  const { requestId, costCenterId, year } = hints
  const scanYear = requestId || costCenterId ? year : (year ?? new Date().getFullYear())
  return useQuery({
    queryKey: ['finance-commitment-lookup', commitmentId, requestId ?? null, costCenterId ?? null, scanYear ?? null],
    enabled: Boolean(commitmentId),
    queryFn: async ({ signal }): Promise<CommitmentItem | null> => {
      for (let page = 1; page <= LOOKUP_MAX_PAGES; page += 1) {
        const response = await budgetCommitmentList(
          { requestId, costCenterId, year: scanYear, page, pageSize: LOOKUP_PAGE_SIZE },
          undefined,
          signal
        )
        const found = response.data?.items.find((item) => item.id === commitmentId)
        if (found) return found
        if (page >= (response.data?.pagination.totalPages ?? 1)) return null
      }
      return null
    }
  })
}

export function useCommitmentInvoices(commitmentId: string | undefined, page: number) {
  const params = { page, pageSize: 20 }
  return useQuery({
    queryKey: commitmentId ? getBudgetCommitmentInvoiceListQueryKey(commitmentId, params) : ['commitment-invoices-off'],
    enabled: Boolean(commitmentId),
    queryFn: async ({ signal }) => {
      if (!commitmentId) throw new Error('commitmentId is required')
      const response = await budgetCommitmentInvoiceList(commitmentId, params, undefined, signal)
      return response.data
    }
  })
}

export function useCommitmentReleases(commitmentId: string | undefined) {
  return useQuery({
    queryKey: commitmentId ? getBudgetCommitmentReleasesQueryKey(commitmentId) : ['commitment-releases-disabled'],
    enabled: Boolean(commitmentId),
    queryFn: async ({ signal }) => {
      if (!commitmentId) throw new Error('commitmentId is required')
      const response = await budgetCommitmentReleases(commitmentId, undefined, undefined, signal)
      return response.data?.items ?? []
    }
  })
}

export function useReleaseCommitment(commitmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget-commitment-release', commitmentId],
    mutationFn: (reason: string) => budgetCommitmentRelease(commitmentId, { reason }, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getBudgetCommitmentListQueryKey() })
      queryClient.invalidateQueries({ queryKey: ['finance-commitment-lookup'] })
      queryClient.invalidateQueries({ queryKey: getBudgetCommitmentReleasesQueryKey(commitmentId) })
      queryClient.invalidateQueries({ queryKey: getBudgetTableQueryKey() })
      queryClient.invalidateQueries({ queryKey: getBudgetSummaryQueryKey() })
    }
  })
}
