import { AlertTriangle, Laptop, Monitor, Plus, Search, Trash2 } from 'lucide-react'
import type { EmployeeDevice, UserAccount } from '../../super-admin-data'
import { roleDefinitions } from '../../super-admin-data'

export interface DevicesSubtabViewProps {
  accounts: UserAccount[]
  deviceSearchTerm: string
  deviceTypeFilter: string
  devices: EmployeeDevice[]
  onOpenDeviceModal: (acc?: UserAccount) => void
  onUnbindDevice: (device: EmployeeDevice) => void
  setDeviceSearchTerm: (val: string) => void
  setDeviceTypeFilter: (val: string) => void
}

export function DevicesSubtabView({
  accounts,
  deviceSearchTerm,
  deviceTypeFilter,
  devices,
  onOpenDeviceModal,
  onUnbindDevice,
  setDeviceSearchTerm,
  setDeviceTypeFilter
}: DevicesSubtabViewProps) {
  const unassigned = accounts.filter(
    (a) => a.role === 'EMPLOYEE' && !devices.some((d) => d.assignedEmployeeId === a.id)
  )

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>Thiết bị đã định danh</span>
            <Laptop className='size-4 text-primary' />
          </div>
          <p className='mt-2 text-2xl font-black text-foreground'>{devices.filter((d) => Boolean(d.assignedEmployeeId)).length}</p>
          <span className='text-[0.7rem] text-muted-foreground'>Đang hoạt động</span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>Kho thiết bị chưa gán</span>
            <Monitor className='size-4 text-primary' />
          </div>
          <p className='mt-2 text-2xl font-black text-foreground'>{devices.filter((d) => !d.assignedEmployeeId).length}</p>
          <span className='text-[0.7rem] text-muted-foreground'>Sẵn sàng cấp phát</span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-warning'>Nhân viên chưa định danh</span>
            <AlertTriangle className='size-4 text-warning' />
          </div>
          <p className='mt-2 text-2xl font-black text-warning'>{unassigned.length}</p>
          <span className='text-[0.7rem] text-muted-foreground'>Cần gán thiết bị</span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>100% Windows</span>
            <Laptop className='size-4 text-success' />
          </div>
          <p className='mt-2 text-2xl font-black text-success'>Chuẩn hóa</p>
          <span className='text-[0.7rem] text-muted-foreground'>Hệ sinh thái máy trạm</span>
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='grid gap-3 sm:grid-cols-3 flex-1'>
            <div className='relative sm:col-span-2'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
              <input
                className='w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none'
                onChange={(e) => setDeviceSearchTerm(e.target.value)}
                placeholder='Tìm nhân sự, mã máy (Device Code), địa chỉ MAC...'
                type='search'
                value={deviceSearchTerm}
              />
            </div>

            <div>
              <select
                className='w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setDeviceTypeFilter(e.target.value)}
                value={deviceTypeFilter}
              >
                <option value='ALL'>Tất cả loại máy Windows</option>
                <option value='LAPTOP'>Laptop Windows công ty</option>
                <option value='DESKTOP'>Máy tính để bàn Windows (PC)</option>
              </select>
            </div>
          </div>

          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover shrink-0'
            onClick={() => onOpenDeviceModal()}
            type='button'
          >
            <Plus className='size-4' />
            <span>+ Định danh thiết bị mới</span>
          </button>
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground bg-surface-subtle/50'>
                <th className='p-3 font-semibold'>Nhân sự sử dụng</th>
                <th className='p-3 font-semibold'>Mã thiết bị (Device Code)</th>
                <th className='p-3 font-semibold'>Loại máy</th>
                <th className='p-3 font-semibold'>Địa chỉ MAC</th>
                <th className='p-3 font-semibold'>Hệ điều hành (OS)</th>
                <th className='p-3 font-semibold text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {devices
                .filter((dev) => Boolean(dev.assignedEmployeeId))
                .filter((dev) => {
                  const q = deviceSearchTerm.toLowerCase()
                  const matchesSearch =
                    (dev.assignedEmployeeName || '').toLowerCase().includes(q) ||
                    (dev.assignedEmployeeCode || '').toLowerCase().includes(q) ||
                    dev.deviceCode.toLowerCase().includes(q) ||
                    dev.macAddress.toLowerCase().includes(q)

                  const matchesType = deviceTypeFilter === 'ALL' || dev.deviceType === deviceTypeFilter

                  return matchesSearch && matchesType
                })
                .map((dev) => {
                  const acc = accounts.find((a) => a.id === dev.assignedEmployeeId)

                  return (
                    <tr className='transition hover:bg-surface-subtle/60' key={dev.id}>
                      <td className='p-3'>
                        <div className='flex items-center gap-1.5'>
                          <span className='font-bold text-foreground'>{dev.assignedEmployeeName}</span>
                          <span className='font-mono text-[0.7rem] text-primary font-semibold'>
                            ({dev.assignedEmployeeCode})
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5 text-[0.7rem] text-muted-foreground mt-0.5'>
                          <span>{dev.departmentName || 'Chưa xếp phòng'}</span>
                          {acc && (
                            <span className='rounded bg-surface-subtle px-1.5 py-0.5 border border-border text-[0.65rem] font-semibold text-primary'>
                              {roleDefinitions[acc.role].name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className='p-3'>
                        <span className='font-mono font-bold text-foreground text-xs bg-surface-subtle border border-border px-2 py-1 rounded-lg inline-block'>
                          {dev.deviceCode}
                        </span>
                      </td>

                      <td className='p-3'>
                        <div className='flex items-center gap-2'>
                          <div className='grid size-7 place-items-center rounded-lg bg-primary-soft text-primary shrink-0'>
                            {dev.deviceType === 'DESKTOP' ? (
                              <Monitor className='size-3.5' />
                            ) : (
                              <Laptop className='size-3.5' />
                            )}
                          </div>
                          <span className='font-medium text-foreground text-xs'>
                            {dev.deviceType === 'DESKTOP' ? 'Máy tính để bàn Windows' : 'Laptop Windows'}
                          </span>
                        </div>
                      </td>

                      <td className='p-3'>
                        <span className='font-mono font-bold text-primary text-xs'>{dev.macAddress}</span>
                      </td>

                      <td className='p-3'>
                        <span className='font-medium text-foreground'>{dev.os}</span>
                      </td>

                      <td className='p-3 text-right'>
                        <button
                          className='inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20 transition'
                          onClick={() => onUnbindDevice(dev)}
                          title='Xóa định danh thiết bị khỏi nhân sự này'
                          type='button'
                        >
                          <Trash2 className='size-3.5' />
                          <span>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}

              {devices.filter((dev) => Boolean(dev.assignedEmployeeId)).length === 0 && (
                <tr>
                  <td className='p-8 text-center text-muted-foreground italic' colSpan={6}>
                    Chưa có thiết bị nào được định danh cho nhân sự. Bấm nút "+ Định danh thiết bị mới" để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {unassigned.length > 0 && (
        <div className='rounded-2xl border border-warning/30 bg-surface p-4 shadow-sm'>
          <div className='flex items-start gap-3'>
            <div className='grid size-9 place-items-center rounded-xl bg-warning/20 text-warning shrink-0'>
              <AlertTriangle className='size-5' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-bold text-foreground'>
                  Cảnh báo: Có {unassigned.length} nhân sự (Employee) chưa được định danh máy tính làm việc!
                </h4>
                <span className='rounded bg-warning/20 px-2 py-0.5 text-xs font-bold text-warning'>
                  Cần định danh
                </span>
              </div>
              <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
                Theo quy định của dự án, mỗi nhân sự vai trò Employee cần được gán đúng 1 máy tính Windows do công ty cấp để hệ thống nhận diện địa chỉ MAC khi thu thập dữ liệu telemetry.
              </p>

              <div className='mt-3 grid gap-2 sm:grid-cols-3'>
                {unassigned.map((emp) => (
                  <div
                    className='flex items-center justify-between rounded-xl border border-border bg-surface-subtle p-2.5 text-xs'
                    key={emp.id}
                  >
                    <div>
                      <span className='font-bold text-foreground block'>{emp.name}</span>
                      <span className='text-[0.7rem] text-muted-foreground font-mono'>
                        {emp.employeeCode} • {emp.departmentName || 'Chưa xếp phòng'}
                      </span>
                    </div>
                    <button
                      className='inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[0.7rem] font-bold text-primary-foreground shadow-sm hover:bg-primary-hover shrink-0'
                      onClick={() => onOpenDeviceModal(emp)}
                      type='button'
                    >
                      <Laptop className='size-3' />
                      <span>Định danh</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
