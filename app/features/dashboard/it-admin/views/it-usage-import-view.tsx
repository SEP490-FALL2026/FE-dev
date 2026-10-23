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

import {
  initialItPurchaseDocs,
  type ItPurchaseDoc
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItUsageImportViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItUsageImportView({ onSelectTab }: ItUsageImportViewProps) {
  const { t } = useTranslation('dashboard')

  const [docs, setDocs] = useState<ItPurchaseDoc[]>(initialItPurchaseDocs)
  const [selectedDoc, setSelectedDoc] = useState<ItPurchaseDoc | null>(docs[0])

  // Import State Simulation
  const [importType, setImportType] = useState<'invoice' | 'contract'>('invoice')
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'reading' | 'needsCheck' | 'success' | 'error'>('idle')
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
        showToast('Trích xuất dữ liệu thành công! Vui lòng đối soát các trường bên cạnh văn bản gốc.')
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

    showToast(`Đã nhập thành công chứng từ ${docNumberInput}! Ghi nhận mới ${qtyInput} quyền sử dụng vào Kiểm tra sai lệch bản quyền.`)
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
            Chứng từ mua & Hợp đồng
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Nhập hóa đơn & Hợp đồng mua sắm
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Tải tệp PDF/ảnh, xem trước dữ liệu trích xuất cạnh tài liệu gốc, ánh xạ phần mềm/gói danh mục và cập nhật số lượng đã mua vào hệ thống.
          </p>
        </div>
        <div>
          <button
            className='flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-surface-subtle'
            onClick={() => onSelectTab && onSelectTab('reconciliation')}
            type='button'
          >
            <Scale className='size-4' />
            <span>Mở Kiểm tra sai lệch bản quyền</span>
          </button>
        </div>
      </div>

      {/* Import Section: Upload / Presets */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-3 text-xs'>
            <span className='font-bold text-foreground'>Loại chứng từ:</span>
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
                Hóa đơn (Invoice)
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
                Hợp đồng (Contract)
              </button>
            </div>
          </div>

          {/* Quick Mock Fixture Buttons */}
          <div className='flex items-center gap-2 text-xs'>
            <span className='text-muted-foreground'>Nạp nhanh mẫu kiểm thử:</span>
            <button
              className='rounded-lg border border-border bg-surface-subtle px-2.5 py-1 font-semibold text-foreground hover:bg-surface'
              onClick={() => handleStartUpload('sampleInvoice')}
              type='button'
            >
              Hóa đơn OpenAI (8 seat)
            </button>
            <button
              className='rounded-lg border border-border bg-surface-subtle px-2.5 py-1 font-semibold text-foreground hover:bg-surface'
              onClick={() => handleStartUpload('sampleContract')}
              type='button'
            >
              Hợp đồng Claude (5 key)
            </button>
            <button
              className='rounded-lg border border-warning/40 bg-warning/10 px-2.5 py-1 font-bold text-warning hover:bg-warning/20'
              onClick={() => handleStartUpload('sampleConflict')}
              type='button'
            >
              Ca lệch Copilot (10 seat)
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center transition hover:border-primary/60 bg-surface-subtle/40 cursor-pointer'
          onClick={() => handleStartUpload()}
        >
          <UploadCloud className='size-10 text-primary opacity-70 mb-2' />
          <p className='text-sm font-bold text-foreground'>
            Kéo thả tệp hóa đơn/hợp đồng vào đây hoặc bấm để chọn tệp
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            Hỗ trợ PDF, PNG, JPG (Mô phỏng trích xuất dữ liệu tự động)
          </p>
          <span className='mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground'>
            <FileText className='size-3.5 text-primary' />
            <span>Tệp hiện tại: {uploadedFileName}</span>
          </span>
        </div>

        {/* Status progress bar if reading */}
        {(importStatus === 'uploading' || importStatus === 'reading') && (
          <div className='rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs space-y-2'>
            <div className='flex items-center justify-between text-primary font-bold'>
              <span className='flex items-center gap-2'>
                <RefreshCw className='size-3.5 animate-spin' />
                {importStatus === 'uploading' ? 'Đang tải tệp lên...' : 'Đang đọc và phân tích cấu trúc chứng từ...'}
              </span>
              <span>Mô phỏng xử lý</span>
            </div>
            <div className='h-1.5 w-full bg-primary/20 rounded-full overflow-hidden'>
              <div className='h-full bg-primary animate-[pulse_1s_infinite]' style={{ width: importStatus === 'uploading' ? '45%' : '85%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Verification Screen (Section 5.2 & 5.3) */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Left: Original Scan Document Preview */}
        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
          <div className='flex items-center justify-between pb-3 border-b border-border/80'>
            <div className='flex items-center gap-2'>
              <FileCheck className='size-4 text-primary' />
              <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                Văn bản gốc scan / Bản chụp
              </h3>
            </div>
            <span className='font-mono text-xs text-muted-foreground'>{uploadedFileName}</span>
          </div>

          <div className='rounded-xl border border-border bg-surface-subtle p-5 font-mono text-xs leading-relaxed space-y-3 min-h-[360px] text-foreground'>
            <div className='flex justify-between border-b border-border/50 pb-2'>
              <span className='font-bold text-base text-primary'>{vendorInput.toUpperCase()}</span>
              <span className='text-muted-foreground'>{importType === 'invoice' ? 'OFFICIAL INVOICE' : 'SERVICE AGREEMENT'}</span>
            </div>
            <div className='space-y-1 text-[0.75rem]'>
              <p>Số chứng từ: <strong>{docNumberInput}</strong></p>
              <p>Ngày lập: <strong>{dateInput}</strong></p>
              <p>Kỳ hiệu lực: <strong>{validPeriodInput}</strong></p>
            </div>
            <div className='mt-4 rounded-lg border border-border bg-surface p-3 space-y-2'>
              <div className='flex justify-between font-bold border-b border-border/40 pb-1 text-[0.72rem]'>
                <span>Mục thanh toán</span>
                <span>Số lượng</span>
                <span>Đơn giá</span>
                <span>Thành tiền</span>
              </div>
              <div className='flex justify-between text-[0.75rem]'>
                <span>{softwareInput} — {planInput}</span>
                <span>{qtyInput}</span>
                <span>${unitPriceInput}</span>
                <span>${totalAmountInput} {currencyInput}</span>
              </div>
            </div>
            <div className='pt-3 text-[0.7rem] text-muted-foreground italic'>
              * Dữ liệu trích xuất tự động được đối chiếu trực tiếp với các trường chỉnh sửa bên cạnh.
            </div>
          </div>
        </div>

        {/* Right: Extracted Editable Fields & Catalog Mapping */}
        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4 flex flex-col justify-between'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between pb-3 border-b border-border/80'>
              <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                Dữ liệu trích xuất & Ánh xạ gói
              </h3>
              <span className='rounded-md bg-success/10 px-2 py-0.5 text-xs font-bold text-success'>
                Sẵn sàng kiểm tra
              </span>
            </div>

            <div className='grid gap-3 sm:grid-cols-2 text-xs'>
              <div>
                <label className='font-bold text-foreground'>Nhà cung cấp (Vendor):</label>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                  onChange={(e) => setVendorInput(e.target.value)}
                  type='text'
                  value={vendorInput}
                />
              </div>
              <div>
                <label className='font-bold text-foreground'>Số chứng từ:</label>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 font-mono outline-none focus:border-primary'
                  onChange={(e) => setDocNumberInput(e.target.value)}
                  type='text'
                  value={docNumberInput}
                />
              </div>
              <div>
                <label className='font-bold text-foreground'>Ngày chứng từ:</label>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                  onChange={(e) => setDateInput(e.target.value)}
                  type='text'
                  value={dateInput}
                />
              </div>
              <div>
                <label className='font-bold text-foreground'>Kỳ hiệu lực:</label>
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
                <span className='font-bold text-foreground'>Ánh xạ tới Phần mềm & Gói danh mục:</span>
                <button
                  className='flex items-center gap-1 text-[0.7rem] font-bold text-primary hover:underline'
                  onClick={() => onSelectTab && onSelectTab('dept-catalog')}
                  type='button'
                >
                  <span>Chưa có gói? Mở Danh mục phòng ban</span>
                  <ExternalLink className='size-3' />
                </button>
              </div>

              <div className='grid gap-3 sm:grid-cols-3'>
                <div>
                  <span className='text-muted-foreground'>Phần mềm:</span>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 font-bold text-foreground outline-none focus:border-primary'
                    onChange={(e) => setSoftwareInput(e.target.value)}
                    type='text'
                    value={softwareInput}
                  />
                </div>
                <div>
                  <span className='text-muted-foreground'>Gói bản quyền:</span>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-3 font-bold text-primary outline-none focus:border-primary'
                    onChange={(e) => setPlanInput(e.target.value)}
                    type='text'
                    value={planInput}
                  />
                </div>
                <div>
                  <span className='text-muted-foreground'>Phòng ban hưởng:</span>
                  <select
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface px-2.5 font-semibold text-foreground outline-none focus:border-primary'
                    onChange={(e) => setDeptScopeInput(e.target.value)}
                    value={deptScopeInput}
                  >
                    <option value='Toàn công ty (Cấp công ty)'>Toàn công ty</option>
                    <option value='Kỹ thuật phần mềm'>Kỹ thuật phần mềm</option>
                    <option value='Thiết kế & Marketing'>Thiết kế & Marketing</option>
                  </select>
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-3 pt-2'>
                <div>
                  <span className='text-muted-foreground'>Số lượng quyền mua:</span>
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
                  <span className='text-muted-foreground'>Đơn giá:</span>
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
                  <span className='text-muted-foreground'>Tổng tiền ({currencyInput}):</span>
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
              Ghi nhận mới: +{qtyInput} quyền sử dụng
            </span>
            <button
              className='flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
              onClick={handleConfirmImport}
              type='button'
            >
              <CheckCircle2 className='size-4' />
              <span>Xác nhận nhập chứng từ</span>
            </button>
          </div>
        </div>
      </div>

      {/* History List of Imported Documents */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-border/80'>
          <div>
            <h3 className='text-base font-bold text-foreground'>Lịch sử chứng từ mua đã nhập ({docs.length})</h3>
            <p className='text-xs text-muted-foreground mt-0.5'>Mở lại văn bản gốc, kiểm tra số lượng và nguồn dữ liệu đối chiếu</p>
          </div>
          <span className='font-mono text-xs text-muted-foreground'>Cập nhật tự động</span>
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
                      {doc.type === 'contract' ? 'Hợp đồng' : 'Hóa đơn'}
                    </span>
                    {doc.linkedDocId && (
                      <span className='inline-flex items-center gap-1 text-[0.65rem] text-primary'>
                        <LinkIcon className='size-3' />
                        <span>Đã liên kết cùng GD</span>
                      </span>
                    )}
                  </div>
                  <span className='text-[0.68rem] text-muted-foreground'>
                    {doc.vendor} · Ngày: {doc.issueDate} · Hiệu lực: {doc.validPeriod}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-6'>
                <div className='text-right'>
                  <span className='font-bold text-foreground block'>{doc.software} — {doc.plan}</span>
                  <span className='text-[0.68rem] text-muted-foreground'>
                    {doc.qty} quyền · {doc.totalAmount} {doc.currency}
                  </span>
                </div>
                <button
                  className='rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                  onClick={() => {
                    setSelectedDoc(doc)
                    showToast(`Đã mở chứng từ ${doc.docNumber}`)
                  }}
                  type='button'
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
