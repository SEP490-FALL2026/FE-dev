import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getApprovalsError } from '../approvals-errors'
import { recordApprovalsRetry } from './use-approvals-retry'

export function useApprovalsFeedback(queryKeys: readonly QueryKey[], onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('approvals')
  const invalidate = () => Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  return {
    onSuccess: async () => {
      await invalidate()
      toast.success(translate('saved'), { id: 'approvals-write' })
      onSuccess?.()
    },
    onError: async (error: unknown) => {
      recordApprovalsRetry(queryClient, error)
      const failure = getApprovalsError(error)
      // A conflict may mean a fresh budget check changed the route even though no decision was saved.
      if (failure.key !== 'rateLimit') await invalidate()
      if (failure.key === 'forbidden') {
        await queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
      }
      toast.error(translate(`errors.${failure.ambiguous ? 'ambiguous' : failure.key}`), {
        id: 'approvals-write',
        description: failure.requestId ? translate('requestId', { value: failure.requestId }) : undefined
      })
    }
  }
}
