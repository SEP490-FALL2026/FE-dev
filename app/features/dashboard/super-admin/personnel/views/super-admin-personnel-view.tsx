import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  UserMinus,
  UserPlus
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, Panel, PanelTitle } from '../../../dashboard-ui'
import {
  type Department,
  type UserAccount,
  initialDepartments,
  initialUserAccounts,
  roleDefinitions
} from '../../super-admin-data'
import type { SuperAdminTabKey } from '../../super-admin-nav'
import { PersonnelModals } from '../components/personnel-modals'

interface SuperAdminPersonnelViewProps {
  onSelectTab?: (tab: SuperAdminTabKey) => void
}

export function SuperAdminPersonnelView({}: SuperAdminPersonnelViewProps) {
  const { t } = useTranslation('dashboard')
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
      managerEmail: candidate.email,
      managerId: candidate.id,
      managerName: candidate.name,
      memberCount: candidate.departmentId === selectedDept.id
        ? selectedDept.memberCount
        : selectedDept.memberCount + 1,
      status: 'CONFIGURED'
    }

    setDepartments((prev) => prev.map((d) => (d.id === selectedDept.id ? updatedDept : d)))
    setIsAssignManagerModalOpen(false)
    setTargetManagerId('')
    showToast(t('superAdmin.personnel.toast.assignManagerSuccess', {
      dept: selectedDept.name,
      manager: candidate.name
    }))
  }

  // Flow 2 - Step 3: Add Unassigned Members
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
    setIsAddMembersModalOpen(false)
    setSelectedMemberIds([])
    showToast(t('superAdmin.personnel.toast.addMembersSuccess', {
      count: selectedMemberIds.length,
      dept: selectedDept.name
    }))
  }

  // Flow 2 - Step 4: Transfer Member from Another Department
  const handleTransferUser = () => {
    if (!selectedDept || !userToTransfer) return

    const sourceDeptId = userToTransfer.departmentId

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userToTransfer.id) {
          return {
            ...u,
            departmentCode: selectedDept.code,
            departmentId: selectedDept.id,
            departmentName: selectedDept.name,
            role: u.role === 'MANAGER' ? 'EMPLOYEE' : u.role
          }
        }
        return u
      })
    )

    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === selectedDept.id) {
          return { ...d, memberCount: d.memberCount + 1 }
        }
        if (d.id === sourceDeptId) {
          const isManagerOfSource = d.managerId === userToTransfer.id
          return {
            ...d,
            managerEmail: isManagerOfSource ? undefined : d.managerEmail,
            managerId: isManagerOfSource ? undefined : d.managerId,
            managerName: isManagerOfSource ? undefined : d.managerName,
            memberCount: Math.max(0, d.memberCount - 1),
            status: isManagerOfSource ? 'INCOMPLETE' : d.status
          }
        }
        return d
      })
    )

    setIsTransferModalOpen(false)
    setUserToTransfer(null)
    showToast(t('superAdmin.personnel.toast.transferSuccess', {
      dept: selectedDept.name,
      name: userToTransfer.name
    }))
  }

  // Remove Member
  const handleRemoveMember = (member: UserAccount) => {
    if (!selectedDept) return

    if (member.id === selectedDept.managerId) {
      alert(t('superAdmin.personnel.toast.cannotRemoveManager'))
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
    showToast(t('superAdmin.personnel.toast.removeMemberSuccess', {
      dept: selectedDept.name,
      name: member.name
    }))
  }

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        actions={
          <div className='flex items-center gap-2'>
            <button
              className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle transition shadow-sm'
              onClick={() => setIsTransferModalOpen(true)}
              type='button'
            >
              <RefreshCw className='size-3.5' />
              <span>{t('superAdmin.personnel.transferBtn')}</span>
            </button>
            <button
              className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              onClick={() => {
                setSelectedMemberIds([])
                setIsAddMembersModalOpen(true)
              }}
              type='button'
            >
              <UserPlus className='size-3.5' />
              <span>{t('superAdmin.personnel.addMembersBtn')}</span>
            </button>
          </div>
        }
        code={t('superAdmin.personnel.headerCode')}
        subtitle={t('superAdmin.personnel.headerSubtitle')}
        title={t('superAdmin.personnel.headerTitle')}
      />

      <div className='grid gap-6 lg:grid-cols-12'>
        <div className='space-y-4 lg:col-span-4'>
          <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-3'>
            <div className='flex items-center justify-between pb-2 border-b border-border'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                {t('superAdmin.personnel.deptSelectorTitle', { count: departments.length })}
              </h3>
              <span className='rounded bg-surface-subtle px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
                {t('superAdmin.personnel.unassignedCountBadge', { count: unassignedUsers.length })}
              </span>
            </div>

            <div className='space-y-1.5'>
              {departments.map((d) => {
                const isSelected = d.id === selectedDept?.id
                const isConfigured = d.status === 'CONFIGURED'

                return (
                  <button
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition ${
                      isSelected
                        ? 'border border-primary bg-primary-soft text-primary font-bold shadow-sm'
                        : 'border border-transparent bg-surface hover:bg-surface-subtle text-foreground'
                    }`}
                    key={d.id}
                    onClick={() => setSelectedDeptId(d.id)}
                    type='button'
                  >
                    <div>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-mono text-xs font-bold'>[{d.code}]</span>
                        <span className='text-xs'>{d.name}</span>
                      </div>
                      <p className='text-[0.7rem] text-muted-foreground mt-0.5'>
                        {d.managerName
                          ? t('superAdmin.personnel.managerPrefix', { name: d.managerName })
                          : t('superAdmin.personnel.noManagerWarning')}
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='font-mono text-xs font-bold text-muted-foreground'>
                        {t('superAdmin.personnel.memberCountBadge', { count: d.memberCount })}
                      </span>
                      <span
                        className={`size-2 rounded-full ${isConfigured ? 'bg-success' : 'bg-warning animate-pulse'}`}
                        title={
                          isConfigured
                            ? t('superAdmin.personnel.hasManagerTitle')
                            : t('superAdmin.personnel.noManagerTitle')
                        }
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className='space-y-6 lg:col-span-8'>
          {selectedDept && (
            <>
              <Panel>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-start gap-3'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-info/15 text-info'>
                      <UserCheck className='size-5' />
                    </span>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                          {t('superAdmin.personnel.managerCardHeading')}
                        </span>
                        <span className='rounded bg-info/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-info'>
                          {t('superAdmin.personnel.managerCardLimit')}
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
                            {t('superAdmin.personnel.managerCardMissingTitle')}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {t('superAdmin.personnel.managerCardMissingDesc')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition shrink-0'
                    onClick={() => {
                      setTargetManagerId(selectedDept.managerId || '')
                      setIsAssignManagerModalOpen(true)
                    }}
                    type='button'
                  >
                    <UserCheck className='size-3.5' />
                    <span>
                      {selectedDept.managerId
                        ? t('superAdmin.personnel.changeManagerBtn')
                        : t('superAdmin.personnel.assignManagerBtn')}
                    </span>
                  </button>
                </div>
              </Panel>

              <Panel>
                <PanelTitle
                  hint={t('superAdmin.personnel.membersListHint')}
                  title={t('superAdmin.personnel.membersListTitle', { count: currentDeptMembers.length })}
                />

                <div className='mt-4 overflow-x-auto'>
                  <table className='w-full text-left text-xs'>
                    <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                      <tr>
                        <th className='p-3 font-semibold'>{t('superAdmin.personnel.colCode')}</th>
                        <th className='p-3 font-semibold'>{t('superAdmin.personnel.colName')}</th>
                        <th className='p-3 font-semibold'>{t('superAdmin.personnel.colEmail')}</th>
                        <th className='p-3 font-semibold text-center'>{t('superAdmin.personnel.colRole')}</th>
                        <th className='p-3 font-semibold text-center'>{t('superAdmin.personnel.colStatus')}</th>
                        <th className='p-3 font-semibold text-right'>{t('superAdmin.personnel.colAction')}</th>
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
                                    {t('superAdmin.personnel.managerBadge')}
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
                                  ? t('superAdmin.personnel.statusActive')
                                  : member.status === 'INVITED'
                                    ? t('superAdmin.personnel.statusInvited')
                                    : t('superAdmin.personnel.statusLocked')}
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
                                  {t('superAdmin.personnel.removeBtn')}
                                </button>
                              ) : (
                                <span className='text-[0.7rem] text-muted-foreground italic'>
                                  {t('superAdmin.personnel.replaceManagerFirst')}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}

                      {currentDeptMembers.length === 0 && (
                        <tr>
                          <td className='p-8 text-center text-muted-foreground' colSpan={6}>
                            {t('superAdmin.personnel.emptyMembers')}
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

      <PersonnelModals
        eligibleManagers={eligibleManagers}
        handleAddMembers={handleAddMembers}
        handleAssignManager={handleAssignManager}
        handleTransferUser={handleTransferUser}
        isAddMembersModalOpen={isAddMembersModalOpen}
        isAssignManagerModalOpen={isAssignManagerModalOpen}
        isTransferModalOpen={isTransferModalOpen}
        selectedDept={selectedDept}
        selectedMemberIds={selectedMemberIds}
        setIsAddMembersModalOpen={setIsAddMembersModalOpen}
        setIsAssignManagerModalOpen={setIsAssignManagerModalOpen}
        setIsTransferModalOpen={setIsTransferModalOpen}
        setSelectedMemberIds={setSelectedMemberIds}
        setTargetManagerId={setTargetManagerId}
        setUserToTransfer={setUserToTransfer}
        targetManagerId={targetManagerId}
        unassignedUsers={unassignedUsers}
        users={users}
        usersInOtherDepts={usersInOtherDepts}
        userToTransfer={userToTransfer}
      />
    </div>
  )
}
