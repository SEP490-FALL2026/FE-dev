import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Unlock,
  UserCheck,
  UserPlus,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Dialog, FilterChips, Notice, PageHeader, Panel, PanelTitle, Pill } from '../../dashboard-ui'
import {
  type AdminAccount,
  type AvailableEmployee,
  availableEmployeesForAccount,
  initialAdminAccounts
} from '../super-admin-data'

type StatusFilter = 'ALL' | 'ACTIVE' | 'INVITED' | 'LOCKED'

export function SuperAdminAccountsView() {
  const [accounts, setAccounts] = useState<AdminAccount[]>(initialAdminAccounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(availableEmployeesForAccount[0]?.id || '')
  const [selectedInitialRole, setSelectedInitialRole] = useState('EMPLOYEE')

  const [roleModalAccount, setRoleModalAccount] = useState<AdminAccount | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const [sys04BlockedModal, setSys04BlockedModal] = useState<{
    open: boolean
    reason: string
  }>({ open: false, reason: '' })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesStatus = statusFilter === 'ALL' || account.status === statusFilter
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.department.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Action: Create account from employee (FR-8.6, FR-8.11)
  const handleCreateAccount = () => {
    const employee = availableEmployeesForAccount.find((e) => e.id === selectedEmployeeId)
    if (!employee) return

    const newAccount: AdminAccount = {
      department: employee.department,
      directRoles: selectedInitialRole === 'EMPLOYEE' ? [] : [selectedInitialRole],
      effectiveRoles: [selectedInitialRole],
      email: employee.email,
      employeeCode: employee.employeeCode,
      id: `acc-${Date.now()}`,
      invitedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      name: employee.name,
      position: employee.position,
      status: 'INVITED'
    }

    setAccounts([newAccount, ...accounts])
    setCreateModalOpen(false)
    showToast(`Đã tạo tài khoản cho ${employee.name} và gửi lời mời kích hoạt dùng 1 lần (FR-8.11).`)
  }

  // Action: Open role modal (Checks SYS-04 boundary)
  const handleOpenRoleModal = (account: AdminAccount) => {
    if (account.isSelf) {
      setSys04BlockedModal({
        open: true,
        reason: 'Quy tắc SoD (FR-8.8): Super Admin không được phép tự phân quyền hoặc sửa đổi vai trò của chính mình.'
      })
      return
    }
    setRoleModalAccount(account)
    setSelectedRoles(account.directRoles)
  }

  // Action: Save roles
  const handleSaveRoles = () => {
    if (!roleModalAccount) return

    setAccounts(
      accounts.map((acc) => {
        if (acc.id === roleModalAccount.id) {
          const effective = selectedRoles.length > 0 ? selectedRoles : ['EMPLOYEE']
          return {
            ...acc,
            directRoles: selectedRoles,
            effectiveRoles: effective
          }
        }
        return acc
      })
    )
    setRoleModalAccount(null)
    showToast(`Đã cập nhật vai trò cho tài khoản ${roleModalAccount.name} và ghi Audit Trail.`)
  }

  // Action: Lock / Unlock account (Checks SYS-04 boundary)
  const handleToggleLock = (account: AdminAccount) => {
    if (account.isSelf) {
      setSys04BlockedModal({
        open: true,
        reason: 'Quy tắc SoD (FR-8.8): Super Admin không thể tự khóa tài khoản quản trị của chính mình.'
      })
      return
    }

    const nextStatus = account.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'
    setAccounts(
      accounts.map((acc) => (acc.id === account.id ? { ...acc, status: nextStatus } : acc))
    )
    showToast(
      nextStatus === 'LOCKED'
        ? `Đã khóa tài khoản ${account.name}. Người dùng không thể đăng nhập.`
        : `Đã mở khóa tài khoản ${account.name}.`
    )
  }

  // Action: Re-invite (FR-8.11)
  const handleReInvite = (account: AdminAccount) => {
    showToast(`Đã gửi lại thư mời kích hoạt mới cho ${account.email}. Mã token cũ đã bị vô hiệu hóa (FR-8.11).`)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={() => setCreateModalOpen(true)}
            type='button'
          >
            <UserPlus className='size-4' />
            Tạo tài khoản từ Nhân viên
          </button>
        }
        code='ADM-21'
        subtitle='Quản lý vòng đời tài khoản: Tạo từ hồ sơ nhân sự, phân bổ vai trò trực tiếp, gửi lại lời mời và kiểm soát truy cập theo quy chuẩn SoD.'
        title='Tài khoản & Phân quyền Hệ thống'
      />

      {/* Toast message notification */}
      {toastMessage && (
        <div className='flex items-center justify-between rounded-xl border border-success/30 bg-success/15 p-3 text-xs font-semibold text-success animate-in fade-in'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='size-4' />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} type='button'>
            <X className='size-3.5' />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Panel>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <FilterChips<StatusFilter>
            label='Lọc theo trạng thái'
            onChange={setStatusFilter}
            options={[
              { count: accounts.length, label: 'Tất cả', value: 'ALL' },
              { count: accounts.filter((a) => a.status === 'ACTIVE').length, label: 'Đang hoạt động', value: 'ACTIVE' },
              { count: accounts.filter((a) => a.status === 'INVITED').length, label: 'Chờ kích hoạt', value: 'INVITED' },
              { count: accounts.filter((a) => a.status === 'LOCKED').length, label: 'Bị khóa', value: 'LOCKED' }
            ]}
            value={statusFilter}
          />

          <div className='relative min-w-[16rem] flex-1 sm:max-w-xs'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              className='w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Tìm tên, mã NV, email, phòng ban...'
              type='search'
              value={searchTerm}
            />
          </div>
        </div>

        {/* Accounts Table */}
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle/50 text-[0.7rem] font-bold uppercase text-muted-foreground'>
              <tr>
                <th className='px-3 py-2.5'>Nhân sự & Mã NV</th>
                <th className='px-3 py-2.5'>Email & Phòng ban</th>
                <th className='px-3 py-2.5'>Vai trò Trực tiếp</th>
                <th className='px-3 py-2.5'>Trạng thái</th>
                <th className='px-3 py-2.5'>Đăng nhập gần nhất</th>
                <th className='px-3 py-2.5 text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredAccounts.map((account) => (
                <tr className='transition hover:bg-surface-subtle/30' key={account.id}>
                  <td className='px-3 py-3'>
                    <div className='flex items-center gap-2'>
                      <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary'>
                        {account.name.charAt(0)}
                      </span>
                      <div>
                        <div className='flex items-center gap-1.5'>
                          <span className='font-bold text-foreground'>{account.name}</span>
                          {account.isSelf && (
                            <span className='rounded bg-primary/10 px-1 py-0.2 text-[0.65rem] font-bold text-primary'>
                              Bạn (Tài khoản hiện hành)
                            </span>
                          )}
                        </div>
                        <span className='text-[0.7rem] text-muted-foreground'>
                          {account.employeeCode} · {account.position}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-3 py-3'>
                    <div className='font-medium text-foreground'>{account.email}</div>
                    <div className='text-[0.7rem] text-muted-foreground'>{account.department}</div>
                  </td>
                  <td className='px-3 py-3'>
                    <div className='flex flex-wrap gap-1'>
                      {account.directRoles.length > 0 ? (
                        account.directRoles.map((role) => (
                          <span
                            className='inline-flex items-center rounded-md border border-primary/25 bg-primary-soft px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-primary'
                            key={role}
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className='text-[0.7rem] italic text-muted-foreground'>
                          Không có vai trò bổ sung (Employee)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='px-3 py-3'>
                    {account.status === 'ACTIVE' && <Pill tone='success'>Hoạt động</Pill>}
                    {account.status === 'INVITED' && <Pill tone='warning'>Chờ kích hoạt</Pill>}
                    {account.status === 'LOCKED' && <Pill tone='danger'>Bị khóa</Pill>}
                  </td>
                  <td className='px-3 py-3 text-muted-foreground'>
                    {account.status === 'INVITED' ? (
                      <span className='text-[0.7rem] text-warning'>Mời lúc: {account.invitedAt}</span>
                    ) : (
                      account.lastLoginAt || 'Chưa đăng nhập'
                    )}
                  </td>
                  <td className='px-3 py-3 text-right'>
                    <div className='inline-flex items-center gap-1'>
                      {/* Change role button */}
                      <button
                        className='inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-[0.7rem] font-semibold text-foreground transition hover:border-primary hover:text-primary'
                        onClick={() => handleOpenRoleModal(account)}
                        title='Phân quyền vai trò'
                        type='button'
                      >
                        <Shield className='size-3 text-primary' />
                        Đổi vai
                      </button>

                      {/* Re-invite if INVITED */}
                      {account.status === 'INVITED' && (
                        <button
                          className='inline-flex items-center gap-1 rounded-lg border border-warning/30 bg-warning/10 px-2 py-1 text-[0.7rem] font-bold text-warning transition hover:bg-warning hover:text-white'
                          onClick={() => handleReInvite(account)}
                          title='Gửi lại lời mời kích hoạt'
                          type='button'
                        >
                          <RefreshCw className='size-3' />
                          Mời lại
                        </button>
                      )}

                      {/* Lock/Unlock if ACTIVE/LOCKED */}
                      {account.status !== 'INVITED' && (
                        <button
                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.7rem] font-semibold transition ${
                            account.status === 'LOCKED'
                              ? 'border-success/30 bg-success/10 text-success hover:bg-success hover:text-white'
                              : 'border-danger/30 bg-danger/10 text-danger hover:bg-danger hover:text-white'
                          }`}
                          onClick={() => handleToggleLock(account)}
                          title={account.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          type='button'
                        >
                          {account.status === 'LOCKED' ? (
                            <>
                              <Unlock className='size-3' />
                              Mở khóa
                            </>
                          ) : (
                            <>
                              <Lock className='size-3' />
                              Khóa
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Modal 1: Create Account from Employee Record (FR-8.6, FR-8.11) */}
      {createModalOpen && (
        <Dialog
          hint='Tài khoản chỉ được tạo từ hồ sơ nhân viên đã có sẵn trong danh mục nhân sự. Hệ thống sẽ phát sinh lời mời dùng 1 lần.'
          onClose={() => setCreateModalOpen(false)}
          title='Tạo Tài khoản từ Hồ sơ Nhân viên (FR-8.6)'
        >
          <div className='space-y-4 text-xs'>
            <Notice tone='info'>
              Theo quy chuẩn bảo mật (FR-8.11), Super Admin không tự đặt mật khẩu cho người dùng. Người dùng sẽ nhận được email chứa liên kết lời mời dùng một lần để tự thiết lập mật khẩu cá nhân.
            </Notice>

            <div>
              <label className='block font-bold text-foreground'>Chọn Nhân sự chưa có tài khoản</label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                value={selectedEmployeeId}
              >
                {availableEmployeesForAccount.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeCode}) — {emp.position} · {emp.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block font-bold text-foreground'>Gán Vai trò ban đầu</label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => setSelectedInitialRole(e.target.value)}
                value={selectedInitialRole}
              >
                <option value='EMPLOYEE'>Nhân viên thông thường (Employee)</option>
                <option value='MANAGER'>Quản lý phòng ban (Manager)</option>
                <option value='IT_ADMIN'>Quản trị viên CNTT (IT Admin)</option>
                <option value='FINANCE'>Kế toán / Tài chính (Finance)</option>
                <option value='SPENDING_APPROVER'>Người duyệt chi (Spending Approver)</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                * Lưu ý: Không thể gán vai trò Super Admin thứ hai theo quy tắc QĐ-44.
              </p>
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                className='rounded-xl border border-border px-4 py-2 font-bold text-foreground hover:bg-surface-subtle'
                onClick={() => setCreateModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90'
                onClick={handleCreateAccount}
                type='button'
              >
                Tạo tài khoản & Gửi lời mời
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Modal 2: Change Roles (FR-8.1, SoD-1) */}
      {roleModalAccount && (
        <Dialog
          hint={`Cập nhật quyền hạn trực tiếp cho ${roleModalAccount.name} (${roleModalAccount.employeeCode})`}
          onClose={() => setRoleModalAccount(null)}
          title='Phân quyền Vai trò Tài khoản'
        >
          <div className='space-y-4 text-xs'>
            <Notice tone='warning'>
              Cổng quy tắc SoD-1: Việc gán vai trò có thể dẫn đến việc tự động định tuyến lại các bước phê duyệt đang chờ nếu người này là người duyệt được chỉ định.
            </Notice>

            <div className='space-y-2'>
              <p className='font-bold text-foreground'>Chọn các vai trò trực tiếp:</p>
              {[
                { id: 'IT_ADMIN', label: 'Quản trị viên CNTT (IT_ADMIN)', desc: 'Cấp phát, quản lý seat, import log' },
                { id: 'FINANCE', label: 'Tài chính (FINANCE)', desc: 'Tạo Cost Center, quản trị ngân sách' },
                { id: 'SPENDING_APPROVER', label: 'Người duyệt chi (SPENDING_APPROVER)', desc: 'Phê duyệt chi tiêu vượt ngưỡng' },
                { id: 'MANAGER', label: 'Quản lý phê duyệt (MANAGER)', desc: 'Duyệt yêu cầu phần mềm cho team' }
              ].map((r) => {
                const checked = selectedRoles.includes(r.id)
                return (
                  <label
                    className='flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition hover:bg-surface-subtle'
                    key={r.id}
                  >
                    <input
                      checked={checked}
                      className='mt-0.5 rounded border-border text-primary focus:ring-primary'
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, r.id])
                        } else {
                          setSelectedRoles(selectedRoles.filter((item) => item !== r.id))
                        }
                      }}
                      type='checkbox'
                    />
                    <div>
                      <span className='font-bold text-foreground'>{r.label}</span>
                      <p className='text-[0.7rem] text-muted-foreground'>{r.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                className='rounded-xl border border-border px-4 py-2 font-bold text-foreground hover:bg-surface-subtle'
                onClick={() => setRoleModalAccount(null)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90'
                onClick={handleSaveRoles}
                type='button'
              >
                Lưu thay đổi & Ghi Audit Trail
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Modal 3: SYS-04 Blocked Boundary Screen (FR-8.8, SYS-04) */}
      {sys04BlockedModal.open && (
        <Dialog
          hint='Hành động đã bị chặn bởi Cổng quy tắc SoD của hệ thống (SYS-04).'
          onClose={() => setSys04BlockedModal({ open: false, reason: '' })}
          title='SYS-04: Thao tác Bị Từ chối'
        >
          <div className='space-y-4 text-xs'>
            <div className='flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-danger'>
              <ShieldAlert className='mt-0.5 size-6 shrink-0' />
              <div>
                <h3 className='font-bold text-foreground'>Vi phạm Ranh giới Vai trò Super Admin</h3>
                <p className='mt-1 text-xs text-muted-foreground'>{sys04BlockedModal.reason}</p>
              </div>
            </div>

            <p className='text-muted-foreground'>
              Để thay đổi người nắm quyền Super Admin, vui lòng thực hiện qua quy trình <strong>Chuyển giao vai trò (ADM-22)</strong> thay vì sửa đổi tài khoản trực tiếp.
            </p>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                className='rounded-xl bg-surface-subtle px-4 py-2 font-bold text-foreground hover:bg-surface'
                onClick={() => setSys04BlockedModal({ open: false, reason: '' })}
                type='button'
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
