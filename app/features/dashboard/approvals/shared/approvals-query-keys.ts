import { getSpendApprovalListQueryKey } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'

export const approvalsListKeys = [getSpendApprovalListQueryKey(), getBudgetVersionListQueryKey()] as const

/** A decision can change a Request, its check, a batch and annual commitments together. */
export function isApprovalRelatedKey(queryKey: readonly unknown[]) {
  const path = queryKey[0]
  return (
    typeof path === 'string' &&
    /\/api\/v1\/(access-requests|spend-approvals|spend-batches|budget-versions|budget-commitments|budgets|budget-information-requests|finance-reviews|notifications)(\/|$)/.test(
      path
    )
  )
}
