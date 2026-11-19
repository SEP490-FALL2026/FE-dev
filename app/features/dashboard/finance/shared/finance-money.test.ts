import { describe, expect, it } from 'vitest'
import { formatMoney, isDecimal } from './finance-money'

describe('Finance decimal amounts', () => {
  it('formats amounts beyond safe integer precision without losing cents', () => {
    expect(formatMoney({ amount: '9007199254740993.25', currency: 'USD' }, 'en-US')).toBe('$9,007,199,254,740,993.25')
  })

  it('retains negative sub-unit amounts and locale decimal separators', () => {
    expect(formatMoney({ amount: '-0.25', currency: 'USD' }, 'en-US')).toBe('-$0.25')
    expect(formatMoney({ amount: '1200000', currency: 'VND' }, 'vi-VN')).toContain('1.200.000')
  })

  it('never silently rounds supplied monetary precision', () => {
    expect(formatMoney({ amount: '1.2345', currency: 'USD' }, 'en-US')).toBe('$1.2345')
    expect(isDecimal('12.50')).toBe(true)
    expect(isDecimal('1e6')).toBe(false)
    expect(isDecimal('12,50')).toBe(false)
    expect(isDecimal('')).toBe(false)
  })
})
