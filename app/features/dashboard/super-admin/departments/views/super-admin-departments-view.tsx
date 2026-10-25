import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users
} from 'lucide-react'
import { useState } from 'react'
import { PageHeader, Panel, PanelTitle, Pill } from '../../../dashboard-ui'
import {
  type Department,
  type DepartmentStatus,
  type UserAccount,
  initialDepartments,
  initialUserAccounts
} from '../../super-admin-data'
import type { SuperAdminTabKey } from '../../super-admin-nav'
import { DepartmentDetailView } from '../components/department-detail-view'
import { DepartmentModals } from '../components/department-modals'
import { DepartmentStatsCards } from '../components/department-stats-cards'

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
      status: 'INCOMPLETE'
    }

    setDepartments((prev) => [newDept, ...prev])
    setIsCreateModalOpen(false)
    setNewCode('')
    setNewName('')
    setNewDesc('')
    setSelectedDept(newDept)
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

    setSelectedDept((prev) =>
      prev ? { ...prev, description: newDesc.trim(), name: cleanName } : null
    )

    setIsEditModalOpen(false)
    showToast('Cập nhật thông tin phòng ban thành công!')
  }

  // Flow 1A - Step 4: Deprecate or Delete Department
  const handleDeprecateDepartment = () => {
    if (!selectedDept) return

    if (selectedDept.memberCount > 0) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === selectedDept.id ? { ...d, status: 'DEPRECATED' } : d))
      )
      setSelectedDept((prev) => (prev ? { ...prev, status: 'DEPRECATED' } : null))
      showToast(`Đã chuyển phòng ban ${selectedDept.name} sang trạng thái Ngừng dùng.`)
    } else {
      setDepartments((prev) => prev.filter((d) => d.id !== selectedDept.id))
      setSelectedDept(null)
      showToast(`Đã xóa hoàn toàn phòng ban ${selectedDept.name}.`)
    }

    setIsDeprecateModalOpen(false)
  }

  // Flow 1B: Assign or Change Manager
  const handleAssignManager = () => {
    if (!selectedDept || !selectedManagerId) return

    const targetUser = users.find((u) => u.id === selectedManagerId)
    if (!targetUser) return

    const prevManagerId = selectedDept.managerId

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedManagerId) {
          return {
            ...u,
            departmentCode: selectedDept.code,
            departmentId: selectedDept.id,
            departmentName: selectedDept.name,
            role: 'MANAGER'
          }
        }
        if (prevManagerId && u.id === prevManagerId) {
          return {
            ...u,
            role: 'EMPLOYEE'
          }
        }
        return u
      })
    )

    const updatedDept: Department = {
      ...selectedDept,
      managerEmail: targetUser.email,
      managerId: targetUser.id,
      managerName: targetUser.name,
      memberCount: targetUser.departmentId === selectedDept.id
        ? selectedDept.memberCount
        : selectedDept.memberCount + 1,
      status: 'CONFIGURED'
    }

    setDepartments((prev) => prev.map((d) => (d.id === selectedDept.id ? updatedDept : d)))
    setSelectedDept(updatedDept)
    setIsAssignManagerModalOpen(false)
    setSelectedManagerId('')
    showToast(`Đã chỉ định ${targetUser.name} làm Manager phòng ban ${selectedDept.name}. Trạng thái: Đã cấu hình!`)
  }

  // Flow 1C - Add Members
  const handleAddMembers = () => {
    if (!selectedDept || selectedMemberIds.length === 0) return

    setUsers((prev) =>
      prev.map((u) => {
        if (selectedMemberIds.includes(u.id)) {
          return {
            ...u,
            departmentCode: selectedDept.code,
            departmentId: selectedDept.id,
            departmentName: selectedDept.name
          }
        }
        return u
      })
    )

    const updatedDept: Department = {
      ...selectedDept,
      memberCount: selectedDept.memberCount + selectedMemberIds.length
    }

    setDepartments((prev) => prev.map((d) => (d.id === selectedDept.id ? updatedDept : d)))
    setSelectedDept(updatedDept)
    setIsAddMembersModalOpen(false)
    setSelectedMemberIds([])
    showToast(`Đã thêm ${selectedMemberIds.length} nhân sự vào ${selectedDept.name} thành công!`)
  }

  // Flow 1C - Remove Member
  const handleRemoveMember = (member: UserAccount) => {
    if (!selectedDept) return

    if (member.id === selectedDept.managerId) {
      alert('Không thể gỡ Manager trực tiếp khỏi phòng ban. Hãy chỉ định Manager mới trước khi gỡ.')
      return
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === member.id
          ? { ...u, departmentCode: undefined, departmentId: undefined, departmentName: undefined }
          : u
      )
    )

    const updatedDept: Department = {
      ...selectedDept,
      memberCount: Math.max(0, selectedDept.memberCount - 1)
    }

    setDepartments((prev) => prev.map((d) => (d.id === selectedDept.id ? updatedDept : d)))
    setSelectedDept(updatedDept)
    showToast(`Đã gỡ nhân sự ${member.name} khỏi ${selectedDept.name}.`)
  }

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {!selectedDept ? (
        <div className='space-y-6'>
          <PageHeader
            actions={
              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                onClick={() => {
                  setNewCode('')
                  setNewName('')
                  setNewDesc('')
                  setFormError(null)
                  setIsCreateModalOpen(true)
                }}
                type='button'
              >
                <Plus className='size-4' />
                <span>Tạo phòng ban mới</span>
              </button>
            }
            code='Quản trị tổ chức doanh nghiệp'
            subtitle='Khởi tạo, cấu hình người quản lý (Manager) và phân bổ thành viên phòng ban.'
            title='Cơ cấu Phòng Ban'
          />

          <DepartmentStatsCards departments={departments} />

          <Panel>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex flex-wrap items-center gap-1.5'>
                {(['ALL', 'CONFIGURED', 'INCOMPLETE', 'DEPRECATED'] as const).map((st) => (
                  <button
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      statusFilter === st
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-surface-subtle text-muted-foreground hover:bg-surface hover:text-foreground'
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
                          ? 'Chưa hoàn tất: chưa có Manager'
                          : 'Ngừng dùng'}
                  </button>
                ))}
              </div>

              <div className='relative w-full sm:w-72'>
                <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <input
                  className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-3 text-xs focus:border-primary focus:outline-none'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Tìm tên, mã phòng, manager...'
                  type='text'
                  value={searchTerm}
                />
              </div>
            </div>

            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                  <tr>
                    <th className='p-3 font-semibold'>Mã phòng</th>
                    <th className='p-3 font-semibold'>Tên phòng ban</th>
                    <th className='p-3 font-semibold'>Người quản lý (Manager)</th>
                    <th className='p-3 font-semibold text-center'>Số thành viên</th>
                    <th className='p-3 font-semibold text-center'>Trạng thái</th>
                    <th className='p-3 font-semibold text-right'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {filteredDepartments.map((dept) => {
                    const isConfigured = dept.status === 'CONFIGURED'
                    const isDeprecated = dept.status === 'DEPRECATED'

                    return (
                      <tr className='transition hover:bg-surface-subtle/60' key={dept.id}>
                        <td className='p-3 font-mono font-bold text-primary'>{dept.code}</td>
                        <td className='p-3'>
                          <p className='font-bold text-foreground'>{dept.name}</p>
                          <p className='text-[0.7rem] text-muted-foreground line-clamp-1'>
                            {dept.description}
                          </p>
                        </td>
                        <td className='p-3'>
                          {dept.managerName ? (
                            <div>
                              <p className='font-semibold text-foreground'>{dept.managerName}</p>
                              <p className='text-[0.7rem] text-muted-foreground font-mono'>
                                {dept.managerEmail}
                              </p>
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
        <DepartmentDetailView
          currentDeptMembers={currentDeptMembers}
          onBack={() => setSelectedDept(null)}
          onOpenAddMembersModal={() => {
            setSelectedMemberIds([])
            setIsAddMembersModalOpen(true)
          }}
          onOpenAssignManagerModal={() => {
            setSelectedManagerId(selectedDept.managerId || '')
            setIsAssignManagerModalOpen(true)
          }}
          onOpenDeprecateModal={() => setIsDeprecateModalOpen(true)}
          onOpenEditModal={() => {
            setNewName(selectedDept.name)
            setNewDesc(selectedDept.description)
            setIsEditModalOpen(true)
          }}
          onRemoveMember={handleRemoveMember}
          selectedDept={selectedDept}
        />
      )}

      <DepartmentModals
        eligibleManagers={eligibleManagers}
        formError={formError}
        handleAddMembers={handleAddMembers}
        handleAssignManager={handleAssignManager}
        handleCreateDepartment={handleCreateDepartment}
        handleDeprecateDepartment={handleDeprecateDepartment}
        handleEditDepartment={handleEditDepartment}
        isAddMembersModalOpen={isAddMembersModalOpen}
        isAssignManagerModalOpen={isAssignManagerModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        isDeprecateModalOpen={isDeprecateModalOpen}
        isEditModalOpen={isEditModalOpen}
        newCode={newCode}
        newDesc={newDesc}
        newName={newName}
        selectedDept={selectedDept}
        selectedManagerId={selectedManagerId}
        selectedMemberIds={selectedMemberIds}
        setIsAddMembersModalOpen={setIsAddMembersModalOpen}
        setIsAssignManagerModalOpen={setIsAssignManagerModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsDeprecateModalOpen={setIsDeprecateModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setNewCode={setNewCode}
        setNewDesc={setNewDesc}
        setNewName={setNewName}
        setSelectedManagerId={setSelectedManagerId}
        setSelectedMemberIds={setSelectedMemberIds}
        unassignedUsers={unassignedUsers}
        users={users}
      />
    </div>
  )
}
