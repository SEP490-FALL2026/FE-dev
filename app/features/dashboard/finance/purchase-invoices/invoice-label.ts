import type { TFunction } from 'i18next'

type InvoiceLabel = 'NEW_PURCHASE' | 'PERIOD' | 'RENEWAL'

/**
 * Text of the label BE derives for an invoice: "Mua mới — tháng 1/6", "Kỳ 2/6", "Kỳ 2" for a long-term Request
 * (`periodCount = null`), "Gia hạn" for a subscription or a continued Request (no period at all).
 */
export function invoiceLabelText(
  translate: TFunction<'financePurchases'>,
  label: InvoiceLabel,
  periodIndex: number | null,
  periodCount: number | null
): string {
  if (label === 'RENEWAL') return translate('invoice.labels.RENEWAL')
  if (label === 'NEW_PURCHASE') {
    const base = translate('invoice.labels.NEW_PURCHASE')
    if (!periodIndex) return base
    return `${base} — ${
      periodCount
        ? translate('invoice.monthOf', { index: periodIndex, count: periodCount })
        : translate('invoice.monthOpen', { index: periodIndex })
    }`
  }
  if (!periodIndex) return translate('invoice.labels.PERIOD')
  return periodCount
    ? translate('invoice.period', { index: periodIndex, count: periodCount })
    : translate('invoice.periodOpen', { index: periodIndex })
}

/** Money the invoice books as spend once signed: the price before tax plus the tax that cannot be deducted. */
export function invoiceSpend(
  netAmount: { amount: string; currency: string },
  nonDeductibleTax: { amount: string } | null | undefined
): { amount: string; currency: string } {
  const sum = Number(netAmount.amount) + Number(nonDeductibleTax?.amount ?? 0)
  return { amount: String(Number.isFinite(sum) ? sum : netAmount.amount), currency: netAmount.currency }
}
