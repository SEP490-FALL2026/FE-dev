import React from 'react'
import {
  AlertTriangle,
  Calculator,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Info,
  Plus,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import type { ItReconciliationRow } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'

export interface ReconciliationInspectionPanelProps {
  selectedRow: ItReconciliationRow | null
  departmentLabel: (dept: string) => string
  unitLabel: (unit: string) => string
  getStatusBadge: (status: ItReconciliationRow['status']) => { label: string; tone: string }
  onOpenConflictModal: () => void
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
  t: any
}

export const ReconciliationInspectionPanel: React.FC<ReconciliationInspectionPanelProps> = ({
  selectedRow,
  departmentLabel,
  unitLabel,
  getStatusBadge,
  onOpenConflictModal,
  onSelectTab,
  t,
}) => {
  if (!selectedRow) {
    return (
      <div className='rounded-2xl border border-dashed border-border bg-surface p-12 text-center text-muted-foreground'>
        <Info className='size-8 mx-auto opacity-40 mb-2' />
        <p className='text-xs font-semibold'>{t('itAdmin.reconciliation.extra.selectRow')}</p>
      </div>
    )
  }

  return (
    <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5 flex flex-col justify-between'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-border/80'>
          <div>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-mono font-bold text-muted-foreground'>{selectedRow.id}</span>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] ${
                  getStatusBadge(selectedRow.status).tone
                }`}
              >
                {getStatusBadge(selectedRow.status).label}
              </span>
            </div>
            <h3 className='text-lg font-bold text-foreground mt-1'>
              {selectedRow.softwareName} — {selectedRow.planName}
            </h3>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('itAdmin.reconciliation.extra.scope')} {departmentLabel(selectedRow.departmentName)}{' '}
              {t('itAdmin.reconciliation.extra.unitOfMeasure')} {unitLabel(selectedRow.unit)}
            </p>
          </div>
        </div>

        {/* Conflict Alert Banner if needsVerification (IT-AC-07A) */}
        {selectedRow.status === 'needsVerification' && selectedRow.conflictData && (
          <div className='rounded-xl border border-warning/40 bg-warning/10 p-4 space-y-2 text-xs'>
            <div className='flex items-center gap-2 text-warning font-bold'>
              <AlertTriangle className='size-4 shrink-0' />
              <span>{t('itAdmin.reconciliation.extra.documentMismatch')}</span>
            </div>
            <p className='text-muted-foreground leading-relaxed'>
              {t('itAdmin.reconciliation.extra.documentMismatchHelp')}
            </p>
            <button
              className='mt-2 flex items-center gap-1.5 rounded-lg bg-warning px-3 py-1.5 text-xs font-bold text-warning-foreground shadow hover:bg-warning/90'
              onClick={onOpenConflictModal}
              type='button'
            >
              <span>{t('itAdmin.reconciliation.extra.openVerification')}</span>
              <ChevronRight className='size-3.5' />
            </button>
          </div>
        )}

        {/* Mathematical Breakdown Box (Section 4 & IT-AC-08) */}
        <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-2.5 text-xs'>
          <div className='flex items-center gap-1.5 font-bold text-foreground'>
            <Calculator className='size-4 text-primary' />
            <span>{t('itAdmin.reconciliation.extra.calculation')}</span>
          </div>
          <div className='space-y-1.5 text-muted-foreground'>
            <div className='flex items-center justify-between'>
              <span>{t('itAdmin.reconciliation.extra.approvedDemand')}</span>
              <span className='font-bold text-foreground'>
                {selectedRow.validDemand} {unitLabel(selectedRow.unit)}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>{t('itAdmin.reconciliation.extra.activePurchases')}</span>
              <span className='font-bold text-foreground'>
                {selectedRow.status === 'insufficientData'
                  ? t('itAdmin.reconciliation.extra.documentsIncomplete')
                  : `${selectedRow.purchasedValid} ${unitLabel(selectedRow.unit)}`}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>{t('itAdmin.reconciliation.extra.activeProvisioning')}</span>
              <span className='font-bold text-foreground'>
                {selectedRow.grantedValid} {unitLabel(selectedRow.unit)}
              </span>
            </div>
            <div className='pt-2 border-t border-border/60 flex items-center justify-between font-bold text-foreground'>
              <span>{t('itAdmin.reconciliation.extra.availableFormula')}</span>
              <span className='text-success font-black text-sm'>
                {selectedRow.status === 'insufficientData'
                  ? '—'
                  : `${selectedRow.availableRemaining} ${unitLabel(selectedRow.unit)}`}
              </span>
            </div>
            {selectedRow.missing > 0 && (
              <div className='flex items-center justify-between font-bold text-danger'>
                <span>{t('itAdmin.reconciliation.extra.shortageFormula')}</span>
                <span className='font-black text-sm'>
                  {t('itAdmin.reconciliation.extra.shortage')} {selectedRow.missing} {unitLabel(selectedRow.unit)}
                </span>
              </div>
            )}
            {selectedRow.surplus > 0 && (
              <div className='flex items-center justify-between font-bold text-warning'>
                <span>{t('itAdmin.reconciliation.extra.surplusFormula')}</span>
                <span className='font-black text-sm'>
                  {t('itAdmin.reconciliation.extra.surplus')} {selectedRow.surplus} {unitLabel(selectedRow.unit)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Constituent Purchases (Contracts & Invoices linked) - IT-AC-07 */}
        <div className='space-y-2 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='font-bold text-foreground uppercase tracking-wider text-[0.68rem] text-muted-foreground'>
              {t('itAdmin.reconciliation.extra.documents')} ({selectedRow.constituentPurchases.length})
            </span>
            <span className='text-[0.65rem] text-muted-foreground'>
              {t('itAdmin.reconciliation.extra.countOnce')}
            </span>
          </div>
          {selectedRow.constituentPurchases.length === 0 ? (
            <div className='rounded-xl border border-dashed border-border p-3 text-center text-muted-foreground italic'>
              {t('itAdmin.reconciliation.extra.noDocuments')}
            </div>
          ) : (
            <div className='space-y-1.5'>
              {selectedRow.constituentPurchases.map((doc: any, idx: number) => (
                <div
                  className='flex items-center justify-between rounded-xl border border-border bg-surface-subtle p-2.5'
                  key={idx}
                >
                  <div className='flex items-center gap-2'>
                    {doc.docType === 'contract' ? (
                      <FileText className='size-4 text-primary shrink-0' />
                    ) : (
                      <FileSpreadsheet className='size-4 text-success shrink-0' />
                    )}
                    <div>
                      <span className='font-bold text-foreground'>{doc.docNumber}</span>
                      <span className='text-[0.68rem] text-muted-foreground block'>
                        {doc.vendor} · {doc.date}
                      </span>
                    </div>
                  </div>
                  <span className='font-bold text-foreground text-xs'>
                    {doc.qty} {unitLabel(selectedRow.unit)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA depending on Deficit or Surplus */}
      <div className='pt-4 border-t border-border space-y-2'>
        {selectedRow.missing > 0 && (
          <button
            className='flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-danger/90'
            onClick={() => onSelectTab && onSelectTab('usage-import')}
            type='button'
          >
            <Plus className='size-4' />
            <span>
              {t('itAdmin.reconciliation.extra.purchaseShortage')} {selectedRow.missing}{' '}
              {t('itAdmin.reconciliation.extra.addDocument')}
            </span>
          </button>
        )}

        {selectedRow.surplus > 0 && (
          <button
            className='flex w-full items-center justify-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-2.5 text-xs font-bold text-warning hover:bg-warning/20'
            onClick={() => onSelectTab && onSelectTab('license-optimization')}
            type='button'
          >
            <Sparkles className='size-4' />
            <span>
              {t('itAdmin.reconciliation.extra.purchaseSurplus')} {selectedRow.surplus}{' '}
              {t('itAdmin.reconciliation.extra.reviewSavings')}
            </span>
          </button>
        )}

        {selectedRow.status === 'insufficientData' && (
          <button
            className='flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={() => onSelectTab && onSelectTab('usage-import')}
            type='button'
          >
            <UploadCloud className='size-4' />
            <span>{t('itAdmin.reconciliation.extra.verifyPurchase')}</span>
          </button>
        )}
      </div>
    </div>
  )
}
