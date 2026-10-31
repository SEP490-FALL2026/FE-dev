export const MANAGER_TAB_KEYS = [
  'overview',
  'my-team',
  'employee-detail',
  'team-software',
  'team-requests',
  'my-requests',
  'request-approval',
  'create-employee-request',
  'weekly-batch',
  'annual-budget',
  'ghost-seat-review',
  'ghost-seat-detail',
  'access-review',
  'transfer-reviews',
  'personnel-notices',
  'handovers',
  'notifications'
] as const

export type ManagerTabKey = (typeof MANAGER_TAB_KEYS)[number]

export const MANAGER_REQUEST_STATUSES = ['pending', 'inProgress', 'approved', 'rejected', 'overdue'] as const
export type ManagerRequestStatus = (typeof MANAGER_REQUEST_STATUSES)[number]

export const MANAGER_REQUEST_TYPES = ['newAccess', 'upgrade', 'renewal', 'changePlan'] as const
export type ManagerRequestType = (typeof MANAGER_REQUEST_TYPES)[number]

export const ACCESS_REVIEW_DECISIONS = ['KEEP', 'RECLAIM', 'EXEMPT'] as const
export type AccessReviewDecision = (typeof ACCESS_REVIEW_DECISIONS)[number]
