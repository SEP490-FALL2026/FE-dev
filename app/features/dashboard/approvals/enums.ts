export const APPROVAL_TAB_KEYS = [
  'overview',
  'queue',
  'request',
  'need',
  'batch',
  'renewal',
  'charge',
  'optimization',
  'annual-budget',
  'exception-approval',
  'decision-history',
  'reports'
] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]
