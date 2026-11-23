import { describe, expect, it } from 'vitest'
import {
  amountsEqual,
  isDefaultReserve,
  isValidYear,
  isYearFilterInvalid,
  parseYearFilter
} from './finance-validation'

describe('finance validation helpers', () => {
  it('accepts only four digit years the API knows', () => {
    expect(isValidYear('2027')).toBe(true)
    expect(['', '99', '20277', '1999', '2201', 'abcd'].some(isValidYear)).toBe(false)
    expect(parseYearFilter('2027')).toBe(2027)
    expect(parseYearFilter('20277')).toBeUndefined()
    expect(isYearFilterInvalid('')).toBe(false)
    expect(isYearFilterInvalid('202')).toBe(true)
  })

  it('compares decimal amounts exactly', () => {
    expect(amountsEqual('1000.50', '1000.5')).toBe(true)
    expect(amountsEqual('9007199254740993.25', '9007199254740993.26')).toBe(false)
  })

  it('knows the default reserve of ten percent of the base', () => {
    expect(isDefaultReserve('1000', '100')).toBe(true)
    expect(isDefaultReserve('1000', '150')).toBe(false)
  })
})
