import { describe, expect, it } from 'vitest'
import { subtractDecimal } from './subtract-decimal'

describe('subtractDecimal', () => {
  it.each([
    ['9007199254740993', '9007199254740992', '1'],
    ['0.3', '0.2', '0.1'],
    ['10.00', '12.345', '-2.345'],
    ['5.000', '5', '0'],
    ['-2.1', '-3.2', '1.1'],
    ['1', '0.0001', '0.9999']
  ])('subtracts %s - %s exactly', (left, right, expected) => {
    expect(subtractDecimal(left, right)).toBe(expected)
  })

  it.each(['', '1e3', '1,000', 'NaN', '1.'])('rejects invalid decimals: %s', (invalid) => {
    expect(subtractDecimal(invalid, '1')).toBeNull()
    expect(subtractDecimal('1', invalid)).toBeNull()
  })
})
