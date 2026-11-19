export const supportedThemes = ['light', 'dark'] as const

export type AppTheme = (typeof supportedThemes)[number]

export const DEFAULT_THEME: AppTheme = 'light'
export const THEME_STORAGE_KEY = 'saas-sentry.theme'

export function isSupportedTheme(value: unknown): value is AppTheme {
  return typeof value === 'string' && supportedThemes.includes(value as AppTheme)
}

export function readStoredTheme(): AppTheme {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  return isSupportedTheme(storedTheme) ? storedTheme : DEFAULT_THEME
}

export function applyTheme(theme: AppTheme, persist = true) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme

  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }
}
