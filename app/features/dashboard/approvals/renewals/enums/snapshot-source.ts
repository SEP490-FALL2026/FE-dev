import type { SubscriptionRenewalResponseDtoDataRenewalDecisionSnapshot } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewalDecisionSnapshot'

export type SnapshotSource = NonNullable<SubscriptionRenewalResponseDtoDataRenewalDecisionSnapshot>['source']

/** The contract types the snapshot as a tagged union without a generated constant; read `source` first. */
export const SNAPSHOT_SOURCE = {
  CONNECTED: 'CONNECTED',
  NOT_CONNECTED: 'NOT_CONNECTED'
} as const satisfies Record<SnapshotSource, SnapshotSource>
