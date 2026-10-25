import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Shield,
  Unlock,
  X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Department, UserAccount, UserAccountRole } from '../../super-admin-data'
import { roleDefinitions } from '../../super-admin-data'

export interface CreateAccountModalProps {
  departments: Department[]
  formError: string | null
  isOpen: boolean
  newCode: string
  newDepartmentId: string
  newEmail: string
  newName: string
  newPosition: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  setNewCode: (val: string) => void
  setNewDepartmentId: (val: string) => void
  setNewEmail: (val: string) => void
  setNewName: (val: string) => void
  setNewPosition: (val: string) => void
}

export function CreateAccountModal({
  departments,
  formError,
  isOpen,
  newCode,
  newDepartmentId,
  newEmail,
  newName,
  newPosition,
  onClose,
  onSubmit,
  setNewCode,
  setNewDepartmentId,
  setNewEmail,
  setNewName,
  setNewPosition
}: CreateAccountModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <h2 className='text-lg font-bold text-foreground'>{t('superAdmin.accounts.formModals.createTitle')}</h2>
        <p className='text-xs text-muted-foreground'>
          {t('superAdmin.accounts.formModals.createSubtitle')}
        </p>

        {formError && (
          <div className='mt-3 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger'>
            <AlertCircle className='size-4 shrink-0' />
            <span>{formError}</span>
          </div>
        )}

        <form className='mt-4 space-y-3' onSubmit={onSubmit}>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>
                {t('superAdmin.accounts.formModals.codeLabel')} <span className='text-danger'>*</span>
              </label>
              <input
                className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold focus:border-primary focus:outline-none uppercase'
                onChange={(e) => setNewCode(e.target.value)}
                placeholder={t('superAdmin.accounts.formModals.codePlaceholder')}
                required
                type='text'
                value={newCode}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>
                {t('superAdmin.accounts.formModals.nameLabel')} <span className='text-danger'>*</span>
              </label>
              <input
                className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t('superAdmin.accounts.formModals.namePlaceholder')}
                required
                type='text'
                value={newName}
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>
              {t('superAdmin.accounts.formModals.emailLabel')} <span className='text-danger'>*</span>
            </label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none'
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t('superAdmin.accounts.formModals.emailPlaceholder')}
              required
              type='email'
              value={newEmail}
            />
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>{t('superAdmin.accounts.formModals.positionLabel')}</label>
              <input
                className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none'
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder={t('superAdmin.accounts.formModals.positionPlaceholder')}
                type='text'
                value={newPosition}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>{t('superAdmin.accounts.formModals.deptLabel')}</label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setNewDepartmentId(e.target.value)}
                value={newDepartmentId}
              >
                <option value=''>{t('superAdmin.accounts.formModals.selectDeptPlaceholder')}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='rounded-xl border border-info/30 bg-info/10 p-3 text-xs text-info flex items-start gap-2'>
            <CheckCircle2 className='size-4 shrink-0 mt-0.5' />
            <span>{t('superAdmin.accounts.formModals.defaultRoleNotice')}</span>
          </div>

          <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
              onClick={onClose}
              type='button'
            >
              {t('superAdmin.accounts.formModals.cancelBtn')}
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              {t('superAdmin.accounts.formModals.submitCreate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export interface EditAccountModalProps {
  account: UserAccount | null
  editEmail: string
  editName: string
  editPosition: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  setEditEmail: (val: string) => void
  setEditName: (val: string) => void
  setEditPosition: (val: string) => void
}

export function EditAccountModal({
  account,
  editEmail,
  editName,
  editPosition,
  isOpen,
  onClose,
  onSubmit,
  setEditEmail,
  setEditName,
  setEditPosition
}: EditAccountModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen || !account) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <h2 className='text-lg font-bold text-foreground'>
          {t('superAdmin.accounts.formModals.editTitle', { code: account.employeeCode })}
        </h2>
        <form className='mt-4 space-y-3' onSubmit={onSubmit}>
          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>{t('superAdmin.accounts.formModals.nameLabel')}</label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
              onChange={(e) => setEditName(e.target.value)}
              required
              type='text'
              value={editName}
            />
          </div>

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>{t('superAdmin.accounts.formModals.emailLabel')}</label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none'
              onChange={(e) => setEditEmail(e.target.value)}
              required
              type='email'
              value={editEmail}
            />
          </div>

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>{t('superAdmin.accounts.formModals.positionLabel')}</label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setEditPosition(e.target.value)}
              type='text'
              value={editPosition}
            />
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-border pt-4'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
              onClick={onClose}
              type='button'
            >
              {t('superAdmin.accounts.formModals.cancelBtn')}
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              {t('superAdmin.accounts.formModals.submitSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export interface ChangeRoleModalProps {
  account: UserAccount | null
  departments: Department[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  roleChangeReason: string
  setRoleChangeReason: (val: string) => void
  setTargetDeptIdForManager: (val: string) => void
  setTargetRole: (val: UserAccountRole) => void
  targetDeptIdForManager: string
  targetRole: UserAccountRole
}

export function ChangeRoleModal({
  account,
  departments,
  isOpen,
  onClose,
  onSubmit,
  roleChangeReason,
  setRoleChangeReason,
  setTargetDeptIdForManager,
  setTargetRole,
  targetDeptIdForManager,
  targetRole
}: ChangeRoleModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen || !account) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <div className='flex items-center gap-2'>
          <Shield className='size-5 text-primary' />
          <h2 className='text-lg font-bold text-foreground'>
            {t('superAdmin.accounts.formModals.changeRoleTitle', { name: account.name })}
          </h2>
        </div>

        <div className='mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning'>
          <p className='font-bold flex items-center gap-1.5'>
            <AlertTriangle className='size-4' />
            {t('superAdmin.accounts.formModals.changeRoleNoticeTitle')}
          </p>
          <p className='mt-1 text-[0.7rem] leading-relaxed'>
            {t('superAdmin.accounts.formModals.changeRoleNoticeDesc', {
              current: roleDefinitions[account.role].name
            })}
          </p>
        </div>

        <form className='mt-4 space-y-3' onSubmit={onSubmit}>
          <label className='block text-xs font-bold text-foreground'>
            {t('superAdmin.accounts.formModals.selectTargetRole')}
          </label>
          <div className='space-y-2'>
            {(['EMPLOYEE', 'FINANCE', 'SPENDING_APPROVER', 'IT_ADMIN', 'MANAGER'] as UserAccountRole[]).map((r) => {
              const def = roleDefinitions[r]
              const isCurrent = account.role === r

              return (
                <label
                  className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition text-xs ${
                    targetRole === r
                      ? 'border-primary bg-primary-soft/30'
                      : isCurrent
                        ? 'border-border bg-surface-subtle opacity-70'
                        : 'border-border bg-surface hover:bg-surface-subtle'
                  }`}
                  key={r}
                >
                  <input
                    checked={targetRole === r}
                    className='mt-1'
                    name='targetRoleRadio'
                    onChange={() => setTargetRole(r)}
                    type='radio'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-foreground'>{def.name}</span>
                      {isCurrent && (
                        <span className='rounded bg-surface px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
                          {t('superAdmin.accounts.formModals.currentRoleBadge')}
                        </span>
                      )}
                    </div>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{def.description}</p>
                  </div>
                </label>
              )
            })}
          </div>

          {targetRole === 'MANAGER' && (
            <div className='mt-3 rounded-xl border border-info/30 bg-info/10 p-3'>
              <label className='block text-xs font-bold text-foreground mb-1'>
                {t('superAdmin.accounts.formModals.selectManagerDept')} <span className='text-danger'>*</span>
              </label>
              <select
                className='w-full rounded-lg border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setTargetDeptIdForManager(e.target.value)}
                value={targetDeptIdForManager}
              >
                <option value=''>{t('superAdmin.accounts.formModals.selectManagerDeptPlaceholder')}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code}) {d.managerId ? `(Manager: ${d.managerName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>
              {t('superAdmin.accounts.formModals.changeRoleReason')} <span className='text-danger'>*</span>
            </label>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setRoleChangeReason(e.target.value)}
              placeholder={t('superAdmin.accounts.formModals.changeRoleReasonPlaceholder')}
              required
              rows={2}
              value={roleChangeReason}
            />
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-border pt-4'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
              onClick={onClose}
              type='button'
            >
              {t('superAdmin.accounts.formModals.cancelBtn')}
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              {t('superAdmin.accounts.formModals.submitChangeRole')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export interface LockAccountModalProps {
  account: UserAccount | null
  isOpen: boolean
  lockReason: string
  onClose: () => void
  onToggleLock: () => void
  setLockReason: (val: string) => void
}

export function LockAccountModal({
  account,
  isOpen,
  lockReason,
  onClose,
  onToggleLock,
  setLockReason
}: LockAccountModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen || !account) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <div className='flex items-center gap-2'>
          {account.status === 'LOCKED' ? (
            <Unlock className='size-5 text-success' />
          ) : (
            <Lock className='size-5 text-danger' />
          )}
          <h2 className='text-lg font-bold text-foreground'>
            {account.status === 'LOCKED'
              ? t('superAdmin.accounts.formModals.unlockTitle')
              : t('superAdmin.accounts.formModals.lockTitle')}
          </h2>
        </div>

        <p className='mt-2 text-xs text-foreground'>
          {account.status === 'LOCKED'
            ? t('superAdmin.accounts.formModals.unlockDesc', {
                email: account.email,
                name: account.name
              })
            : t('superAdmin.accounts.formModals.lockDesc', {
                name: account.name
              })}
        </p>

        {account.status !== 'LOCKED' && (
          <div className='mt-3'>
            <label className='block text-xs font-bold text-foreground mb-1'>
              {t('superAdmin.accounts.formModals.lockReasonLabel')}
            </label>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setLockReason(e.target.value)}
              placeholder={t('superAdmin.accounts.formModals.lockReasonPlaceholder')}
              rows={2}
              value={lockReason}
            />
          </div>
        )}

        <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
            onClick={onClose}
            type='button'
          >
            {t('superAdmin.accounts.formModals.cancelBtn')}
          </button>
          <button
            className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition ${
              account.status === 'LOCKED'
                ? 'bg-success hover:bg-success/90'
                : 'bg-danger hover:bg-danger/90'
            }`}
            onClick={onToggleLock}
            type='button'
          >
            {account.status === 'LOCKED'
              ? t('superAdmin.accounts.formModals.confirmUnlock')
              : t('superAdmin.accounts.formModals.confirmLock')}
          </button>
        </div>
      </div>
    </div>
  )
}
