import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { useSubscriptionRenewalDecide } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-decide'
import type { SubscriptionRenewalDecideBodyDto } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalDecideBodyDto'
import { recordApprovalsRetry } from '../../shared/hooks/use-approvals-retry'
import { getRenewalError, getRenewalErrorMessage, type RenewalFailure } from '../renewal-errors'

const TOAST_ID = 'approvals-renewal-decision'

/** List, detail, seat ranking and missed-milestone queries all reflect a decision. */
export function isRenewalRelatedKey(queryKey: readonly unknown[]) {
  const path = queryKey[0]
  return typeof path === 'string' && /\/api\/v1\/(subscription-renewals|subscription-deadline-events)(\/|$)/.test(path)
}

export function useRenewalDecision(renewalId: string) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('approvalsRenewal')
  const { t: translateApprovals } = useTranslation('approvals')
  const [failure, setFailure] = useState<RenewalFailure | null>(null)
  const refresh = () => queryClient.invalidateQueries({ predicate: (query) => isRenewalRelatedKey(query.queryKey) })

  const mutation = useSubscriptionRenewalDecide({
    mutation: {
      onSuccess: async () => {
        setFailure(null)
        await refresh()
        toast.success(translate('decision.decided'), { id: TOAST_ID })
      },
      onError: async (error: unknown) => {
        recordApprovalsRetry(queryClient, error)
        const next = getRenewalError(error)
        setFailure(next)
        // A write that failed or timed out may still have changed the case: read it again, never resend.
        if (next.approvalsKey !== 'rateLimit') await refresh()
        if (next.blocking) {
          await queryClient.fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false }).catch(() => undefined)
        }
        toast.error(getRenewalErrorMessage(next, translate, translateApprovals), {
          id: TOAST_ID,
          description: next.requestId ? translateApprovals('requestId', { value: next.requestId }) : undefined
        })
      }
    }
  })

  const decide = (body: SubscriptionRenewalDecideBodyDto) => {
    if (mutation.isPending) return
    mutation.mutate({ id: renewalId, data: body })
  }

  return {
    decide,
    isPending: mutation.isPending,
    blocked: failure?.blocking ?? false,
    /** Seats the server reported when a cancellation was not acknowledged. */
    reportedSeatsInUse: failure?.renewalKey === 'activeUsers' ? failure.details.seatsInUse : undefined,
    acknowledgementRequested: failure?.renewalKey === 'activeUsers'
  }
}
