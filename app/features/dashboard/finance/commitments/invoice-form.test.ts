import { describe, expect, it } from 'vitest'
import { currencyDigits, emptyInvoiceDraft, validateInvoice } from './invoice-form'

const draft = { ...emptyInvoiceDraft, number: 'INV-1', issuedOn: '2026-11-05', netAmount: '12.50' }

describe('invoice form rules', () => {
  it('uses the decimal places of the commitment currency', () => {
    expect(currencyDigits('VND')).toBe(0)
    expect(currencyDigits('USD')).toBe(2)
    expect(validateInvoice(draft, 'USD').body?.netAmount).toEqual({ amount: '12.50' })
    expect(validateInvoice(draft, 'VND').errors).toEqual({ netAmount: 'amountScale' })
    expect(validateInvoice({ ...draft, deductibleTax: '1.234' }, 'USD').errors).toEqual({
      deductibleTax: 'amountScale'
    })
  })

  it('accepts zero tax, refuses a zero price and malformed or oversized amounts', () => {
    expect(validateInvoice({ ...draft, nonDeductibleTax: '0' }, 'USD').body?.nonDeductibleTax).toEqual({ amount: '0' })
    expect(validateInvoice({ ...draft, netAmount: '0.00' }, 'USD').errors).toEqual({ netAmount: 'amountPositive' })
    expect(validateInvoice({ ...draft, netAmount: '1,200' }, 'USD').errors).toEqual({ netAmount: 'amountInvalid' })
    expect(validateInvoice({ ...draft, netAmount: '-5' }, 'USD').errors).toEqual({ netAmount: 'amountInvalid' })
    expect(validateInvoice({ ...draft, netAmount: '12345678901234567' }, 'USD').errors).toEqual({
      netAmount: 'amountRange'
    })
  })

  it('checks the number and date and leaves optional fields out of the body', () => {
    expect(validateInvoice({ ...draft, number: ' ', issuedOn: '' }, 'USD').errors).toEqual({
      number: 'numberRequired',
      issuedOn: 'issuedOnRequired'
    })
    expect(validateInvoice({ ...draft, number: 'x'.repeat(65) }, 'USD').errors).toEqual({ number: 'numberLength' })
    expect(validateInvoice({ ...draft, note: '  Hóa đơn tháng 11 ' }, 'USD').body).toEqual({
      number: 'INV-1',
      issuedOn: '2026-11-05',
      netAmount: { amount: '12.50' },
      note: 'Hóa đơn tháng 11'
    })
  })
})
