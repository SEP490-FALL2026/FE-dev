import { SubscriptionRenewalProposeBodyDtoChoice } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalProposeBodyDtoChoice'

export const RENEWAL_CHOICE = SubscriptionRenewalProposeBodyDtoChoice
export type RenewalChoice = (typeof RENEWAL_CHOICE)[keyof typeof RENEWAL_CHOICE]
