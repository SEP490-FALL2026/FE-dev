import {
  getBudgetReviewPeriodGetQueryKey,
  getBudgetReviewPeriodListQueryKey,
  useBudgetReviewPeriodClose,
  useBudgetReviewPeriodSign
} from '~/shared/api/generated/operations/budget-review-periods'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'

/** Closing and signing a review period refresh the list and the opened period after BE confirms. */
export function useReviewPeriodActions(periodId?: string, onClosed?: (periodId: string) => void) {
  const listFeedback = useFinanceFeedback([getBudgetReviewPeriodListQueryKey()])
  const feedback = useFinanceFeedback([
    getBudgetReviewPeriodListQueryKey(),
    ...(periodId ? [getBudgetReviewPeriodGetQueryKey(periodId)] : [])
  ])
  return {
    close: useBudgetReviewPeriodClose({
      mutation: {
        onSuccess: async (response) => {
          await listFeedback.onSuccess()
          const id = response.data?.id
          if (id) onClosed?.(id)
        },
        onError: listFeedback.onError
      }
    }),
    sign: useBudgetReviewPeriodSign({ mutation: feedback })
  }
}
