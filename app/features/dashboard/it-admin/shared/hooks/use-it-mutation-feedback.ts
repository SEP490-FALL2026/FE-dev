import { matchQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { recordAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getItAdminDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/it-admin-dashboard-get'
import { getAssessmentQueueListQueryKey } from '~/shared/api/generated/operations/access-requests/assessment-queue-list'
import { getSubscriptionRenewalListQueryKey } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import { getPlanWarningListQueryKey } from '~/shared/api/generated/operations/plan-terms/plan-warning-list'
import { getBusinessOwnerWarningListQueryKey } from '~/shared/api/generated/operations/applications/business-owner-warning-list'
import { getItError } from './it-errors'

export function useItMutationFeedback(queryKeys: readonly QueryKey[], onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('itAdmin')
  const changesAssessment = queryKeys.some((key) =>
    key.some((part) => typeof part === 'string' && /\/api\/v1\/access-requests\//.test(part))
  )
  const changesRenewals = queryKeys.some((key) =>
    key.some((part) => typeof part === 'string' && /\/api\/v1\/subscription-renewals(\/|$)/.test(part))
  )
  const changesCatalog = queryKeys.some((key) =>
    key.some((part) => typeof part === 'string' && /\/api\/v1\/(subscriptions|applications|plans)(\/|$)/.test(part))
  )
  const changesAssignments = queryKeys.some((queryKey) =>
    queryKey.some(
      (part) =>
        typeof part === 'string' &&
        /\/api\/v1\/(provisioning-tasks|grant-queue|assignment-expiry-queue|seat-baseline-imports|license-keys|license-assignments|service-account-duties|handover-duties)(\/|$)/.test(
          part
        )
    )
  )
  const invalidate = () =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        matchQuery({ queryKey: getItAdminDashboardGetQueryKey() }, query) ||
        (changesAssessment && matchQuery({ queryKey: getAssessmentQueueListQueryKey() }, query)) ||
        (changesCatalog &&
          [
            getSubscriptionRenewalListQueryKey(),
            getPlanWarningListQueryKey(),
            getBusinessOwnerWarningListQueryKey()
          ].some((queryKey) => matchQuery({ queryKey }, query))) ||
        queryKeys.some((queryKey) => matchQuery({ queryKey }, query)) ||
        // A grant or revocation changes both seat availability and departure prerequisites.
        ((changesAssignments || changesRenewals) &&
          query.queryKey.some(
            (part) =>
              typeof part === 'string' &&
              /\/api\/v1\/(offboarding-cases|license-assignments|subscriptions|provisioning-tasks|grant-queue|assignment-expiry-queue|seat-baseline|seat-baseline-imports|service-account-duties|handover-duties)(\/|$)/.test(
                part
              )
          ))
    })
  return {
    onSuccess: async () => {
      await invalidate()
      toast.success(translate('saved'), { id: 'it-admin-write' })
      onSuccess?.()
    },
    onError: async (error: unknown) => {
      recordAdminRetryDelay(queryClient, error)
      const failure = getItError(error)
      if (failure.key !== 'rateLimit') await invalidate()
      if (failure.key === 'forbidden')
        await queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
      toast.error(translate(`errors.${failure.key}`), {
        id: 'it-admin-write',
        description: failure.requestId ? translate('requestId', { id: failure.requestId }) : undefined
      })
    }
  }
}
