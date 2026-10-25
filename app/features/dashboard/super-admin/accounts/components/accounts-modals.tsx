import type {
  Department,
  EmployeeDevice,
  UserAccount,
  UserAccountRole
} from '../../super-admin-data'
import type { DeviceType } from '../../enums'
import { AccountDetailModal } from './account-detail-modal'
import {
  ChangeRoleModal,
  CreateAccountModal,
  EditAccountModal,
  LockAccountModal
} from './account-form-modals'
import { DeviceIdentificationModal } from './device-identification-modal'
import { OnboardingPromptModal } from './onboarding-prompt-modal'

export interface AccountsModalsProps {
  selectedAccount: UserAccount | null
  setSelectedAccount: (acc: UserAccount | null) => void
  departments: Department[]
  devices: EmployeeDevice[]
  accounts: UserAccount[]
  handleCopyText: (text: string) => void
  setTargetRole: (role: UserAccountRole) => void
  setTargetDeptIdForManager: (id: string) => void
  setIsChangeRoleModalOpen: (open: boolean) => void
  handleOpenDeviceModal: (acc?: UserAccount | null, dev?: EmployeeDevice | null) => void
  setEditName: (name: string) => void
  setEditEmail: (email: string) => void
  setEditPosition: (pos: string) => void
  setIsEditModalOpen: (open: boolean) => void
  setIsLockModalOpen: (open: boolean) => void
  handleResendInvitation: () => void
  isCreateModalOpen: boolean
  setIsCreateModalOpen: (open: boolean) => void
  formError: string | null
  newCode: string
  newDepartmentId: string
  newEmail: string
  newName: string
  newPosition: string
  handleCreateAccount: (e: React.FormEvent) => void
  setNewCode: (val: string) => void
  setNewDepartmentId: (val: string) => void
  setNewEmail: (val: string) => void
  setNewName: (val: string) => void
  setNewPosition: (val: string) => void
  isEditModalOpen: boolean
  editEmail: string
  editName: string
  editPosition: string
  handleEditAccount: (e: React.FormEvent) => void
  isChangeRoleModalOpen: boolean
  handleRoleChange: (e: React.FormEvent) => void
  roleChangeReason: string
  setRoleChangeReason: (val: string) => void
  targetDeptIdForManager: string
  targetRole: UserAccountRole
  isLockModalOpen: boolean
  lockReason: string
  handleToggleLock: (e: React.FormEvent) => void
  setLockReason: (val: string) => void
  devFormCode: string
  devFormEmployeeId: string
  devFormError: string | null
  devFormMac: string
  devFormOs: string
  devFormType: DeviceType
  deviceModalExistingDevice: EmployeeDevice | null
  deviceModalTargetAccount: UserAccount | null
  isDeviceModalOpen: boolean
  setIsDeviceModalOpen: (open: boolean) => void
  handleSaveDeviceBinding: (e: React.FormEvent) => void
  setDevFormCode: (val: string) => void
  setDevFormEmployeeId: (val: string) => void
  setDevFormMac: (val: string) => void
  setDevFormOs: (val: string) => void
  setDevFormType: (val: DeviceType) => void
  nextStepPrompt: { account: UserAccount | null; open: boolean }
  setNextStepPrompt: (val: { account: UserAccount | null; open: boolean }) => void
}

export function AccountsModals({
  selectedAccount,
  setSelectedAccount,
  departments,
  devices,
  accounts,
  handleCopyText,
  setTargetRole,
  setTargetDeptIdForManager,
  setIsChangeRoleModalOpen,
  handleOpenDeviceModal,
  setEditName,
  setEditEmail,
  setEditPosition,
  setIsEditModalOpen,
  setIsLockModalOpen,
  handleResendInvitation,
  isCreateModalOpen,
  setIsCreateModalOpen,
  formError,
  newCode,
  newDepartmentId,
  newEmail,
  newName,
  newPosition,
  handleCreateAccount,
  setNewCode,
  setNewDepartmentId,
  setNewEmail,
  setNewName,
  setNewPosition,
  isEditModalOpen,
  editEmail,
  editName,
  editPosition,
  handleEditAccount,
  isChangeRoleModalOpen,
  handleRoleChange,
  roleChangeReason,
  setRoleChangeReason,
  targetDeptIdForManager,
  targetRole,
  isLockModalOpen,
  lockReason,
  handleToggleLock,
  setLockReason,
  devFormCode,
  devFormEmployeeId,
  devFormError,
  devFormMac,
  devFormOs,
  devFormType,
  deviceModalExistingDevice,
  deviceModalTargetAccount,
  isDeviceModalOpen,
  setIsDeviceModalOpen,
  handleSaveDeviceBinding,
  setDevFormCode,
  setDevFormEmployeeId,
  setDevFormMac,
  setDevFormOs,
  setDevFormType,
  nextStepPrompt,
  setNextStepPrompt
}: AccountsModalsProps) {
  return (
    <>
      <AccountDetailModal
        account={selectedAccount}
        departments={departments}
        devices={devices}
        onClose={() => setSelectedAccount(null)}
        onCopyText={handleCopyText}
        onOpenChangeRoleModal={() => {
          if (!selectedAccount) return
          setTargetRole(selectedAccount.role === 'EMPLOYEE' ? 'FINANCE' : 'EMPLOYEE')
          setTargetDeptIdForManager(selectedAccount.departmentId || '')
          setIsChangeRoleModalOpen(true)
        }}
        onOpenDeviceModal={handleOpenDeviceModal}
        onOpenEditModal={() => {
          if (!selectedAccount) return
          setEditName(selectedAccount.name)
          setEditEmail(selectedAccount.email)
          setEditPosition(selectedAccount.position)
          setIsEditModalOpen(true)
        }}
        onOpenLockModal={() => setIsLockModalOpen(true)}
        onResendInvitation={handleResendInvitation}
      />

      <CreateAccountModal
        departments={departments}
        formError={formError}
        isOpen={isCreateModalOpen}
        newCode={newCode}
        newDepartmentId={newDepartmentId}
        newEmail={newEmail}
        newName={newName}
        newPosition={newPosition}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAccount}
        setNewCode={setNewCode}
        setNewDepartmentId={setNewDepartmentId}
        setNewEmail={setNewEmail}
        setNewName={setNewName}
        setNewPosition={setNewPosition}
      />

      <EditAccountModal
        account={selectedAccount}
        editEmail={editEmail}
        editName={editName}
        editPosition={editPosition}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditAccount}
        setEditEmail={setEditEmail}
        setEditName={setEditName}
        setEditPosition={setEditPosition}
      />

      <ChangeRoleModal
        account={selectedAccount}
        departments={departments}
        isOpen={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        onSubmit={handleRoleChange}
        roleChangeReason={roleChangeReason}
        setRoleChangeReason={setRoleChangeReason}
        setTargetDeptIdForManager={setTargetDeptIdForManager}
        setTargetRole={setTargetRole}
        targetDeptIdForManager={targetDeptIdForManager}
        targetRole={targetRole}
      />

      <LockAccountModal
        account={selectedAccount}
        isOpen={isLockModalOpen}
        lockReason={lockReason}
        onClose={() => setIsLockModalOpen(false)}
        onToggleLock={() => handleToggleLock({ preventDefault: () => {} } as React.FormEvent)}
        setLockReason={setLockReason}
      />

      <DeviceIdentificationModal
        accounts={accounts}
        devFormCode={devFormCode}
        devFormEmployeeId={devFormEmployeeId}
        devFormError={devFormError}
        devFormMac={devFormMac}
        devFormOs={devFormOs}
        devFormType={devFormType}
        deviceModalExistingDevice={deviceModalExistingDevice}
        deviceModalTargetAccount={deviceModalTargetAccount}
        devices={devices}
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onSaveDeviceBinding={handleSaveDeviceBinding}
        setDevFormCode={setDevFormCode}
        setDevFormEmployeeId={setDevFormEmployeeId}
        setDevFormMac={setDevFormMac}
        setDevFormOs={setDevFormOs}
        setDevFormType={setDevFormType}
      />

      <OnboardingPromptModal
        account={nextStepPrompt.account}
        isOpen={nextStepPrompt.open}
        onClose={() => setNextStepPrompt({ account: null, open: false })}
        onIdentifyDevice={(acc) => {
          setNextStepPrompt({ account: null, open: false })
          handleOpenDeviceModal(acc)
        }}
      />
    </>
  )
}
