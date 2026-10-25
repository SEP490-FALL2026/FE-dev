import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  Sparkles,
  UserCheck,
  UserMinus,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ItAdminTabKey } from '../../it-admin-nav'

type OffboardingEmployee = {
  code: string
  department: string
  email: string
  handoverConfirmed: boolean
  isDeptHead: boolean
  isServiceAccountLead: boolean
  isSuperAdmin: boolean
  lastDay: string
  licenses: { name: string; type: 'license-key' | 'ai-agent' | 'saas-workspace'; detail: string }[]
  lockedAccount: boolean
  name: string
  newDeptHead?: string
  planCode: string
  role: string
  serviceAccountName?: string
  status: 'handover' | 'sudden' | 'left'
  successor: string
}

const mockLeavers: OffboardingEmployee[] = [
  {
    code: 'NV-0174',
    department: 'Thiết kế sản phẩm',
    email: 'tran.minh@company.com',
    handoverConfirmed: true,
    isDeptHead: false,
    isServiceAccountLead: true,
    isSuperAdmin: false,
    lastDay: '31/01/2026',
    licenses: [
      { name: 'Microsoft 365 Enterprise', type: 'license-key', detail: 'Mã khóa KEY-M365-01 (Thu hồi về kho)' },
      { name: 'Claude Autonomous QA Agent', type: 'ai-agent', detail: 'Tài khoản dịch vụ (Vô hiệu hóa & Hủy Secret Token)' },
      { name: 'Claude Enterprise', type: 'saas-workspace', detail: 'Workspace Team (Gỡ khỏi tổ chức)' },
      { name: 'OpenAI Developer API Key', type: 'ai-agent', detail: 'Khóa API phát triển (Thu hồi Token)' }
    ],
    lockedAccount: false,
    name: 'Trần Minh',
    planCode: 'OFF-2026-044',
    role: 'Product Designer',
    serviceAccountName: 'Tài khoản AI QA Agent (agent-claude-qa@company.ai)',
    status: 'handover',
    successor: 'Đỗ Hoàng Long (NV-0082)'
  },
  {
    code: 'NV-0056',
    department: 'Hạ tầng công nghệ',
    email: 'dang.nguyen@company.com',
    handoverConfirmed: false,
    isDeptHead: true,
    isServiceAccountLead: false,
    isSuperAdmin: false,
    lastDay: '28/02/2026',
    licenses: [
      { name: 'Microsoft 365 Enterprise', type: 'license-key', detail: 'Mã khóa bản quyền trên ThinkPad X1' },
      { name: 'GitHub Copilot Business', type: 'saas-workspace', detail: 'Workspace GitHub Organization' },
      { name: 'Google Gemini Business', type: 'saas-workspace', detail: 'Tài khoản Workspace công ty' }
    ],
    lockedAccount: false,
    name: 'Nguyễn Hải Đăng',
    planCode: 'OFF-2026-045',
    role: 'Trưởng phòng Hạ tầng',
    status: 'handover',
    successor: 'Vũ Quang Khang (NV-0091)'
  },
  {
    code: 'NV-0210',
    department: 'Kỹ thuật phần mềm',
    email: 'nam.le@company.com',
    handoverConfirmed: false,
    isDeptHead: false,
    isServiceAccountLead: false,
    isSuperAdmin: false,
    lastDay: 'Hôm nay (Đột ngột)',
    licenses: [
      { name: 'JetBrains All Products Pack', type: 'license-key', detail: 'Mã khóa KEY-JB-03 (Cần thu hồi gấp về kho)' },
      { name: 'GitHub Copilot Business', type: 'saas-workspace', detail: 'Workspace Kỹ thuật' },
      { name: 'ChatGPT Enterprise', type: 'saas-workspace', detail: 'Tài khoản OpenAI Enterprise' }
    ],
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
  const [newServiceAccountLeadInput, setNewServiceAccountLeadInput] = useState('Đỗ Hoàng Long (NV-0082)')
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
              successor: newServiceAccountLeadInput
            }
          : l
      )
    )
    setSelectedLeaver((prev) => ({
      ...prev,
      newDeptHead: prev.isDeptHead ? newHeadInput : prev.newDeptHead,
      successor: newServiceAccountLeadInput
    }))
    setIsImpactModalOpen(false)
    setToastMessage('Đã cập nhật chỉ định Trưởng phòng mới và Người chịu trách nhiệm tài khoản dịch vụ thành công!')
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
          {t('itAdmin.offboarding.extra.kicker')}
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.offboarding.title', 'Xử lý nhân sự nghỉ việc')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('itAdmin.offboarding.extra.subtitle')}
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
                  {leaver.status === 'sudden' ? 'Nghỉ việc đột ngột' : 'Đang bàn giao công việc'}
                </span>
              </div>
              <h3 className='mt-2 font-bold text-foreground text-sm'>{leaver.name}</h3>
              <p className='text-xs text-muted-foreground'>{leaver.role} · {leaver.department}</p>
              <div className='mt-3 flex items-center justify-between border-t border-border pt-2 text-[0.7rem] text-muted-foreground'>
                <span>{t('itAdmin.offboarding.extra.lastDay')} <strong className='text-foreground'>{leaver.lastDay}</strong></span>
                <span>{leaver.licenses.length} {t('itAdmin.offboarding.extra.assignedResources')}</span>
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
                    {t('itAdmin.offboarding.extra.accountLocked')}
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
              <span>{t('itAdmin.offboarding.extra.assignSuccessor')}</span>
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
                  <p className='text-xs font-bold text-warning'>{t('itAdmin.offboarding.extra.departmentHeadLeaving')}</p>
                  <p className='text-[0.7rem] text-muted-foreground'>
                    {t('itAdmin.offboarding.extra.appointDepartmentHead')}{' '}
                    <strong className='text-foreground'>{selectedLeaver.newDeptHead || 'Chưa chỉ định'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedLeaver.isServiceAccountLead && (
            <div className='rounded-xl border border-info/30 bg-info/10 p-3'>
              <div className='flex items-start gap-2'>
                <Users className='mt-0.5 size-4 text-info shrink-0' />
                <div>
                  <p className='text-xs font-bold text-info'>{t('itAdmin.offboarding.extra.serviceAccountOwner')}</p>
                  <p className='text-[0.7rem] text-muted-foreground'>
                    {selectedLeaver.serviceAccountName} {t('itAdmin.offboarding.extra.transferAdministration')}{' '}
                    <strong className='text-foreground'>{selectedLeaver.successor}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resources Assigned List */}
        <div className='mt-5 rounded-xl border border-border bg-surface-subtle/40 p-4'>
          <h3 className='text-xs font-bold text-foreground'>{t('itAdmin.offboarding.extra.resourcesToReclaim')}</h3>
          <div className='mt-2.5 grid gap-2 sm:grid-cols-2'>
            {selectedLeaver.licenses.map((lic, idx) => (
              <div className='flex items-center gap-2 rounded-lg border border-border bg-background p-2.5 text-xs' key={idx}>
                {lic.type === 'license-key' ? (
                  <Key className='size-4 text-info shrink-0' />
                ) : lic.type === 'ai-agent' ? (
                  <Sparkles className='size-4 text-primary shrink-0' />
                ) : (
                  <Users className='size-4 text-muted-foreground shrink-0' />
                )}
                <div className='min-w-0 flex-1'>
                  <p className='font-bold text-foreground truncate'>{lic.name}</p>
                  <p className='text-[0.65rem] text-muted-foreground truncate'>{lic.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Step Execution Checklist */}
        <div className='mt-6 border-t border-border pt-5'>
          <h3 className='text-sm font-bold text-foreground'>{t('itAdmin.offboarding.extra.threeStepTitle')}</h3>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {t('itAdmin.offboarding.extra.threeStepHelp')}
          </p>

          <div className='mt-4 grid gap-4 lg:grid-cols-3'>
            {/* Step 1 */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='rounded-full bg-surface border px-2 py-0.5 text-xs font-bold text-primary'>
                  {t('itAdmin.offboarding.extra.stepOne')}
                </span>
                {selectedLeaver.handoverConfirmed ? (
                  <span className='text-xs font-bold text-success inline-flex items-center gap-1'>
                    <CheckCircle2 className='size-3.5' /> {t('itAdmin.offboarding.extra.confirmed')}
                  </span>
                ) : (
                  <span className='text-xs font-bold text-warning inline-flex items-center gap-1'>
                    <Clock className='size-3.5' /> {t('itAdmin.offboarding.extra.awaitingConfirmation')}
                  </span>
                )}
              </div>
              <h4 className='mt-2 font-bold text-foreground text-sm'>{t('itAdmin.offboarding.extra.handoverProjects')}</h4>
              <p className='mt-1 text-xs text-muted-foreground'>
                {t('itAdmin.offboarding.extra.handoverHelp')}
              </p>
            </div>

            {/* Step 2 */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='rounded-full bg-surface border px-2 py-0.5 text-xs font-bold text-primary'>
                  {t('itAdmin.offboarding.extra.stepTwo')}
                </span>
                <span className='text-xs font-bold text-danger inline-flex items-center gap-1'>
                  {selectedLeaver.licenses.length} {t('itAdmin.offboarding.extra.resourcesToRemove')}
                </span>
              </div>
              <h4 className='mt-2 font-bold text-foreground text-sm'>{t('itAdmin.offboarding.extra.revokeKeysAndAi')}</h4>
              <p className='mt-1 text-xs text-muted-foreground'>
                {t('itAdmin.offboarding.extra.revokeKeysHelp')}
              </p>
              {onSelectTab && (
                <button
                  className='mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline'
                  onClick={() => onSelectTab('provisioning', { id: 'PV-2042' })}
                  type='button'
                >
                  <span>{t('itAdmin.offboarding.extra.openProvisioning')}</span>
                  <ArrowRight className='size-3' />
                </button>
              )}
            </div>

            {/* Step 3 */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='rounded-full bg-surface border px-2 py-0.5 text-xs font-bold text-primary'>
                  {t('itAdmin.offboarding.extra.stepThree')}
                </span>
                {selectedLeaver.lockedAccount ? (
                  <span className='text-xs font-bold text-success inline-flex items-center gap-1'>
                    <CheckCircle2 className='size-3.5' /> {t('itAdmin.offboarding.extra.locked')}
                  </span>
                ) : (
                  <span className='text-xs font-bold text-muted-foreground inline-flex items-center gap-1'>
                    <Clock className='size-3.5' /> {t('itAdmin.offboarding.extra.notLocked')}
                  </span>
                )}
              </div>
              <h4 className='mt-2 font-bold text-foreground text-sm'>{t('itAdmin.offboarding.extra.lockCompanyLogin')}</h4>
              <p className='mt-1 text-xs text-muted-foreground'>
                {t('itAdmin.offboarding.extra.lockCompanyHelp')}
              </p>
              {!selectedLeaver.lockedAccount && (
                <button
                  className='mt-3 inline-flex items-center gap-1 rounded-lg bg-danger px-3 py-1.5 text-xs font-bold text-white hover:bg-danger/90'
                  onClick={handleLockAccount}
                  type='button'
                >
                  <Lock className='size-3' />
                  <span>{t('itAdmin.offboarding.extra.lockNow')}</span>
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
                  {t('itAdmin.offboarding.extra.roleImpact')}
                </span>
                <h2 className='mt-1 text-base font-bold text-foreground'>
                  {t('itAdmin.offboarding.extra.appointSuccessor')}
                </h2>
                <p className='text-xs text-muted-foreground'>{t('itAdmin.offboarding.extra.departingEmployee')} {selectedLeaver.name} ({selectedLeaver.code})</p>
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
                    {t('itAdmin.offboarding.extra.appointHeadFor')} {selectedLeaver.department} *
                  </label>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                    {t('itAdmin.offboarding.extra.effectiveAfterLastDay')}
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
                  <p className='text-muted-foreground'>{t('itAdmin.offboarding.extra.notDepartmentHead')}</p>
                </div>
              )}

              {selectedLeaver.isServiceAccountLead && (
                <div>
                  <label className='block font-bold text-foreground'>
                    {t('itAdmin.offboarding.extra.appointServiceOwner')}
                  </label>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                    {selectedLeaver.serviceAccountName}
                  </p>
                  <input
                    className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary'
                    onChange={(e) => setNewServiceAccountLeadInput(e.target.value)}
                    type='text'
                    value={newServiceAccountLeadInput}
                  />
                </div>
              )}

              <div className='rounded-xl border border-primary/20 bg-primary-soft/30 p-3'>
                <p className='text-muted-foreground'>
                  {t('itAdmin.offboarding.extra.auditNotice')}
                </p>
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-surface-subtle'
                onClick={() => setIsImpactModalOpen(false)}
                type='button'
              >
                {t('itAdmin.offboarding.extra.cancel')}
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover'
                onClick={handleSaveImpactAssignments}
                type='button'
              >
                <CheckCircle2 className='size-3.5' />
                <span>{t('itAdmin.offboarding.extra.saveAssignments')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
