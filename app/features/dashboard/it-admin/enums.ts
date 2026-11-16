export const IT_ADMIN_TAB_KEYS = [
  'overview',
  'provisioning',
  'shared-stock',
  'purchase-documents',
  'purchase-invoices',
  'reconciliation',
  'usage-import',
  'device-collectors',
  'license-optimization',
  'shadow-it',
  'dept-catalog',
  'department-software',
  'offboarding',
  'transfers',
  'saas-issues',
  'identities',
  'renewals'
] as const
export type ItAdminTabKey = (typeof IT_ADMIN_TAB_KEYS)[number]
