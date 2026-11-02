import { useQueryClient } from '@tanstack/react-query'
import { useSpendApprovalDecide } from '~/shared/api/generated/operations/spend-approvals/spend-approval-decide'
import { useSpendApprovalLineDecide } from '~/shared/api/generated/operations/group-requests/spend-approval-line-decide'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { isApprovalRelatedKey } from '../../shared/approvals-query-keys'
import { getApprovalsError } from '../../shared/approvals-errors'

export function useSpendDecision() {
  const queryClient = useQueryClient()
  const feedback = useApprovalsFeedback([])
  const recover = () => queryClient.invalidateQueries({ predicate: (query) => isApprovalRelatedKey(query.queryKey) })
  const mutation = {
    onSuccess: async () => {
      await recover()
      await feedback.onSuccess()
    },
    onError: async (error: unknown) => {
      if (getApprovalsError(error).key !== 'rateLimit') await recover()
      await feedback.onError(error)
    }
  }
  const single = useSpendApprovalDecide({ mutation })
  const group = useSpendApprovalLineDecide({ mutation })
  return { single, group, isPending: single.isPending || group.isPending }
}
