export const APPROVAL_TAB_KEYS = [
  'overview',
  'queue',
  'request',
  'need',
  'batch',
  'annual-budget',
  'version-history'
] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]
