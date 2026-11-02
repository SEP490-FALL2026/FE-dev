import { describe, expect, it } from 'vitest'
import { formatMoney, isDecimal } from './approvals-money'

describe('Spending Approver exact decimal money', () => {
  it('preserves cents beyond the safe integer range', () => {
    expect(formatMoney({ amount: '9007199254740993.25', currency: 'USD' }, 'en-US')).toBe('$9,007,199,254,740,993.25')
  })
  it('preserves negative subunits, supplied precision and Vietnamese grouping', () => {
    expect(formatMoney({ amount: '-0.25', currency: 'USD' }, 'en-US')).toBe('-$0.25')
    expect(formatMoney({ amount: '1.2345', currency: 'USD' }, 'en-US')).toBe('$1.2345')
    expect(formatMoney({ amount: '1200000', currency: 'VND' }, 'vi-VN')).toContain('1.200.000')
  })
  it('accepts exact non-negative decimal inputs and rejects scientific and grouped input', () => {
    expect(isDecimal('12.50')).toBe(true)
    for (const value of ['', '1e6', '12,50', '-1']) expect(isDecimal(value)).toBe(false)
  })
})
