/** Subtract decimal strings without rounding monetary values through JavaScript numbers. */
export function subtractDecimal(left: string, right: string): string | null {
  if (!/^-?\d+(?:\.\d+)?$/.test(left) || !/^-?\d+(?:\.\d+)?$/.test(right)) return null

  const scale = Math.max(left.split('.')[1]?.length ?? 0, right.split('.')[1]?.length ?? 0)
  const scaled = (value: string) => {
    const negative = value.startsWith('-')
    const [integer, fraction = ''] = (negative ? value.slice(1) : value).split('.')
    const result = BigInt(integer + fraction.padEnd(scale, '0'))
    return negative ? -result : result
  }
  const difference = scaled(left) - scaled(right)
  if (difference === 0n) return '0'
  const negative = difference < 0n
  const digits = (negative ? -difference : difference).toString().padStart(scale + 1, '0')
  if (scale === 0) return `${negative ? '-' : ''}${digits}`
  const fraction = digits.slice(-scale).replace(/0+$/, '')
  return `${negative ? '-' : ''}${digits.slice(0, -scale)}${fraction ? `.${fraction}` : ''}`
}
