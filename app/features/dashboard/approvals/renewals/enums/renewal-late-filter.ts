import { SubscriptionRenewalListLate } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalListLate'

/** The list filter sends the late flag as the strings "true"/"false". */
export const RENEWAL_LATE_FILTER = SubscriptionRenewalListLate
export type RenewalLateFilter = (typeof RENEWAL_LATE_FILTER)[keyof typeof RENEWAL_LATE_FILTER]
