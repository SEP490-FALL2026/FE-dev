import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Edit2,
  ExternalLink,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { PageHeader, Panel, PanelTitle, Pill } from '../../dashboard-ui'
import {
  type Department,
  type DepartmentStatus,
  type UserAccount,
  initialDepartments,
  initialUserAccounts,
  roleDefinitions
} from '../super-admin-data'
import type { SuperAdminTabKey } from '../super-admin-nav'

interface SuperAdminDepartmentsViewProps {
  onSelectTab?: (tab: SuperAdminTabKey) => void
}

export function SuperAdminDepartmentsView({ onSelectTab }: SuperAdminDepartmentsViewProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [users, setUsers] = useState<UserAccount[]>(initialUserAccounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | DepartmentStatus>('ALL')
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false)
  const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false)
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false)

  // Form states
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Manager assignment state
  const [selectedManagerId, setSelectedManagerId] = useState<string>('')

  // Add members state
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filtered departments list
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.managerName && d.managerName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Members of currently selected department
  const currentDeptMembers = selectedDept
    ? users.filter((u) => u.departmentId === selectedDept.id)
    : []

  // Eligible users for Manager picker: Active accounts
  const eligibleManagers = users.filter((u) => u.status === 'ACTIVE' && u.role !== 'SUPER_ADMIN')

  // Unassigned users for adding to department
  const unassignedUsers = users.filter((u) => !u.departmentId && u.status === 'ACTIVE')

  // Flow 1A - Step 1: Create Department (SA-01 -> SA-02)
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const cleanCode = newCode.trim().toUpperCase()
    const cleanName = newName.trim()

    if (!cleanCode || !cleanName) {
      setFormError('Vui lòng nhập đầy đủ mã và tên phòng ban.')
      return
    }

    if (departments.some((d) => d.code.toUpperCase() === cleanCode)) {
      setFormError(`Mã phòng ban "${cleanCode}" đã tồn tại trên hệ thống.`)
      return
    }

    if (departments.some((d) => d.name.toLowerCase() === cleanName.toLowerCase())) {
      setFormError(`Tên phòng ban "${cleanName}" đã tồn tại trên hệ thống.`)
      return
    }

    const newDept: Department = {
      code: cleanCode,
      createdAt: new Date().toISOString().split('T')[0],
      description: newDesc.trim() || 'Chưa có mô tả chức năng.',
      id: `dept-${Date.now()}`,
      memberCount: 0,
      name: cleanName,
      status: 'INCOMPLETE' // Spec rule: Chưa có Manager là Chưa hoàn tất
    }

    setDepartments((prev) => [newDept, ...prev])
    setIsCreateModalOpen(false)
    setNewCode('')
    setNewName('')
    setNewDesc('')
    setSelectedDept(newDept) // Mở thẳng SA-02 với trạng thái Chưa hoàn tất: chưa có Manager
    showToast(`Đã tạo phòng ban ${cleanName} thành công! Trạng thái: Chưa hoàn tất (chưa có Manager).`)
  }

  // Flow 1A - Step 3: Edit Department
  const handleEditDepartment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDept) return

    const cleanName = newName.trim()
    if (!cleanName) {
      setFormError('Tên phòng ban không được để trống.')
      return
    }

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id
          ? { ...d, description: newDesc.trim(), name: cleanName }
          : d
      )
    )

    setSelectedDept((prev) => (prev ? { ...prev, description: newDesc.trim(), name: cleanName } : null))
    setIsEditModalOpen(false)
    showToast(`Đã cập nhật thông tin phòng ban ${cleanName}!`)
  }

  // Flow 1A - Step 4: Deprecate or Delete Department
  const handleDeprecateDepartment = () => {
    if (!selectedDept) return

    // Spec rule: If has members, can only Deprecate (Ngừng dùng) to preserve history
    if (selectedDept.memberCount > 0) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === selectedDept.id ? { ...d, status: 'DEPRECATED' } : d))
      )
      setSelectedDept((prev) => (prev ? { ...prev, status: 'DEPRECATED' } : null))
      showToast(`Đã chuyển phòng ban ${selectedDept.name} sang trạng thái Ngừng dùng để bảo toàn lịch sử!`)
    } else {
      setDepartments((prev) => prev.filter((d) => d.id !== selectedDept.id))
      setSelectedDept(null)
      showToast(`Đã xóa phòng ban ${selectedDept.name}!`)
    }
    setIsDeprecateModalOpen(false)
  }

  // Flow 2 - Step 2: Assign or Replace Manager (SA-06 / SA-02)
  const handleAssignManager = () => {
    if (!selectedDept || !selectedManagerId) return

    const targetUser = users.find((u) => u.id === selectedManagerId)
    if (!targetUser) return

    // Previous manager if any
    const prevManagerId = selectedDept.managerId

    // 1. Update user roles: Selected user becomes MANAGER of this dept
    // If replacing old manager: Old manager becomes EMPLOYEE and remains member of dept (Spec Section 7)
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUser.id) {
          return {
            ...u,
            departmentCode: selectedDept.code,
            departmentId: selectedDept.id,
            departmentName: selectedDept.name,
            role: 'MANAGER' // STRICT INVARIANT: Exactly 1 role!
          }
        }
        if (prevManagerId && u.id === prevManagerId) {
          return {
            ...u,
            role: 'EMPLOYEE' // Reverts to EMPLOYEE, stays member of department
          }
        }
        return u
      })
    )

    // 2. Update department manager and status to CONFIGURED
    const updatedDept: Department = {
      ...selectedDept,
      managerEmail: targetUser.email,
      managerId: targetUser.id,
      managerName: targetUser.name,
      status: 'CONFIGURED'
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === selectedDept.id ? updatedDept : d))
    )
    setSelectedDept(updatedDept)
    setIsAssignManagerModalOpen(false)
    showToast(`Đã chỉ định ${targetUser.name} làm Manager phòng ${selectedDept.name}! Role mới: Manager.`)
  }

  // Flow 2 - Step 3: Add Members to Department
  const handleAddMembers = () => {
    if (!selectedDept || selectedMemberIds.length === 0) return

    setUsers((prev) =>
      prev.map((u) =>
        selectedMemberIds.includes(u.id)
          ? {
              ...u,
              departmentCode: selectedDept.code,
              departmentId: selectedDept.id,
              departmentName: selectedDept.name
              // Spec: Xếp phòng KHÔNG đổi role của họ!
            }
          : u
      )
    )

    const addedCount = selectedMemberIds.length
    const updatedDept: Department = {
      ...selectedDept,
      memberCount: selectedDept.memberCount + addedCount
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === selectedDept.id ? updatedDept : d))
    )
    setSelectedDept(updatedDept)
    setSelectedMemberIds([])
    setIsAddMembersModalOpen(false)
    showToast(`Đã xếp ${addedCount} nhân sự vào phòng ${selectedDept.name}!`)
  }

  // Flow 2 - Step 5: Remove Member from Department
  const handleRemoveMember = (user: UserAccount) => {
    if (!selectedDept) return

    // If removing the current Manager, must block and require assigning new Manager first
    if (selectedDept.managerId === user.id) {
      alert(`Không thể gỡ Manager hiện tại (${user.name}) khỏi phòng. Vui lòng chỉ định Manager mới thay thế trước khi gỡ.`)
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn gỡ nhân sự ${user.name} khỏi phòng ${selectedDept.name}?`)) {
      return
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, departmentCode: undefined, departmentId: undefined, departmentName: undefined }
          : u
      )
    )

    const updatedDept: Department = {
      ...selectedDept,
      memberCount: Math.max(0, selectedDept.memberCount - 1)
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === selectedDept.id ? updatedDept : d))
    )
    setSelectedDept(updatedDept)
    showToast(`Đã gỡ nhân sự ${user.name} khỏi phòng ${selectedDept.name}!`)
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

      {/* Main View: Department List (SA-01) or Detail (SA-02) */}
      {!selectedDept ? (
        /* SA-01: Department List */
        <div className='space-y-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
                <Building2 className='size-3.5' />
                Khởi tạo cơ cấu tổ chức
              </div>
              <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>Danh sách Phòng ban</h1>
              <p className='mt-1 text-sm text-muted-foreground'>
                Khởi tạo các phòng ban, theo dõi trạng thái cấu hình Manager và phân bổ nhân sự trực thuộc
              </p>
            </div>

            <button
              className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover shrink-0'
              id='btn-create-department'
              onClick={() => {
                setFormError(null)
                setNewCode('')
                setNewName('')
                setNewDesc('')
                setIsCreateModalOpen(true)
              }}
              type='button'
            >
              <Plus className='size-4' />
              <span>Tạo phòng ban mới</span>
            </button>
          </div>

          {/* Search & Filters */}
          <Panel>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                <input
                  className='w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Tìm kiếm theo mã, tên phòng hoặc Manager...'
                  type='search'
                  value={searchTerm}
                />
              </div>

              <div className='flex items-center gap-1.5 rounded-xl border border-border bg-surface p-1 text-xs'>
                {(['ALL', 'CONFIGURED', 'INCOMPLETE', 'DEPRECATED'] as const).map((st) => (
                  <button
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      statusFilter === st
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                    }`}
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    type='button'
                  >
                    {st === 'ALL'
                      ? 'Tất cả'
                      : st === 'CONFIGURED'
                        ? 'Đã cấu hình'
                        : st === 'INCOMPLETE'
                          ? 'Chưa có Manager'
                          : 'Ngừng dùng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Table */}
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                  <tr>
                    <th className='p-3 font-semibold'>Mã phòng</th>
                    <th className='p-3 font-semibold'>Tên phòng ban</th>
                    <th className='p-3 font-semibold'>Manager phụ trách</th>
                    <th className='p-3 font-semibold text-center'>Số thành viên</th>
                    <th className='p-3 font-semibold text-center'>Trạng thái cấu hình</th>
                    <th className='p-3 font-semibold text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {filteredDepartments.map((dept) => {
                    const isConfigured = dept.status === 'CONFIGURED'
                    const isDeprecated = dept.status === 'DEPRECATED'

                    return (
                      <tr className='transition hover:bg-surface-subtle/60' key={dept.id}>
                        <td className='p-3 font-mono font-bold text-primary'>{dept.code}</td>
                        <td className='p-3 font-bold text-foreground'>{dept.name}</td>
                        <td className='p-3'>
                          {dept.managerName ? (
                            <div className='flex items-center gap-1.5'>
                              <UserCheck className='size-3.5 text-info' />
                              <span className='font-semibold text-foreground'>{dept.managerName}</span>
                            </div>
                          ) : (
                            <span className='inline-flex items-center gap-1 font-bold text-warning'>
                              <AlertTriangle className='size-3' />
                              Chưa có Manager
                            </span>
                          )}
                        </td>
                        <td className='p-3 text-center font-mono font-bold text-foreground'>
                          {dept.memberCount}
                        </td>
                        <td className='p-3 text-center'>
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                              isConfigured
                                ? 'border-success/30 bg-success/15 text-success'
                                : isDeprecated
                                  ? 'border-border bg-surface-subtle text-muted-foreground'
                                  : 'border-warning/30 bg-warning/15 text-warning'
                            }`}
                          >
                            {isConfigured
                              ? 'Đã cấu hình'
                              : isDeprecated
                                ? 'Ngừng dùng'
                                : 'Chưa hoàn tất: chưa có Manager'}
                          </span>
                        </td>
                        <td className='p-3 text-right'>
                          <button
                            className='inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-primary hover:bg-surface-subtle transition'
                            onClick={() => setSelectedDept(dept)}
                            type='button'
                          >
                            <span>Chi tiết</span>
                            <ChevronRight className='size-3.5' />
                          </button>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredDepartments.length === 0 && (
                    <tr>
                      <td className='p-8 text-center text-muted-foreground' colSpan={6}>
                        Không tìm thấy phòng ban nào khớp với điều kiện tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      ) : (
        /* SA-02: Department Detail View */
        <div className='space-y-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <button
                className='grid size-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground transition'
                onClick={() => setSelectedDept(null)}
                title='Quay lại danh sách phòng ban'
                type='button'
              >
                <ArrowLeft className='size-4' />
              </button>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='font-mono font-bold text-primary text-sm'>[{selectedDept.code}]</span>
                  <h1 className='text-2xl font-bold tracking-tight text-foreground'>{selectedDept.name}</h1>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${
                      selectedDept.status === 'CONFIGURED'
                        ? 'border-success/30 bg-success/15 text-success'
                        : selectedDept.status === 'DEPRECATED'
                          ? 'border-border bg-surface-subtle text-muted-foreground'
                          : 'border-warning/30 bg-warning/15 text-warning'
                    }`}
                  >
                    {selectedDept.status === 'CONFIGURED'
                      ? 'Đã cấu hình'
                      : selectedDept.status === 'DEPRECATED'
                        ? 'Ngừng dùng'
                        : 'Chưa hoàn tất: chưa có Manager'}
                  </span>
                </div>
                <p className='mt-0.5 text-xs text-muted-foreground'>{selectedDept.description}</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle transition'
                onClick={() => {
                  setNewName(selectedDept.name)
                  setNewDesc(selectedDept.description)
                  setIsEditModalOpen(true)
                }}
                type='button'
              >
                <Edit2 className='size-3.5' />
                Sửa thông tin
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/20 transition'
                onClick={() => setIsDeprecateModalOpen(true)}
                type='button'
              >
                <Trash2 className='size-3.5' />
                {selectedDept.memberCount > 0 ? 'Ngừng dùng phòng' : 'Xóa phòng ban'}
              </button>
            </div>
          </div>

          {/* Department Manager Card */}
          <Panel>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-start gap-3'>
                <span className='grid size-11 place-items-center rounded-2xl bg-info/15 text-info'>
                  <UserCheck className='size-5' />
                </span>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                      Người quản lý phòng ban (Manager)
                    </span>
                    <span className='rounded bg-info/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-info'>
                      Tối đa 1 Manager
                    </span>
                  </div>

                  {selectedDept.managerName ? (
                    <div className='mt-1'>
                      <p className='text-base font-bold text-foreground'>{selectedDept.managerName}</p>
                      <p className='text-xs text-muted-foreground font-mono'>{selectedDept.managerEmail}</p>
                    </div>
                  ) : (
                    <div className='mt-1'>
                      <p className='text-sm font-bold text-warning flex items-center gap-1.5'>
                        <AlertTriangle className='size-4' />
                        Phòng ban chưa có Manager
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Nhân viên trong phòng không thể gửi yêu cầu phê duyệt cho đến khi chỉ định Manager.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition shrink-0'
                onClick={() => {
                  setSelectedManagerId(selectedDept.managerId || '')
                  setIsAssignManagerModalOpen(true)
                }}
                type='button'
              >
                <UserCheck className='size-3.5' />
                <span>{selectedDept.managerId ? 'Thay đổi Manager' : 'Chỉ định Manager'}</span>
              </button>
            </div>
          </Panel>

          {/* Members of Department */}
          <Panel>
            <PanelTitle
              action={
                <button
                  className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition shrink-0'
                  onClick={() => {
                    setSelectedMemberIds([])
                    setIsAddMembersModalOpen(true)
                  }}
                  type='button'
                >
                  <UserPlus className='size-3.5' />
                  <span>Thêm thành viên</span>
                </button>
              }
              hint='Xếp nhân viên vào phòng ban không làm thay đổi vai trò (role) của họ'
              title={`Danh sách thành viên trực thuộc (${currentDeptMembers.length})`}
            />

            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                  <tr>
                    <th className='p-3 font-semibold'>Mã NV</th>
                    <th className='p-3 font-semibold'>Họ và tên</th>
                    <th className='p-3 font-semibold'>Email công việc</th>
                    <th className='p-3 font-semibold text-center'>Role duy nhất</th>
                    <th className='p-3 font-semibold text-center'>Trạng thái</th>
                    <th className='p-3 font-semibold text-right'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {currentDeptMembers.map((member) => {
                    const isManager = member.id === selectedDept.managerId
                    const roleDef = roleDefinitions[member.role]

                    return (
                      <tr className='transition hover:bg-surface-subtle/60' key={member.id}>
                        <td className='p-3 font-mono font-bold text-muted-foreground'>{member.employeeCode}</td>
                        <td className='p-3'>
                          <div className='flex items-center gap-1.5'>
                            <span className='font-bold text-foreground'>{member.name}</span>
                            {isManager && (
                              <span className='rounded bg-info/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-info'>
                                Trưởng phòng
                              </span>
                            )}
                          </div>
                          <span className='text-[0.7rem] text-muted-foreground'>{member.position}</span>
                        </td>
                        <td className='p-3 font-mono text-muted-foreground'>{member.email}</td>
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
                                      : 'border-border bg-surface-subtle text-muted-foreground'
                            }`}
                          >
                            {roleDef.name}
                          </span>
                        </td>
                        <td className='p-3 text-center'>
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                              member.status === 'ACTIVE'
                                ? 'border-success/30 bg-success/15 text-success'
                                : member.status === 'INVITED'
                                  ? 'border-warning/30 bg-warning/15 text-warning'
                                  : 'border-danger/30 bg-danger/15 text-danger'
                            }`}
                          >
                            {member.status === 'ACTIVE'
                              ? 'Đang hoạt động'
                              : member.status === 'INVITED'
                                ? 'Chờ kích hoạt'
                                : 'Bị khóa'}
                          </span>
                        </td>
                        <td className='p-3 text-right'>
                          {!isManager ? (
                            <button
                              className='inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1 text-[0.7rem] font-semibold text-danger hover:bg-danger/20 transition'
                              onClick={() => handleRemoveMember(member)}
                              type='button'
                            >
                              <UserMinus className='size-3' />
                              Gỡ
                            </button>
                          ) : (
                            <span className='text-[0.7rem] text-muted-foreground italic'>Cần thay Manager trước</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}

                  {currentDeptMembers.length === 0 && (
                    <tr>
                      <td className='p-8 text-center text-muted-foreground' colSpan={6}>
                        Phòng ban chưa có thành viên nào. Bấm <strong>Thêm thành viên</strong> để xếp nhân sự vào phòng.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {/* Modal: Create Department */}
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
              <span className='rounded-full border border-primary/20 bg-primary-soft p-1.5 text-primary'>
                <Building2 className='size-4' />
              </span>
              <h2 className='text-lg font-bold text-foreground'>Tạo phòng ban mới</h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Nhập mã và tên phòng ban. Manager và thành viên được xếp sau ở bước cấu hình nhân sự.
            </p>

            {formError && (
              <div className='mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger'>
                <AlertCircle className='size-4 shrink-0' />
                <span>{formError}</span>
              </div>
            )}

            <form className='mt-4 space-y-4' onSubmit={handleCreateDepartment}>
              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  Mã phòng ban (Viết hoa, duy nhất) <span className='text-danger'>*</span>
                </label>
                <input
                  className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold focus:border-primary focus:outline-none uppercase'
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder='Ví dụ: ENG, FIN, HR, MKT...'
                  required
                  type='text'
                  value={newCode}
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  Tên phòng ban <span className='text-danger'>*</span>
                </label>
                <input
                  className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder='Ví dụ: Khối CNTT & Phần mềm'
                  required
                  type='text'
                  value={newName}
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  Mô tả / Chức năng nhiệm vụ
                </label>
                <textarea
                  className='w-full rounded-xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none'
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder='Mô tả chức năng chính của phòng ban trong tổ chức...'
                  rows={3}
                  value={newDesc}
                />
              </div>

              <div className='rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning flex items-start gap-2'>
                <AlertTriangle className='size-4 shrink-0 mt-0.5' />
                <span>
                  Sau khi tạo, phòng ban sẽ có trạng thái <strong>Chưa hoàn tất: chưa có Manager</strong> cho tới khi bạn chỉ định Manager phụ trách.
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
                  className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                  type='submit'
                >
                  <Plus className='size-3.5' />
                  <span>Tạo phòng ban</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Department */}
      {isEditModalOpen && selectedDept && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsEditModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <h2 className='text-lg font-bold text-foreground'>Sửa thông tin phòng ban [{selectedDept.code}]</h2>
            <form className='mt-4 space-y-4' onSubmit={handleEditDepartment}>
              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>Tên phòng ban</label>
                <input
                  className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  type='text'
                  value={newName}
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>Mô tả chức năng</label>
                <textarea
                  className='w-full rounded-xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none'
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  value={newDesc}
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

      {/* Modal: Deprecate or Delete Department */}
      {isDeprecateModalOpen && selectedDept && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <div className='flex items-center gap-2 text-danger'>
              <AlertTriangle className='size-5' />
              <h2 className='text-lg font-bold'>
                {selectedDept.memberCount > 0 ? 'Xác nhận ngừng dùng phòng ban' : 'Xác nhận xóa phòng ban'}
              </h2>
            </div>

            <p className='mt-3 text-xs text-foreground'>
              {selectedDept.memberCount > 0 ? (
                <>
                  Phòng ban <strong>{selectedDept.name}</strong> hiện đang có{' '}
                  <strong>{selectedDept.memberCount} thành viên</strong>. Theo quy tắc kiểm toán, phòng đã có dữ liệu sẽ được chuyển sang trạng thái <strong>Ngừng dùng (Deprecated)</strong> để bảo toàn lịch sử yêu cầu.
                </>
              ) : (
                <>
                  Phòng ban <strong>{selectedDept.name}</strong> chưa có thành viên hoặc phát sinh yêu cầu. Bạn có thể xóa hoàn toàn khỏi hệ thống.
                </>
              )}
            </p>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsDeprecateModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-danger/90 transition'
                onClick={handleDeprecateDepartment}
                type='button'
              >
                {selectedDept.memberCount > 0 ? 'Ngừng dùng phòng ban' : 'Xóa phòng ban'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Assign or Replace Manager */}
      {isAssignManagerModalOpen && selectedDept && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsAssignManagerModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <UserCheck className='size-5 text-primary' />
              <h2 className='text-lg font-bold text-foreground'>
                {selectedDept.managerId ? 'Thay đổi Manager' : 'Chỉ định Manager'} cho {selectedDept.name}
              </h2>
            </div>

            <div className='mt-3 rounded-xl border border-info/30 bg-info/10 p-3 text-xs text-info'>
              <p className='font-bold'>Lưu ý khi chỉ định:</p>
              <ul className='mt-1 list-disc pl-4 space-y-0.5 text-[0.7rem]'>
                <li>Người được chọn sẽ nhận vai trò <strong>Quản lý phòng ban</strong> (Manager).</li>
                {selectedDept.managerId && (
                  <li>
                    Quản lý hiện tại ({selectedDept.managerName}) sẽ chuyển về vai trò <strong>Nhân viên</strong> và tiếp tục thuộc phòng ban này.
                  </li>
                )}
                <li>Mỗi phòng ban có tối đa <strong>01 Quản lý</strong> phụ trách phê duyệt.</li>
              </ul>
            </div>

            <div className='mt-4'>
              <label className='block text-xs font-bold text-foreground mb-1'>
                Chọn nhân sự làm Manager:
              </label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setSelectedManagerId(e.target.value)}
                value={selectedManagerId}
              >
                <option value=''>-- Chọn nhân sự đủ điều kiện --</option>
                {eligibleManagers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.employeeCode}) — Role hiện tại: {u.role} ({u.departmentName || 'Chưa có phòng'})
                  </option>
                ))}
              </select>
            </div>

            {selectedManagerId && (
              <div className='mt-4 rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                <span className='font-bold text-foreground'>Xem trước thay đổi (Preview):</span>
                <p className='mt-1 text-muted-foreground'>
                  Tài khoản <strong>{users.find((u) => u.id === selectedManagerId)?.name}</strong>:
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <span className='rounded bg-surface px-2 py-0.5 text-[0.7rem] font-bold text-muted-foreground line-through'>
                    Role cũ: {users.find((u) => u.id === selectedManagerId)?.role}
                  </span>
                  <span>→</span>
                  <span className='rounded bg-info/20 px-2 py-0.5 text-[0.7rem] font-bold text-info'>
                    Role mới: MANAGER
                  </span>
                </div>
              </div>
            )}

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsAssignManagerModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={!selectedManagerId}
                onClick={handleAssignManager}
                type='button'
              >
                Xác nhận chỉ định Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Members to Department */}
      {isAddMembersModalOpen && selectedDept && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsAddMembersModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <UserPlus className='size-5 text-primary' />
              <h2 className='text-lg font-bold text-foreground'>Thêm thành viên vào {selectedDept.name}</h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Chọn các nhân sự chưa được phân bổ phòng ban để xếp vào phòng ban này.
            </p>

            <div className='mt-4 max-h-60 overflow-y-auto space-y-2 border border-border rounded-xl p-3 bg-background/50'>
              {unassignedUsers.map((u) => {
                const isSelected = selectedMemberIds.includes(u.id)

                return (
                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                      isSelected
                        ? 'border-primary bg-primary-soft/30'
                        : 'border-border bg-surface hover:bg-surface-subtle'
                    }`}
                    key={u.id}
                  >
                    <div className='flex items-center gap-2.5'>
                      <input
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMemberIds((prev) => [...prev, u.id])
                          } else {
                            setSelectedMemberIds((prev) => prev.filter((id) => id !== u.id))
                          }
                        }}
                        type='checkbox'
                      />
                      <div>
                        <p className='font-bold text-foreground'>{u.name}</p>
                        <p className='text-[0.7rem] text-muted-foreground font-mono'>{u.email}</p>
                      </div>
                    </div>
                    <span className='rounded bg-surface px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
                      Role: {u.role}
                    </span>
                  </label>
                )
              })}

              {unassignedUsers.length === 0 && (
                <p className='text-center py-4 text-xs text-muted-foreground'>
                  Tất cả nhân sự đang hoạt động đã được xếp phòng ban.
                </p>
              )}
            </div>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsAddMembersModalOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={selectedMemberIds.length === 0}
                onClick={handleAddMembers}
                type='button'
              >
                Thêm {selectedMemberIds.length} nhân sự
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
