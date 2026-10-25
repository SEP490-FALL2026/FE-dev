import {
  Download,
  Laptop,
  Plus,
  Shield,
  UserPlus,
  Users
} from 'lucide-react'
import { PageHeader } from '../../../dashboard-ui'
import { AccountsSubtabView } from '../components/accounts-subtab-view'
import { RolesSubtabView } from '../components/roles-subtab-view'
import { DevicesSubtabView } from '../components/devices-subtab-view'
import { AccountsModals } from '../components/accounts-modals'
import { useSuperAdminAccounts } from '../hooks/use-super-admin-accounts'

export function SuperAdminAccountsView() {
  const {
    accounts,
    activeSubTab,
    departmentFilter,
    departments,
    devFormCode,
    devFormEmployeeId,
    devFormError,
    devFormMac,
    devFormOs,
    devFormType,
    deviceModalExistingDevice,
    deviceModalTargetAccount,
    deviceSearchTerm,
    deviceTypeFilter,
    devices,
    editEmail,
    editName,
    editPosition,
    filteredAccounts,
    formError,
    handleCopyText,
    handleCreateAccount,
    handleEditAccount,
    handleExportAccountsCsv,
    handleOpenDeviceModal,
    handleResendInvitation,
    handleRoleChange,
    handleSaveDeviceBinding,
    handleToggleLock,
    handleUnbindDevice,
    isChangeRoleModalOpen,
    isCreateModalOpen,
    isDeviceModalOpen,
    isEditModalOpen,
    isLockModalOpen,
    lockReason,
    newCode,
    newDepartmentId,
    newEmail,
    newName,
    newPosition,
    nextStepPrompt,
    roleChangeReason,
    roleFilter,
    searchTerm,
    selectedAccount,
    setActiveSubTab,
    setDepartmentFilter,
    setDevFormCode,
    setDevFormEmployeeId,
    setDevFormMac,
    setDevFormOs,
    setDevFormType,
    setDeviceSearchTerm,
    setDeviceTypeFilter,
    setEditEmail,
    setEditName,
    setEditPosition,
    setIsChangeRoleModalOpen,
    setIsCreateModalOpen,
    setIsDeviceModalOpen,
    setIsEditModalOpen,
    setIsLockModalOpen,
    setLockReason,
    setNewCode,
    setNewDepartmentId,
    setNewEmail,
    setNewName,
    setNewPosition,
    setNextStepPrompt,
    setRoleChangeReason,
    setRoleFilter,
    setSearchTerm,
    setSelectedAccount,
    setTargetDeptIdForManager,
    setTargetRole,
    statusFilter,
    targetDeptIdForManager,
    targetRole,
    toastMessage
  } = useSuperAdminAccounts()

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-[slideUp_0.3s_ease-out]'>
          <span className='size-2 rounded-full bg-success' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        actions={
          <div className='flex items-center gap-2'>
            <button
              className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle transition shadow-sm'
              onClick={handleExportAccountsCsv}
              type='button'
            >
              <Download className='size-3.5' />
              <span>Xuất CSV</span>
            </button>
            <button
              className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle transition shadow-sm'
              onClick={() => handleOpenDeviceModal()}
              type='button'
            >
              <Laptop className='size-3.5' />
              <span>Định danh máy</span>
            </button>
            <button
              className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              onClick={() => {
                setNewCode('')
                setNewName('')
                setNewEmail('')
                setNewPosition('')
                setNewDepartmentId('')
                setIsCreateModalOpen(true)
              }}
              type='button'
            >
              <UserPlus className='size-3.5' />
              <span>Thêm tài khoản</span>
            </button>
          </div>
        }
        code='Quản trị tài khoản & thiết bị'
        subtitle='Quản lý danh sách người dùng, vai trò duy nhất và định danh thiết bị công ty của nhân sự.'
        title='Tài Khoản & Phân Quyền Người Dùng'
      />

      <div className='flex flex-wrap items-center gap-2 border-b border-border pb-3'>
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

        <button
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'devices'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          }`}
          onClick={() => setActiveSubTab('devices')}
          type='button'
        >
          <Laptop className='size-4' />
          <span>Định danh thiết bị nhân sự ({devices.length})</span>
        </button>
      </div>

      {activeSubTab === 'accounts' && (
        <AccountsSubtabView
          accounts={accounts}
          departmentFilter={departmentFilter}
          departments={departments}
          devices={devices}
          filteredAccounts={filteredAccounts}
          onExportCsv={handleExportAccountsCsv}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenDeviceModal={handleOpenDeviceModal}
          onSelectAccount={(acc) => setSelectedAccount(acc)}
          roleFilter={roleFilter}
          searchTerm={searchTerm}
          setDepartmentFilter={setDepartmentFilter}
          setRoleFilter={setRoleFilter}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
        />
      )}

      {activeSubTab === 'roles' && (
        <RolesSubtabView accounts={accounts} onSelectAccount={(acc) => setSelectedAccount(acc)} />
      )}

      {activeSubTab === 'devices' && (
        <DevicesSubtabView
          accounts={accounts}
          deviceSearchTerm={deviceSearchTerm}
          deviceTypeFilter={deviceTypeFilter}
          devices={devices}
          onOpenDeviceModal={handleOpenDeviceModal}
          onUnbindDevice={handleUnbindDevice}
          setDeviceSearchTerm={setDeviceSearchTerm}
          setDeviceTypeFilter={setDeviceTypeFilter}
        />
      )}

      <AccountsModals
        accounts={accounts}
        devFormCode={devFormCode}
        devFormEmployeeId={devFormEmployeeId}
        devFormError={devFormError}
        devFormMac={devFormMac}
        devFormOs={devFormOs}
        devFormType={devFormType as any}
        departments={departments}
        deviceModalExistingDevice={deviceModalExistingDevice}
        deviceModalTargetAccount={deviceModalTargetAccount}
        devices={devices}
        editEmail={editEmail}
        editName={editName}
        editPosition={editPosition}
        formError={formError}
        handleCopyText={handleCopyText}
        handleCreateAccount={handleCreateAccount}
        handleEditAccount={handleEditAccount}
        handleOpenDeviceModal={handleOpenDeviceModal}
        handleResendInvitation={handleResendInvitation}
        handleRoleChange={handleRoleChange}
        handleSaveDeviceBinding={handleSaveDeviceBinding}
        handleToggleLock={handleToggleLock}
        isChangeRoleModalOpen={isChangeRoleModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        isDeviceModalOpen={isDeviceModalOpen}
        isEditModalOpen={isEditModalOpen}
        isLockModalOpen={isLockModalOpen}
        lockReason={lockReason}
        newCode={newCode}
        newDepartmentId={newDepartmentId}
        newEmail={newEmail}
        newName={newName}
        newPosition={newPosition}
        nextStepPrompt={nextStepPrompt}
        roleChangeReason={roleChangeReason}
        selectedAccount={selectedAccount}
        setDevFormCode={setDevFormCode}
        setDevFormEmployeeId={setDevFormEmployeeId}
        setDevFormMac={setDevFormMac}
        setDevFormOs={setDevFormOs}
        setDevFormType={setDevFormType}
        setEditEmail={setEditEmail}
        setEditName={setEditName}
        setEditPosition={setEditPosition}
        setIsChangeRoleModalOpen={setIsChangeRoleModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsDeviceModalOpen={setIsDeviceModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsLockModalOpen={setIsLockModalOpen}
        setLockReason={setLockReason}
        setNewCode={setNewCode}
        setNewDepartmentId={setNewDepartmentId}
        setNewEmail={setNewEmail}
        setNewName={setNewName}
        setNewPosition={setNewPosition}
        setNextStepPrompt={setNextStepPrompt}
        setRoleChangeReason={setRoleChangeReason}
        setSelectedAccount={setSelectedAccount}
        setTargetDeptIdForManager={setTargetDeptIdForManager}
        setTargetRole={setTargetRole}
        targetDeptIdForManager={targetDeptIdForManager}
        targetRole={targetRole}
      />
    </div>
  )
}
