import { useTranslation } from 'react-i18next'
export function useWorkspaceFormat() {
  const { i18n } = useTranslation()
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'

  return {
    formatDate: (value: string) =>
      new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(value.length === 10 ? `${value}T00:00:00` : value)
      ),
    formatDateTime: (value: string) =>
      new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(value)),
    formatMonthYear: (value: string) =>
      new Intl.DateTimeFormat(locale, { month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`)),
    formatCompactCurrency: (value: number) =>
      new Intl.NumberFormat(locale, {
        currency: 'VND',
        maximumFractionDigits: 1,
        notation: 'compact',
        style: 'currency'
      }).format(value),
    formatNumber: (value: number) => new Intl.NumberFormat(locale).format(value),
    formatPercent: (value: number) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: 0, style: 'percent' }).format(value)
  }
}
