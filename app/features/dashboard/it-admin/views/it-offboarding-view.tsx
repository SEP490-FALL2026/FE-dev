import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Lock,
  ShieldAlert,
  UserCheck,
  UserMinus,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ItAdminTabKey } from '../it-admin-nav'

type OffboardingEmployee = {
  code: string
  department: string
  email: string
  handoverConfirmed: boolean
  isDeptHead: boolean
  isSharedAccountLead: boolean
  isSuperAdmin: boolean
  lastDay: string
  licenses: string[]
  lockedAccount: boolean
  name: string
  newDeptHead?: string
  planCode: string
  role: string
  sharedAccountName?: string
  status: 'handover' | 'sudden' | 'left'
  successor: string
}

const mockLeavers: OffboardingEmployee[] = [
  {
    code: 'NV-0174',
    department: 'Product Team',
    email: 'tran.minh@company.com',
    handoverConfirmed: true,
    isDeptHead: false,
    isSharedAccountLead: true,
    isSuperAdmin: false,
    lastDay: '31/01/2026',
    licenses: ['ChatGPT Enterprise (OpenAI)', 'Claude Enterprise (Tài khoản nghiên cứu dùng chung)', 'Claude 3.7 Sonnet Pro', 'OpenAI Codex API'],
    lockedAccount: false,
    name: 'Trần Minh',
    planCode: 'OFF-2026-044',
    role: 'Product Designer',
    sharedAccountName: 'Tài khoản Claude Enterprise nghiên cứu chung (claude-research@company.com)',
    status: 'handover',
    successor: 'Đỗ Hoàng Long (NV-0082)'
  },
  {
    code: 'NV-0056',
    department: 'Infrastructure',
    email: 'dang.nguyen@company.com',
    handoverConfirmed: false,
    isDeptHead: true,
    isSharedAccountLead: false,
    isSuperAdmin: false,
    lastDay: '28/02/2026',
    licenses: ['Claude Enterprise (Anthropic)', 'GitHub Copilot Business (Codex)', 'Google Gemini Business', 'Google Gemini Code Assist'],
    lockedAccount: false,
    name: 'Nguyễn Hải Đăng',
    planCode: 'OFF-2026-045',
    role: 'Trưởng phòng Hạ tầng (Head of Infra)',
    status: 'handover',
    successor: 'Vũ Quang Khang (NV-0091)'
  },
  {
    code: 'NV-0210',
    department: 'Engineering',
    email: 'nam.le@company.com',
    handoverConfirmed: false,
    isDeptHead: false,
    isSharedAccountLead: false,
    isSuperAdmin: false,
    lastDay: 'Hôm nay (Đột ngột)',
    licenses: ['GitHub Copilot Business (OpenAI Codex)', 'ChatGPT Enterprise (OpenAI)', 'Claude Code Terminal Agent'],
    lockedAccount: true,
    name: 'Lê Hoàng Nam',
    planCode: 'OFF-2026-046',
    role: 'Frontend Developer',
    status: 'sudden',
    successor: 'Chưa chỉ định'
  }
]

type ItOffboardingViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItOffboardingView({ onSelectTab }: ItOffboardingViewProps = {}) {
  const { t } = useTranslation('dashboard')
  const [leavers, setLeavers] = useState<OffboardingEmployee[]>(mockLeavers)
  const [selectedLeaver, setSelectedLeaver] = useState<OffboardingEmployee>(mockLeavers[0])
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false)
  const [newHeadInput, setNewHeadInput] = useState('Vũ Quang Khang (NV-0091)')
  const [newSharedLeadInput, setNewSharedLeadInput] = useState('Đỗ Hoàng Long (NV-0082)')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleLockAccount = () => {
    setLeavers((prev) =>
      prev.map((l) => (l.code === selectedLeaver.code ? { ...l, lockedAccount: true } : l))
    )
    setSelectedLeaver((prev) => ({ ...prev, lockedAccount: true }))
    setToastMessage(`Đã khóa tài khoản email công ty ${selectedLeaver.email} thành công!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSaveImpactAssignments = () => {
    setLeavers((prev) =>
      prev.map((l) =>
        l.code === selectedLeaver.code
          ? {
              ...l,
              newDeptHead: selectedLeaver.isDeptHead ? newHeadInput : l.newDeptHead,
              successor: newSharedLeadInput
            }
          : l
      )
    )
    setSelectedLeaver((prev) => ({
      ...prev,
      newDeptHead: prev.isDeptHead ? newHeadInput : prev.newDeptHead,
      successor: newSharedLeadInput
    }))
    setIsImpactModalOpen(false)
    setToastMessage('Đã cập nhật chỉ định Trưởng phòng mới và Người chịu trách nhiệm tài khoản dùng chung thành công!')
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className='space-y-6'>
      {/* Toast */}
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
          Thu hồi tài khoản nhân sự nghỉ việc
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.offboarding.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Quy trình thu hồi quyền AI cho nhân sự nghỉ việc: Đánh giá vai trò, bàn giao tài nguyên AI và thu hồi quyền theo quy chuẩn 3 bước
        </p>
      </div>

      {/* Leaver List Grid */}
      <div className='grid gap-4 sm:grid-cols-3'>
        {leavers.map((leaver) => {
          const isSelected = selectedLeaver.code === leaver.code
          return (
            <div
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                isSelected
                  ? 'border-primary bg-primary-soft/30 ring-1 ring-primary shadow-sm'
                  : 'border-border bg-surface hover:border-primary/40'
              }`}
              key={leaver.code}
              onClick={() => setSelectedLeaver(leaver)}
            >
              <div className='flex items-center justify-between'>
                <span className='font-mono text-xs font-bold text-primary'>{leaver.code}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                    leaver.status === 'sudden'
                      ? 'border-danger/30 bg-danger/10 text-danger'
                      : 'border-warning/30 bg-warning/15 text-warning'
                  }`}
                >
                  {leaver.status === 'sudden' ? 'Nghỉ việc đột xuất' : 'Đang bàn giao công việc'}
                </span>
              </div>
              <h3 className='mt-2 font-bold text-foreground text-sm'>{leaver.name}</h3>
              <p className='text-xs text-muted-foreground'>{leaver.role} · {leaver.department}</p>
              <div className='mt-3 flex items-center justify-between border-t border-border pt-2 text-[0.7rem] text-muted-foreground'>
                <span>Ngày cuối: <strong className='text-foreground'>{leaver.lastDay}</strong></span>
                <span>{leaver.licenses.length} tài khoản AI</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Employee Main Impact & Checklist Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border pb-5'>
          <div className='flex items-start gap-4'>
            <span className='grid size-12 place-items-center rounded-2xl bg-danger/10 text-danger border border-danger/20'>
              <UserMinus aria-hidden='true' className='size-6' />
            </span>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-bold text-foreground'>{selectedLeaver.name}</h2>
                <span className='rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-xs font-mono font-semibold text-muted-foreground'>
                  {selectedLeaver.code}
                </span>
                {selectedLeaver.lockedAccount && (
                  <span className='rounded-md bg-danger/10 text-danger border border-danger/25 px-2 py-0.5 text-xs font-bold'>
                    Tài khoản đã khóa
                  </span>
                )}
              </div>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                {selectedLeaver.role} · {selectedLeaver.department}
              </p>
              <p className='text-xs font-mono text-muted-foreground'>{selectedLeaver.email}</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2 text-xs'>
            <button
              className='inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary-soft px-3 py-2 text-xs font-bold text-primary hover:bg-primary-hover hover:text-primary-foreground transition'
              onClick={() => setIsImpactModalOpen(true)}
              type='button'
            >
              <AlertTriangle className='size-3.5' />
              <span>Đánh giá vai trò & Chỉ định người thay thế</span>
            </button>
          </div>
        </div>

        {/* Roles Impact Warnings Banner */}
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          {selectedLeaver.isDeptHead && (
            <div className='rounded-xl border border-warning/30 bg-warning/10 p-3'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='mt-0.5 size-4 text-warning shrink-0' />
                <div>
                  <p className='text-xs font-bold text-warning'>Nhân sự nghỉ là Trưởng phòng!</p>
                  <p className='text-[0.7rem] text-muted-foreground'>
                    Cần chỉ định Trưởng phòng mới có hiệu lực sau ngày làm việc cuối. Hiện tại:{' '}
                    <strong className='text-foreground'>{selectedLeaver.newDeptHead || 'Chưa chỉ định'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedLeaver.isSharedAccountLead && (
            <div className='rounded-xl border border-info/30 bg-info/10 p-3'>
              <div className='flex items-start gap-2'>
                <Users className='mt-0.5 size-4 text-info shrink-0' />
                <div>
                  <p className='text-xs font-bold text-info'>Chịu trách nhiệm tài khoản dùng chung (Shared Account)</p>
                  <p className='text-[0.7rem] text-muted-foreground'>
                    {selectedLeaver.sharedAccountName} → Đã chuyển giao cho{' '}
                    <strong className='text-foreground'>{selectedLeaver.successor}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3-Step Execution Checklist */}
        <div className='mt-6 border-t border-border pt-5'>
          <h3 className='text-sm font-bold text-foreground'>Quy trình thu hồi quyền truy cập AI 3 bước chuẩn hóa</h3>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Thực hiện tuần tự: (1) Bàn giao tài nguyên AI → (2) Thu hồi tài khoản AI khỏi Workspace → (3) Khóa tài khoản
          </p>

          <div className='mt-4 grid gap-4 lg:grid-cols-3'>
            {/* Step 1 */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='rounded-full bg-surface border px-2 py-0.5 text-xs font-bold text-primary'>
                  Bước 1: Bàn giao dữ liệu AI
                </span>
                {selectedLeaver.handoverConfirmed ? (
                  <span className='text-xs font-bold text-success inline-flex items-center gap-1'>
                    <CheckCircle2 className='size-3.5' /> Đã xác nhận
                  </span>
                ) : (
                  <span className='text-xs font-bold text-warning inline-flex items-center gap-1'>
                    <Clock className='size-3.5' /> Chờ xác nhận
                  </span>
                )}
              </div>
              <h4 className='mt-2 font-bold text-foreground text-sm'>Bàn giao dữ liệu & dự án AI</h4>
              <p className='mt-1 text-xs text-muted-foreground'>
                Trưởng phòng xác nhận nhân viên đã chuyển nhượng prompt mẫu, custom GPT, tài nguyên dự án Claude và kho lưu trữ liên quan.
              </p>
            </div>

            {/* Step 2 */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='rounded-full bg-surface border px-2 py-0.5 text-xs font-bold text-primary'>
                  Bước 2: Thu hồi tài khoản AI
                </span>
                <span className='text-xs font-bold text-danger inline-flex items-center gap-1'>
                  {selectedLeaver.licenses.length} tài khoản cần thu hồi
                </span>
              </div>
              <h4 className='mt-2 font-bold text-foreground text-sm'>Thu hồi quyền theo hình thức cấp phát</h4>
              <p className='mt-1 text-xs text-muted-foreground'>
                Đưa tác vụ vào Hàng đợi cấp phát để thu hồi giấy phép AI hoặc gỡ tài khoản khỏi Workspace doanh nghiệp.
              </p>
              {onSelectTab && (
                <button
                  className='mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline'
                  onClick={() => onSelectTab('provisioning', { id: 'PV-2042' })}
                  type='button'
                >
                  <span>Mở Hàng đợi cấp phát (PV-2042)</span>
                  <ArrowRight className='size-3' />
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='rounded-full bg-surface border px-2 py-0.5 text-xs font-bold text-primary'>
                  Bước 3: Khóa tài khoản
                </span>
                {selectedLeaver.lockedAccount ? (
                  <span className='text-xs font-bold text-success inline-flex items-center gap-1'>
                    <CheckCircle2 className='size-3.5' /> Đã khóa
                  </span>
                ) : (
                  <span className='text-xs font-bold text-muted-foreground inline-flex items-center gap-1'>
                    <Clock className='size-3.5' /> Chưa khóa
                  </span>
                )}
              </div>
              <h4 className='mt-2 font-bold text-foreground text-sm'>Khóa tài khoản email đăng nhập</h4>
              <p className='mt-1 text-xs text-muted-foreground'>
                Khóa đăng nhập hệ thống. Lưu ý: khóa tài khoản không tự dừng tính tiền nếu chưa thu hồi seat AI trên cổng quản trị vendor!
              </p>
              {!selectedLeaver.lockedAccount && (
                <button
                  className='mt-3 inline-flex items-center gap-1 rounded-lg bg-danger px-3 py-1.5 text-xs font-bold text-white hover:bg-danger/90'
                  onClick={handleLockAccount}
                  type='button'
                >
                  <Lock className='size-3' />
                  <span>Khóa tài khoản ngay</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── IMPACT & APPOINTMENT MODAL ─── */}
      {isImpactModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <div className='flex items-start justify-between border-b border-border pb-4'>
              <div>
                <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary'>
                  Đánh giá ảnh hưởng vai trò
                </span>
                <h2 className='mt-1 text-base font-bold text-foreground'>
                  Đánh giá ảnh hưởng & Chỉ định người thay thế
                </h2>
                <p className='text-xs text-muted-foreground'>Nhân sự: {selectedLeaver.name} ({selectedLeaver.code})</p>
              </div>
              <button
                className='rounded-lg p-1.5 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsImpactModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            <div className='mt-4 space-y-4 text-xs'>
              {selectedLeaver.isDeptHead ? (
                <div>
                  <label className='block font-bold text-foreground'>
                    Chỉ định Trưởng phòng mới cho phòng {selectedLeaver.department} *
                  </label>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                    Hiệu lực từ ngày sau ngày làm việc cuối. Người này không được là Trưởng phòng của phòng khác.
                  </p>
                  <input
                    className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary'
                    onChange={(e) => setNewHeadInput(e.target.value)}
                    type='text'
                    value={newHeadInput}
                  />
                </div>
              ) : (
                <div className='rounded-xl border border-border bg-surface-subtle/50 p-3'>
                  <p className='text-muted-foreground'>Nhân sự này không giữ chức vụ Trưởng phòng.</p>
                </div>
              )}

              {selectedLeaver.isSharedAccountLead && (
                <div>
                  <label className='block font-bold text-foreground'>
                    Chỉ định người chịu trách nhiệm mới cho tài khoản dùng chung *
                  </label>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                    {selectedLeaver.sharedAccountName}
                  </p>
                  <input
                    className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary'
                    onChange={(e) => setNewSharedLeadInput(e.target.value)}
                    type='text'
                    value={newSharedLeadInput}
                  />
                </div>
              )}

              <div className='rounded-xl border border-primary/20 bg-primary-soft/30 p-3'>
                <p className='text-muted-foreground'>
                  Mọi thao tác thay đổi Trưởng phòng và người chịu trách nhiệm đều được hệ thống ghi vết vào Nhật ký kiểm toán tự động.
                </p>
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-surface-subtle'
                onClick={() => setIsImpactModalOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover'
                onClick={handleSaveImpactAssignments}
                type='button'
              >
                <CheckCircle2 className='size-3.5' />
                <span>Lưu chỉ định thay thế</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
