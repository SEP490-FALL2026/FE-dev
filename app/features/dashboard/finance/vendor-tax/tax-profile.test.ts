import { describe, expect, it } from 'vitest'
import { taxProfileBody } from './tax-profile'
describe('tax declaration contract', () => {
  it('retains decimal strings and sends only writable tax line fields', () => {
    expect(taxProfileBody('T3', [{ taxType: ' VAT ', ratePercent: '8.5000', deductible: true }])).toEqual({
      group: 'T3',
      lines: [{ taxType: 'VAT', ratePercent: '8.5000', deductible: true }]
    })
  })
  it('rejects unknown groups and invalid decimal rates', () => {
    expect(taxProfileBody('FUTURE', [])).toBeNull()
    expect(taxProfileBody('T1', [{ taxType: 'VAT', ratePercent: '1e3', deductible: false }])).toBeNull()
    expect(taxProfileBody('T2', [{ taxType: '', ratePercent: '10', deductible: false }])).toBeNull()
    expect(
      taxProfileBody('T2', [{ taxType: 'VAT', ratePercent: '100000000000000000000', deductible: false }])
    ).toBeNull()
  })
  it('allows an explicit empty tax profile', () => {
    expect(taxProfileBody('T2', [])).toEqual({ group: 'T2', lines: [] })
  })
})
