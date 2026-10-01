import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { defaultNS, resources, type SupportedLanguage, type TranslationNamespace } from './resources'

const LANGUAGE_STORAGE_KEY = 'saas-sentry.language'
export const supportedLanguages = Object.keys(resources) as SupportedLanguage[]
export const translationNamespaces = Object.keys(resources.vi) as TranslationNamespace[]

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === 'string' && supportedLanguages.includes(value as SupportedLanguage)
}

void i18n.use(initReactI18next).init({
  defaultNS,
  fallbackLng: 'vi',
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'vi',
  ns: translationNamespaces,
  resources,
  supportedLngs: supportedLanguages
})

export async function setAppLanguage(language: SupportedLanguage, persist = true) {
  await i18n.changeLanguage(language)
  if (typeof document !== 'undefined') document.documentElement.lang = language
  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }
}

export async function initializeBrowserLanguage() {
  if (typeof window === 'undefined') return
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  const browserLanguage = navigator.languages.map((language) => language.split('-')[0]).find(isSupportedLanguage)
  await setAppLanguage(isSupportedLanguage(storedLanguage) ? storedLanguage : (browserLanguage ?? 'vi'), false)
}

export { i18n }
export type { SupportedLanguage, TranslationNamespace } from './resources'
