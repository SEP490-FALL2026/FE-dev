import { SubscriptionRenewalResponseDtoDataRenewalUsageStatus } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewalUsageStatus'

/** NOT_AVAILABLE means usage cannot be judged yet; it never means zero users. */
export const USAGE_STATUS = SubscriptionRenewalResponseDtoDataRenewalUsageStatus
export type UsageStatus = (typeof USAGE_STATUS)[keyof typeof USAGE_STATUS]
