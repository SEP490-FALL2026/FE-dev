import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Info,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itReconciliationItems, type ReconciliationDiscrepancy } from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItReconciliationViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItReconciliationView({ onSelectTab }: ItReconciliationViewProps = {}) {
  const { t } = useTranslation('dashboard')
  const [items, setItems] = useState<ReconciliationDiscrepancy[]>(itReconciliationItems)
  const [selectedCase, setSelectedCase] = useState<ReconciliationDiscrepancy | null>(null)
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'invoice' | 'shadowAccess' | 'pendingAcceptance'>('all')
  const [isInvestigateOpen, setIsInvestigateOpen] = useState(false)
  const [investigationCause, setInvestigationCause] = useState<'vendorError' | 'shadowAccess' | 'internalLag'>('vendorError')
  const [investigationNotes, setInvestigationNotes] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const comparisonRows = [
    {
      active: 48,
      app: 'ChatGPT Enterprise (OpenAI)',
      billed: 55,
      declared: 50,
      diff: '+5 seat (Hóa đơn vendor > Khai báo)',
      status: 'danger'
    },
    {
      active: 118,
      app: 'GitHub Copilot (OpenAI Codex)',
      billed: 120,
      declared: 120,
      diff: '1 tài khoản ngoài quy trình',
      status: 'warning'
    },
    {
      active: 45,
      app: 'Claude Enterprise (Anthropic)',
      billed: 45,
      declared: 45,
      diff: '1 seat chờ người dùng chấp nhận',
      status: 'info'
    },
    {
      active: 300,
      app: 'Google Gemini Business (Workspace)',
      billed: 300,
      declared: 300,
      diff: 'Khớp hoàn toàn 100%',
      status: 'success'
    }
  ]

  const discrepancyIcons = {
    invoice: FileSpreadsheet,
    pendingAcceptance: UserCheck,
    shadowAccess: ShieldAlert
  }

  const filteredItems = items.filter((item) => {
    if (activeTabFilter === 'all') return true
    return item.type === activeTabFilter
  })

  const handleOpenCase = (item: ReconciliationDiscrepancy) => {
    setSelectedCase(item)
    setIsInvestigateOpen(true)
    setInvestigationNotes(item.financeBasis || '')
    if (item.type === 'invoice') setInvestigationCause('vendorError')
    else if (item.type === 'shadowAccess') setInvestigationCause('shadowAccess')
    else setInvestigationCause('internalLag')
  }

  const handleCloseCaseDecision = () => {
    if (!selectedCase) return

    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedCase.id
          ? {
              ...i,
              caseStatus: 'resolved',
              vendorErrorNote: investigationNotes
            }
          : i
      )
    )

    let msg = 'Đã giải quyết hồ sơ sai lệch thành công!'
    if (investigationCause === 'vendorError') {
      msg = `Hồ sơ ${selectedCase.id}: Ghi nhận lỗi hóa đơn của nhà cung cấp, chờ đối soát hóa đơn điều chỉnh.`
    } else if (investigationCause === 'shadowAccess') {
      msg = `Hồ sơ ${selectedCase.id}: Đã cô lập quyền AI ngoài luồng và chuyển hồ sơ hợp thức hóa.`
    } else {
      msg = `Hồ sơ ${selectedCase.id}: Đã cập nhật số lượng thuê bao theo chứng từ duyệt chi (ITA-66).`
    }

    setToastMessage(msg)
    setIsInvestigateOpen(false)
    setSelectedCase(null)
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/15 px-5 py-3.5 shadow-xl backdrop-blur-md animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          ITA-11 · Xử lý sai lệch & Đối soát
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.reconciliation.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.reconciliation.subtitle')}</p>
      </div>

      {/* Three Numbers Side-by-Side Table (FR-2.6, FR-7.7) */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex items-center gap-2 border-b border-border pb-3'>
          <Scale aria-hidden='true' className='size-5 text-primary' />
          <div>
            <h2 className='text-base font-bold text-foreground'>{t('itAdmin.reconciliation.threeNumbersTitle')}</h2>
            <p className='text-xs text-muted-foreground'>
              Hóa đơn thực chi (Billed) so với Khai báo hợp đồng (Declared) và Suất kích hoạt thực tế (Active)
            </p>
          </div>
        </div>

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>Nền tảng AI Agent</th>
                <th className='p-3 font-semibold text-center'>Hóa đơn (Billed)</th>
                <th className='p-3 font-semibold text-center'>Hợp đồng (Declared)</th>
                <th className='p-3 font-semibold text-center'>Đang gán (Active)</th>
                <th className='p-3 font-semibold text-right'>Chênh lệch phát hiện</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border font-mono'>
              {comparisonRows.map((row) => (
                <tr className='transition hover:bg-surface-subtle/60' key={row.app}>
                  <td className='p-3 font-sans font-semibold text-foreground'>{row.app}</td>
                  <td className='p-3 text-center font-bold text-foreground'>{row.billed}</td>
                  <td className='p-3 text-center text-muted-foreground'>{row.declared}</td>
                  <td className='p-3 text-center text-muted-foreground'>{row.active}</td>
                  <td className='p-3 text-right font-sans'>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${
                        row.status === 'danger'
                          ? 'border-danger/25 bg-danger/10 text-danger'
                          : row.status === 'warning'
                            ? 'border-warning/30 bg-warning/15 text-warning'
                            : row.status === 'info'
                              ? 'border-info/25 bg-info/10 text-info'
                              : 'border-success/25 bg-success/10 text-success'
                      }`}
                    >
                      {row.diff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrepancy Cases Queue (ITA-11) */}
      <div className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>Hàng đợi hồ sơ sai lệch cần xử lý</h2>
            <p className='text-xs text-muted-foreground'>
              Mỗi hồ sơ giữ nguyên giá trị hai phía song song, không tự động đồng bộ đè dữ liệu (FR-7.7)
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-1 text-xs'>
            {(['all', 'invoice', 'shadowAccess', 'pendingAcceptance'] as const).map((tab) => (
              <button
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  activeTabFilter === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                key={tab}
                onClick={() => setActiveTabFilter(tab)}
                type='button'
              >
                {tab === 'all'
                  ? 'Tất cả'
                  : tab === 'invoice'
                    ? 'Lệch hóa đơn'
                    : tab === 'shadowAccess'
                      ? 'Quyền ngoài quy trình'
                      : 'Chờ chấp nhận'}
              </button>
            ))}
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-3'>
          {filteredItems.map((item) => {
            const Icon = discrepancyIcons[item.type]
            const isResolved = item.caseStatus === 'resolved'

            return (
              <div
                className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                  isResolved
                    ? 'border-border bg-surface opacity-80'
                    : 'border-border bg-surface'
                }`}
                key={item.id}
              >
                <div>
                  <div className='flex items-center justify-between'>
                    <span className='grid size-9 place-items-center rounded-xl bg-surface-subtle text-foreground'>
                      <Icon aria-hidden='true' className='size-4' />
                    </span>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-mono font-bold text-primary'>{item.id}</span>
                      {isResolved && (
                        <span className='rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-[0.65rem] font-bold text-success'>
                          Đã đóng
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className='mt-3 text-sm font-bold text-foreground'>{item.title}</h3>
                  <p className='mt-1 text-xs font-mono text-muted-foreground'>{item.diff}</p>

                  <div className='mt-3 rounded-lg border border-border bg-background/50 p-2 text-[0.7rem] text-muted-foreground'>
                    <span className='font-semibold text-foreground'>Căn cứ Tài chính: </span>
                    {item.financeBasis}
                  </div>
                </div>

                <div className='mt-4 pt-3 border-t border-border flex items-center gap-2'>
                  <button
                    className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                    onClick={() => handleOpenCase(item)}
                    type='button'
                  >
                    <span>{isResolved ? 'Xem lại hồ sơ' : 'Điều tra & Đóng hồ sơ (ITA-52)'}</span>
                    <ChevronRight className='size-3.5' />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Case Investigation Modal (ITA-51 / ITA-52) */}
      {isInvestigateOpen && selectedCase && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsInvestigateOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <span className='rounded-full border border-primary/20 bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary font-mono'>
                {selectedCase.id}
              </span>
              <span className='text-xs font-bold text-muted-foreground'>ITA-51 / ITA-52 · Điều tra sai lệch cùng Tài chính</span>
            </div>

            <h2 className='mt-2 text-xl font-bold text-foreground'>{selectedCase.title}</h2>
            <p className='text-xs text-muted-foreground'>{selectedCase.app}</p>

            {/* Side-by-Side Comparison Box (ITA-51) */}
            <div className='mt-4 grid gap-3 sm:grid-cols-3 rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
              <div className='text-center border-r border-border/70 pr-2'>
                <span className='text-muted-foreground'>Hóa đơn bên Vendor:</span>
                <p className='mt-1 text-lg font-bold text-foreground font-mono'>{selectedCase.billed} seats</p>
              </div>
              <div className='text-center border-r border-border/70 pr-2'>
                <span className='text-muted-foreground'>Hợp đồng nội bộ:</span>
                <p className='mt-1 text-lg font-bold text-primary font-mono'>{selectedCase.declared} seats</p>
              </div>
              <div className='text-center'>
                <span className='text-muted-foreground'>Thực tế đang gán:</span>
                <p className='mt-1 text-lg font-bold text-foreground font-mono'>{selectedCase.active} seats</p>
              </div>
            </div>

            {/* Root Cause Selection (ITA-52) */}
            <div className='mt-5 space-y-3'>
              <label className='block text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                Xác định nguyên nhân sau điều tra cùng Finance:
              </label>

              <div className='space-y-2'>
                {[
                  {
                    desc: 'Ghi chú xác minh bắt buộc. Hóa đơn vẫn giữ nguyên thực tế, điều chỉnh bằng hóa đơn mới (QĐ-49f).',
                    id: 'vendorError' as const,
                    title: 'Nhà cung cấp tính sai (Vendor billing error)'
                  },
                  {
                    desc: 'Tài khoản ngoài quy trình: Chuyển Người duyệt chi quyết định hợp thức hóa (BM-07) hoặc IT thu hồi khẩn.',
                    id: 'shadowAccess' as const,
                    title: 'Quyền được cấp ngoài quy trình (Shadow AI Access)'
                  },
                  {
                    desc: 'Mua đã duyệt nhưng chưa cập nhật số lượng thuê bao: IT Admin cập nhật theo chứng từ Finance (ITA-66).',
                    id: 'internalLag' as const,
                    title: 'Bản ghi nội bộ chưa theo kịp quyết định phê duyệt'
                  }
                ].map((cause) => (
                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      investigationCause === cause.id
                        ? 'border-primary bg-primary-soft/30'
                        : 'border-border bg-surface hover:bg-surface-subtle'
                    }`}
                    key={cause.id}
                  >
                    <input
                      checked={investigationCause === cause.id}
                      className='mt-1'
                      name='investigationCause'
                      onChange={() => setInvestigationCause(cause.id)}
                      type='radio'
                    />
                    <div>
                      <p className='text-xs font-bold text-foreground'>{cause.title}</p>
                      <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{cause.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className='block text-xs font-semibold text-foreground mb-1'>
                  Ghi chú chứng từ xác minh cùng Finance (Bắt buộc):
                </label>
                <textarea
                  className='w-full rounded-xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none'
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                  placeholder='Nhập số quyết định duyệt chi, số hóa đơn hoặc căn cứ điều tra...'
                  rows={3}
                  value={investigationNotes}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsInvestigateOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                onClick={handleCloseCaseDecision}
                type='button'
              >
                <FileCheck className='size-3.5' />
                <span>Đóng hồ sơ bằng quyết định (s_close)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
