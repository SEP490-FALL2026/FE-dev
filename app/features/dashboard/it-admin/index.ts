// Sub-feature: overview
export { ItOverviewView } from './overview/views/it-overview-view'

// Sub-feature: provisioning
export { ItProvisioningView } from './provisioning/views/it-provisioning-view'

// Sub-feature: device-collectors
export { ItDeviceCollectorsView } from './device-collectors/views/it-device-collectors-view'

// Sub-feature: dept-catalog
export { ItDeptCatalogView } from './dept-catalog/views/it-dept-catalog-view'

// Sub-feature: optimization
export { ItOptimizationView } from './optimization/views/it-optimization-view'

// Sub-feature: shadow-it
export { ItShadowItView } from './shadow-it/views/it-shadow-it-view'

// Sub-feature: reconciliation
export { ItReconciliationView } from './reconciliation/views/it-reconciliation-view'

// Sub-feature: identities
export { ItUnmatchedIdentitiesView } from './identities/views/it-unmatched-identities-view'

// Sub-feature: renewals
export { ItRenewalsView } from './renewals/views/it-renewals-view'

// Sub-feature: offboarding
export { ItOffboardingView } from './offboarding/views/it-offboarding-view'

// Sub-feature: usage-import
export { ItUsageImportView } from './usage-import/views/it-usage-import-view'

// Shared
export { useItAdminTabs } from './shared/hooks/use-it-admin-tabs'
export * from './it-admin-data'
export * from './it-admin-demo-labels'
export {
  isValidItAdminTab,
  getParentMenuKey,
  type ItAdminSubMenuItem,
  type ItAdminMenuItem,
  itAdminMenuItems
} from './it-admin-nav'
export * from './enums'
