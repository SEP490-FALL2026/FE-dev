import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { getBudgetProposalGetQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { getBudgetVersionGetQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { getBudgetVersionLineListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-line-list'
import { getBudgetVersionHistoryListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getFinanceReviewListQueryKey } from '~/shared/api/generated/operations/finance-reviews/finance-review-list'

export function budgetQueryKeys(versionId?: string, proposalId?: string) {
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
      : [])
  ]
}
