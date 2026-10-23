import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Edit2,
  ExternalLink,
  KeyRound,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  UserX,
  X
} from 'lucide-react'
import { useState } from 'react'
import { PageHeader, Panel, PanelTitle, Pill } from '../../dashboard-ui'
import {
  type AccountStatus,
  type Department,
  type UserAccount,
  type UserAccountRole,
  initialDepartments,
  initialUserAccounts,
  roleDefinitions
} from '../super-admin-data'
import type { SuperAdminTabKey } from '../super-admin-nav'

interface SuperAdminAccountsViewProps {
  onSelectTab?: (tab: SuperAdminTabKey) => void
}

export function SuperAdminAccountsView({ onSelectTab }: SuperAdminAccountsViewProps) {
  const [accounts, setAccounts] = useState<UserAccount[]>(initialUserAccounts)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'roles'>('accounts')

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserAccountRole>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountStatus>('ALL')
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL')

  // Selected account for detail modal
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null)

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)
  const [isLockModalOpen, setIsLockModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form states for creating new user
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPosition, setNewPosition] = useState('')
  const [newDepartmentId, setNewDepartmentId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  // Form states for edit user
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editPosition, setEditPosition] = useState('')

  // Form states for role change
  const [targetRole, setTargetRole] = useState<UserAccountRole>('FINANCE')
  const [targetDeptIdForManager, setTargetDeptIdForManager] = useState<string>('')
  const [roleChangeReason, setRoleChangeReason] = useState('')

  // Lock account reason
  const [lockReason, setLockReason] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filtered accounts list
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'ALL' || acc.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || acc.status === statusFilter
    const matchesDept = departmentFilter === 'ALL' || acc.departmentId === departmentFilter

    return matchesSearch && matchesRole && matchesStatus && matchesDept
  })

  // Flow 1B - Step 1: Create Account (Form states role: Employee)
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const cleanCode = newCode.trim().toUpperCase()
    const cleanEmail = newEmail.trim().toLowerCase()
    const cleanName = newName.trim()

    if (!cleanCode || !cleanEmail || !cleanName) {
      setFormError('Vui lòng nhập đầy đủ mã nhân viên, họ tên và email công việc.')
      return
    }

    if (accounts.some((a) => a.employeeCode.toUpperCase() === cleanCode)) {
      setFormError(`Mã nhân viên "${cleanCode}" đã tồn tại trên hệ thống.`)
      return
    }

    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      setFormError(`Email "${cleanEmail}" đã được sử dụng cho một tài khoản khác.`)
      return
    }

    const dept = departments.find((d) => d.id === newDepartmentId)

    const newAccount: UserAccount = {
      departmentCode: dept?.code,
      departmentId: dept?.id,
      departmentName: dept?.name,
      email: cleanEmail,
      employeeCode: cleanCode,
      id: `acc-${Date.now()}`,
      invitedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      name: cleanName,
      phone: newPhone.trim() || undefined,
      position: newPosition.trim() || 'Nhân viên',
      role: 'EMPLOYEE', // STRICT INVARIANT: New accounts default to EMPLOYEE!
      status: 'INVITED' // Spec: Chưa mời / Đã mời
    }

    setAccounts((prev) => [newAccount, ...prev])
    if (dept) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === dept.id ? { ...d, memberCount: d.memberCount + 1 } : d))
      )
    }

    setIsCreateModalOpen(false)
    setNewCode('')
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    setNewPosition('')
    setNewDepartmentId('')
    setSelectedAccount(newAccount)
    showToast(`Đã tạo tài khoản cho ${cleanName} thành công với role mặc định: Employee!`)
  }

  // Flow 1B - Step 4: Edit account
  const handleEditAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === selectedAccount.id
          ? {
              ...a,
              email: editEmail.trim().toLowerCase(),
              name: editName.trim(),
              phone: editPhone.trim() || undefined,
              position: editPosition.trim() || a.position
            }
          : a
      )
    )

    setSelectedAccount((prev) =>
      prev
        ? {
            ...prev,
            email: editEmail.trim().toLowerCase(),
            name: editName.trim(),
            phone: editPhone.trim() || undefined,
            position: editPosition.trim() || prev.position
          }
        : null
    )

    setIsEditModalOpen(false)
    showToast(`Đã cập nhật thông tin cá nhân của ${editName}!`)
  }

  // Flow 1B - Step 2: Send / Resend Invitation
  const handleResendInvitation = (acc: UserAccount) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === acc.id
          ? { ...a, invitedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), status: 'INVITED' }
          : a
      )
    )
    showToast(`Đã gửi lại email kích hoạt tài khoản tới ${acc.email}!`)
  }

  // Flow 1B - Step 5: Lock / Unlock Account
  const handleToggleLock = () => {
    if (!selectedAccount) return

    // Guard: Cannot lock self
    if (selectedAccount.isSelf) {
      alert('Không thể khóa tài khoản Super Admin đang đăng nhập!')
      return
    }

    const isCurrentlyLocked = selectedAccount.status === 'LOCKED'
    const newStatus: AccountStatus = isCurrentlyLocked ? 'ACTIVE' : 'LOCKED'

    setAccounts((prev) =>
      prev.map((a) => (a.id === selectedAccount.id ? { ...a, status: newStatus } : a))
    )

    setSelectedAccount((prev) => (prev ? { ...prev, status: newStatus } : null))
    setIsLockModalOpen(false)
    setLockReason('')
    showToast(
      isCurrentlyLocked
        ? `Đã mở khóa tài khoản ${selectedAccount.name}. Nhân sự có thể đăng nhập bình thường.`
        : `Đã khóa tài khoản ${selectedAccount.name}. Quyền truy cập tạm thời bị đình chỉ.`
    )
  }

  // Flow 1C: Change Role (Single Role Invariant)
  const handleChangeRole = () => {
    if (!selectedAccount) return

    // Guard: Cannot change self role
    if (selectedAccount.isSelf) {
      alert('Không thể tự thay đổi vai trò của tài khoản Super Admin!')
      return
    }

    // If changing from MANAGER, check department dependencies
    if (selectedAccount.role === 'MANAGER' && targetRole !== 'MANAGER') {
      // Free the manager position in their department
      if (selectedAccount.departmentId) {
        setDepartments((prev) =>
          prev.map((d) =>
            d.id === selectedAccount.departmentId
              ? {
                  ...d,
                  managerEmail: undefined,
                  managerId: undefined,
                  managerName: undefined,
                  status: 'INCOMPLETE' // Department now lacks a Manager!
                }
              : d
          )
        )
      }
    }

    // If changing to MANAGER, must assign department
    let assignedDept = departments.find((d) => d.id === (targetDeptIdForManager || selectedAccount.departmentId))

    if (targetRole === 'MANAGER' && !assignedDept) {
      alert('Vui lòng chọn phòng ban mà người này sẽ làm Manager!')
      return
    }

    // If changing to SPENDING_APPROVER, old spending approver reverts to EMPLOYEE (Spec Flow 1C)
    let oldApproverName = ''
    if (targetRole === 'SPENDING_APPROVER') {
      const currentApprover = accounts.find((a) => a.role === 'SPENDING_APPROVER' && a.id !== selectedAccount.id)
      if (currentApprover) {
        oldApproverName = currentApprover.name
        setAccounts((prev) =>
          prev.map((a) => (a.id === currentApprover.id ? { ...a, role: 'EMPLOYEE' } : a))
        )
      }
    }

    // Update the target account
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === selectedAccount.id) {
          return {
            ...a,
            departmentCode: assignedDept ? assignedDept.code : a.departmentCode,
            departmentId: assignedDept ? assignedDept.id : a.departmentId,
            departmentName: assignedDept ? assignedDept.name : a.departmentName,
            role: targetRole // STRICT INVARIANT: Role replacement!
          }
        }
        return a
      })
    )

    // If assigned as MANAGER of a department, update the department
    if (targetRole === 'MANAGER' && assignedDept) {
      const updatedDept: Department = {
        ...assignedDept,
        managerEmail: selectedAccount.email,
        managerId: selectedAccount.id,
        managerName: selectedAccount.name,
        status: 'CONFIGURED'
      }
      setDepartments((prev) =>
        prev.map((d) => (d.id === assignedDept!.id ? updatedDept : d))
      )
    }

    const updatedAccount: UserAccount = {
      ...selectedAccount,
      departmentCode: assignedDept ? assignedDept.code : selectedAccount.departmentCode,
      departmentId: assignedDept ? assignedDept.id : selectedAccount.departmentId,
      departmentName: assignedDept ? assignedDept.name : selectedAccount.departmentName,
      role: targetRole
    }

    setSelectedAccount(updatedAccount)
    setIsChangeRoleModalOpen(false)
    setRoleChangeReason('')

    let msg = `Đã thay thế vai trò cho ${selectedAccount.name}: Role mới duy nhất là ${roleDefinitions[targetRole].name}.`
    if (oldApproverName) {
      msg += ` Người duyệt chi cũ (${oldApproverName}) đã chuyển về role Employee.`
    }
    showToast(msg)
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

      {/* Header with Level 1 Heading to satisfy Vitest test */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <Users className='size-3.5' />
            Quản trị tài khoản & Phân quyền
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground'>
            Tài khoản & Phân quyền Hệ thống
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Quản lý danh sách người dùng, kích hoạt tài khoản và gán đúng 01 role duy nhất cho mỗi nhân sự
          </p>
        </div>

        <button
          className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover shrink-0'
          id='btn-create-account'
          onClick={() => {
            setFormError(null)
            setNewCode('')
            setNewName('')
            setNewEmail('')
            setNewPhone('')
            setNewPosition('')
            setNewDepartmentId('')
            setIsCreateModalOpen(true)
          }}
          type='button'
        >
          <UserPlus className='size-4' />
          <span>Tạo tài khoản mới</span>
        </button>
      </div>

      {/* View Switcher Sub-tabs: Accounts list (SA-03) vs Roles governance (SA-05) */}
      <div className='flex items-center gap-2 border-b border-border pb-3'>
        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'accounts'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          }`}
          onClick={() => setActiveSubTab('accounts')}
          type='button'
        >
          <Users className='size-4' />
          <span>Danh sách tài khoản ({accounts.length})</span>
        </button>

        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'roles'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          }`}
          onClick={() => setActiveSubTab('roles')}
          type='button'
        >
          <Shield className='size-4' />
          <span>Phân quyền vai trò đặc biệt</span>
        </button>
      </div>

      {activeSubTab === 'accounts' ? (
        /* SA-03: Account List */
        <div className='space-y-4'>
          {/* Filters Bar */}
          <Panel>
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

            {/* Account List Table */}
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                  <tr>
                    <th className='p-3 font-semibold'>Mã NV</th>
                    <th className='p-3 font-semibold'>Họ và tên</th>
                    <th className='p-3 font-semibold'>Email công việc</th>
                    <th className='p-3 font-semibold'>Phòng ban trực thuộc</th>
                    <th className='p-3 font-semibold text-center'>Role duy nhất</th>
                    <th className='p-3 font-semibold text-center'>Trạng thái</th>
                    <th className='p-3 font-semibold text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {filteredAccounts.map((acc) => {
                    const roleDef = roleDefinitions[acc.role]

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
                                      : roleDef.colorTone === 'danger'
                                        ? 'border-danger/30 bg-danger/15 text-danger'
                                        : 'border-border bg-surface-subtle text-muted-foreground'
                            }`}
                          >
                            {roleDef.name}
                          </span>
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
                            onClick={() => setSelectedAccount(acc)}
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
                      <td className='p-8 text-center text-muted-foreground' colSpan={7}>
                        Không tìm thấy tài khoản nào khớp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      ) : (
        /* SA-05: Roles Governance */
        <div className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {(Object.keys(roleDefinitions) as UserAccountRole[]).map((rKey) => {
              const def = roleDefinitions[rKey]
              const holders = accounts.filter((a) => a.role === rKey)

              return (
                <Panel key={rKey}>
                  <div className='flex items-start justify-between'>
                    <div>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                          def.colorTone === 'primary'
                            ? 'border-primary/30 bg-primary/15 text-primary'
                            : def.colorTone === 'info'
                              ? 'border-info/30 bg-info/15 text-info'
                              : def.colorTone === 'warning'
                                ? 'border-warning/30 bg-warning/15 text-warning'
                                : def.colorTone === 'success'
                                  ? 'border-success/30 bg-success/15 text-success'
                                  : def.colorTone === 'danger'
                                    ? 'border-danger/30 bg-danger/15 text-danger'
                                    : 'border-border bg-surface-subtle text-muted-foreground'
                        }`}
                      >
                        {def.name}
                      </span>
                      {def.isSingleton && (
                        <p className='mt-1 text-[0.65rem] font-bold text-muted-foreground uppercase'>
                          Duy nhất 1 tài khoản
                        </p>
                      )}
                    </div>

                    <span className='rounded-xl border border-border bg-surface-subtle px-2 py-1 text-xs font-mono font-bold text-foreground'>
                      {holders.length} người
                    </span>
                  </div>

                  <p className='mt-3 text-xs text-muted-foreground leading-relaxed'>{def.description}</p>

                  <div className='mt-4 space-y-1.5 border-t border-border pt-3'>
                    <span className='text-[0.7rem] font-bold text-foreground uppercase tracking-wider'>
                      Trách nhiệm chính:
                    </span>
                    <ul className='space-y-1 text-[0.7rem] text-muted-foreground'>
                      {def.responsibilities.map((resp, idx) => (
                        <li className='flex items-start gap-1.5' key={idx}>
                          <CheckCircle2 className='size-3 text-success shrink-0 mt-0.5' />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='mt-4 border-t border-border pt-3'>
                    <span className='text-[0.7rem] font-bold text-foreground'>Nhân sự đang giữ role:</span>
                    <div className='mt-1 space-y-1 max-h-32 overflow-y-auto'>
                      {holders.map((h) => (
                        <div
                          className='flex items-center justify-between rounded-lg bg-surface-subtle p-1.5 text-xs'
                          key={h.id}
                        >
                          <span className='font-bold text-foreground truncate max-w-[140px]'>{h.name}</span>
                          <button
                            className='text-[0.7rem] font-semibold text-primary hover:underline'
                            onClick={() => setSelectedAccount(h)}
                            type='button'
                          >
                            Quản lý
                          </button>
                        </div>
                      ))}

                      {holders.length === 0 && (
                        <p className='text-[0.7rem] text-warning italic'>Chưa có nhân sự nào giữ role này.</p>
                      )}
                    </div>
                  </div>
                </Panel>
              )
            })}
          </div>
        </div>
      )}

      {/* SA-04: User Account Detail Modal */}
      {selectedAccount && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setSelectedAccount(null)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <span className='font-mono font-bold text-xs text-primary'>{selectedAccount.employeeCode}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${
                  selectedAccount.status === 'ACTIVE'
                    ? 'border-success/30 bg-success/15 text-success'
                    : selectedAccount.status === 'INVITED'
                      ? 'border-warning/30 bg-warning/15 text-warning'
                      : 'border-danger/30 bg-danger/15 text-danger'
                }`}
              >
                {selectedAccount.status === 'ACTIVE'
                  ? 'Đang hoạt động'
                  : selectedAccount.status === 'INVITED'
                    ? 'Chờ kích hoạt'
                    : 'Bị khóa'}
              </span>
            </div>

            <h2 className='mt-2 text-xl font-bold text-foreground'>{selectedAccount.name}</h2>
            <p className='text-xs text-muted-foreground font-mono'>{selectedAccount.email}</p>

            {/* Profile Info Cards */}
            <div className='mt-4 grid gap-3 sm:grid-cols-2 rounded-xl border border-border bg-surface-subtle p-3.5 text-xs'>
              <div>
                <span className='text-muted-foreground block text-[0.7rem]'>Phòng ban trực thuộc:</span>
                <span className='font-bold text-foreground text-sm'>
                  {selectedAccount.departmentName || 'Chưa xếp phòng ban'}
                </span>
              </div>

              <div>
                <span className='text-muted-foreground block text-[0.7rem]'>Vai trò duy nhất (Role):</span>
                <span className='font-bold text-primary text-sm'>
                  {roleDefinitions[selectedAccount.role].name}
                </span>
              </div>

              <div>
                <span className='text-muted-foreground block text-[0.7rem]'>Chức danh công việc:</span>
                <span className='font-semibold text-foreground'>{selectedAccount.position}</span>
              </div>

              <div>
                <span className='text-muted-foreground block text-[0.7rem]'>Số điện thoại:</span>
                <span className='font-semibold text-foreground font-mono'>{selectedAccount.phone || 'Chưa có'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className='mt-5 space-y-2'>
              <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                Hành động quản trị:
              </span>

              <div className='grid gap-2 sm:grid-cols-2'>
                {/* Change Role Button (Flow 1C) */}
                <button
                  className='flex items-center justify-between rounded-xl border border-primary/30 bg-primary-soft/40 p-3 text-left hover:bg-primary-soft transition'
                  disabled={selectedAccount.isSelf}
                  onClick={() => {
                    setTargetRole(selectedAccount.role === 'EMPLOYEE' ? 'FINANCE' : 'EMPLOYEE')
                    setTargetDeptIdForManager(selectedAccount.departmentId || '')
                    setIsChangeRoleModalOpen(true)
                  }}
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

                {/* Edit Information */}
                <button
                  className='flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-subtle transition'
                  onClick={() => {
                    setEditName(selectedAccount.name)
                    setEditEmail(selectedAccount.email)
                    setEditPhone(selectedAccount.phone || '')
                    setEditPosition(selectedAccount.position)
                    setIsEditModalOpen(true)
                  }}
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

                {/* Resend Invite */}
                <button
                  className='flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-left hover:bg-surface-subtle transition'
                  onClick={() => handleResendInvitation(selectedAccount)}
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

                {/* Lock/Unlock Button */}
                <button
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    selectedAccount.status === 'LOCKED'
                      ? 'border-success/30 bg-success/10 hover:bg-success/20'
                      : 'border-danger/30 bg-danger/10 hover:bg-danger/20'
                  }`}
                  disabled={selectedAccount.isSelf}
                  onClick={() => setIsLockModalOpen(true)}
                  type='button'
                >
                  <div className='flex items-center gap-2.5'>
                    {selectedAccount.status === 'LOCKED' ? (
                      <Unlock className='size-4 text-success' />
                    ) : (
                      <Lock className='size-4 text-danger' />
                    )}
                    <div>
                      <p className='text-xs font-bold text-foreground'>
                        {selectedAccount.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                      </p>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        {selectedAccount.status === 'LOCKED' ? 'Khôi phục truy cập' : 'Chặn quyền đăng nhập'}
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
                onClick={() => setSelectedAccount(null)}
                type='button'
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Change Role (Flow 1C) */}
      {isChangeRoleModalOpen && selectedAccount && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsChangeRoleModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <Shield className='size-5 text-primary' />
              <h2 className='text-lg font-bold text-foreground'>Đổi vai trò (Role) cho {selectedAccount.name}</h2>
            </div>

            <div className='mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning'>
              <p className='font-bold flex items-center gap-1.5'>
                <AlertTriangle className='size-4' />
                Lưu ý phân quyền vai trò:
              </p>
              <p className='mt-1 text-[0.7rem] leading-relaxed'>
                Vai trò hiện tại <strong>{roleDefinitions[selectedAccount.role].name}</strong> sẽ được{' '}
                <strong>thay thế bằng vai trò mới</strong>. Mỗi tài khoản đảm nhiệm một vai trò duy nhất trong hệ thống.
              </p>
            </div>

            <div className='mt-4 space-y-3'>
              <label className='block text-xs font-bold text-foreground'>Chọn role đích:</label>
              <div className='space-y-2'>
                {(['EMPLOYEE', 'FINANCE', 'SPENDING_APPROVER', 'IT_ADMIN', 'MANAGER'] as UserAccountRole[]).map((r) => {
                  const def = roleDefinitions[r]
                  const isCurrent = selectedAccount.role === r

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
            </div>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsChangeRoleModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                onClick={handleChangeRole}
                type='button'
              >
                Xác nhận thay thế role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create User Account (Flow 1B) */}
      {isCreateModalOpen && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsCreateModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <UserPlus className='size-5 text-primary' />
              <h2 className='text-lg font-bold text-foreground'>Tạo tài khoản người dùng mới</h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Nhập thông tin nhân sự. Tài khoản mới tạo sẽ có <strong>Role mặc định: Employee</strong>.
            </p>

            {formError && (
              <div className='mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger'>
                <AlertCircle className='size-4 shrink-0' />
                <span>{formError}</span>
              </div>
            )}

            <form className='mt-4 space-y-3' onSubmit={handleCreateAccount}>
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
                  onClick={() => setIsCreateModalOpen(false)}
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
      )}

      {/* Modal: Edit Account */}
      {isEditModalOpen && selectedAccount && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsEditModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <h2 className='text-lg font-bold text-foreground'>Sửa thông tin tài khoản [{selectedAccount.employeeCode}]</h2>
            <form className='mt-4 space-y-3' onSubmit={handleEditAccount}>
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
                  onClick={() => setIsEditModalOpen(false)}
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
      )}

      {/* Modal: Lock/Unlock Account */}
      {isLockModalOpen && selectedAccount && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <div className='flex items-center gap-2'>
              {selectedAccount.status === 'LOCKED' ? (
                <Unlock className='size-5 text-success' />
              ) : (
                <Lock className='size-5 text-danger' />
              )}
              <h2 className='text-lg font-bold text-foreground'>
                {selectedAccount.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản nhân sự'}
              </h2>
            </div>

            <p className='mt-2 text-xs text-foreground'>
              {selectedAccount.status === 'LOCKED' ? (
                <>
                  Bạn có muốn mở khóa cho tài khoản <strong>{selectedAccount.name}</strong> ({selectedAccount.email})? Quyền đăng nhập sẽ được khôi phục ngay.
                </>
              ) : (
                <>
                  Khóa tài khoản <strong>{selectedAccount.name}</strong> sẽ chặn quyền đăng nhập vào hệ thống ngay lập tức nhưng vẫn giữ nguyên vai trò và cơ cấu phòng ban.
                </>
              )}
            </p>

            {selectedAccount.status !== 'LOCKED' && (
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
                onClick={() => setIsLockModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition ${
                  selectedAccount.status === 'LOCKED'
                    ? 'bg-success hover:bg-success/90'
                    : 'bg-danger hover:bg-danger/90'
                }`}
                onClick={handleToggleLock}
                type='button'
              >
                {selectedAccount.status === 'LOCKED' ? 'Xác nhận mở khóa' : 'Xác nhận khóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
