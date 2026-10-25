import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Shield,
  Unlock,
  X
} from 'lucide-react'
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

        <h2 className='text-lg font-bold text-foreground'>Tạo tài khoản nhân sự mới (SA-01)</h2>
        <p className='text-xs text-muted-foreground'>
          Khởi tạo thông tin cơ bản cho nhân sự. Tài khoản mới sẽ tự động nhận vai trò mặc định: Employee.
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
                Mã nhân viên <span className='text-danger'>*</span>
              </label>
              <input
                className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold focus:border-primary focus:outline-none uppercase'
                onChange={(e) => setNewCode(e.target.value)}
                placeholder='EMP-xxx'
                required
                type='text'
                value={newCode}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>
                Họ và tên <span className='text-danger'>*</span>
              </label>
              <input
                className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Ví dụ: Nguyễn Văn An'
                required
                type='text'
                value={newName}
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>
              Email công việc <span className='text-danger'>*</span>
            </label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none'
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder='an.nguyen@company.com'
              required
              type='email'
              value={newEmail}
            />
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>Chức danh / Vị trí</label>
              <input
                className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none'
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder='Kỹ sư phần mềm, Designer...'
                type='text'
                value={newPosition}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground mb-1'>Phòng ban trực thuộc</label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setNewDepartmentId(e.target.value)}
                value={newDepartmentId}
              >
                <option value=''>-- Chưa xếp phòng ban --</option>
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
            <span>
              Tài khoản mới tạo sẽ mặc định mang vai trò <strong>Nhân viên</strong>. Bạn có thể phân quyền vai trò khác trong phần chi tiết tài khoản sau khi tạo.
            </span>
          </div>

          <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
              onClick={onClose}
              type='button'
            >
              Hủy bỏ
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              Tạo tài khoản (Role: Employee)
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

        <h2 className='text-lg font-bold text-foreground'>Sửa thông tin tài khoản [{account.employeeCode}]</h2>
        <form className='mt-4 space-y-3' onSubmit={onSubmit}>
          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>Họ và tên</label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
              onChange={(e) => setEditName(e.target.value)}
              required
              type='text'
              value={editName}
            />
          </div>

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>Email công việc</label>
            <input
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none'
              onChange={(e) => setEditEmail(e.target.value)}
              required
              type='email'
              value={editEmail}
            />
          </div>

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>Chức danh</label>
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
              Hủy
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              Lưu thay đổi
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
          <h2 className='text-lg font-bold text-foreground'>Đổi vai trò (Role) cho {account.name}</h2>
        </div>

        <div className='mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning'>
          <p className='font-bold flex items-center gap-1.5'>
            <AlertTriangle className='size-4' />
            Lưu ý phân quyền vai trò:
          </p>
          <p className='mt-1 text-[0.7rem] leading-relaxed'>
            Vai trò hiện tại <strong>{roleDefinitions[account.role].name}</strong> sẽ được{' '}
            <strong>thay thế bằng vai trò mới</strong>. Mỗi tài khoản đảm nhiệm một vai trò duy nhất trong hệ thống.
          </p>
        </div>

        <form className='mt-4 space-y-3' onSubmit={onSubmit}>
          <label className='block text-xs font-bold text-foreground'>Chọn role đích:</label>
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
                          Role hiện tại
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
                Chọn phòng ban quản lý <span className='text-danger'>*</span>
              </label>
              <select
                className='w-full rounded-lg border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setTargetDeptIdForManager(e.target.value)}
                value={targetDeptIdForManager}
              >
                <option value=''>-- Chọn phòng ban --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code}) {d.managerId ? `(Manager hiện tại: ${d.managerName})` : '(Chưa có Manager)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>
              Lý do thay đổi vai trò: <span className='text-danger'>*</span>
            </label>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setRoleChangeReason(e.target.value)}
              placeholder='Nhập lý do điều chuyển hoặc phân công nhiệm vụ mới...'
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
              Hủy
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              Cập nhật vai trò
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
            {account.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản nhân sự'}
          </h2>
        </div>

        <p className='mt-2 text-xs text-foreground'>
          {account.status === 'LOCKED' ? (
            <>
              Bạn có muốn mở khóa cho tài khoản <strong>{account.name}</strong> ({account.email})? Quyền đăng nhập sẽ được khôi phục ngay.
            </>
          ) : (
            <>
              Khóa tài khoản <strong>{account.name}</strong> sẽ chặn quyền đăng nhập vào hệ thống ngay lập tức nhưng vẫn giữ nguyên vai trò và cơ cấu phòng ban.
            </>
          )}
        </p>

        {account.status !== 'LOCKED' && (
          <div className='mt-3'>
            <label className='block text-xs font-bold text-foreground mb-1'>Lý do khóa tài khoản:</label>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setLockReason(e.target.value)}
              placeholder='Nhập lý do tạm đình chỉ quyền truy cập...'
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
            Hủy bỏ
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
            {account.status === 'LOCKED' ? 'Xác nhận mở khóa' : 'Xác nhận khóa tài khoản'}
          </button>
        </div>
      </div>
    </div>
  )
}
