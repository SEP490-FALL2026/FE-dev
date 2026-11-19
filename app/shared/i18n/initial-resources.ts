export { defaultNS } from './resource-config'

import { auth as viauth } from './locales/vi/auth'
import { common as vicommon } from './locales/vi/common'
import { errors as vierrors } from './locales/vi/errors'
import { notFound as vinotFound } from './locales/vi/not-found'
import { theme as vitheme } from './locales/vi/theme'
import { auth as enauth } from './locales/en/auth'
import { common as encommon } from './locales/en/common'
import { errors as enerrors } from './locales/en/errors'
import { notFound as ennotFound } from './locales/en/not-found'
import { theme as entheme } from './locales/en/theme'

// Keep startup, authentication and error messages available before any chunk loads.
export const initialResources = {
  vi: { auth: viauth, common: vicommon, errors: vierrors, theme: vitheme, notFound: vinotFound },
  en: { auth: enauth, common: encommon, errors: enerrors, theme: entheme, notFound: ennotFound }
} as const
