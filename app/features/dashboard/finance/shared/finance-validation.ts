const MIN_YEAR = 2000
const MAX_YEAR = 2200

/** The default reserve is this share of the base (MF-4 B4); a different one needs a reason. */
export const DEFAULT_RESERVE_PERCENT = 10

/** A year typed into a filter: four digits within the years the API accepts. */
export function isValidYear(value: string): boolean {
  return /^\d{4}$/.test(value) && Number(value) >= MIN_YEAR && Number(value) <= MAX_YEAR
}

/** The year of a filter, or nothing while the field is empty or not a valid year (the API refuses anything else). */
export function parseYearFilter(value: string): number | undefined {
  return isValidYear(value) ? Number(value) : undefined
}

/** True when a filled field is not a valid year. */
export function isYearFilterInvalid(value: string): boolean {
  return value !== '' && !isValidYear(value)
}

const scaleOf = (values: readonly string[]) => Math.max(0, ...values.map((value) => (value.split('.')[1] ?? '').length))

function scaled(value: string, scale: number): bigint {
  const [integer, fraction = ''] = value.split('.')
  return BigInt(`${integer}${fraction.padEnd(scale, '0')}`)
}

const decimal = /^\d+(?:\.\d+)?$/

/** Exact comparison of decimal strings: 1000.50 and 1000.5 are the same amount. */
export function amountsEqual(left: string, right: string): boolean {
  if (!decimal.test(left) || !decimal.test(right)) return left === right
  const scale = scaleOf([left, right])
  return scaled(left, scale) === scaled(right, scale)
}

/** Whether the reserve is the default share of the base. */
export function isDefaultReserve(base: string, reserve: string): boolean {
  if (!decimal.test(base) || !decimal.test(reserve)) return false
  const scale = scaleOf([base, reserve])
  return scaled(reserve, scale) * 100n === scaled(base, scale) * BigInt(DEFAULT_RESERVE_PERCENT)
}

/** Exact sum of decimal strings, written without trailing zeros after the point. */
export function addAmounts(values: readonly string[]): string {
  if (!values.every((value) => decimal.test(value))) return '0'
  const scale = scaleOf(values)
  const total = values.reduce((sum, value) => sum + scaled(value, scale), 0n)
  if (scale === 0) return total.toString()
  const digits = total.toString().padStart(scale + 1, '0')
  const fraction = digits.slice(-scale).replace(/0+$/, '')
  const integer = digits.slice(0, -scale)
  return fraction ? `${integer}.${fraction}` : integer
}
