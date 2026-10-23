import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  Layers,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  initialItReconciliationRows,
  type ItReconciliationRow
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItReconciliationViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItReconciliationView({ onSelectTab }: ItReconciliationViewProps) {
  const { t } = useTranslation('dashboard')

  const [rows, setRows] = useState<ItReconciliationRow[]>(initialItReconciliationRows)
  const [selectedRow, setSelectedRow] = useState<ItReconciliationRow | null>(rows[0])
  const [periodFilter, setPeriodFilter] = useState<'10/2026' | '11/2026'>('10/2026')
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'dept-eng' | 'dept-design'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'deficit' | 'surplus' | 'matched' | 'insufficientData' | 'needsVerification'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Conflict Resolution Modal (IT-AC-07A)
  const [isResolveConflictOpen, setIsResolveConflictOpen] = useState(false)
  const [resolvedQuantity, setResolvedQuantity] = useState<number>(10)
  const [resolutionReason, setResolutionReason] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filtered rows
  const filteredRows = rows.filter((row) => {
    if (departmentFilter !== 'all' && row.departmentId !== 'all' && row.departmentId !== departmentFilter) {
      return false
    }
    if (statusFilter !== 'all' && row.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        row.softwareName.toLowerCase().includes(q) ||
        row.planName.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Handle Resolving Conflicting Contract vs Invoice (IT-AC-07A)
  const handleConfirmResolution = () => {
    if (!selectedRow) return
    if (!resolutionReason.trim()) {
      showToast('Vui lòng nhập căn cứ xác minh trước khi lưu.')
      return
    }

    setRows((prev) =>
      prev.map((r) => {
        if (r.id === selectedRow.id) {
          const newPurchased = resolvedQuantity
          const newRemaining = Math.max(0, newPurchased - r.grantedValid)
          const newMissing = Math.max(0, r.validDemand - newPurchased)
          const newSurplus = Math.max(0, newPurchased - r.validDemand)
          const newStatus =
            newMissing > 0 ? 'deficit' : newSurplus > 0 ? 'surplus' : 'matched'

          return {
            ...r,
            purchasedValid: newPurchased,
            availableRemaining: newRemaining,
            missing: newMissing,
            surplus: newSurplus,
            status: newStatus,
            conflictData: r.conflictData
              ? {
                  ...r.conflictData,
                  resolvedQty: resolvedQuantity,
                  resolutionReason: resolutionReason
                }
              : undefined
          }
        }
        return r
      })
    )

    setIsResolveConflictOpen(false)
    showToast(`Đã xác minh số lượng đã mua chính thức là ${resolvedQuantity} ${selectedRow.unit}!`)
  }

  const getStatusBadge = (status: ItReconciliationRow['status']) => {
    switch (status) {
      case 'deficit':
        return {
          label: 'Mua thiếu',
          tone: 'border-danger/30 bg-danger/10 text-danger font-bold'
        }
      case 'surplus':
        return {
          label: 'Mua dư',
          tone: 'border-warning/30 bg-warning/10 text-warning font-semibold'
        }
      case 'matched':
        return {
          label: 'Khớp 100%',
          tone: 'border-success/30 bg-success/10 text-success font-bold'
        }
      case 'needsVerification':
        return {
          label: 'Cần xác minh',
          tone: 'border-warning/40 bg-warning/15 text-warning font-bold'
        }
      case 'insufficientData':
        return {
          label: 'Chưa đủ dữ liệu mua',
          tone: 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
        }
    }
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
            Kiểm tra sai lệch bản quyền
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Đối chiếu mua sắm & Kiểm tra sai lệch bản quyền
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Hệ thống đối chiếu tự động số lượng bản quyền đã mua từ hóa đơn/hợp đồng với số tài khoản IT Admin đã cấp phát thực tế để phát hiện sai lệch thừa hoặc thiếu.
          </p>
        </div>
        <div>
          <button
            className='flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-surface-subtle'
            onClick={() => onSelectTab && onSelectTab('usage-import')}
            type='button'
          >
            <UploadCloud className='size-4' />
            <span>Nhập hóa đơn & Hợp đồng mua</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-3 text-xs'>
          {/* Period selector */}
          <div className='flex items-center gap-2'>
            <span className='font-bold text-muted-foreground'>Kỳ đối chiếu:</span>
            <select
              className='h-9 rounded-xl border border-border bg-surface-subtle px-3 font-semibold text-foreground outline-none focus:border-primary'
              onChange={(e) => setPeriodFilter(e.target.value as any)}
              value={periodFilter}
            >
              <option value='10/2026'>Tháng 10/2026 (Hiện tại)</option>
              <option value='11/2026'>Tháng 11/2026 (Kế hoạch)</option>
            </select>
          </div>

          {/* Department selector */}
          <div className='flex items-center gap-2'>
            <span className='font-bold text-muted-foreground'>Phạm vi:</span>
            <select
              className='h-9 rounded-xl border border-border bg-surface-subtle px-3 font-semibold text-foreground outline-none focus:border-primary'
              onChange={(e) => setDepartmentFilter(e.target.value as any)}
              value={departmentFilter}
            >
              <option value='all'>Toàn công ty</option>
              <option value='dept-eng'>Kỹ thuật phần mềm</option>
              <option value='dept-design'>Thiết kế & Marketing</option>
            </select>
          </div>

          {/* Status Filter Pills */}
          <div className='flex items-center gap-1.5 border-l border-border pl-3'>
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'deficit', label: 'Thiếu' },
                { id: 'surplus', label: 'Dư' },
                { id: 'matched', label: 'Khớp' },
                { id: 'needsVerification', label: 'Cần xác minh' },
                { id: 'insufficientData', label: 'Chưa đủ dữ liệu' }
              ] as const
            ).map((st) => (
              <button
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === st.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                    : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                type='button'
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-4 text-xs outline-none focus:border-primary'
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Tìm phần mềm, gói...'
            type='search'
            value={searchQuery}
          />
        </div>
      </div>

      {/* Main Grid: Comparison Table (Left) + Detailed Panel (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Comparison Table */}
        <div className='lg:col-span-2 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle/80 text-[0.7rem] uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3'>Phần mềm & Gói</th>
                  <th className='px-3 py-3 text-center'>Nhu cầu hợp lệ</th>
                  <th className='px-3 py-3 text-center'>Đã mua hiệu lực</th>
                  <th className='px-3 py-3 text-center'>Đã cấp</th>
                  <th className='px-3 py-3 text-center'>Còn có thể cấp</th>
                  <th className='px-3 py-3 text-center'>Chênh lệch</th>
                  <th className='px-4 py-3 text-right'>Trạng thái</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td className='px-4 py-8 text-center text-muted-foreground' colSpan={7}>
                      Không có dòng đối chiếu nào phù hợp với bộ lọc
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const isSelected = selectedRow?.id === row.id
                    return (
                      <tr
                        className={`cursor-pointer transition hover:bg-primary-soft/30 ${
                          isSelected ? 'bg-primary-soft/50 font-medium' : ''
                        }`}
                        key={row.id}
                        onClick={() => setSelectedRow(row)}
                      >
                        <td className='px-4 py-3.5'>
                          <div className='flex items-center gap-2'>
                            <span className='font-bold text-foreground'>{row.softwareName}</span>
                            <span className='rounded bg-primary-soft px-1.5 py-0.5 text-[0.68rem] font-bold text-primary'>
                              {row.planName}
                            </span>
                          </div>
                          <span className='text-[0.68rem] text-muted-foreground block mt-0.5'>
                            Đơn vị: {row.unit} · {row.departmentName}
                          </span>
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>
                          {row.validDemand}
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>
                          {row.status === 'insufficientData' ? (
                            <span className='text-muted-foreground italic text-[0.7rem]'>Chưa đủ</span>
                          ) : (
                            row.purchasedValid
                          )}
                        </td>
                        <td className='px-3 py-3.5 text-center text-muted-foreground'>
                          {row.grantedValid}
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-success'>
                          {row.status === 'insufficientData' ? '—' : row.availableRemaining}
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold'>
                          {row.missing > 0 ? (
                            <span className='text-danger'>- {row.missing}</span>
                          ) : row.surplus > 0 ? (
                            <span className='text-warning'>+ {row.surplus}</span>
                          ) : row.status === 'matched' ? (
                            <span className='text-success'>0</span>
                          ) : (
                            <span className='text-muted-foreground'>—</span>
                          )}
                        </td>
                        <td className='px-4 py-3.5 text-right'>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] ${
                              getStatusBadge(row.status).tone
                            }`}
                          >
                            {getStatusBadge(row.status).label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection Panel (Section 4 & IT-AC-08) */}
        {selectedRow ? (
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
                    Phạm vi: {selectedRow.departmentName} · Đơn vị tính: {selectedRow.unit}
                  </p>
                </div>
              </div>

              {/* Conflict Alert Banner if needsVerification (IT-AC-07A) */}
              {selectedRow.status === 'needsVerification' && selectedRow.conflictData && (
                <div className='rounded-xl border border-warning/40 bg-warning/10 p-4 space-y-2 text-xs'>
                  <div className='flex items-center gap-2 text-warning font-bold'>
                    <AlertTriangle className='size-4 shrink-0' />
                    <span>Phát hiện sai lệch giữa Hợp đồng và Hóa đơn</span>
                  </div>
                  <p className='text-muted-foreground leading-relaxed'>
                    Hai chứng từ của cùng một giao dịch ghi nhận số lượng khác nhau. Số lượng này chưa được đưa vào tồn có thể cấp cho tới khi IT Admin xác minh.
                  </p>
                  <button
                    className='mt-2 flex items-center gap-1.5 rounded-lg bg-warning px-3 py-1.5 text-xs font-bold text-warning-foreground shadow hover:bg-warning/90'
                    onClick={() => {
                      setResolvedQuantity(selectedRow.conflictData?.invoiceQty || 10)
                      setIsResolveConflictOpen(true)
                    }}
                    type='button'
                  >
                    <span>Mở bảng xác minh 2 nguồn</span>
                    <ChevronRight className='size-3.5' />
                  </button>
                </div>
              )}

              {/* Mathematical Breakdown Box (Section 4 & IT-AC-08) */}
              <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-2.5 text-xs'>
                <div className='flex items-center gap-1.5 font-bold text-foreground'>
                  <Calculator className='size-4 text-primary' />
                  <span>Cách tính toán số lượng đối chiếu:</span>
                </div>
                <div className='space-y-1.5 text-muted-foreground'>
                  <div className='flex items-center justify-between'>
                    <span>1. Nhu cầu hợp lệ (Các yêu cầu được duyệt):</span>
                    <span className='font-bold text-foreground'>{selectedRow.validDemand} {selectedRow.unit}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>2. Đã mua còn hiệu lực (Theo chứng từ):</span>
                    <span className='font-bold text-foreground'>
                      {selectedRow.status === 'insufficientData' ? 'Chưa đủ chứng từ' : `${selectedRow.purchasedValid} ${selectedRow.unit}`}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>3. Đã cấp còn hiệu lực:</span>
                    <span className='font-bold text-foreground'>{selectedRow.grantedValid} {selectedRow.unit}</span>
                  </div>
                  <div className='pt-2 border-t border-border/60 flex items-center justify-between font-bold text-foreground'>
                    <span>→ Còn có thể cấp (max(0, Đã mua - Đã cấp)):</span>
                    <span className='text-success font-black text-sm'>
                      {selectedRow.status === 'insufficientData' ? '—' : `${selectedRow.availableRemaining} ${selectedRow.unit}`}
                    </span>
                  </div>
                  {selectedRow.missing > 0 && (
                    <div className='flex items-center justify-between font-bold text-danger'>
                      <span>→ Mua thiếu (max(0, Nhu cầu - Đã mua)):</span>
                      <span className='font-black text-sm'>Thiếu {selectedRow.missing} {selectedRow.unit}</span>
                    </div>
                  )}
                  {selectedRow.surplus > 0 && (
                    <div className='flex items-center justify-between font-bold text-warning'>
                      <span>→ Mua dư (max(0, Đã mua - Nhu cầu)):</span>
                      <span className='font-black text-sm'>Dư {selectedRow.surplus} {selectedRow.unit}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Constituent Purchases (Contracts & Invoices linked) - IT-AC-07 */}
              <div className='space-y-2 text-xs'>
                <div className='flex items-center justify-between'>
                  <span className='font-bold text-foreground uppercase tracking-wider text-[0.68rem] text-muted-foreground'>
                    Chứng từ mua cấu thành ({selectedRow.constituentPurchases.length})
                  </span>
                  <span className='text-[0.65rem] text-muted-foreground'>Cùng giao dịch tính 1 lần</span>
                </div>
                {selectedRow.constituentPurchases.length === 0 ? (
                  <div className='rounded-xl border border-dashed border-border p-3 text-center text-muted-foreground italic'>
                    Chưa có chứng từ mua hợp lệ. Vui lòng vào màn hình Nhập hóa đơn / Hợp đồng.
                  </div>
                ) : (
                  <div className='space-y-1.5'>
                    {selectedRow.constituentPurchases.map((doc, idx) => (
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
                          {doc.qty} {selectedRow.unit}
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
                  <span>Mua thiếu {selectedRow.missing} quyền → Nhập chứng từ bổ sung</span>
                </button>
              )}

              {selectedRow.surplus > 0 && (
                <button
                  className='flex w-full items-center justify-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-2.5 text-xs font-bold text-warning hover:bg-warning/20'
                  onClick={() => onSelectTab && onSelectTab('license-optimization')}
                  type='button'
                >
                  <Sparkles className='size-4' />
                  <span>Mua dư {selectedRow.surplus} quyền → Đánh giá tối ưu chi phí</span>
                </button>
              )}

              {selectedRow.status === 'insufficientData' && (
                <button
                  className='flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                  onClick={() => onSelectTab && onSelectTab('usage-import')}
                  type='button'
                >
                  <UploadCloud className='size-4' />
                  <span>Nhập chứng từ để xác minh quyền mua</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='rounded-2xl border border-dashed border-border bg-surface p-12 text-center text-muted-foreground'>
            <Info className='size-8 mx-auto opacity-40 mb-2' />
            <p className='text-xs font-semibold'>Chọn một dòng đối chiếu để xem chi tiết</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: XÁC MINH HAI CHỨNG TỪ BẤT ĐỒNG SỐ LƯỢNG (IT-AC-07A)               */}
      {/* ========================================================================= */}
      {isResolveConflictOpen && selectedRow && selectedRow.conflictData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-warning font-bold'>
                <AlertTriangle className='size-5' />
                <h3 className='text-base font-bold text-foreground'>
                  Xác minh sai lệch số lượng Hợp đồng & Hóa đơn
                </h3>
              </div>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsResolveConflictOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            <p className='text-xs text-muted-foreground leading-relaxed'>
              Giao dịch này có cả Hợp đồng và Hóa đơn nhưng ghi nhận hai số lượng khác nhau. Vui lòng đối chiếu trực tiếp
              và chọn số lượng xác nhận chính thức đưa vào số "Đã mua hiệu lực":
            </p>

            {/* Side-by-side comparison cards */}
            <div className='grid grid-cols-2 gap-3 text-xs'>
              {/* Option 1: Contract */}
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
                    Theo Hợp đồng
                  </span>
                  <input
                    checked={resolvedQuantity === selectedRow.conflictData.contractQty}
                    onChange={() => setResolvedQuantity(selectedRow.conflictData!.contractQty)}
                    type='radio'
                  />
                </div>
                <div className='mt-2 flex items-baseline gap-2'>
                  <span className='text-2xl font-black text-foreground'>{selectedRow.conflictData.contractQty}</span>
                  <span className='text-xs text-muted-foreground'>{selectedRow.unit}</span>
                </div>
                <p className='text-[0.7rem] text-muted-foreground mt-1'>
                  {selectedRow.conflictData.contractDoc}
                </p>
              </div>

              {/* Option 2: Invoice */}
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
                    Theo Hóa đơn kỳ này
                  </span>
                  <input
                    checked={resolvedQuantity === selectedRow.conflictData.invoiceQty}
                    onChange={() => setResolvedQuantity(selectedRow.conflictData!.invoiceQty)}
                    type='radio'
                  />
                </div>
                <div className='mt-2 flex items-baseline gap-2'>
                  <span className='text-2xl font-black text-foreground'>{selectedRow.conflictData.invoiceQty}</span>
                  <span className='text-xs text-muted-foreground'>{selectedRow.unit}</span>
                </div>
                <p className='text-[0.7rem] text-muted-foreground mt-1'>
                  {selectedRow.conflictData.invoiceDoc}
                </p>
              </div>
            </div>

            {/* Reason input */}
            <div className='space-y-1.5 text-xs'>
              <label className='font-bold text-foreground'>
                Căn cứ / Lý do xác nhận số lượng (Bắt buộc):
              </label>
              <textarea
                className='w-full rounded-xl border border-border bg-surface-subtle p-3 text-xs outline-none focus:border-primary'
                onChange={(e) => setResolutionReason(e.target.value)}
                placeholder='Ví dụ: Hợp đồng khung cho phép tối đa 12 seat nhưng kỳ tháng 10 thực tế chỉ kích hoạt và thanh toán hóa đơn 10 seat...'
                rows={3}
                value={resolutionReason}
              />
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsResolveConflictOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={handleConfirmResolution}
                type='button'
              >
                Lưu số lượng xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
