import { ChevronRight, Download, Search, UserPlus } from 'lucide-react'
import type { Department, EmployeeDevice, UserAccount, UserAccountRole } from '../../super-admin-data'
import { roleDefinitions } from '../../super-admin-data'

export interface AccountsSubtabViewProps {
  accounts: UserAccount[]
  departmentFilter: string
  departments: Department[]
  devices: EmployeeDevice[]
  filteredAccounts: UserAccount[]
  onExportCsv: () => void
  onOpenCreateModal: () => void
  onOpenDeviceModal?: (acc: UserAccount) => void
  onSelectAccount: (acc: UserAccount) => void
  roleFilter: string
  searchTerm: string
  setDepartmentFilter: (val: string) => void
  setRoleFilter: (val: any) => void
  setSearchTerm: (val: string) => void
  statusFilter: string
}

export function AccountsSubtabView({
  accounts: _accounts,
  departmentFilter,
  departments,
  devices,
  filteredAccounts,
  onExportCsv,
  onOpenCreateModal,
  onOpenDeviceModal,
  onSelectAccount,
  roleFilter,
  searchTerm,
  setDepartmentFilter,
  setRoleFilter,
  setSearchTerm,
  statusFilter: _statusFilter
}: AccountsSubtabViewProps) {
  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='grid gap-3 sm:grid-cols-4'>
          <div className='relative sm:col-span-2'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <input
              className='w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Tìm kiếm họ tên, email hoặc mã NV...'
              type='search'
              value={searchTerm}
            />
          </div>

          <div>
            <select
              className='w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
              onChange={(e) => setRoleFilter(e.target.value as any)}
              value={roleFilter}
            >
              <option value='ALL'>Tất cả vai trò (Role)</option>
              {(Object.keys(roleDefinitions) as UserAccountRole[]).map((r) => (
                <option key={r} value={r}>
                  {roleDefinitions[r].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className='w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
              onChange={(e) => setDepartmentFilter(e.target.value)}
              value={departmentFilter}
            >
              <option value='ALL'>Tất cả phòng ban</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>Mã NV</th>
                <th className='p-3 font-semibold'>Họ và tên</th>
                <th className='p-3 font-semibold'>Email công việc</th>
                <th className='p-3 font-semibold'>Phòng ban trực thuộc</th>
                <th className='p-3 font-semibold text-center'>Role duy nhất</th>
                <th className='p-3 font-semibold text-center'>Thiết bị định danh</th>
                <th className='p-3 font-semibold text-center'>Trạng thái</th>
                <th className='p-3 font-semibold text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredAccounts.map((acc) => {
                const roleDef = roleDefinitions[acc.role]
                const boundDev = devices.find(
                  (d) => d.assignedEmployeeId === acc.id || d.deviceCode === acc.assignedDeviceCode
                )

                return (
                  <tr className='transition hover:bg-surface-subtle/60' key={acc.id}>
                    <td className='p-3 font-mono font-bold text-muted-foreground'>{acc.employeeCode}</td>
                    <td className='p-3'>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-foreground'>{acc.name}</span>
                        {acc.isSelf && (
                          <span className='rounded bg-primary/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-primary'>
                            Bạn
                          </span>
                        )}
                      </div>
                      <span className='text-[0.7rem] text-muted-foreground'>{acc.position}</span>
                    </td>
                    <td className='p-3 font-mono text-muted-foreground'>{acc.email}</td>
                    <td className='p-3'>
                      {acc.departmentName ? (
                        <span className='font-semibold text-foreground'>{acc.departmentName}</span>
                      ) : (
                        <span className='font-semibold text-info'>Chưa xếp phòng</span>
                      )}
                    </td>
                    <td className='p-3 text-center'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
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
                    </td>
                    <td className='p-3 text-center'>
                      {boundDev ? (
                        <span className='inline-flex items-center gap-1 font-mono text-[0.68rem] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full'>
                          {boundDev.deviceCode}
                        </span>
                      ) : acc.role === 'EMPLOYEE' ? (
                        <button
                          className='inline-flex items-center gap-1 text-[0.68rem] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary/20'
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenDeviceModal?.(acc)
                          }}
                          type='button'
                        >
                          + Định danh
                        </button>
                      ) : (
                        <span className='text-muted-foreground text-[0.68rem]'>—</span>
                      )}
                    </td>
                    <td className='p-3 text-center'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                          acc.status === 'ACTIVE'
                            ? 'border-success/30 bg-success/15 text-success'
                            : acc.status === 'INVITED'
                              ? 'border-warning/30 bg-warning/15 text-warning'
                              : 'border-danger/30 bg-danger/15 text-danger'
                        }`}
                      >
                        {acc.status === 'ACTIVE'
                          ? 'Đang hoạt động'
                          : acc.status === 'INVITED'
                            ? 'Chờ kích hoạt'
                            : 'Bị khóa'}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      <button
                        className='inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-primary hover:bg-surface-subtle transition'
                        onClick={() => onSelectAccount(acc)}
                        type='button'
                      >
                        <span>Chi tiết</span>
                        <ChevronRight className='size-3.5' />
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredAccounts.length === 0 && (
                <tr>
                  <td className='p-8 text-center text-muted-foreground' colSpan={8}>
                    Không tìm thấy tài khoản nào khớp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
