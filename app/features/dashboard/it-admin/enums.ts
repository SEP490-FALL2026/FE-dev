export const IT_ADMIN_TAB_KEYS = [
  'overview',
  'provisioning',
  'reconciliation',
  'usage-import',
  'device-collectors',
  'license-optimization',
  'shadow-it',
  'dept-catalog'
] as const

export type ItAdminTabKey = (typeof IT_ADMIN_TAB_KEYS)[number]

export const PROVISIONING_STATUSES = ['PENDING', 'PROVISIONED', 'REJECTED', 'IN_PROGRESS'] as const
export type ProvisioningStatus = (typeof PROVISIONING_STATUSES)[number]

export const OPTIMIZATION_TYPES = ['UNASSIGNED', 'INACTIVE', 'DOWNGRADE_ELIGIBLE', 'OVERLAPPING'] as const
export type OptimizationType = (typeof OPTIMIZATION_TYPES)[number]

export const SHADOW_IT_RISK_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'] as const
export type ShadowItRiskLevel = (typeof SHADOW_IT_RISK_LEVELS)[number]

export const RECONCILIATION_STATUSES = ['MATCHED', 'DISCREPANCY', 'OVER_ALLOCATED', 'PENDING_REVIEW'] as const
export type ReconciliationStatus = (typeof RECONCILIATION_STATUSES)[number]
