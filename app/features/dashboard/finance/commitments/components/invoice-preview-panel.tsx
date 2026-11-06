import { useTranslation } from 'react-i18next'
import { formatMoney } from '../../shared/finance-money'
import type { Commitment } from '../hooks/use-commitment-actions'
import type { InvoiceDraft } from '../invoice-form'
import { approvedSeats, previewInvoice, quantityMismatch } from '../invoice-preview'
import { InvoiceMatchBadge } from './invoice-match-badge'

/** Live estimate of what recording the draft will change; the API result replaces it after recording. */
export function InvoicePreviewPanel({
  commitment,
  draft,
  billedQuantity
}: {
  commitment: Commitment
  draft: InvoiceDraft
  billedQuantity: string
}) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const currency = commitment.amount.currency
  const preview = previewInvoice(commitment, draft)
  const money = (amount: number) => formatMoney({ amount: String(amount), currency }, i18n.language)
  const seats = approvedSeats(commitment)
  const mismatch = quantityMismatch(commitment, billedQuantity)
  const rows: [string, string][] = [
    [
      translate('invoiceIntake.preview.purchase'),
      commitment.request
        ? [commitment.request.software.name, commitment.request.plan?.name].filter(Boolean).join(' · ')
        : translate('noValue')
    ],
    [translate('invoiceIntake.preview.approvedSeats'), seats === null ? translate('noValue') : String(seats)],
    [translate('invoiceIntake.preview.approved'), formatMoney(commitment.amount, i18n.language)],
    [translate('invoiceIntake.preview.heldNow'), formatMoney(commitment.held, i18n.language)],
    [translate('invoiceIntake.preview.actualCost'), money(preview.actualCost)],
    [translate('invoiceIntake.preview.heldAfter'), money(preview.heldAfter)]
  ]
  return (
    <section
      aria-labelledby='invoice-preview-title'
      className='space-y-4 rounded-lg border border-border/70 bg-surface-subtle/50 p-4'
    >
      <div className='space-y-1'>
        <h3 id='invoice-preview-title' className='text-sm font-semibold'>
          {translate('invoiceIntake.preview.title')}
        </h3>
        <p className='text-xs text-muted-foreground text-pretty'>{translate('invoiceIntake.preview.hint')}</p>
      </div>
      <dl className='space-y-2 text-sm'>
        {rows.map(([label, value]) => (
          <div key={label} className='flex items-center justify-between gap-3'>
            <dt className='text-muted-foreground'>{label}</dt>
            <dd className='font-mono font-medium tabular-nums'>{value}</dd>
          </div>
        ))}
        <div className='flex items-center justify-between gap-3 border-t border-border/60 pt-2'>
          <dt className='text-muted-foreground'>{translate('invoiceIntake.preview.expectedMatch')}</dt>
          <dd>
            <InvoiceMatchBadge value={preview.expectedMatch} />
          </dd>
        </div>
      </dl>
      {mismatch && (
        <p
          role='alert'
          className='rounded-md border border-warning/40 bg-warning/15 px-3 py-2 text-xs text-warning-ink'
        >
          {translate('invoiceIntake.preview.quantityMismatch', { quantity: billedQuantity, seats })}
        </p>
      )}
    </section>
  )
}
