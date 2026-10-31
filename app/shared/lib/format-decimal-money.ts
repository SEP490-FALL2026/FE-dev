/** Formats BE decimal strings without converting money to a floating point number. */
export function formatDecimalMoney(money: { amount: string; currency: string }, locale: string): string | null {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(money.amount)
  if (!match) return null
  try {
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: money.currency })
    const fraction = (match[3] ?? '').padEnd(formatter.resolvedOptions().minimumFractionDigits ?? 0, '0')
    const integer = BigInt(`${match[1]}${match[2]}`)
    const decimalSeparator =
      new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.'
    let inserted = false
    return formatter
      .formatToParts(integer)
      .map((part, index, parts) => {
        if (part.type === 'fraction') {
          inserted = true
          return fraction
        }
        if (
          part.type === 'integer' &&
          !inserted &&
          fraction &&
          !parts.some((value) => value.type === 'fraction') &&
          !parts.slice(index + 1).some((value) => value.type === 'integer')
        ) {
          inserted = true
          return `${part.value}${decimalSeparator}${fraction}`
        }
        return part.value
      })
      .join('')
  } catch {
    return null
  }
}
