import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  History,
  Info,
  Layers,
  Package,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingDown,
  UserCheck,
  UserMinus,
  Users,
  WifiOff,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  initialItOptimizationAlerts,
  type ItOptimizationAlertItem
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItOptimizationViewProps = {
  formatCurrency?: (value: number) => string
  initialAlertId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItOptimizationView({
  formatCurrency = (v) => `${v.toLocaleString('vi-VN')} ₫`,
  initialAlertId,
  onSelectTab
}: ItOptimizationViewProps) {
  const { t } = useTranslation('dashboard')

  const [alerts, setAlerts] = useState<ItOptimizationAlertItem[]>(initialItOptimizationAlerts)
  const [selectedAlert, setSelectedAlert] = useState<ItOptimizationAlertItem | null>(() => {
    if (initialAlertId) {
      const match = initialItOptimizationAlerts.find((a) => a.id === initialAlertId)
      if (match) return match
    }
    return initialItOptimizationAlerts[0] || null
  })
  const [filterType, setFilterType] = useState<'all' | 'lowUsage' | 'idleLong' | 'delayedReclaim' | 'missingData'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isReclaimModalOpen, setIsReclaimModalOpen] = useState(false)
  const [isKeepModalOpen, setIsKeepModalOpen] = useState(false)
  const [keepReasonInput, setKeepReasonInput] = useState('')
  const [isReclaimProcessing, setIsReclaimProcessing] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredAlerts = alerts.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        item.employeeName.toLowerCase().includes(q) ||
        item.softwareName.toLowerCase().includes(q) ||
        item.planName.toLowerCase().includes(q) ||
        item.departmentName.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Handle Reclaim Decision
  const handleConfirmReclaim = () => {
    if (!selectedAlert) return
    setIsReclaimProcessing(true)

    setTimeout(() => {
      setIsReclaimProcessing(false)
      setIsReclaimModalOpen(false)

      const canReuse = selectedAlert.reclaimImpact.canReuse

      setAlerts((prev) =>
        prev.map((a) => (a.id === selectedAlert.id ? { ...a, status: 'reclaimed' } : a))
      )

      if (canReuse) {
        showToast(
          `Thu hồi thành công! Bản quyền ${selectedAlert.softwareName} được hoàn trả vào kho (+1 Còn có thể cấp cho nhân sự khác).`
        )
      } else {
        showToast(
          `Thu hồi thành công! Mã key bản quyền này không thể tái sử dụng nên kho không tăng số lượng.`
        )
      }
    }, 1000)
  }

  // Handle Keep Decision
  const handleConfirmKeep = () => {
    if (!selectedAlert) return
    if (!keepReasonInput.trim()) {
      showToast('Vui lòng nhập lý do giữ lại bản quyền.')
      return
    }

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id ? { ...a, status: 'kept', keepReason: keepReasonInput } : a
      )
    )

    setIsKeepModalOpen(false)
    setKeepReasonInput('')
    showToast(`Đã giữ lại bản quyền cho nhân sự ${selectedAlert.employeeName}!`)
  }

  const getAlertBadge = (type: ItOptimizationAlertItem['type']) => {
    switch (type) {
      case 'lowUsage':
        return { label: 'Ít sử dụng', tone: 'border-warning/30 bg-warning/10 text-warning font-bold' }
      case 'idleLong':
        return { label: 'Không sử dụng lâu', tone: 'border-danger/30 bg-danger/10 text-danger font-bold' }
      case 'delayedReclaim':
        return { label: 'Chờ thu hồi nghỉ việc', tone: 'border-primary/30 bg-primary/10 text-primary font-bold' }
      case 'missingData':
        return { label: 'Dữ liệu theo dõi thiếu', tone: 'border-border bg-surface-subtle text-muted-foreground' }
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

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          Bảng tối ưu bản quyền & Giảm chi phí
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Cảnh báo tối ưu chi phí & Thu hồi bản quyền
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Rà soát các tài khoản ít dùng, không thao tác kéo dài hoặc nhân sự thôi việc; hiển thị đầy đủ căn cứ trước khi quyết định Thu hồi hoặc Giữ lại.
        </p>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          {(
            [
              { id: 'all', label: 'Tất cả cảnh báo' },
              { id: 'lowUsage', label: 'Ít sử dụng' },
              { id: 'idleLong', label: 'Không sử dụng lâu' },
              { id: 'delayedReclaim', label: 'Chờ thu hồi lâu' },
              { id: 'missingData', label: 'Dữ liệu thiếu' }
            ] as const
          ).map((tab) => (
            <button
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                filterType === tab.id
                  ? 'bg-primary text-primary-foreground font-bold shadow'
                  : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              type='button'
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-4 text-xs outline-none focus:border-primary'
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Tìm nhân viên, phần mềm...'
            type='search'
            value={searchQuery}
          />
        </div>
      </div>

      {/* Main Grid: Alerts List (Left) + Evidence & Actions Panel (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Alerts List */}
        <div className='lg:col-span-2 space-y-3'>
          {filteredAlerts.length === 0 ? (
            <div className='rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground'>
              <Sparkles className='size-10 mx-auto opacity-40 mb-3' />
              <p className='text-sm font-semibold'>Không có cảnh báo lãng phí nào thuộc nhóm này</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isSelected = selectedAlert?.id === item.id
              const isHandled = item.status === 'reclaimed' || item.status === 'kept'

              return (
                <div
                  className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-primary bg-primary-soft/40 ring-2 ring-primary'
                      : 'border-border bg-surface hover:border-primary/50'
                  } ${isHandled ? 'opacity-65' : ''}`}
                  key={item.id}
                  onClick={() => setSelectedAlert(item)}
                >
                  <div className='flex items-center gap-3.5 min-w-[280px]'>
                    <span className='grid size-10 place-items-center rounded-xl bg-primary-soft text-primary font-bold text-xs shrink-0'>
                      {item.employeeName.split(' ').slice(-1)[0][0]}
                    </span>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold text-foreground'>{item.employeeName}</span>
                        <span className='text-xs text-muted-foreground'>({item.departmentName})</span>
                        <span className={`rounded-md border px-2 py-0.5 text-[0.65rem] ${getAlertBadge(item.type).tone}`}>
                          {getAlertBadge(item.type).label}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 mt-1 text-xs'>
                        <span className='font-bold text-primary'>{item.softwareName} — {item.planName}</span>
                        <span className='text-muted-foreground'>· Lần dùng cuối: {item.evidence.lastUsed}</span>
                      </div>
                      <div className='mt-2'>
                        <button
                          className='inline-flex items-center gap-1 text-[0.72rem] font-bold text-primary hover:underline'
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectTab?.('device-collectors', {
                              employeeId: item.employeeId || 'emp-tuan',
                              deptId: item.departmentId,
                              from: 'license-optimization',
                              alertId: item.id
                            })
                          }}
                          type='button'
                        >
                          <span>Xem dữ liệu đo lường</span>
                          <ArrowRight className='size-3' />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right text-xs'>
                      <span className='font-bold text-danger block'>
                        Tiết kiệm: {formatCurrency(item.evidence.costPerMonth)}/tháng
                      </span>
                      <span className='text-[0.68rem] text-muted-foreground'>
                        {item.status === 'reclaimed' ? 'Đã thu hồi' : item.status === 'kept' ? 'Đã giữ lại' : 'Chờ xử lý'}
                      </span>
                    </div>
                    <ChevronRight className='size-4 text-muted-foreground' />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Evidence & Action Drawer (Right) */}
        {selectedAlert ? (
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5 flex flex-col justify-between'>
            <div className='space-y-4'>
              <div className='pb-3 border-b border-border/80'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-xs text-muted-foreground'>{selectedAlert.id}</span>
                  <span className={`rounded-md border px-2 py-0.5 text-[0.65rem] ${getAlertBadge(selectedAlert.type).tone}`}>
                    {getAlertBadge(selectedAlert.type).label}
                  </span>
                </div>
                <h3 className='text-lg font-bold text-foreground mt-1'>
                  {selectedAlert.employeeName}
                </h3>
                <p className='text-xs text-muted-foreground'>
                  {selectedAlert.employeeEmail} · {selectedAlert.departmentName}
                </p>
              </div>

              {/* Package & Cost */}
              <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1 text-xs'>
                <span className='text-muted-foreground'>Phần mềm & Gói đang dùng:</span>
                <p className='font-bold text-foreground text-sm'>
                  {selectedAlert.softwareName} — {selectedAlert.planName}
                </p>
                <div className='flex items-center justify-between pt-2 border-t border-border/60 text-xs'>
                  <span className='text-muted-foreground'>Chi phí định kỳ:</span>
                  <span className='font-bold text-danger'>{formatCurrency(selectedAlert.evidence.costPerMonth)} / tháng</span>
                </div>
              </div>

              {/* Evidence details */}
              <div className='space-y-2 text-xs'>
                <span className='font-bold text-foreground uppercase tracking-wider text-[0.68rem] text-muted-foreground block'>
                  Căn cứ phát sinh cảnh báo (Ngưỡng hệ thống)
                </span>
                <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2 leading-relaxed'>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>Ngưỡng kích hoạt:</span>
                    <span className='font-semibold text-foreground'>{selectedAlert.evidence.threshold}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>Kỳ quan sát:</span>
                    <span className='text-foreground'>{selectedAlert.evidence.observationPeriod}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>Mức dùng ghi nhận:</span>
                    <span className='font-bold text-foreground'>{selectedAlert.evidence.usageStats}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>Token ghi nhận:</span>
                    <span className='text-foreground'>{selectedAlert.evidence.tokens}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[0.68rem]'>Nguồn dữ liệu:</span>
                    <span className='text-muted-foreground italic'>{selectedAlert.evidence.dataSource}</span>
                  </div>
                </div>
              </div>

              {/* CTA button to verify at device collectors */}
              <button
                className='w-full flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition shadow-sm'
                onClick={() => {
                  onSelectTab?.('device-collectors', {
                    employeeId: selectedAlert.employeeId || 'emp-tuan',
                    deptId: selectedAlert.departmentId,
                    from: 'license-optimization',
                    alertId: selectedAlert.id
                  })
                }}
                type='button'
              >
                <ExternalLink className='size-3.5' />
                <span>Xem chi tiết tại Bộ thu thập thiết bị</span>
              </button>

              {/* Reclaim Impact Policy Note */}
              <div className='rounded-xl border border-primary/20 bg-primary/5 p-3 text-[0.7rem] text-muted-foreground space-y-1'>
                <span className='font-bold text-primary block'>Chính sách hoàn trả kho bản quyền:</span>
                <p>{selectedAlert.reclaimImpact.reclaimRefundText}</p>
              </div>

              {selectedAlert.keepReason && (
                <div className='rounded-xl border border-success/30 bg-success/10 p-3 text-xs'>
                  <span className='font-bold text-success'>Lý do giữ lại:</span>
                  <p className='text-foreground mt-0.5'>{selectedAlert.keepReason}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedAlert.status === 'pending' ? (
              <div className='pt-4 border-t border-border flex items-center gap-3'>
                <button
                  className='flex-1 rounded-xl border border-border bg-surface py-2.5 text-xs font-bold text-foreground hover:bg-surface-subtle'
                  onClick={() => setIsKeepModalOpen(true)}
                  type='button'
                >
                  Giữ lại kèm lý do
                </button>
                <button
                  className='flex-1 rounded-xl bg-danger py-2.5 text-xs font-bold text-white shadow hover:bg-danger/90'
                  onClick={() => setIsReclaimModalOpen(true)}
                  type='button'
                >
                  Thu hồi bản quyền
                </button>
              </div>
            ) : (
              <div className='pt-4 border-t border-border text-center text-xs font-semibold text-muted-foreground'>
                Cảnh báo này đã được xử lý ({selectedAlert.status === 'reclaimed' ? 'Đã thu hồi' : 'Đã giữ lại'}).
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: XÁC NHẬN THU HỒI BẢN QUYỀN (IT-AC-11 & 11A)                       */}
      {/* ========================================================================= */}
      {isReclaimModalOpen && selectedAlert && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-danger font-bold'>
              <AlertCircle className='size-5' />
              <h3 className='text-base font-bold text-foreground'>Xác nhận thu hồi quyền sử dụng</h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              Bạn có chắc chắn muốn thu hồi gói <strong>{selectedAlert.softwareName} — {selectedAlert.planName}</strong> của
              nhân viên <strong>{selectedAlert.employeeName}</strong>?
            </p>

            <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1.5 text-xs'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Nhân sự:</span>
                <span className='font-bold text-foreground'>{selectedAlert.employeeName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Tác động tới kho:</span>
                <span className='font-bold text-primary'>
                  {selectedAlert.reclaimImpact.canReuse ? '+1 vào Còn có thể cấp' : 'Không tăng tồn (Key một lần)'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Tiết kiệm:</span>
                <span className='font-bold text-danger'>{formatCurrency(selectedAlert.evidence.costPerMonth)}/tháng</span>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                disabled={isReclaimProcessing}
                onClick={() => setIsReclaimModalOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='flex items-center gap-2 rounded-xl bg-danger px-5 py-2 text-xs font-bold text-white shadow hover:bg-danger/90'
                disabled={isReclaimProcessing}
                onClick={handleConfirmReclaim}
                type='button'
              >
                {isReclaimProcessing ? (
                  <>
                    <RefreshCw className='size-3.5 animate-spin' />
                    <span>Đang thu hồi...</span>
                  </>
                ) : (
                  <span>Xác nhận thu hồi</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GIỮ LẠI BẢN QUYỀN (BẮT BUỘC NHẬP LÝ DO)                           */}
      {/* ========================================================================= */}
      {isKeepModalOpen && selectedAlert && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-primary font-bold'>
              <UserCheck className='size-5' />
              <h3 className='text-base font-bold text-foreground'>Giữ lại bản quyền cho nhân sự</h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              Vui lòng nhập lý do/căn cứ giữ lại để lưu hồ sơ kiểm toán:
            </p>

            <textarea
              className='w-full rounded-xl border border-border bg-surface-subtle p-3 text-xs outline-none focus:border-primary'
              onChange={(e) => setKeepReasonInput(e.target.value)}
              placeholder='Ví dụ: Nhân sự đang chuẩn bị tham gia dự án mới vào tháng sau...'
              rows={3}
              value={keepReasonInput}
            />

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsKeepModalOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={handleConfirmKeep}
                type='button'
              >
                Xác nhận giữ lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
