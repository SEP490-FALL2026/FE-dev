import { AlertTriangle, CheckCircle2, Laptop, X } from 'lucide-react'
import type { EmployeeDevice, UserAccount } from '../../super-admin-data'
import type { DeviceType } from '../../enums'

export interface DeviceIdentificationModalProps {
  accounts: UserAccount[]
  devFormCode: string
  devFormEmployeeId: string
  devFormError: string | null
  devFormMac: string
  devFormOs: string
  devFormType: any
  deviceModalExistingDevice: EmployeeDevice | null
  deviceModalTargetAccount: UserAccount | null
  devices: EmployeeDevice[]
  isOpen: boolean
  onClose: () => void
  onSaveDeviceBinding: (e: React.FormEvent) => void
  setDevFormCode: (code: string) => void
  setDevFormEmployeeId: (id: string) => void
  setDevFormMac: (mac: string) => void
  setDevFormOs: (os: string) => void
  setDevFormType: (type: any) => void
}

export function DeviceIdentificationModal({
  accounts,
  devFormCode,
  devFormEmployeeId,
  devFormError,
  devFormMac,
  devFormOs,
  devFormType,
  deviceModalExistingDevice,
  deviceModalTargetAccount,
  devices,
  isOpen,
  onClose,
  onSaveDeviceBinding,
  setDevFormCode,
  setDevFormEmployeeId,
  setDevFormMac,
  setDevFormOs,
  setDevFormType
}: DeviceIdentificationModalProps) {
  if (!isOpen) return null

  const employeeAccounts = accounts.filter((a) => a.role === 'EMPLOYEE')
  const unassignedDevs = devices.filter((d) => !d.assignedEmployeeId)

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

        <div className='flex items-center gap-2.5'>
          <div className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary'>
            <Laptop className='size-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-foreground'>
              {deviceModalExistingDevice
                ? `Cập nhật định danh thiết bị máy tính cho ${deviceModalTargetAccount?.name || 'nhân viên'}`
                : `Định danh thiết bị máy tính cho ${deviceModalTargetAccount?.name || 'nhân viên'}`}
            </h2>
            <p className='text-[0.7rem] text-muted-foreground'>
              Bước 3 Onboarding: Gán định danh máy tính cho nhân sự
            </p>
          </div>
        </div>

        <div className='mt-3 rounded-xl border border-primary/20 bg-primary-soft/30 p-3 text-xs text-foreground'>
          <p className='font-bold text-primary flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5' />
            Nguyên lý nhận diện Telemetry:
          </p>
          <p className='mt-1 text-[0.68rem] leading-relaxed text-muted-foreground'>
            Tool desktop sentry-collector đọc Hardware MAC và Device Code của máy tính Windows này để gán dữ liệu thời gian mở phần mềm và token AI cho đúng nhân sự.
          </p>
        </div>

        {devFormError && (
          <div className='mt-3 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger'>
            <AlertTriangle className='size-4 shrink-0' />
            <span>{devFormError}</span>
          </div>
        )}

        <form className='mt-4 space-y-3 text-xs' onSubmit={onSaveDeviceBinding}>
          <div>
            <label className='block font-bold text-foreground mb-1'>
              Nhân sự sử dụng máy tính: <span className='text-danger'>*</span>
            </label>
            <select
              className='w-full rounded-xl border border-border bg-background p-2.5 font-semibold focus:border-primary focus:outline-none'
              disabled={!!deviceModalTargetAccount}
              onChange={(e) => setDevFormEmployeeId(e.target.value)}
              value={devFormEmployeeId}
            >
              <option value=''>-- Chọn nhân sự (Vai trò Employee) --</option>
              {employeeAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.employeeCode}) — {acc.departmentName || 'Chưa xếp phòng'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block font-bold text-foreground mb-1'>
              Mã thiết bị (Device Code): <span className='text-danger'>*</span>
            </label>
            <input
              className='w-full rounded-xl border border-border bg-background p-2.5 font-mono font-bold uppercase focus:border-primary focus:outline-none'
              list='company-hardware-codes'
              onChange={(e) => {
                const val = e.target.value.toUpperCase()
                setDevFormCode(val)
                const matched = devices.find((d) => d.deviceCode.toUpperCase() === val)
                if (matched) {
                  setDevFormType(matched.deviceType || 'LAPTOP')
                  setDevFormOs(matched.os)
                  setDevFormMac(matched.macAddress)
                }
              }}
              placeholder='VD: DEV-WIN-2026-041 hoặc chọn từ kho'
              required
              type='text'
              value={devFormCode}
            />
            <datalist id='company-hardware-codes'>
              {unassignedDevs.map((d) => (
                <option key={d.id} value={d.deviceCode}>
                  {d.hostname} - {d.manufacturerModel} ({d.macAddress})
                </option>
              ))}
            </datalist>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='block font-bold text-foreground mb-1'>
                Loại thiết bị:
              </label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2.5 font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setDevFormType(e.target.value)}
                value={devFormType}
              >
                <option value='LAPTOP'>Laptop xách tay</option>
                <option value='DESKTOP'>Máy bàn PC công ty</option>
                <option value='WORKSTATION'>Workstation cấu hình cao</option>
                <option value='MACBOOK'>MacBook công ty</option>
              </select>
            </div>

            <div>
              <label className='block font-bold text-foreground mb-1'>
                Hệ điều hành (OS):
              </label>
              <input
                className='w-full rounded-xl border border-border bg-background p-2.5 focus:border-primary focus:outline-none'
                onChange={(e) => setDevFormOs(e.target.value)}
                placeholder='VD: Windows 11 Pro 64-bit'
                type='text'
                value={devFormOs}
              />
            </div>
          </div>

          <div>
            <label className='block font-bold text-foreground mb-1'>
              Địa chỉ MAC Card mạng:
            </label>
            <input
              className='w-full rounded-xl border border-border bg-surface-subtle p-2.5 font-mono font-bold text-muted-foreground cursor-not-allowed select-none uppercase'
              disabled
              readOnly
              type='text'
              value={devFormMac || 'Tự động điền theo Mã thiết bị'}
            />
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-border pt-4'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
              onClick={onClose}
              type='button'
            >
              Hủy bỏ
            </button>
            <button
              className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              Lưu định danh thiết bị
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
