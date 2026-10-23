import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search,
  Shield,
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
  type UserAccount,
  initialDepartments,
  initialUserAccounts,
  roleDefinitions
} from '../super-admin-data'
import type { SuperAdminTabKey } from '../super-admin-nav'

interface SuperAdminPersonnelViewProps {
  onSelectTab?: (tab: SuperAdminTabKey) => void
}

export function SuperAdminPersonnelView({ onSelectTab }: SuperAdminPersonnelViewProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [users, setUsers] = useState<UserAccount[]>(initialUserAccounts)
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDepartments[0]?.id || '')

  // Modals
  const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false)
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Selection states
  const [targetManagerId, setTargetManagerId] = useState<string>('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [userToTransfer, setUserToTransfer] = useState<UserAccount | null>(null)
  const [transferTargetDeptId, setTransferTargetDeptId] = useState<string>('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || departments[0]

  // Members in current department
  const currentDeptMembers = users.filter((u) => u.departmentId === selectedDept?.id)

  // Eligible managers: Active users
  const eligibleManagers = users.filter((u) => u.status === 'ACTIVE' && u.role !== 'SUPER_ADMIN')

  // Unassigned active users
  const unassignedUsers = users.filter((u) => !u.departmentId && u.status === 'ACTIVE')

  // Users in other departments eligible for transfer
  const usersInOtherDepts = users.filter(
    (u) => u.departmentId && u.departmentId !== selectedDept?.id && u.status === 'ACTIVE'
  )

  // Flow 2 - Step 2: Assign / Replace Manager
  const handleAssignManager = () => {
    if (!selectedDept || !targetManagerId) return

    const candidate = users.find((u) => u.id === targetManagerId)
    if (!candidate) return

    const prevManagerId = selectedDept.managerId

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === candidate.id) {
          return {
            ...u,
            departmentCode: selectedDept.code,
            departmentId: selectedDept.id,
            departmentName: selectedDept.name,
            role: 'MANAGER' // STRICT INVARIANT: Assigned user becomes MANAGER!
          }
        }
        if (prevManagerId && u.id === prevManagerId) {
          return {
            ...u,
            role: 'EMPLOYEE' // Old manager reverts to EMPLOYEE and stays member
          }
        }
        return u
      })
    )

    const updatedDept: Department = {
      ...selectedDept,
      managerEmail: candidate.email,
      managerId: candidate.id,
      managerName: candidate.name,
      status: 'CONFIGURED'
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === selectedDept.id ? updatedDept : d))
    )
    setIsAssignManagerModalOpen(false)
    setTargetManagerId('')
    showToast(`Đã chỉ định ${candidate.name} làm Manager phòng ${selectedDept.name}! Role mới: Manager.`)
  }

  // Flow 2 - Step 3: Add unassigned members
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
    setSelectedMemberIds([])
    setIsAddMembersModalOpen(false)
    showToast(`Đã xếp ${addedCount} nhân sự vào phòng ${selectedDept.name}!`)
  }

  // Flow 2 - Step 4: Transfer User from another department
  const handleTransferUser = () => {
    if (!userToTransfer || !transferTargetDeptId) return

    // Guard: If user is manager of their old department, block transfer (Spec Flow 2 Step 4)
    const oldDept = departments.find((d) => d.id === userToTransfer.departmentId)
    if (oldDept && oldDept.managerId === userToTransfer.id) {
      alert(`Không thể chuyển phòng: ${userToTransfer.name} hiện là Manager của phòng ${oldDept.name}. Vui lòng chỉ định Manager mới cho phòng ${oldDept.name} trước khi chuyển.`)
      return
    }

    const newDept = departments.find((d) => d.id === transferTargetDeptId)
    if (!newDept) return

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userToTransfer.id
          ? {
              ...u,
              departmentCode: newDept.code,
              departmentId: newDept.id,
              departmentName: newDept.name
            }
          : u
      )
    )

    // Update counts
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === oldDept?.id) return { ...d, memberCount: Math.max(0, d.memberCount - 1) }
        if (d.id === newDept.id) return { ...d, memberCount: d.memberCount + 1 }
        return d
      })
    )

    setIsTransferModalOpen(false)
    setUserToTransfer(null)
    setTransferTargetDeptId('')
    showToast(`Đã chuyển nhân sự ${userToTransfer.name} từ ${oldDept?.name} sang ${newDept.name}!`)
  }

  // Flow 2 - Step 5: Remove Member
  const handleRemoveMember = (user: UserAccount) => {
    if (!selectedDept) return

    if (selectedDept.managerId === user.id) {
      alert(`Không thể gỡ Manager hiện tại (${user.name}) khỏi phòng. Vui lòng chỉ định Manager mới trước khi gỡ.`)
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
    showToast(`Đã gỡ ${user.name} khỏi phòng ban. Nhân sự chuyển sang trạng thái chưa có phòng.`)
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

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <UserCheck className='size-3.5' />
          Cấu hình nhân sự phòng ban
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground'>
          Nhân sự Phòng ban & Chỉ định Manager
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Chỉ định Manager chịu trách nhiệm duyệt yêu cầu cho từng phòng ban và phân bổ nhân sự trực thuộc
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column: Department Selector (4 cols) */}
        <div className='lg:col-span-4 space-y-3'>
          <Panel>
            <div className='flex items-center justify-between border-b border-border pb-3'>
              <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                Chọn phòng ban ({departments.length})
              </span>
              <button
                className='text-xs font-bold text-primary hover:underline'
                onClick={() => onSelectTab && onSelectTab('departments')}
                type='button'
              >
                + Thêm phòng
              </button>
            </div>

            <div className='mt-3 space-y-2'>
              {departments.map((dept) => {
                const isSelected = dept.id === selectedDept?.id
                const isConfigured = dept.status === 'CONFIGURED'

                return (
                  <button
                    className={`w-full text-left rounded-xl p-3 border transition flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-soft/50 shadow-sm'
                        : 'border-border bg-surface hover:bg-surface-subtle'
                    }`}
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    type='button'
                  >
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-mono font-bold text-xs text-primary'>[{dept.code}]</span>
                        <span className='font-bold text-foreground text-xs'>{dept.name}</span>
                      </div>
                      <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                        Manager:{' '}
                        {dept.managerName ? (
                          <strong className='text-foreground'>{dept.managerName}</strong>
                        ) : (
                          <span className='text-warning font-bold'>Chưa có</span>
                        )}
                      </p>
                    </div>

                    <div className='text-right'>
                      <span className='text-xs font-bold font-mono text-foreground block'>
                        {dept.memberCount} TV
                      </span>
                      <span
                        className={`inline-flex rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold ${
                          isConfigured ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {isConfigured ? 'Đủ' : 'Thiếu'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </Panel>
        </div>

        {/* Right Column: Active Department Detail & Personnel (8 cols) */}
        <div className='lg:col-span-8 space-y-6'>
          {selectedDept && (
            <>
              {/* Department Header Card */}
              <Panel>
                <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='font-mono font-bold text-primary text-base'>[{selectedDept.code}]</span>
                      <h2 className='text-xl font-bold text-foreground'>{selectedDept.name}</h2>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${
                          selectedDept.status === 'CONFIGURED'
                            ? 'border-success/30 bg-success/15 text-success'
                            : 'border-warning/30 bg-warning/15 text-warning'
                        }`}
                      >
                        {selectedDept.status === 'CONFIGURED'
                          ? 'Đã cấu hình hoàn tất'
                          : 'Chưa hoàn tất: chưa có Manager'}
                      </span>
                    </div>
                    <p className='mt-1 text-xs text-muted-foreground'>{selectedDept.description}</p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle transition'
                      onClick={() => {
                        setUserToTransfer(null)
                        setTransferTargetDeptId(selectedDept.id)
                        setIsTransferModalOpen(true)
                      }}
                      type='button'
                    >
                      <RefreshCw className='size-3.5' />
                      Chuyển nhân sự đến
                    </button>
                    <button
                      className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                      onClick={() => {
                        setSelectedMemberIds([])
                        setIsAddMembersModalOpen(true)
                      }}
                      type='button'
                    >
                      <UserPlus className='size-3.5' />
                      Thêm thành viên
                    </button>
                  </div>
                </div>

                {/* Manager Information Block */}
                <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border bg-surface-subtle p-4'>
                  <div className='flex items-start gap-3'>
                    <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-info/15 text-info'>
                      <UserCheck className='size-5' />
                    </span>
                    <div>
                      <span className='text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground'>
                        Trưởng phòng (Manager phụ trách phê duyệt)
                      </span>
                      {selectedDept.managerName ? (
                        <div className='mt-0.5'>
                          <p className='text-sm font-bold text-foreground'>{selectedDept.managerName}</p>
                          <p className='text-xs text-muted-foreground font-mono'>{selectedDept.managerEmail}</p>
                        </div>
                      ) : (
                        <div className='mt-0.5'>
                          <p className='text-xs font-bold text-warning flex items-center gap-1.5'>
                            <AlertTriangle className='size-3.5' />
                            Phòng ban chưa có Manager
                          </p>
                          <p className='text-[0.7rem] text-muted-foreground'>
                            Nhân viên không thể gửi yêu cầu phần mềm cho đến khi có Manager.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition shrink-0'
                    onClick={() => {
                      setTargetManagerId(selectedDept.managerId || '')
                      setIsAssignManagerModalOpen(true)
                    }}
                    type='button'
                  >
                    <UserCheck className='size-3.5' />
                    <span>{selectedDept.managerId ? 'Thay Manager' : 'Chỉ định Manager'}</span>
                  </button>
                </div>
              </Panel>

              {/* Members Table */}
              <Panel>
                <PanelTitle
                  hint='Thành viên gửi yêu cầu cấp phần mềm sẽ được chuyển đến Manager phòng này phê duyệt'
                  title={`Danh sách nhân sự trực thuộc (${currentDeptMembers.length})`}
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
                                    Manager
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
                                  Gỡ khỏi phòng
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
            </>
          )}
        </div>
      </div>

      {/* Modal: Assign / Replace Manager */}
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
                onChange={(e) => setTargetManagerId(e.target.value)}
                value={targetManagerId}
              >
                <option value=''>-- Chọn nhân sự đủ điều kiện --</option>
                {eligibleManagers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.employeeCode}) — Role hiện tại: {u.role} ({u.departmentName || 'Chưa có phòng'})
                  </option>
                ))}
              </select>
            </div>

            {targetManagerId && (
              <div className='mt-4 rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                <span className='font-bold text-foreground'>Xem trước thay đổi (Preview):</span>
                <p className='mt-1 text-muted-foreground'>
                  Tài khoản <strong>{users.find((u) => u.id === targetManagerId)?.name}</strong>:
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <span className='rounded bg-surface px-2 py-0.5 text-[0.7rem] font-bold text-muted-foreground line-through'>
                    Role cũ: {users.find((u) => u.id === targetManagerId)?.role}
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
                disabled={!targetManagerId}
                onClick={handleAssignManager}
                type='button'
              >
                Xác nhận chỉ định
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Members */}
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
                  Không có nhân sự nào đang chờ xếp phòng.
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
                Xác nhận thêm ({selectedMemberIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Transfer Member from Another Department */}
      {isTransferModalOpen && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <button
              className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              onClick={() => setIsTransferModalOpen(false)}
              type='button'
            >
              <X className='size-5' />
            </button>

            <div className='flex items-center gap-2'>
              <RefreshCw className='size-5 text-primary' />
              <h2 className='text-lg font-bold text-foreground'>Chuyển nhân sự giữa các phòng ban</h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Chọn nhân sự từ phòng ban khác để chuyển sang phòng <strong>{selectedDept?.name}</strong>.
            </p>

            <div className='mt-4 space-y-3'>
              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>Chọn nhân sự cần chuyển:</label>
                <select
                  className='w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:border-primary focus:outline-none'
                  onChange={(e) => {
                    const u = users.find((acc) => acc.id === e.target.value) || null
                    setUserToTransfer(u)
                  }}
                  value={userToTransfer?.id || ''}
                >
                  <option value=''>-- Chọn nhân sự từ phòng ban khác --</option>
                  {usersInOtherDepts.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.employeeCode}) — Hiện ở: {u.departmentName} (Role: {u.role})
                    </option>
                  ))}
                </select>
              </div>

              {userToTransfer && (
                <div className='rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                  <span className='font-bold text-foreground'>Xem trước luồng chuyển phòng:</span>
                  <div className='mt-2 flex items-center justify-between font-bold'>
                    <span className='text-muted-foreground'>{userToTransfer.departmentName}</span>
                    <ArrowRight className='size-4 text-primary' />
                    <span className='text-primary'>{selectedDept?.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsTransferModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={!userToTransfer}
                onClick={handleTransferUser}
                type='button'
              >
                Xác nhận chuyển phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
