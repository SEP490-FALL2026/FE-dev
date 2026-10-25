import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Info,
  Layers,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Sparkles,
  Upload,
  UploadCloud,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { initialItPurchaseDocs, type ItPurchaseDoc } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { UsageImportForm } from '../components/usage-import-form'
import { UsageImportHistory } from '../components/usage-import-history'

type ItUsageImportViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItUsageImportView({ onSelectTab }: ItUsageImportViewProps) {
  const { t } = useTranslation('dashboard')

  const [docs, setDocs] = useState<ItPurchaseDoc[]>(initialItPurchaseDocs)
  const [selectedDoc, setSelectedDoc] = useState<ItPurchaseDoc | null>(docs[0])

  // Import State Simulation
  const [importType, setImportType] = useState<'invoice' | 'contract'>('invoice')
  const [importStatus, setImportStatus] = useState<
    'idle' | 'uploading' | 'reading' | 'needsCheck' | 'success' | 'error'
  >('idle')
  const [uploadedFileName, setUploadedFileName] = useState<string>('hoa_don_openai_enterprise_inv_1026_894.pdf')

  // Editable preview form state
  const [vendorInput, setVendorInput] = useState('OpenAI, LLC')
  const [docNumberInput, setDocNumberInput] = useState('INV-OAI-1026-894')
  const [dateInput, setDateInput] = useState('02/10/2026')
  const [validPeriodInput, setValidPeriodInput] = useState('01/10/2026 – 31/10/2026')
  const [currencyInput, setCurrencyInput] = useState('USD')
  const [softwareInput, setSoftwareInput] = useState('ChatGPT')
  const [planInput, setPlanInput] = useState('Plus')
  const [qtyInput, setQtyInput] = useState(8)
  const [unitPriceInput, setUnitPriceInput] = useState(20)
  const [totalAmountInput, setTotalAmountInput] = useState(160)
  const [deptScopeInput, setDeptScopeInput] = useState('Toàn công ty (Cấp công ty)')
  const [mappedCatalogInput, setMappedCatalogInput] = useState('CAT-01')

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle mock file upload & simulated OCR
  const handleStartUpload = (preset?: 'sampleInvoice' | 'sampleContract' | 'sampleConflict') => {
    setImportStatus('uploading')

    if (preset === 'sampleContract') {
      setImportType('contract')
      setUploadedFileName('hop_dong_anthropic_claude_pro_ct_2026_012.pdf')
      setVendorInput('Anthropic PBC')
      setDocNumberInput('HD-ANTH-2026-012')
      setDateInput('10/10/2026')
      setValidPeriodInput('01/10/2026 – 31/12/2026')
      setCurrencyInput('USD')
      setSoftwareInput('Claude')
      setPlanInput('Pro 5x')
      setQtyInput(5)
      setUnitPriceInput(30)
      setTotalAmountInput(150)
      setDeptScopeInput('Kỹ thuật phần mềm')
      setMappedCatalogInput('CAT-03')
    } else if (preset === 'sampleConflict') {
      setImportType('invoice')
      setUploadedFileName('hoa_don_copilot_inv_ms_2026_441.pdf')
      setVendorInput('GitHub / Microsoft')
      setDocNumberInput('INV-MS-2026-441')
      setDateInput('01/10/2026')
      setValidPeriodInput('01/10/2026 – 31/10/2026')
      setCurrencyInput('USD')
      setSoftwareInput('GitHub Copilot')
      setPlanInput('Business')
      setQtyInput(10)
      setUnitPriceInput(19)
      setTotalAmountInput(190)
      setDeptScopeInput('Kỹ thuật phần mềm')
      setMappedCatalogInput('CAT-02')
    }

    setTimeout(() => {
      setImportStatus('reading')
      setTimeout(() => {
        setImportStatus('needsCheck')
        showToast(t('itAdmin.usageImport.extra.extractionSuccess'))
      }, 1000)
    }, 800)
  }

  // Handle Confirm Import (Section 5.5)
  const handleConfirmImport = () => {
    const newDoc: ItPurchaseDoc = {
      id: `DOC-${Date.now()}`,
      docNumber: docNumberInput,
      type: importType,
      vendor: vendorInput,
      issueDate: dateInput,
      validPeriod: validPeriodInput,
      currency: currencyInput,
      software: softwareInput,
      plan: planInput,
      qty: Number(qtyInput),
      unitPrice: Number(unitPriceInput),
      totalAmount: Number(totalAmountInput),
      status: 'verified',
      departmentScope: deptScopeInput,
      mappedCatalogId: mappedCatalogInput,
      scanPreviewText: `CERTIFIED SCAN: ${docNumberInput} | Vendor: ${vendorInput} | Date: ${dateInput} | Item: ${softwareInput} - ${planInput} x ${qtyInput} | Total: ${totalAmountInput} ${currencyInput}`
    }

    setDocs((prev) => [newDoc, ...prev])
    setSelectedDoc(newDoc)
    setImportStatus('success')

    showToast(t('itAdmin.usageImport.extra.importSuccess', { document: docNumberInput, quantity: qtyInput }))
  }

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            {t('itAdmin.usageImport.extra.kicker')}
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('itAdmin.usageImport.extra.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.usageImport.extra.intro')}</p>
        </div>
        <div>
          <button
            className='flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-surface-subtle'
            onClick={() => onSelectTab && onSelectTab('reconciliation')}
            type='button'
          >
            <Scale className='size-4' />
            <span>{t('itAdmin.usageImport.extra.openReconciliation')}</span>
          </button>
        </div>
      </div>

      {/* Import Section: Upload / Presets */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-3 text-xs'>
            <span className='font-bold text-foreground'>{t('itAdmin.usageImport.extra.documentType')}</span>
            <div className='flex items-center gap-2'>
              <button
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  importType === 'invoice'
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'border border-border text-muted-foreground hover:bg-surface-subtle'
                }`}
                onClick={() => setImportType('invoice')}
                type='button'
              >
                {t('itAdmin.usageImport.extra.invoice')}
              </button>
              <button
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  importType === 'contract'
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'border border-border text-muted-foreground hover:bg-surface-subtle'
                }`}
                onClick={() => setImportType('contract')}
                type='button'
              >
                {t('itAdmin.usageImport.extra.contract')}
              </button>
            </div>
          </div>

          {/* Quick Mock Fixture Buttons */}
          <div className='flex items-center gap-2 text-xs'>
            <span className='text-muted-foreground'>{t('itAdmin.usageImport.extra.quickSample')}</span>
            <button
              className='rounded-lg border border-border bg-surface-subtle px-2.5 py-1 font-semibold text-foreground hover:bg-surface'
              onClick={() => handleStartUpload('sampleInvoice')}
              type='button'
            >
              {t('itAdmin.usageImport.extra.openAiSample')}
            </button>
            <button
              className='rounded-lg border border-border bg-surface-subtle px-2.5 py-1 font-semibold text-foreground hover:bg-surface'
              onClick={() => handleStartUpload('sampleContract')}
              type='button'
            >
              {t('itAdmin.usageImport.extra.claudeSample')}
            </button>
            <button
              className='rounded-lg border border-warning/40 bg-warning/10 px-2.5 py-1 font-bold text-warning hover:bg-warning/20'
              onClick={() => handleStartUpload('sampleConflict')}
              type='button'
            >
              {t('itAdmin.usageImport.extra.copilotSample')}
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center transition hover:border-primary/60 bg-surface-subtle/40 cursor-pointer'
          onClick={() => handleStartUpload()}
        >
          <UploadCloud className='size-10 text-primary opacity-70 mb-2' />
          <p className='text-sm font-bold text-foreground'>{t('itAdmin.usageImport.extra.dropFile')}</p>
          <p className='text-xs text-muted-foreground mt-1'>{t('itAdmin.usageImport.extra.supportedFiles')}</p>
          <span className='mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground'>
            <FileText className='size-3.5 text-primary' />
            <span>
              {t('itAdmin.usageImport.extra.currentFile')} {uploadedFileName}
            </span>
          </span>
        </div>

        {/* Status progress bar if reading */}
        {(importStatus === 'uploading' || importStatus === 'reading') && (
          <div className='rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs space-y-2'>
            <div className='flex items-center justify-between text-primary font-bold'>
              <span className='flex items-center gap-2'>
                <RefreshCw className='size-3.5 animate-spin' />
                {importStatus === 'uploading'
                  ? t('itAdmin.usageImport.extra.uploading')
                  : t('itAdmin.usageImport.extra.reading')}
              </span>
              <span>{t('itAdmin.usageImport.extra.processing')}</span>
            </div>
            <div className='h-1.5 w-full bg-primary/20 rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary animate-[pulse_1s_infinite]'
                style={{ width: importStatus === 'uploading' ? '45%' : '85%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Verification Screen (Section 5.2 & 5.3) */}
      <UsageImportForm
        currencyInput={currencyInput}
        dateInput={dateInput}
        deptScopeInput={deptScopeInput}
        docNumberInput={docNumberInput}
        importType={importType}
        onConfirmImport={handleConfirmImport}
        onOpenCatalog={() => onSelectTab && onSelectTab('dept-catalog')}
        planInput={planInput}
        qtyInput={qtyInput}
        setDateInput={setDateInput}
        setDeptScopeInput={setDeptScopeInput}
        setDocNumberInput={setDocNumberInput}
        setPlanInput={setPlanInput}
        setQtyInput={setQtyInput}
        setSoftwareInput={setSoftwareInput}
        setTotalAmountInput={setTotalAmountInput}
        setUnitPriceInput={setUnitPriceInput}
        setValidPeriodInput={setValidPeriodInput}
        setVendorInput={setVendorInput}
        softwareInput={softwareInput}
        t={t}
        totalAmountInput={totalAmountInput}
        unitPriceInput={unitPriceInput}
        uploadedFileName={uploadedFileName}
        validPeriodInput={validPeriodInput}
        vendorInput={vendorInput}
      />

      {/* History List of Imported Documents */}
      <UsageImportHistory
        docs={docs}
        onSelectDoc={(doc) => {
          setSelectedDoc(doc)
          showToast(t('itAdmin.usageImport.extra.documentOpened', { document: doc.docNumber }))
        }}
        t={t}
      />
    </div>
  )
}
