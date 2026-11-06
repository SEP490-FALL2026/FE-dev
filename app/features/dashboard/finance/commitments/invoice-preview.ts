import type { InvoiceListResponseDtoDataItemsItemMatchResult } from '~/shared/api/generated/model/budget-commitments'
import { isDecimal } from '../shared/finance-money'
import type { Commitment } from './hooks/use-commitment-actions'
import type { InvoiceDraft } from './invoice-form'

const toNumber = (value: string | undefined) => (value && isDecimal(value) ? Number(value) : 0)

export interface InvoicePreview {
  /** Actual cost the invoice adds: net + non-deductible tax (deductible VAT is shown apart, never spent). */
  actualCost: number
  /** What the commitment still holds after this invoice (it drops by the net amount, never below 0). */
  heldAfter: number
  /** Expected outcome of the backend match; the recorded result comes from the API. */
  expectedMatch: InvoiceListResponseDtoDataItemsItemMatchResult
}

/** Seats the request was approved for; the API does not store an invoice quantity yet. */
export const approvedSeats = (commitment: Commitment) => commitment.request?.beneficiaryCount ?? null

/**
 * Local check only: the invoiced quantity is not sent to the API, so a mismatch is a warning for the person recording,
 * not part of the backend match result.
 */
export function quantityMismatch(commitment: Commitment, billedQuantity: string): boolean {
  const seats = approvedSeats(commitment)
  const quantity = Number(billedQuantity)
  return seats !== null && Number.isInteger(quantity) && quantity > 0 && quantity !== seats
}

/**
 * Mirrors the matching rule documented by the backend (flows/finance-screens.md): the total net of every invoice of a
 * commitment is compared with `amount − released`. The net already invoiced is what is no longer held.
 * Display estimate only.
 */
export function previewInvoice(commitment: Commitment, draft: InvoiceDraft): InvoicePreview {
  const net = toNumber(draft.netAmount.trim())
  const deductibleTax = toNumber(draft.deductibleTax.trim())
  const nonDeductibleTax = toNumber(draft.nonDeductibleTax.trim())
  const approved = toNumber(commitment.amount.amount) - toNumber(commitment.released.amount)
  const held = toNumber(commitment.held.amount)
  const alreadyInvoicedNet = Math.max(0, approved - held)
  const expectedMatch =
    alreadyInvoicedNet + net > approved
      ? 'PRICE_QUANTITY_EXCEPTION'
      : deductibleTax + nonDeductibleTax > 0
        ? 'TAX_ONLY'
        : 'MATCHED'
  return { actualCost: net + nonDeductibleTax, heldAfter: Math.max(0, held - net), expectedMatch }
}
