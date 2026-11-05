import { SubscriptionRenewalDecideBodyDtoChoice } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalDecideBodyDtoChoice'

export const RENEWAL_CHOICE = SubscriptionRenewalDecideBodyDtoChoice
export type RenewalChoice = (typeof RENEWAL_CHOICE)[keyof typeof RENEWAL_CHOICE]
