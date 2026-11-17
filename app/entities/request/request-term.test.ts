import { describe, expect, it } from 'vitest'
import { requestTerm } from './request-term'

describe('request time of use', () => {
  it('keeps the months of a request with a term', () => {
    expect(requestTerm(9, false)).toEqual({ kind: 'MONTHS', months: 9 })
  })

  it('reads a null term with cost in the next year as long-term use', () => {
    expect(requestTerm(null, true)).toEqual({ kind: 'OPEN_ENDED' })
  })

  it('reads a null term with no cost in the next year as a one-time licence', () => {
    expect(requestTerm(null, false)).toEqual({ kind: 'ONE_TIME' })
  })

  it('does not guess when it is not known whether the cost reaches next year', () => {
    expect(requestTerm(null)).toEqual({ kind: 'UNKNOWN' })
    expect(requestTerm(undefined)).toEqual({ kind: 'UNKNOWN' })
  })
})
