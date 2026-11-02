import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getFinanceError } from '../finance-errors'
import { recordFinanceRetry } from './use-finance-retry'

export function useFinanceFeedback(queryKeys: readonly QueryKey[], onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('finance')
  const invalidate = () => Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  return {
    onSuccess: async () => {
      await invalidate()
      toast.success(translate('saved'), { id: 'finance-write' })
      onSuccess?.()
    },
    onError: async (error: unknown) => {
      recordFinanceRetry(queryClient, error)
      const failure = getFinanceError(error)
      if (failure.key !== 'rateLimit') await invalidate()
      if (failure.key === 'forbidden') {
        await queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
      }
      toast.error(translate(`errors.${failure.ambiguous ? 'ambiguous' : failure.key}`), { id: 'finance-write' })
    }
  }
}
