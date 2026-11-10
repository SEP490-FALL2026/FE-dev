export interface Money {
  amount: string
  currency: string
}

export function isDecimal(value: string): boolean {
  return /^\d+(?:\.\d+)?$/.test(value)
}

/** Keep server decimal strings exact, including cents beyond the safe integer range. */
export function formatMoney(money: Money | null | undefined, locale: string): string {
  if (!money) return '—'
  if (!/^-?\d+(?:\.\d+)?$/.test(money.amount)) return money.amount
  const negative = money.amount.startsWith('-')
  const [integer, fraction = ''] = money.amount.replace(/^-/, '').split('.')
  const currencyFormat = new Intl.NumberFormat(locale, { style: 'currency', currency: money.currency })
  const precision = Math.max(currencyFormat.resolvedOptions().minimumFractionDigits ?? 0, fraction.length)
  const groupedInteger = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(BigInt(integer))
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  })
    .formatToParts(negative ? -1 : 1)
    .map((part) => {
      if (part.type === 'integer') return groupedInteger
      if (part.type === 'fraction') return fraction.padEnd(precision, '0')
      return part.value
    })
    .join('')
}
