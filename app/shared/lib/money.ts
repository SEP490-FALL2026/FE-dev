export interface Money {
  amount: string
  currency: string
}

export function isDecimal(value: string): boolean {
  return /^\d+(?:\.\d+)?$/.test(value)
}

/** Turn an amount in the currency's smallest unit (string, e.g. "150000" USD cents) into an exact decimal Money. */
export function moneyFromMinor(amountMinor: string, currency: string): Money {
  if (!/^-?\d+$/.test(amountMinor)) return { amount: amountMinor, currency }
  const digits =
    new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().minimumFractionDigits ?? 0
  const negative = amountMinor.startsWith('-')
  const padded = amountMinor.replace(/^-/, '').padStart(digits + 1, '0')
  const integer = padded.slice(0, padded.length - digits)
  const amount = digits ? `${integer}.${padded.slice(padded.length - digits)}` : integer
  return { amount: `${negative ? '-' : ''}${amount}`, currency }
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
