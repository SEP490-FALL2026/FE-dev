import { auth as enAuth } from './locales/en/auth'
import { approvals as enApprovals } from './locales/en/approvals'
import { approvalsBudget as enApprovalsBudget } from './locales/en/approvals-budget'
import { approvalsSpend as enApprovalsSpend } from './locales/en/approvals-spend'
import { approvalsNeed as enApprovalsNeed } from './locales/en/approvals-need'
import { approvalsRenewal as enApprovalsRenewal } from './locales/en/approvals-renewal'
import { finance as enFinance } from './locales/en/finance'
import { financeBudget as enFinanceBudget } from './locales/en/finance-budget'
import { financeSettings as enFinanceSettings } from './locales/en/finance-settings'
import { admin as enAdmin } from './locales/en/admin'
import { adminAccounts as enAdminAccounts } from './locales/en/admin-accounts'
import { adminOrganization as enAdminOrganization } from './locales/en/admin-organization'
import { adminPersonnel as enAdminPersonnel } from './locales/en/admin-personnel'
import { common as enCommon } from './locales/en/common'
import { dashboard as enDashboard } from './locales/en/dashboard'
import { errors as enErrors } from './locales/en/errors'
import { landing as enLanding } from './locales/en/landing'
import { notFound as enNotFound } from './locales/en/not-found'
import { theme as enTheme } from './locales/en/theme'
import { auth as viAuth } from './locales/vi/auth'
import { approvals as viApprovals } from './locales/vi/approvals'
import { approvalsBudget as viApprovalsBudget } from './locales/vi/approvals-budget'
import { approvalsSpend as viApprovalsSpend } from './locales/vi/approvals-spend'
import { approvalsNeed as viApprovalsNeed } from './locales/vi/approvals-need'
import { approvalsRenewal as viApprovalsRenewal } from './locales/vi/approvals-renewal'
import { finance as viFinance } from './locales/vi/finance'
import { financeBudget as viFinanceBudget } from './locales/vi/finance-budget'
import { financeSettings as viFinanceSettings } from './locales/vi/finance-settings'
import { admin as viAdmin } from './locales/vi/admin'
import { adminAccounts as viAdminAccounts } from './locales/vi/admin-accounts'
import { adminOrganization as viAdminOrganization } from './locales/vi/admin-organization'
import { adminPersonnel as viAdminPersonnel } from './locales/vi/admin-personnel'
import { common as viCommon } from './locales/vi/common'
import { dashboard as viDashboard } from './locales/vi/dashboard'
import { errors as viErrors } from './locales/vi/errors'
import { landing as viLanding } from './locales/vi/landing'
import { notFound as viNotFound } from './locales/vi/not-found'
import { theme as viTheme } from './locales/vi/theme'
import { itAdmin as enItAdmin } from './locales/en/it-admin'
import { itRenewals as enItRenewals } from './locales/en/it-renewals'
import { itRenewals as viItRenewals } from './locales/vi/it-renewals'
import { itPurchases as enItPurchases } from './locales/en/it-purchases'
import { itPurchases as viItPurchases } from './locales/vi/it-purchases'
import { itTransfers as enItTransfers } from './locales/en/it-transfers'
import { itTransfers as viItTransfers } from './locales/vi/it-transfers'
import { itAdmin as viItAdmin } from './locales/vi/it-admin'
import { itProvisioning as enItProvisioning } from './locales/en/it-provisioning'
import { itProvisioning as viItProvisioning } from './locales/vi/it-provisioning'
import { itCatalog as enItCatalog } from './locales/en/it-catalog'
import { itCatalog as viItCatalog } from './locales/vi/it-catalog'
import { itOffboarding as enItOffboarding } from './locales/en/it-offboarding'
import { itOffboarding as viItOffboarding } from './locales/vi/it-offboarding'
import { itIssues as enItIssues } from './locales/en/it-issues'
import { itIssues as viItIssues } from './locales/vi/it-issues'
import { itNewSoftware as enItNewSoftware } from './locales/en/it-new-software'
import { itNewSoftware as viItNewSoftware } from './locales/vi/it-new-software'
import { employee as enEmployee } from './locales/en/employee'
import { employee as viEmployee } from './locales/vi/employee'
import { manager as enManager } from './locales/en/manager'
import { manager as viManager } from './locales/vi/manager'

export { defaultNS } from './resource-config'

export const resources = {
  en: {
    itRenewals: enItRenewals,
    itPurchases: enItPurchases,
    itTransfers: enItTransfers,
    approvals: enApprovals,
    approvalsBudget: enApprovalsBudget,
    approvalsSpend: enApprovalsSpend,
    approvalsNeed: enApprovalsNeed,
    approvalsRenewal: enApprovalsRenewal,
    finance: enFinance,
    financeBudget: enFinanceBudget,
    financeSettings: enFinanceSettings,
    itNewSoftware: enItNewSoftware,
    itAdmin: enItAdmin,
    itProvisioning: enItProvisioning,
    itCatalog: enItCatalog,
    itOffboarding: enItOffboarding,
    itIssues: enItIssues,
    manager: enManager,
    employee: enEmployee,
    admin: enAdmin,
    adminAccounts: enAdminAccounts,
    adminOrganization: enAdminOrganization,
    adminPersonnel: enAdminPersonnel,
    auth: enAuth,
    common: enCommon,
    dashboard: enDashboard,
    errors: enErrors,
    landing: enLanding,
    notFound: enNotFound,
    theme: enTheme
  },
  vi: {
    itRenewals: viItRenewals,
    itPurchases: viItPurchases,
    itTransfers: viItTransfers,
    approvals: viApprovals,
    approvalsBudget: viApprovalsBudget,
    approvalsSpend: viApprovalsSpend,
    approvalsNeed: viApprovalsNeed,
    approvalsRenewal: viApprovalsRenewal,
    finance: viFinance,
    financeBudget: viFinanceBudget,
    financeSettings: viFinanceSettings,
    itNewSoftware: viItNewSoftware,
    itAdmin: viItAdmin,
    itProvisioning: viItProvisioning,
    itCatalog: viItCatalog,
    itOffboarding: viItOffboarding,
    itIssues: viItIssues,
    manager: viManager,
    employee: viEmployee,
    admin: viAdmin,
    adminAccounts: viAdminAccounts,
    adminOrganization: viAdminOrganization,
    adminPersonnel: viAdminPersonnel,
    auth: viAuth,
    common: viCommon,
    dashboard: viDashboard,
    errors: viErrors,
    landing: viLanding,
    notFound: viNotFound,
    theme: viTheme
  }
} as const

export type SupportedLanguage = keyof typeof resources
export type TranslationNamespace = keyof (typeof resources)['vi']
