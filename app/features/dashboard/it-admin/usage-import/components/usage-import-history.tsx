import React from 'react'
import { FileSpreadsheet, FileText, Link as LinkIcon } from 'lucide-react'
import type { ItPurchaseDoc } from '../../it-admin-data'

export interface UsageImportHistoryProps {
  docs: ItPurchaseDoc[]
  onSelectDoc: (doc: ItPurchaseDoc) => void
  t: any
}

export const UsageImportHistory: React.FC<UsageImportHistoryProps> = ({ docs, onSelectDoc, t }) => {
  return (
    <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
      <div className='flex items-center justify-between pb-3 border-b border-border/80'>
        <div>
          <h3 className='text-base font-bold text-foreground'>
            {t('itAdmin.usageImport.extra.history')} ({docs.length})
          </h3>
          <p className='text-xs text-muted-foreground mt-0.5'>{t('itAdmin.usageImport.extra.historyHelp')}</p>
        </div>
        <span className='font-mono text-xs text-muted-foreground'>{t('itAdmin.usageImport.extra.autoUpdated')}</span>
      </div>

      <div className='divide-y divide-border/60 text-xs'>
        {docs.map((doc) => (
          <div
            className='flex flex-wrap items-center justify-between gap-3 py-3 transition hover:bg-surface-subtle/50 px-2 rounded-xl'
            key={doc.id}
          >
            <div className='flex items-center gap-3 min-w-[260px]'>
              <span className='grid size-8 place-items-center rounded-xl bg-primary-soft text-primary font-bold text-xs'>
                {doc.type === 'contract' ? <FileText className='size-4' /> : <FileSpreadsheet className='size-4' />}
              </span>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-foreground'>{doc.docNumber}</span>
                  <span className='rounded bg-surface px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground border border-border'>
                    {doc.type === 'contract'
                      ? t('itAdmin.usageImport.extra.contractType')
                      : t('itAdmin.usageImport.extra.invoiceType')}
                  </span>
                  {doc.linkedDocId && (
                    <span className='inline-flex items-center gap-1 text-[0.65rem] text-primary'>
                      <LinkIcon className='size-3' />
                      <span>{t('itAdmin.usageImport.extra.linkedTransaction')}</span>
                    </span>
                  )}
                </div>
                <span className='text-[0.68rem] text-muted-foreground'>
                  {doc.vendor} {t('itAdmin.usageImport.extra.date')} {doc.issueDate}{' '}
                  {t('itAdmin.usageImport.extra.effective')} {doc.validPeriod}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='text-right'>
                <span className='font-bold text-foreground block'>
                  {doc.software} — {doc.plan}
                </span>
                <span className='text-[0.68rem] text-muted-foreground'>
                  {doc.qty} {t('itAdmin.usageImport.extra.licensesSeparator')} {doc.totalAmount} {doc.currency}
                </span>
              </div>
              <button
                className='rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => onSelectDoc(doc)}
                type='button'
              >
                {t('itAdmin.usageImport.extra.viewDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
