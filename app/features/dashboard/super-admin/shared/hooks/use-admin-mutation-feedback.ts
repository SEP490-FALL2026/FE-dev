import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getAdminError } from './admin-errors'
import { recordAdminRetryDelay } from './use-admin-retry-delay'

/** Shared UX only. Each feature still owns its typed generated mutation and cache scope. */
export function useAdminMutationFeedback(queryKeys: readonly QueryKey[], onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('admin')
  const invalidate = () => Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  const refreshPermissions = () =>
    queryClient
      .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
      .catch(() => undefined)
  return {
    onSuccess: async () => {
      await invalidate()
      toast.success(translate('saved'), { id: 'admin-write' })
      onSuccess?.()
    },
    onError: async (error: unknown) => {
      recordAdminRetryDelay(queryClient, error)
      const failure = getAdminError(error)
      if (failure.key !== 'rateLimit') await invalidate()
      if (failure.key === 'forbidden') await refreshPermissions()
      toast.error(translate(`errors.${failure.key}`), {
        id: 'admin-write',
        description: failure.requestId ? translate('requestId', { id: failure.requestId }) : undefined
      })
    }
  }
}
