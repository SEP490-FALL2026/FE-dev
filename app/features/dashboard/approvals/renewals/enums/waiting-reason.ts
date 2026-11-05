import { SubscriptionRenewalResponseDtoDataRenewalWaitingReason } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewalWaitingReason'

export const WAITING_REASON = SubscriptionRenewalResponseDtoDataRenewalWaitingReason
export type WaitingReason = (typeof WAITING_REASON)[keyof typeof WAITING_REASON]
