import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { getBudgetProposalGetQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { getBudgetVersionGetQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { getBudgetVersionLineListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-line-list'
import { getBudgetVersionHistoryListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { getBudgetVersionLineChangeListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-line-change-list'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getFinanceReviewListQueryKey } from '~/shared/api/generated/operations/finance-reviews/finance-review-list'
import type { QueryClient } from '@tanstack/react-query'

export function budgetQueryKeys(versionId?: string, proposalId?: string, position?: number) {
  return [
    getBudgetProposalListQueryKey(),
    getBudgetVersionListQueryKey(),
    getBudgetTableQueryKey(),
    getFinanceReviewListQueryKey(),
    ...(proposalId ? [getBudgetProposalGetQueryKey(proposalId)] : []),
    ...(versionId
      ? [
          getBudgetVersionGetQueryKey(versionId),
          getBudgetVersionLineListQueryKey(versionId),
          getBudgetVersionHistoryListQueryKey(versionId)
        ]
      : []),
    ...(versionId && position !== undefined ? [getBudgetVersionLineChangeListQueryKey(versionId, position)] : [])
  ]
}

/** Moving a purchase window reruns the checks of linked requests on the server. */
export function invalidateRequestBudgetChecks(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      typeof queryKey[0] === 'string' &&
      /\/access-requests\/[^/]+(?:\/(?:budget-check(?:\/years)?|finance-review))?$/.test(queryKey[0])
  })
}
