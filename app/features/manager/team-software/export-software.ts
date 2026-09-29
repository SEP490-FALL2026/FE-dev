import type { TFunction } from 'i18next'

import { csvCell } from '~/shared/lib/csv'

import type { TeamSoftware } from './team-software-demo'

export function buildSoftwareCsv(items: TeamSoftware[], locale: string, t: TFunction) {
  const number = new Intl.NumberFormat(locale)
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 })
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' })
  const headers = (
    ['software', 'plan', 'total', 'inUse', 'available', 'usage', 'expiring', 'ghost', 'monthlyCost', 'status'] as const
  ).map((key) => t(`teamSoftware.${key}`))
  const rows = items.map((item) => [
    item.name,
    item.plan,
    number.format(item.total),
    number.format(item.inUse),
    number.format(item.available),
    percent.format(item.usage),
    number.format(item.expiring),
    number.format(item.ghost),
    money.format(item.monthlyCost),
    t('teamSoftware.active')
  ])
  return '\uFEFF' + [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
}
