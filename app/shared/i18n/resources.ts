import { auth as enAuth } from './locales/en/auth'
import { common as enCommon } from './locales/en/common'
import { dashboard as enDashboard } from './locales/en/dashboard'
import { errors as enErrors } from './locales/en/errors'
import { landing as enLanding } from './locales/en/landing'
import { notFound as enNotFound } from './locales/en/not-found'
import { theme as enTheme } from './locales/en/theme'
import { auth as viAuth } from './locales/vi/auth'
import { common as viCommon } from './locales/vi/common'
import { dashboard as viDashboard } from './locales/vi/dashboard'
import { errors as viErrors } from './locales/vi/errors'
import { landing as viLanding } from './locales/vi/landing'
import { notFound as viNotFound } from './locales/vi/not-found'
import { theme as viTheme } from './locales/vi/theme'

export const defaultNS = 'common' as const

export const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    dashboard: enDashboard,
    errors: enErrors,
    landing: enLanding,
    notFound: enNotFound,
    theme: enTheme
  },
  vi: {
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
