import { describe, expect, it } from 'vitest'
import { formatDecimalMoney } from './format-decimal-money'

describe('BE decimal money formatting', () => {
  it('preserves cents beyond the safe integer range', () => {
    expect(formatDecimalMoney({ amount: '9007199254740993.25', currency: 'USD' }, 'en-US')).toBe(
      '$9,007,199,254,740,993.25'
    )
  })
  it('uses the currency scale and locale without changing the amount', () => {
    expect(formatDecimalMoney({ amount: '1000', currency: 'USD' }, 'en-US')).toBe('$1,000.00')
    expect(formatDecimalMoney({ amount: '1000', currency: 'VND' }, 'vi-VN')).toContain('1.000')
    expect(formatDecimalMoney({ amount: '1.25', currency: 'USD' }, 'vi-VN')).toContain('1,25')
  })
  it('does not render invalid money', () => {
    expect(formatDecimalMoney({ amount: 'not-money', currency: 'USD' }, 'en-US')).toBeNull()
  })
})
