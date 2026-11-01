import { auth as enAuth } from './locales/en/auth'
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

export const defaultNS = 'common' as const

export const resources = {
  en: {
    itNewSoftware: enItNewSoftware,
    itAdmin: enItAdmin,
    itProvisioning: enItProvisioning,
    itCatalog: enItCatalog,
    itOffboarding: enItOffboarding,
    itIssues: enItIssues,
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
    itNewSoftware: viItNewSoftware,
    itAdmin: viItAdmin,
    itProvisioning: viItProvisioning,
    itCatalog: viItCatalog,
    itOffboarding: viItOffboarding,
    itIssues: viItIssues,
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
