import { useTranslation } from 'react-i18next'

export interface OverviewMoney {
  full: (value: number) => string
  compact: (value: number) => string
}

/** Formats chart totals in the reporting currency returned by the budget table. */
export function useOverviewMoney(currency: string | null): OverviewMoney {
  const { i18n } = useTranslation()
  const options: Intl.NumberFormatOptions = currency
    ? { style: 'currency', currency, maximumFractionDigits: 0 }
    : { maximumFractionDigits: 0 }
  const full = new Intl.NumberFormat(i18n.language, options)
  const compact = new Intl.NumberFormat(i18n.language, { ...options, notation: 'compact', maximumFractionDigits: 1 })
  return { full: (value) => full.format(value), compact: (value) => compact.format(value) }
}
