import {
  ChevronRight,
  Edit2,
  Laptop,
  Lock,
  Mail,
  Shield,
  Terminal,
  Unlock,
  X
} from 'lucide-react'
import type { EmployeeDevice, UserAccount, Department } from '../../super-admin-data'
import { roleDefinitions } from '../../super-admin-data'

export interface AccountDetailModalProps {
  account: UserAccount | null
  departments: Department[]
  devices: EmployeeDevice[]
  onClose: () => void
  onCopyText: (text: string) => void
  onOpenChangeRoleModal: () => void
  onOpenDeviceModal: (acc?: UserAccount, existingDev?: EmployeeDevice) => void
  onOpenEditModal: () => void
  onOpenLockModal: () => void
  onResendInvitation: (acc: UserAccount) => void
}

export function AccountDetailModal({
  account,
  departments: _departments,
  devices,
  onClose,
  onCopyText,
  onOpenChangeRoleModal,
  onOpenDeviceModal,
  onOpenEditModal,
  onOpenLockModal,
  onResendInvitation
}: AccountDetailModalProps) {
  if (!account) return null

  const roleDef = roleDefinitions[account.role]
  const assignedDev = devices.find(
    (d) => d.assignedEmployeeId === account.id || d.deviceCode === account.assignedDeviceCode
  )

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <div className='flex items-start justify-between border-b border-border pb-4'>
          <div className='flex items-center gap-3'>
            <div className='grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary font-bold text-lg'>
              {account.name.charAt(0)}
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-bold text-foreground'>{account.name}</h2>
                {account.isSelf && (
                  <span className='rounded bg-primary/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-primary'>
                    Tài khoản của bạn
                  </span>
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                {account.position} • {account.employeeCode}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
              account.status === 'ACTIVE'
                ? 'border-success/30 bg-success/15 text-success'
                : account.status === 'INVITED'
                  ? 'border-warning/30 bg-warning/15 text-warning'
                  : 'border-danger/30 bg-danger/15 text-danger'
            }`}
          >
            {account.status}
          </span>
        </div>

        <div className='mt-4 grid gap-3 sm:grid-cols-2 text-xs'>
          <div>
            <span className='text-muted-foreground block text-[0.7rem]'>Email công việc:</span>
            <span className='font-mono font-semibold text-foreground'>{account.email}</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-[0.7rem]'>Phòng ban trực thuộc:</span>
            <span className='font-semibold text-foreground'>
              {account.departmentName || 'Chưa xếp phòng ban'}
            </span>
          </div>
          <div>
            <span className='text-muted-foreground block text-[0.7rem]'>Số điện thoại:</span>
            <span className='font-mono text-foreground'>{account.phone || 'Chưa cập nhật'}</span>
          </div>
          <div>
            <span className='text-muted-foreground block text-[0.7rem]'>Đăng nhập gần nhất:</span>
            <span className='font-mono text-foreground'>{account.lastLoginAt || 'Chưa đăng nhập'}</span>
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-primary/20 bg-primary-soft/30 p-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Shield className='size-4 text-primary' />
              <span className='font-bold text-xs text-primary'>Vai trò hệ thống (Role)</span>
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                roleDef.colorTone === 'primary'
                  ? 'border-primary/30 bg-primary/15 text-primary'
                  : roleDef.colorTone === 'info'
                    ? 'border-info/30 bg-info/15 text-info'
                    : roleDef.colorTone === 'warning'
                      ? 'border-warning/30 bg-warning/15 text-warning'
                      : roleDef.colorTone === 'success'
                        ? 'border-success/30 bg-success/15 text-success'
                        : 'border-border bg-surface-subtle text-foreground'
              }`}
            >
              {roleDef.name}
            </span>
          </div>
          <p className='mt-1 text-[0.72rem] text-muted-foreground'>{roleDef.description}</p>
        </div>

        {/* Hardware Workstation Inspector */}
        <div className='mt-3 rounded-xl border border-border bg-surface-subtle/50 p-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Laptop className='size-4 text-primary' />
              <span className='font-bold text-xs text-foreground'>Thiết bị máy tính làm việc</span>
            </div>
            {assignedDev ? (
              <span className='rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-[0.65rem] font-bold text-success'>
                Đã định danh phần cứng
              </span>
            ) : (
              <span className='rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-[0.65rem] font-bold text-warning'>
                Chưa định danh máy
              </span>
            )}
          </div>

          {assignedDev ? (
            <div className='mt-2.5 space-y-2'>
              <div className='grid gap-2 sm:grid-cols-2 text-xs'>
                <div>
                  <span className='text-muted-foreground block text-[0.68rem]'>Mã máy & Tên Hostname:</span>
                  <span className='font-bold font-mono text-foreground'>
                    {assignedDev.deviceCode} ({assignedDev.hostname})
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground block text-[0.68rem]'>Hệ điều hành & Model:</span>
                  <span className='font-semibold text-foreground truncate block'>
                    {assignedDev.manufacturerModel} • {assignedDev.os}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground block text-[0.68rem]'>Địa chỉ MAC phần cứng:</span>
                  <span className='font-mono font-semibold text-foreground'>{assignedDev.macAddress}</span>
                </div>
                <div>
                  <span className='text-muted-foreground block text-[0.68rem]'>Lần đồng bộ Telemetry:</span>
                  <span className='font-semibold text-foreground'>{assignedDev.lastTelemetrySync}</span>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border border-border bg-background p-2'>
                <div className='flex items-center gap-2'>
                  <Terminal className='size-3.5 text-muted-foreground' />
                  <span className='font-mono text-[0.7rem] text-muted-foreground'>
                    Token: <strong className='text-foreground'>{assignedDev.pairingToken}</strong>
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <button
                    className='rounded px-2 py-0.5 text-[0.68rem] font-semibold text-primary hover:bg-surface-subtle transition'
                    onClick={() => onCopyText(`sentry-collector.exe --enroll --token ${assignedDev.pairingToken}`)}
                    type='button'
                  >
                    Sao chép lệnh cài đặt
                  </button>
                  <button
                    className='rounded px-2 py-0.5 text-[0.68rem] font-semibold text-primary hover:bg-surface-subtle transition'
                    onClick={() => onOpenDeviceModal(account, assignedDev)}
                    type='button'
                  >
                    Đổi máy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-2.5 flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-2.5'>
              <div className='space-y-0.5'>
                <p className='text-xs font-bold text-foreground'>
                  Chưa có thiết bị máy tính nào được gán cho nhân viên này!
                </p>
                <p className='text-[0.68rem] text-muted-foreground'>
                  Tool tracking không thể biết ai đang ngồi máy khi trả dữ liệu thời gian dùng phần mềm và token AI về.
                </p>
              </div>
              <button
                className='inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover shrink-0'
                onClick={() => onOpenDeviceModal(account)}
                type='button'
              >
                <Laptop className='size-3.5' />
                <span>Định danh máy ngay</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className='mt-5 space-y-2'>
          <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            Hành động quản trị:
          </span>

          <div className='grid gap-2 sm:grid-cols-2'>
            <button
              className='flex items-center justify-between rounded-xl border border-primary/30 bg-primary-soft/40 p-3 text-left hover:bg-primary-soft transition'
              onClick={() => {
                const existingDev = devices.find(
                  (d) => d.deviceCode === account.assignedDeviceCode || d.assignedEmployeeId === account.id
                )
                onOpenDeviceModal(account, existingDev)
              }}
              type='button'
            >
              <div className='flex items-center gap-2.5'>
                <Laptop className='size-4 text-primary' />
                <div>
                  <p className='text-xs font-bold text-foreground'>Định danh máy tính</p>
                  <p className='text-[0.7rem] text-muted-foreground'>Gán, cập nhật thiết bị làm việc</p>
                </div>
              </div>
              <ChevronRight className='size-4 text-primary' />
            </button>

            <button
              className='flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-subtle transition'
              disabled={account.isSelf}
              onClick={onOpenChangeRoleModal}
              type='button'
            >
              <div className='flex items-center gap-2.5'>
                <Shield className='size-4 text-primary' />
                <div>
                  <p className='text-xs font-bold text-foreground'>Đổi vai trò (Role)</p>
                  <p className='text-[0.7rem] text-muted-foreground'>Gán, thay thế hoặc thu hồi role</p>
                </div>
              </div>
              <ChevronRight className='size-4 text-primary' />
            </button>

            <button
              className='flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-subtle transition'
              onClick={onOpenEditModal}
              type='button'
            >
              <div className='flex items-center gap-2.5'>
                <Edit2 className='size-4 text-foreground' />
                <div>
                  <p className='text-xs font-bold text-foreground'>Sửa thông tin cá nhân</p>
                  <p className='text-[0.7rem] text-muted-foreground'>Họ tên, email, liên hệ</p>
                </div>
              </div>
              <ChevronRight className='size-4 text-muted-foreground' />
            </button>

            <button
              className='flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-subtle transition'
              onClick={() => onResendInvitation(account)}
              type='button'
            >
              <div className='flex items-center gap-2.5'>
                <Mail className='size-4 text-info' />
                <div>
                  <p className='text-xs font-bold text-foreground'>Gửi lại email mời</p>
                  <p className='text-[0.7rem] text-muted-foreground'>Kích hoạt tài khoản</p>
                </div>
              </div>
              <ChevronRight className='size-4 text-muted-foreground' />
            </button>

            <button
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                account.status === 'LOCKED'
                  ? 'border-success/30 bg-success/10 hover:bg-success/20'
                  : 'border-danger/30 bg-danger/10 hover:bg-danger/20'
              }`}
              disabled={account.isSelf}
              onClick={onOpenLockModal}
              type='button'
            >
              <div className='flex items-center gap-2.5'>
                {account.status === 'LOCKED' ? (
                  <Unlock className='size-4 text-success' />
                ) : (
                  <Lock className='size-4 text-danger' />
                )}
                <div>
                  <p className='text-xs font-bold text-foreground'>
                    {account.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                  </p>
                  <p className='text-[0.7rem] text-muted-foreground'>
                    {account.status === 'LOCKED' ? 'Khôi phục truy cập' : 'Chặn quyền đăng nhập'}
                  </p>
                </div>
              </div>
              <ChevronRight className='size-4 text-muted-foreground' />
            </button>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end border-t border-border pt-4'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
            onClick={onClose}
            type='button'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
