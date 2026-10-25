export const APPROVAL_TAB_KEYS = [
  'overview',
  'queue',
  'request',
  'renewal',
  'charge',
  'optimization',
  'annual-budget',
  'exception-approval',
  'decision-history',
  'reports'
] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]

export const APPROVAL_DECISION_OUTCOMES = ['APPROVED', 'REJECTED', 'NEEDS_CHANGES', 'DEFERRED'] as const
export type ApprovalDecisionOutcome = (typeof APPROVAL_DECISION_OUTCOMES)[number]

export const SPEND_QUEUE_KINDS = ['NEW_LICENSE', 'RENEWAL', 'OVERAGE_CHARGE', 'PLAN_UPGRADE'] as const
export type SpendQueueKind = (typeof SPEND_QUEUE_KINDS)[number]
