import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Plus,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Department, UserAccount } from '../../super-admin-data'

export interface DepartmentModalsProps {
  isCreateModalOpen: boolean
  setIsCreateModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeprecateModalOpen: boolean
  setIsDeprecateModalOpen: (open: boolean) => void
  isAssignManagerModalOpen: boolean
  setIsAssignManagerModalOpen: (open: boolean) => void
  isAddMembersModalOpen: boolean
  setIsAddMembersModalOpen: (open: boolean) => void
  selectedDept: Department | null
  newCode: string
  setNewCode: (code: string) => void
  newName: string
  setNewName: (name: string) => void
  newDesc: string
  setNewDesc: (desc: string) => void
  formError: string | null
  handleCreateDepartment: (e: React.FormEvent) => void
  handleEditDepartment: (e: React.FormEvent) => void
  handleDeprecateDepartment: () => void
  selectedManagerId: string
  setSelectedManagerId: (id: string) => void
  eligibleManagers: UserAccount[]
  users: UserAccount[]
  handleAssignManager: () => void
  unassignedUsers: UserAccount[]
  selectedMemberIds: string[]
  setSelectedMemberIds: React.Dispatch<React.SetStateAction<string[]>>
  handleAddMembers: () => void
}

export function DepartmentModals({
  isCreateModalOpen,
  setIsCreateModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isDeprecateModalOpen,
  setIsDeprecateModalOpen,
  isAssignManagerModalOpen,
  setIsAssignManagerModalOpen,
  isAddMembersModalOpen,
  setIsAddMembersModalOpen,
  selectedDept,
  newCode,
  setNewCode,
  newName,
  setNewName,
  newDesc,
  setNewDesc,
  formError,
  handleCreateDepartment,
  handleEditDepartment,
  handleDeprecateDepartment,
  selectedManagerId,
  setSelectedManagerId,
  eligibleManagers,
  users,
  handleAssignManager,
  unassignedUsers,
  selectedMemberIds,
  setSelectedMemberIds,
  handleAddMembers
}: DepartmentModalsProps) {
  const { t } = useTranslation('dashboard')

  return (
    <>
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
              <h2 className='text-lg font-bold text-foreground'>
                {t('superAdmin.departmentsModule.modals.createTitle')}
              </h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('superAdmin.departmentsModule.modals.createSubtitle')}
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
                  {t('superAdmin.departmentsModule.modals.codeLabel')} <span className='text-danger'>*</span>
                </label>
                <input
                  className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold focus:border-primary focus:outline-none uppercase'
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder={t('superAdmin.departmentsModule.modals.codePlaceholder')}
                  required
                  type='text'
                  value={newCode}
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  {t('superAdmin.departmentsModule.modals.nameLabel')} <span className='text-danger'>*</span>
                </label>
                <input
                  className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('superAdmin.departmentsModule.modals.namePlaceholder')}
                  required
                  type='text'
                  value={newName}
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  {t('superAdmin.departmentsModule.modals.descLabel')}
                </label>
                <textarea
                  className='w-full rounded-xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none'
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={t('superAdmin.departmentsModule.modals.descPlaceholder')}
                  rows={3}
                  value={newDesc}
                />
              </div>

              <div className='rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning flex items-start gap-2'>
                <AlertTriangle className='size-4 shrink-0 mt-0.5' />
                <span>{t('superAdmin.departmentsModule.modals.createNotice')}</span>
              </div>

              <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
                <button
                  className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                  onClick={() => setIsCreateModalOpen(false)}
                  type='button'
                >
                  {t('superAdmin.departmentsModule.modals.cancelBtn')}
                </button>
                <button
                  className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                  type='submit'
                >
                  <Plus className='size-3.5' />
                  <span>{t('superAdmin.departmentsModule.modals.submitCreate')}</span>
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

            <h2 className='text-lg font-bold text-foreground'>
              {t('superAdmin.departmentsModule.modals.editTitle', { code: selectedDept.code })}
            </h2>
            <form className='mt-4 space-y-4' onSubmit={handleEditDepartment}>
              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  {t('superAdmin.departmentsModule.modals.nameLabel')}
                </label>
                <input
                  className='w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none'
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  type='text'
                  value={newName}
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-foreground mb-1'>
                  {t('superAdmin.departmentsModule.modals.descLabel')}
                </label>
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
                  {t('superAdmin.departmentsModule.modals.cancelBtn')}
                </button>
                <button
                  className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                  type='submit'
                >
                  {t('superAdmin.departmentsModule.modals.submitEdit')}
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
                {selectedDept.memberCount > 0
                  ? t('superAdmin.departmentsModule.modals.deprecateTitle')
                  : t('superAdmin.departmentsModule.modals.deleteTitle')}
              </h2>
            </div>

            <p className='mt-3 text-xs text-foreground'>
              {selectedDept.memberCount > 0
                ? t('superAdmin.departmentsModule.modals.deprecateDesc', {
                    count: selectedDept.memberCount,
                    name: selectedDept.name
                  })
                : t('superAdmin.departmentsModule.modals.deleteDesc', {
                    name: selectedDept.name
                  })}
            </p>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsDeprecateModalOpen(false)}
                type='button'
              >
                {t('superAdmin.departmentsModule.modals.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-danger/90 transition'
                onClick={handleDeprecateDepartment}
                type='button'
              >
                {selectedDept.memberCount > 0
                  ? t('superAdmin.departmentsModule.modals.confirmDeprecateBtn')
                  : t('superAdmin.departmentsModule.modals.confirmDeleteBtn')}
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
                {t('superAdmin.departmentsModule.modals.assignManagerTitle', {
                  action: selectedDept.managerId
                    ? t('superAdmin.departmentsModule.modals.changeManagerAction')
                    : t('superAdmin.departmentsModule.modals.assignManagerAction'),
                  name: selectedDept.name
                })}
              </h2>
            </div>

            <div className='mt-3 rounded-xl border border-info/30 bg-info/10 p-3 text-xs text-info'>
              <p className='font-bold'>{t('superAdmin.departmentsModule.modals.assignManagerNoticeHeading')}</p>
              <ul className='mt-1 list-disc pl-4 space-y-0.5 text-[0.7rem]'>
                <li>{t('superAdmin.departmentsModule.modals.assignManagerNotice1')}</li>
                {selectedDept.managerId && (
                  <li>
                    {t('superAdmin.departmentsModule.modals.assignManagerNotice2', {
                      name: selectedDept.managerName ?? ''
                    })}
                  </li>
                )}
                <li>{t('superAdmin.departmentsModule.modals.assignManagerNotice3')}</li>
              </ul>
            </div>

            <div className='mt-4'>
              <label className='block text-xs font-bold text-foreground mb-1'>
                {t('superAdmin.departmentsModule.modals.assignManagerSelectLabel')}
              </label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setSelectedManagerId(e.target.value)}
                value={selectedManagerId}
              >
                <option value=''>{t('superAdmin.departmentsModule.modals.assignManagerSelectPlaceholder')}</option>
                {eligibleManagers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.employeeCode}) — {t('superAdmin.departmentsModule.modals.roleCurrentOption', {
                      dept: u.departmentName || '',
                      role: u.role
                    })}
                  </option>
                ))}
              </select>
            </div>

            {selectedManagerId && (
              <div className='mt-4 rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                <span className='font-bold text-foreground'>
                  {t('superAdmin.departmentsModule.modals.previewHeading')}
                </span>
                <p className='mt-1 text-muted-foreground'>
                  {t('superAdmin.departmentsModule.modals.previewAccountLabel', {
                    name: users.find((u) => u.id === selectedManagerId)?.name ?? ''
                  })}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <span className='rounded bg-surface px-2 py-0.5 text-[0.7rem] font-bold text-muted-foreground line-through'>
                    {t('superAdmin.departmentsModule.modals.previewOldRole', {
                      role: users.find((u) => u.id === selectedManagerId)?.role ?? ''
                    })}
                  </span>
                  <span>→</span>
                  <span className='rounded bg-info/20 px-2 py-0.5 text-[0.7rem] font-bold text-info'>
                    {t('superAdmin.departmentsModule.modals.previewNewRole')}
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
                {t('superAdmin.departmentsModule.modals.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={!selectedManagerId}
                onClick={handleAssignManager}
                type='button'
              >
                {t('superAdmin.departmentsModule.modals.confirmAssignManagerBtn')}
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
              <h2 className='text-lg font-bold text-foreground'>
                {t('superAdmin.departmentsModule.modals.addMembersTitle', { name: selectedDept.name })}
              </h2>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('superAdmin.departmentsModule.modals.addMembersSubtitle')}
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
                      {t('superAdmin.departmentsModule.modals.memberRoleBadge', { role: u.role })}
                    </span>
                  </label>
                )
              })}

              {unassignedUsers.length === 0 && (
                <p className='text-center py-4 text-xs text-muted-foreground'>
                  {t('superAdmin.departmentsModule.modals.noUnassignedDesc')}
                </p>
              )}
            </div>

            <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                onClick={() => setIsAddMembersModalOpen(false)}
                type='button'
              >
                {t('superAdmin.departmentsModule.modals.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                disabled={selectedMemberIds.length === 0}
                onClick={handleAddMembers}
                type='button'
              >
                {t('superAdmin.departmentsModule.modals.confirmAddMembersBtn', {
                  count: selectedMemberIds.length
                })}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
