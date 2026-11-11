import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Names of cost centers and departments come from the server in one language. In English the seeded ones are shown
 * under their English name, found by cost center code; any other name is shown as the server sent it.
 */
export function useCostCenterLabel() {
  const { t: translate, i18n } = useTranslation('finance')
  const english = i18n.language.startsWith('en')
  return useCallback(
    (item: { code: string; name: string }) =>
      english ? translate(`costCenterNames.${item.code}`, { defaultValue: item.name }) : item.name,
    [english, translate]
  )
}

/** Lower case, without accents and with the Vietnamese đ read as d, so "Ban Giam Doc" finds "Ban Giám đốc". */
export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim()
}
