import { SubscriptionDeadlineEventListKind } from '~/shared/api/generated/model/subscription-renewals/subscriptionDeadlineEventListKind'

export const DEADLINE_EVENT_KIND = SubscriptionDeadlineEventListKind
export type DeadlineEventKind = (typeof DEADLINE_EVENT_KIND)[keyof typeof DEADLINE_EVENT_KIND]
