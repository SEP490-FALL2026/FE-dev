export const IT_ADMIN_TAB_KEYS = [
  'overview',
  'provisioning',
  'reconciliation',
  'usage-import',
  'device-collectors',
  'license-optimization',
  'shadow-it',
  'dept-catalog',
  'offboarding',
  'saas-issues',
  'identities',
  'renewals'
] as const
export type ItAdminTabKey = (typeof IT_ADMIN_TAB_KEYS)[number]
