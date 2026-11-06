export const APPROVAL_TAB_KEYS = ['overview', 'queue', 'request', 'need', 'batch', 'renewal', 'annual-budget'] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]
