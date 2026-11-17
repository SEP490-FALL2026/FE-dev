import { useQuery } from '@tanstack/react-query'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { env } from '~/shared/config/env'

/**
 * `GET /subscription-renewals/adjustment` (subscriptionRenewalAdjustmentGet) came with BE `feat/p5` and is not in the
 * generated client yet, so it is typed here from the API description. Finance only reads it. Until that BE is
 * deployed the route answers 404, and a subscription without an adjustment point answers 409: both read as "no
 * adjustment point", not as a failure.
 */
export interface SubscriptionAdjustment {
  subscriptionId: string
  commitment: 'MONTHLY' | 'ANNUAL'
  deadlineKind: 'PAYMENT_DATE' | 'NOTICE_DEADLINE' | 'RENEWAL_DATE' | 'END_DATE'
  deadline: string
  adjustmentPointOn: string
  renewalOn: string
  redAlertOn: string | null
  purchasedQuantity: number | null
  vendorMinimumSeats: number | null
  seatsNeeded: {
    total: number
    heldPastRenewal: number
    pendingContinuations: number
    approvedAwaitingGrant: number
  }
  target: number
  suggestedChoice: 'RENEW' | 'REDUCE' | 'CANCEL' | 'INCREASE' | null
  canCancel: boolean
  activeSeatsToday: number
  openRequests: number
  responsibleItAdminEmployeeId: string | null
  callerIsResponsible: boolean
  recordedRenewalId: string | null
}

interface SubscriptionAdjustmentResponse {
  success: boolean
  message: string
  data: { adjustment: SubscriptionAdjustment } | null
}

const url = () => `${env.API_BASE_URL}/api/v1/subscription-renewals/adjustment`

export const getSubscriptionAdjustment = (subscriptionId: string, signal?: AbortSignal) =>
  customAxios<SubscriptionAdjustmentResponse>({ url: url(), method: 'GET', params: { subscriptionId }, signal })

export const getSubscriptionAdjustmentQueryKey = (subscriptionId: string) => [url(), { subscriptionId }] as const

/** The status code of a failed read, when the server answered. */
export function errorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('response' in error)) return undefined
  const response = (error as { response?: { status?: unknown } }).response
  return typeof response?.status === 'number' ? response.status : undefined
}

export function useSubscriptionAdjustment(subscriptionId: string | undefined) {
  return useQuery({
    queryKey: getSubscriptionAdjustmentQueryKey(subscriptionId ?? ''),
    queryFn: ({ signal }) => getSubscriptionAdjustment(subscriptionId ?? '', signal),
    enabled: Boolean(subscriptionId),
    retry: false
  })
}
