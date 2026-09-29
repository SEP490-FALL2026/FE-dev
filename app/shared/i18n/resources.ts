import { approvals as enApprovals } from './locales/en/approvals'
import { common as enCommon } from './locales/en/common'
import { errors as enErrors } from './locales/en/errors'
import { finance as enFinance } from './locales/en/finance'
import { landing as enLanding } from './locales/en/landing'
import { notFound as enNotFound } from './locales/en/not-found'
import { theme as enTheme } from './locales/en/theme'
import { approvals as viApprovals } from './locales/vi/approvals'
import { common as viCommon } from './locales/vi/common'
import { errors as viErrors } from './locales/vi/errors'
import { finance as viFinance } from './locales/vi/finance'
import { landing as viLanding } from './locales/vi/landing'
import { notFound as viNotFound } from './locales/vi/not-found'
import { theme as viTheme } from './locales/vi/theme'

export const defaultNS = 'common' as const

export const resources = {
  en: {
    approvals: enApprovals,
    common: enCommon,
    errors: enErrors,
    finance: enFinance,
    landing: enLanding,
    notFound: enNotFound,
    theme: enTheme
  },
  vi: {
    approvals: viApprovals,
    common: viCommon,
    errors: viErrors,
    finance: viFinance,
    landing: viLanding,
    notFound: viNotFound,
    theme: viTheme
  }
} as const

export type SupportedLanguage = keyof typeof resources
export type TranslationNamespace = keyof (typeof resources)['vi']
