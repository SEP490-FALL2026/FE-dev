import { FileText, Plus, Unlock, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ExtendedCommitmentItem } from '../../shared/finance-api-extensions'

const iconButtonClass =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-md border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:size-9'

const toneClass = {
  primary: 'border-primary/40 bg-primary-soft text-primary-ink hover:border-primary hover:bg-primary/15',
  neutral: 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
}

function RowIconButton({
  icon: Icon,
  label,
  tone = 'neutral',
  onClick
}: {
  icon: LucideIcon
  label: string
  tone?: keyof typeof toneClass
  onClick: () => void
}) {
  return (
    <button
      type='button'
      aria-label={label}
      title={label}
      className={`${iconButtonClass} ${toneClass[tone]}`}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <Icon aria-hidden className='size-4' strokeWidth={1.5} />
    </button>
  )
}

export function CommitmentRowActions({
  commitment,
  onRecordInvoice,
  onViewInvoices,
  onRelease
}: {
  commitment: ExtendedCommitmentItem
  onRecordInvoice: () => void
  onViewInvoices: () => void
  onRelease: () => void
}) {
  const { t: translate } = useTranslation('finance')
  return (
    <div className='inline-flex items-center justify-end gap-1.5'>
      {commitment.state !== 'RELEASED' && (
        <RowIconButton icon={Plus} tone='primary' label={translate('recordInvoice')} onClick={onRecordInvoice} />
      )}
      {(commitment.invoiceCount ?? 0) > 0 && (
        <RowIconButton icon={FileText} label={translate('viewInvoices')} onClick={onViewInvoices} />
      )}
      {Number(commitment.held.amount) > 0 && (
        <RowIconButton icon={Unlock} label={translate('releaseRemainder')} onClick={onRelease} />
      )}
    </div>
  )
}
