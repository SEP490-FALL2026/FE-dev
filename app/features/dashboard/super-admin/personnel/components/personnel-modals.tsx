import { ArrowRight, RefreshCw, UserCheck, UserPlus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Department, UserAccount } from '../../super-admin-data'

export interface PersonnelModalsProps {
  isAssignManagerModalOpen: boolean
  setIsAssignManagerModalOpen: (open: boolean) => void
  isAddMembersModalOpen: boolean
  setIsAddMembersModalOpen: (open: boolean) => void
  isTransferModalOpen: boolean
  setIsTransferModalOpen: (open: boolean) => void
  selectedDept?: Department
  targetManagerId: string
  setTargetManagerId: (id: string) => void
  eligibleManagers: UserAccount[]
  users: UserAccount[]
  handleAssignManager: () => void
  unassignedUsers: UserAccount[]
  selectedMemberIds: string[]
  setSelectedMemberIds: React.Dispatch<React.SetStateAction<string[]>>
  handleAddMembers: () => void
  userToTransfer: UserAccount | null
  setUserToTransfer: (u: UserAccount | null) => void
  usersInOtherDepts: UserAccount[]
  handleTransferUser: () => void
}

export function PersonnelModals({
  isAssignManagerModalOpen,
  setIsAssignManagerModalOpen,
  isAddMembersModalOpen,
  setIsAddMembersModalOpen,
  isTransferModalOpen,
  setIsTransferModalOpen,
  selectedDept,
  targetManagerId,
  setTargetManagerId,
  eligibleManagers,
  users,
  handleAssignManager,
  unassignedUsers,
  selectedMemberIds,
  setSelectedMemberIds,
  handleAddMembers,
  userToTransfer,
  setUserToTransfer,
  usersInOtherDepts,
  handleTransferUser
}: PersonnelModalsProps) {
  const { t } = useTranslation('dashboard')

  return (
    <>
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
                {t('superAdmin.personnel.modals.assignManagerTitle', {
                  action: selectedDept.managerId
                    ? t('superAdmin.personnel.modals.actionChange')
                    : t('superAdmin.personnel.modals.actionAssign'),
                  name: selectedDept.name
                })}
              </h2>
            </div>

            <div className='mt-3 rounded-xl border border-info/30 bg-info/10 p-3 text-xs text-info'>
              <p className='font-bold'>{t('superAdmin.personnel.modals.assignManagerNoticeTitle')}</p>
              <ul className='mt-1 list-disc pl-4 space-y-0.5 text-[0.7rem]'>
                <li>{t('superAdmin.personnel.modals.assignManagerNotice1')}</li>
                {selectedDept.managerId && (
                  <li>
                    {t('superAdmin.personnel.modals.assignManagerNotice2', {
                      name: selectedDept.managerName ?? ''
                    })}
                  </li>
                )}
                <li>{t('superAdmin.personnel.modals.assignManagerNotice3')}</li>
              </ul>
            </div>

            <div className='mt-4'>
              <label className='block text-xs font-bold text-foreground mb-1'>
                {t('superAdmin.personnel.modals.assignManagerSelectLabel')}
              </label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setTargetManagerId(e.target.value)}
                value={targetManagerId}
              >
                <option value=''>{t('superAdmin.personnel.modals.assignManagerSelectPlaceholder')}</option>
                {eligibleManagers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {t('superAdmin.personnel.modals.userInOtherDeptOption', {
                      code: u.employeeCode,
                      dept: u.departmentName || '',
                      name: u.name,
                      role: u.role
                    })}
                  </option>
                ))}
              </select>
            </div>

            {targetManagerId && (
              <div className='mt-4 rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                <span className='font-bold text-foreground'>
                  {t('superAdmin.personnel.modals.previewTitle')}
                </span>
                <p className='mt-1 text-muted-foreground'>
                  {t('superAdmin.personnel.modals.previewAccount', {
                    name: users.find((u) => u.id === targetManagerId)?.name ?? ''
                  })}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <span className='rounded bg-surface px-2 py-0.5 text-[0.7rem] font-bold text-muted-foreground line-through'>
                    {t('superAdmin.personnel.modals.previewOldRole', {
                      role: users.find((u) => u.id === targetManagerId)?.role ?? ''
                    })}
                  </span>
                  <span>→</span>
                  <span className='rounded bg-info/20 px-2 py-0.5 text-[0.7rem] font-bold text-info'>
                    {t('superAdmin.personnel.modals.previewNewRole')}
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
                {t('superAdmin.personnel.modals.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={!targetManagerId}
                onClick={handleAssignManager}
                type='button'
              >
                {t('superAdmin.personnel.modals.confirmAssignBtn')}
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
              <h2 className='text-lg font-bold text-foreground'>
                {t('superAdmin.personnel.modals.addMembersTitle', { name: selectedDept.name })}
              </h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('superAdmin.personnel.modals.addMembersSubtitle')}
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
                      {t('superAdmin.personnel.modals.memberRoleBadge', { role: u.role })}
                    </span>
                  </label>
                )
              })}

              {unassignedUsers.length === 0 && (
                <p className='text-center py-4 text-xs text-muted-foreground'>
                  {t('superAdmin.personnel.modals.noUnassignedUsers')}
                </p>
              )}
            </div>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsAddMembersModalOpen(false)}
                type='button'
              >
                {t('superAdmin.personnel.modals.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={selectedMemberIds.length === 0}
                onClick={handleAddMembers}
                type='button'
              >
                {t('superAdmin.personnel.modals.confirmAddMembersBtn', {
                  count: selectedMemberIds.length
                })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Transfer Member */}
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
              <h2 className='text-lg font-bold text-foreground'>
                {t('superAdmin.personnel.modals.transferTitle')}
              </h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('superAdmin.personnel.modals.transferSubtitle', {
                name: selectedDept?.name || ''
              })}
            </p>

            <div className='mt-4 space-y-3'>
              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  {t('superAdmin.personnel.modals.selectUserToTransfer')}
                </label>
                <select
                  className='w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:border-primary focus:outline-none'
                  onChange={(e) => {
                    const u = users.find((acc) => acc.id === e.target.value) || null
                    setUserToTransfer(u)
                  }}
                  value={userToTransfer?.id || ''}
                >
                  <option value=''>{t('superAdmin.personnel.modals.selectUserToTransferPlaceholder')}</option>
                  {usersInOtherDepts.map((u) => (
                    <option key={u.id} value={u.id}>
                      {t('superAdmin.personnel.modals.userInOtherDeptOption', {
                        code: u.employeeCode,
                        dept: u.departmentName || '',
                        name: u.name,
                        role: u.role
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {userToTransfer && (
                <div className='rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                  <span className='font-bold text-foreground'>
                    {t('superAdmin.personnel.modals.previewTransferFlow')}
                  </span>
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
                {t('superAdmin.personnel.modals.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={!userToTransfer}
                onClick={handleTransferUser}
                type='button'
              >
                {t('superAdmin.personnel.modals.confirmTransferBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
