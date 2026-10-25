import React from 'react'
import { CheckCircle2, ExternalLink, FileCheck } from 'lucide-react'

export interface UsageImportFormProps {
  uploadedFileName: string
  vendorInput: string
  setVendorInput: (v: string) => void
  importType: 'invoice' | 'contract'
  docNumberInput: string
  setDocNumberInput: (v: string) => void
  dateInput: string
  setDateInput: (v: string) => void
  validPeriodInput: string
  setValidPeriodInput: (v: string) => void
  softwareInput: string
  setSoftwareInput: (v: string) => void
  planInput: string
  setPlanInput: (v: string) => void
  qtyInput: number
  setQtyInput: (v: number) => void
  unitPriceInput: number
  setUnitPriceInput: (v: number) => void
  totalAmountInput: number
  setTotalAmountInput: (v: number) => void
  currencyInput: string
  deptScopeInput: string
  setDeptScopeInput: (v: string) => void
  onOpenCatalog?: () => void
  onConfirmImport: () => void
  t: any
}

export const UsageImportForm: React.FC<UsageImportFormProps> = ({
  uploadedFileName,
  vendorInput,
  setVendorInput,
  importType,
  docNumberInput,
  setDocNumberInput,
  dateInput,
  setDateInput,
  validPeriodInput,
  setValidPeriodInput,
  softwareInput,
  setSoftwareInput,
  planInput,
  setPlanInput,
  qtyInput,
  setQtyInput,
  unitPriceInput,
  setUnitPriceInput,
  totalAmountInput,
  setTotalAmountInput,
  currencyInput,
  deptScopeInput,
  setDeptScopeInput,
  onOpenCatalog,
  onConfirmImport,
  t,
}) => {
  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      {/* Left: Original Scan Document Preview */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-border/80'>
          <div className='flex items-center gap-2'>
            <FileCheck className='size-4 text-primary' />
            <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
              {t('itAdmin.usageImport.extra.sourceDocument')}
            </h3>
          </div>
          <span className='font-mono text-xs text-muted-foreground'>{uploadedFileName}</span>
        </div>

        <div className='rounded-xl border border-border bg-surface-subtle p-5 font-mono text-xs leading-relaxed space-y-3 min-h-[360px] text-foreground'>
          <div className='flex justify-between border-b border-border/50 pb-2'>
            <span className='font-bold text-base text-primary'>{vendorInput.toUpperCase()}</span>
            <span className='text-muted-foreground'>
              {importType === 'invoice' ? 'OFFICIAL INVOICE' : 'SERVICE AGREEMENT'}
            </span>
          </div>
          <div className='space-y-1 text-[0.75rem]'>
            <p>
              {t('itAdmin.usageImport.extra.documentNumber')} <strong>{docNumberInput}</strong>
            </p>
            <p>
              {t('itAdmin.usageImport.extra.documentDate')} <strong>{dateInput}</strong>
            </p>
            <p>
              {t('itAdmin.usageImport.extra.coveragePeriod')} <strong>{validPeriodInput}</strong>
            </p>
          </div>
          <div className='mt-4 rounded-lg border border-border bg-surface p-3 space-y-2'>
            <div className='flex justify-between font-bold border-b border-border/40 pb-1 text-[0.72rem]'>
              <span>{t('itAdmin.usageImport.extra.lineItem')}</span>
              <span>{t('itAdmin.usageImport.extra.quantity')}</span>
              <span>{t('itAdmin.usageImport.extra.unitPrice')}</span>
              <span>{t('itAdmin.usageImport.extra.amount')}</span>
            </div>
            <div className='flex justify-between text-[0.75rem]'>
              <span>
                {softwareInput} — {planInput}
              </span>
              <span>{qtyInput}</span>
              <span>${unitPriceInput}</span>
              <span>
                ${totalAmountInput} {currencyInput}
              </span>
            </div>
          </div>
          <div className='pt-3 text-[0.7rem] text-muted-foreground italic'>
            {t('itAdmin.usageImport.extra.extractionNotice')}
          </div>
        </div>
      </div>

      {/* Right: Extracted Editable Fields & Catalog Mapping */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4 flex flex-col justify-between'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between pb-3 border-b border-border/80'>
            <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
              {t('itAdmin.usageImport.extra.mappingTitle')}
            </h3>
            <span className='rounded-md bg-success/10 px-2 py-0.5 text-xs font-bold text-success'>
              {t('itAdmin.usageImport.extra.readyToReview')}
            </span>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 text-xs'>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.usageImport.extra.vendor')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setVendorInput(e.target.value)}
                type='text'
                value={vendorInput}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.usageImport.extra.documentNumber')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 font-mono outline-none focus:border-primary'
                onChange={(e) => setDocNumberInput(e.target.value)}
                type='text'
                value={docNumberInput}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.usageImport.extra.documentIssued')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setDateInput(e.target.value)}
                type='text'
                value={dateInput}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.usageImport.extra.coveragePeriod')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setValidPeriodInput(e.target.value)}
                type='text'
                value={validPeriodInput}
              />
            </div>
          </div>

          {/* Catalog Mapping Row (Section 5.3) */}
          <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-foreground'>{t('itAdmin.usageImport.extra.catalogMapping')}</span>
              {onOpenCatalog && (
                <button
                  className='flex items-center gap-1 text-[0.7rem] font-bold text-primary hover:underline'
                  onClick={onOpenCatalog}
                  type='button'
                >
                  <span>{t('itAdmin.usageImport.extra.openCatalog')}</span>
                  <ExternalLink className='size-3' />
                </button>
              )}
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.usageImport.extra.software')}</span>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 font-bold text-foreground outline-none focus:border-primary'
                  onChange={(e) => setSoftwareInput(e.target.value)}
                  type='text'
                  value={softwareInput}
                />
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.usageImport.extra.licensePlan')}</span>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 font-bold text-primary outline-none focus:border-primary'
                  onChange={(e) => setPlanInput(e.target.value)}
                  type='text'
                  value={planInput}
                />
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.usageImport.extra.benefitingDepartment')}</span>
                <select
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-2.5 font-semibold text-foreground outline-none focus:border-primary'
                  onChange={(e) => setDeptScopeInput(e.target.value)}
                  value={deptScopeInput}
                >
                  <option value={t('itAdmin.usageImport.extra.companyValue')}>
                    {t('itAdmin.usageImport.extra.company')}
                  </option>
                  <option value={t('itAdmin.usageImport.extra.engineering')}>
                    {t('itAdmin.usageImport.extra.engineering')}
                  </option>
                  <option value={t('itAdmin.usageImport.extra.designMarketing')}>
                    {t('itAdmin.usageImport.extra.designMarketing')}
                  </option>
                </select>
              </div>
            </div>

            <div className='grid gap-3 sm:grid-cols-3 pt-2'>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.usageImport.extra.purchasedQuantity')}</span>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 font-bold text-foreground outline-none focus:border-primary'
                  onChange={(e) => {
                    const q = Number(e.target.value) || 0
                    setQtyInput(q)
                    setTotalAmountInput(q * unitPriceInput)
                  }}
                  type='number'
                  value={qtyInput}
                />
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.usageImport.extra.unitPrice')}:</span>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 text-foreground outline-none focus:border-primary'
                  onChange={(e) => {
                    const p = Number(e.target.value) || 0
                    setUnitPriceInput(p)
                    setTotalAmountInput(qtyInput * p)
                  }}
                  type='number'
                  value={unitPriceInput}
                />
              </div>
              <div>
                <span className='text-muted-foreground'>
                  {t('itAdmin.usageImport.extra.totalAmount')} ({currencyInput}):
                </span>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 font-bold text-foreground outline-none focus:border-primary'
                  onChange={(e) => setTotalAmountInput(Number(e.target.value) || 0)}
                  type='number'
                  value={totalAmountInput}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='pt-4 border-t border-border flex items-center justify-between'>
          <span className='text-xs text-muted-foreground font-semibold'>
            {t('itAdmin.usageImport.extra.newLicenses')} {qtyInput} {t('itAdmin.usageImport.extra.licenses')}
          </span>
          <button
            className='flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={onConfirmImport}
            type='button'
          >
            <CheckCircle2 className='size-4' />
            <span>{t('itAdmin.usageImport.extra.confirmImport')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
