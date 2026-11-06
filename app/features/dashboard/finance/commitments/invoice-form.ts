import type { InvoiceBodyDto } from '~/shared/api/generated/model/budget-commitments'
import { isDecimal } from '../shared/finance-money'

export const invoiceFields = ['number', 'issuedOn', 'netAmount', 'deductibleTax', 'nonDeductibleTax', 'note'] as const
export type InvoiceField = (typeof invoiceFields)[number]
export type InvoiceDraft = Record<InvoiceField, string>
export type InvoiceFieldError =
  | 'numberRequired'
  | 'numberLength'
  | 'duplicate'
  | 'issuedOnRequired'
  | 'amountRequired'
  | 'amountInvalid'
  | 'amountPositive'
  | 'amountScale'
  | 'amountRange'
  | 'noteLength'
  | 'invalid'
export type InvoiceFieldErrors = Partial<Record<InvoiceField, InvoiceFieldError>>

export const emptyInvoiceDraft: InvoiceDraft = {
  number: '',
  issuedOn: '',
  netAmount: '',
  deductibleTax: '',
  nonDeductibleTax: '',
  note: ''
}

const maxIntegerDigits = 16
const dayPattern = /^\d{4}-\d{2}-\d{2}$/

/** Decimal places the currency allows (VND 0, USD 2); the API refuses more with MONEY_SCALE_EXCEEDED. */
export function currencyDigits(currency: string): number {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    return 2
  }
}

function amountError(value: string, digits: number, required: boolean): InvoiceFieldError | null {
  if (!value) return required ? 'amountRequired' : null
  if (!isDecimal(value)) return 'amountInvalid'
  const [integer, fraction = ''] = value.split('.')
  if (fraction.length > digits) return 'amountScale'
  if (integer.replace(/^0+/, '').length > maxIntegerDigits) return 'amountRange'
  if (required && !/[1-9]/.test(value)) return 'amountPositive'
  return null
}

/** Client checks mirror the contract; the API still decides. Empty tax fields are left out, which means 0. */
export function validateInvoice(
  draft: InvoiceDraft,
  currency: string
): { errors: InvoiceFieldErrors; body: InvoiceBodyDto | null } {
  const digits = currencyDigits(currency)
  const number = draft.number.trim()
  const note = draft.note.trim()
  const netAmount = draft.netAmount.trim()
  const deductibleTax = draft.deductibleTax.trim()
  const nonDeductibleTax = draft.nonDeductibleTax.trim()
  const candidates: [InvoiceField, InvoiceFieldError | null][] = [
    ['number', !number ? 'numberRequired' : number.length > 64 ? 'numberLength' : null],
    ['issuedOn', dayPattern.test(draft.issuedOn) ? null : 'issuedOnRequired'],
    ['netAmount', amountError(netAmount, digits, true)],
    ['deductibleTax', amountError(deductibleTax, digits, false)],
    ['nonDeductibleTax', amountError(nonDeductibleTax, digits, false)],
    ['note', note.length > 1000 ? 'noteLength' : null]
  ]
  const errors: InvoiceFieldErrors = {}
  for (const [field, error] of candidates) if (error) errors[field] = error
  if (Object.keys(errors).length) return { errors, body: null }
  return {
    errors,
    body: {
      number,
      issuedOn: draft.issuedOn,
      netAmount: { amount: netAmount },
      ...(deductibleTax ? { deductibleTax: { amount: deductibleTax } } : {}),
      ...(nonDeductibleTax ? { nonDeductibleTax: { amount: nonDeductibleTax } } : {}),
      ...(note ? { note } : {})
    }
  }
}
