import { SubscriptionRenewalListState } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalListState'

/** Case state; PROPOSED is the decider's queue. */
export const RENEWAL_STATE = SubscriptionRenewalListState
export type RenewalState = (typeof RENEWAL_STATE)[keyof typeof RENEWAL_STATE]
