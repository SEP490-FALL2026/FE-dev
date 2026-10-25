import { AlertTriangle, FileSpreadsheet, FileText, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ItReconciliationRow } from '../../it-admin-data'

export interface ReconciliationConflictModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRow: ItReconciliationRow | null
  resolvedQuantity: number
  setResolvedQuantity: (qty: number) => void
  resolutionReason: string
  setResolutionReason: (reason: string) => void
  onConfirmResolution: () => void
  unitLabel: (unit: string) => string
}

export function ReconciliationConflictModal({
  isOpen,
  onClose,
  selectedRow,
  resolvedQuantity,
  setResolvedQuantity,
  resolutionReason,
  setResolutionReason,
  onConfirmResolution,
  unitLabel
}: ReconciliationConflictModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen || !selectedRow || !selectedRow.conflictData) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-warning font-bold'>
            <AlertTriangle className='size-5' />
            <h3 className='text-base font-bold text-foreground'>{t('itAdmin.reconciliation.extra.verifyTitle')}</h3>
          </div>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>

        <p className='text-xs text-muted-foreground leading-relaxed'>
          {t('itAdmin.reconciliation.extra.verifyHelp')}
        </p>

        <div className='grid grid-cols-2 gap-3 text-xs'>
          <div
            className={`rounded-xl border p-4 cursor-pointer transition ${
              resolvedQuantity === selectedRow.conflictData.contractQty
                ? 'border-primary bg-primary-soft/50 ring-2 ring-primary'
                : 'border-border bg-surface hover:bg-surface-subtle'
            }`}
            onClick={() => setResolvedQuantity(selectedRow.conflictData!.contractQty)}
          >
            <div className='flex items-center justify-between'>
              <span className='font-bold text-foreground flex items-center gap-1.5'>
                <FileText className='size-4 text-primary' />
                {t('itAdmin.reconciliation.extra.useContract')}
              </span>
              <input
                checked={resolvedQuantity === selectedRow.conflictData.contractQty}
                onChange={() => setResolvedQuantity(selectedRow.conflictData!.contractQty)}
                type='radio'
              />
            </div>
            <div className='mt-2 flex items-baseline gap-2'>
              <span className='text-2xl font-black text-foreground'>{selectedRow.conflictData.contractQty}</span>
              <span className='text-xs text-muted-foreground'>{unitLabel(selectedRow.unit)}</span>
            </div>
            <p className='text-[0.7rem] text-muted-foreground mt-1'>{selectedRow.conflictData.contractDoc}</p>
          </div>

          <div
            className={`rounded-xl border p-4 cursor-pointer transition ${
              resolvedQuantity === selectedRow.conflictData.invoiceQty
                ? 'border-primary bg-primary-soft/50 ring-2 ring-primary'
                : 'border-border bg-surface hover:bg-surface-subtle'
            }`}
            onClick={() => setResolvedQuantity(selectedRow.conflictData!.invoiceQty)}
          >
            <div className='flex items-center justify-between'>
              <span className='font-bold text-foreground flex items-center gap-1.5'>
                <FileSpreadsheet className='size-4 text-success' />
                {t('itAdmin.reconciliation.extra.useInvoice')}
              </span>
              <input
                checked={resolvedQuantity === selectedRow.conflictData.invoiceQty}
                onChange={() => setResolvedQuantity(selectedRow.conflictData!.invoiceQty)}
                type='radio'
              />
            </div>
            <div className='mt-2 flex items-baseline gap-2'>
              <span className='text-2xl font-black text-foreground'>{selectedRow.conflictData.invoiceQty}</span>
              <span className='text-xs text-muted-foreground'>{unitLabel(selectedRow.unit)}</span>
            </div>
            <p className='text-[0.7rem] text-muted-foreground mt-1'>{selectedRow.conflictData.invoiceDoc}</p>
          </div>
        </div>

        <div className='space-y-1.5 text-xs'>
          <label className='font-bold text-foreground'>{t('itAdmin.reconciliation.extra.reason')}</label>
          <textarea
            className='w-full rounded-xl border border-border bg-surface-subtle p-3 text-xs outline-none focus:border-primary'
            onChange={(e) => setResolutionReason(e.target.value)}
            placeholder={t('itAdmin.reconciliation.extra.reasonPlaceholder')}
            rows={3}
            value={resolutionReason}
          />
        </div>

        <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.reconciliation.extra.cancel')}
          </button>
          <button
            className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={onConfirmResolution}
            type='button'
          >
            {t('itAdmin.reconciliation.extra.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
