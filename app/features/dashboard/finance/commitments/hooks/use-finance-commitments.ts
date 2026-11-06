import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getExtendedCommitmentList,
  getExtendedCommitmentListQueryKey,
  getCommitmentInvoices,
  getCommitmentInvoicesQueryKey,
  recordCommitmentInvoice,
  type CreateInvoiceBody,
  type ExtendedCommitmentListParams
} from '../../shared/finance-api-extensions'
import {
  budgetCommitmentRelease
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-release'
import {
  budgetCommitmentReleases,
  getBudgetCommitmentReleasesQueryKey
} from '~/shared/api/generated/operations/budget-commitments/budget-commitment-releases'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getBudgetSummaryQueryKey } from '../../shared/finance-api-extensions'

export function useFinanceCommitments(params?: ExtendedCommitmentListParams) {
  return useQuery({
    queryKey: getExtendedCommitmentListQueryKey(params),
    queryFn: async ({ signal }) => {
      const response = await getExtendedCommitmentList(params, signal)
      return response.data
    }
  })
}

export function useCommitmentInvoices(commitmentId: string | undefined) {
  return useQuery({
    queryKey: commitmentId ? getCommitmentInvoicesQueryKey(commitmentId) : ['commitment-invoices-disabled'],
    enabled: Boolean(commitmentId),
    queryFn: async ({ signal }) => {
      if (!commitmentId) throw new Error('commitmentId is required')
      const response = await getCommitmentInvoices(commitmentId, { pageSize: 50 }, signal)
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

export function useRecordInvoice(commitmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget-commitment-record-invoice', commitmentId],
    mutationFn: (data: CreateInvoiceBody) => recordCommitmentInvoice(commitmentId, data),
    onSuccess: () => {
      // Invalidate cam kết, hóa đơn, và bảng ngân sách / summary ở Màn 1
      queryClient.invalidateQueries({ queryKey: getExtendedCommitmentListQueryKey() })
      queryClient.invalidateQueries({ queryKey: getCommitmentInvoicesQueryKey(commitmentId) })
      queryClient.invalidateQueries({ queryKey: getBudgetTableQueryKey() })
      queryClient.invalidateQueries({ queryKey: getBudgetSummaryQueryKey() })
    }
  })
}

export function useReleaseCommitment(commitmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget-commitment-release', commitmentId],
    mutationFn: (reason: string) =>
      budgetCommitmentRelease(commitmentId, { reason }, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getExtendedCommitmentListQueryKey() })
      queryClient.invalidateQueries({ queryKey: getBudgetCommitmentReleasesQueryKey(commitmentId) })
      queryClient.invalidateQueries({ queryKey: getBudgetTableQueryKey() })
      queryClient.invalidateQueries({ queryKey: getBudgetSummaryQueryKey() })
    }
  })
}