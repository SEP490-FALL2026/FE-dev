export const APPROVAL_TAB_KEYS = [
  'overview',
  'queue',
  'request',
  'batch',
  'annual-budget',
  'in-year',
  'monitor',
  'version-history'
] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]
