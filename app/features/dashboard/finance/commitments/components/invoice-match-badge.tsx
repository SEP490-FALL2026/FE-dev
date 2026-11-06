import { useTranslation } from 'react-i18next'
import { InvoiceMatchResult } from '../enums/invoice-match-result'

const toneClasses: Record<InvoiceMatchResult, string> = {
  MATCHED: 'bg-success/10 text-success-ink ring-success/25',
  TAX_ONLY: 'bg-info/10 text-info-ink ring-info/25',
  PRICE_QUANTITY_EXCEPTION: 'bg-danger/10 text-danger-ink ring-danger/25'
}
const unknownTone = 'bg-surface-subtle text-muted-foreground ring-border'

const isMatchResult = (value: string): value is InvoiceMatchResult =>
  (Object.values(InvoiceMatchResult) as string[]).includes(value)

export function InvoiceMatchBadge({ value }: { value: string }) {
  const { t: translate } = useTranslation('financeSpend')
  const known = isMatchResult(value)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-sans text-xs font-medium whitespace-nowrap ring-1 ring-inset ${known ? toneClasses[value] : unknownTone}`}
    >
      <span aria-hidden className='size-1.5 rounded-full bg-current' />
      {known ? translate(`matchResult.${value}`) : translate('unknown')}
    </span>
  )
}
