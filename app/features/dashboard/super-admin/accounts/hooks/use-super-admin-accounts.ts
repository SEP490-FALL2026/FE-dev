import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  AccountStatus,
  Department,
  EmployeeDevice,
  UserAccount,
  UserAccountRole
} from '../../super-admin-data'
import {
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEE_DEVICES,
  INITIAL_USER_ACCOUNTS
} from '../../super-admin-data'
import type { DeviceType } from '../../enums'

export function useSuperAdminAccounts() {
  const { t } = useTranslation('dashboard')
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS)
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS)
  const [devices, setDevices] = useState<EmployeeDevice[]>(INITIAL_EMPLOYEE_DEVICES)

  // Sub-tabs: 'accounts' (SA-03), 'roles' (SA-05), 'devices' (SA-06)
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'roles' | 'devices'>('accounts')

  // Search and filters for Accounts
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter] = useState<string>('ALL')
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL')

  // Search and filters for Devices
  const [deviceSearchTerm, setDeviceSearchTerm] = useState('')
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('ALL')

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
  const [newPosition, setNewPosition] = useState('')
  const [newDepartmentId, setNewDepartmentId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  // Form states for edit user
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPosition, setEditPosition] = useState('')

  // Form states for role change
  const [targetRole, setTargetRole] = useState<UserAccountRole>('FINANCE')
  const [targetDeptIdForManager, setTargetDeptIdForManager] = useState<string>('')
  const [roleChangeReason, setRoleChangeReason] = useState('')

  // Lock account reason
  const [lockReason, setLockReason] = useState('')

  // Modal: Device Identification
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
  const [deviceModalTargetAccount, setDeviceModalTargetAccount] = useState<UserAccount | null>(null)
  const [deviceModalExistingDevice, setDeviceModalExistingDevice] = useState<EmployeeDevice | null>(null)

  // Device Form States
  const [devFormEmployeeId, setDevFormEmployeeId] = useState('')
  const [devFormCode, setDevFormCode] = useState('')
  const [devFormType, setDevFormType] = useState<DeviceType>('LAPTOP')
  const [devFormOs, setDevFormOs] = useState('Windows 11 Pro 64-bit')
  const [devFormMac, setDevFormMac] = useState('')
  const [devFormError, setDevFormError] = useState<string | null>(null)

  // Next step prompt after creating account
  const [nextStepPrompt, setNextStepPrompt] = useState<{ open: boolean; account: UserAccount | null }>({
    account: null,
    open: false
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text)
    showToast(t('superAdmin.accounts.toast.copySuccess'))
  }

  // Device identification handlers
  const handleOpenDeviceModal = (acc?: UserAccount | null, existingDev?: EmployeeDevice | null) => {
    setDevFormError(null)
    const employeeAccounts = accounts.filter((a) => a.role === 'EMPLOYEE')
    const unassignedDevs = devices.filter((d) => !d.assignedEmployeeId)

    const targetAcc = acc && acc.role === 'EMPLOYEE' ? acc : null

    setDeviceModalTargetAccount(targetAcc)
    setDeviceModalExistingDevice(existingDev || null)

    if (existingDev) {
      setDevFormEmployeeId(existingDev.assignedEmployeeId || '')
      setDevFormCode(existingDev.deviceCode)
      setDevFormType((existingDev.deviceType as DeviceType) || 'LAPTOP')
      setDevFormOs(existingDev.os)
      setDevFormMac(existingDev.macAddress)
    } else {
      const firstUnassignedDev = unassignedDevs[0]
      setDevFormEmployeeId(targetAcc?.id || employeeAccounts[0]?.id || '')
      setDevFormCode(firstUnassignedDev?.deviceCode || '')
      setDevFormType((firstUnassignedDev?.deviceType as DeviceType) || 'LAPTOP')
      setDevFormOs(firstUnassignedDev?.os || 'Windows 11 Pro 64-bit')
      setDevFormMac(firstUnassignedDev?.macAddress || '')
    }

    setIsDeviceModalOpen(true)
  }

  const handleSaveDeviceBinding = (e: React.FormEvent) => {
    e.preventDefault()
    setDevFormError(null)

    if (!devFormEmployeeId) {
      setDevFormError(t('superAdmin.accounts.errors.selectEmployee'))
      return
    }

    const assignedAcc = accounts.find((a) => a.id === devFormEmployeeId)
    if (!assignedAcc) {
      setDevFormError(t('superAdmin.accounts.errors.employeeNotFound'))
      return
    }

    const cleanDevCode = devFormCode.trim().toUpperCase()
    if (!cleanDevCode) {
      setDevFormError(t('superAdmin.accounts.errors.enterDeviceCode'))
      return
    }

    const targetDev: EmployeeDevice = devices.find((d) => d.deviceCode.toUpperCase() === cleanDevCode) || {
      deviceCode: cleanDevCode,
      hostname: `${assignedAcc.name.replace(/\s+/g, '-').toLowerCase()}-pc`,
      id: `dev-${Date.now()}`,
      macAddress: devFormMac || `00:1A:2B:${Math.floor(Math.random() * 89 + 10)}:${Math.floor(Math.random() * 89 + 10)}:99`,
      os: devFormOs || 'Windows 11 Pro 64-bit',
      pairingToken: `sentry-token-${Date.now().toString(36)}`,
      trackingStatus: 'TRACKING'
    }

    const updatedDevice: EmployeeDevice = {
      ...targetDev,
      assignedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      assignedEmployeeCode: assignedAcc.employeeCode,
      assignedEmployeeId: assignedAcc.id,
      assignedEmployeeName: assignedAcc.name,
      departmentName: assignedAcc.departmentName,
      macAddress: devFormMac || targetDev.macAddress,
      os: devFormOs || targetDev.os
    }

    setDevices((prev) =>
      prev.map((d) => {
        if (d.deviceCode === updatedDevice.deviceCode) return updatedDevice
        if (d.assignedEmployeeId === assignedAcc.id) {
          return {
            ...d,
            assignedAt: undefined,
            assignedEmployeeCode: undefined,
            assignedEmployeeId: undefined,
            assignedEmployeeName: undefined,
            departmentName: undefined
          }
        }
        return d
      })
    )

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === assignedAcc.id
          ? { ...a, assignedDeviceCode: updatedDevice.deviceCode, assignedDeviceId: updatedDevice.id, deviceTrackingStatus: 'TRACKING' }
          : a
      )
    )

    if (selectedAccount?.id === assignedAcc.id) {
      setSelectedAccount((prev) =>
        prev
          ? { ...prev, assignedDeviceCode: updatedDevice.deviceCode, assignedDeviceId: updatedDevice.id, deviceTrackingStatus: 'TRACKING' }
          : null
      )
    }

    setIsDeviceModalOpen(false)
    showToast(t('superAdmin.accounts.toast.deviceBoundSuccess', { code: updatedDevice.deviceCode, name: assignedAcc.name }))
  }

  const handleUnbindDevice = (device: EmployeeDevice) => {
    if (!confirm(t('superAdmin.accounts.toast.confirmUnbindDevice', { code: device.deviceCode, name: device.assignedEmployeeName || '' }))) {
      return
    }

    const empId = device.assignedEmployeeId
    setDevices((prev) =>
      prev.map((d) => (d.id === device.id ? { ...d, assignedAt: undefined, assignedEmployeeCode: undefined, assignedEmployeeId: undefined, assignedEmployeeName: undefined, departmentName: undefined } : d))
    )

    if (empId) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === empId ? { ...a, assignedDeviceCode: undefined, assignedDeviceId: undefined, deviceTrackingStatus: 'UNBOUND' } : a))
      )
      if (selectedAccount?.id === empId) {
        setSelectedAccount((prev) => (prev ? { ...prev, assignedDeviceCode: undefined, assignedDeviceId: undefined, deviceTrackingStatus: 'UNBOUND' } : null))
      }
    }

    showToast(t('superAdmin.accounts.toast.deviceUnboundSuccess', { code: device.deviceCode, name: device.assignedEmployeeName || '' }))
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

  // Create Account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const cleanCode = newCode.trim().toUpperCase()
    const cleanEmail = newEmail.trim().toLowerCase()
    const cleanName = newName.trim()

    if (!cleanCode || !cleanEmail || !cleanName) {
      setFormError(t('superAdmin.accounts.errors.requiredFields'))
      return
    }

    if (accounts.some((a) => a.employeeCode.toUpperCase() === cleanCode)) {
      setFormError(t('superAdmin.accounts.errors.duplicateCode', { code: cleanCode }))
      return
    }

    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      setFormError(t('superAdmin.accounts.errors.duplicateEmail', { email: cleanEmail }))
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
      name: cleanName,
      position: newPosition.trim() || 'Nhân viên',
      role: 'EMPLOYEE',
      status: 'INVITED'
    }

    setAccounts([newAccount, ...accounts])
    setIsCreateModalOpen(false)
    setNewCode('')
    setNewName('')
    setNewEmail('')
    setNewPosition('')
    setNewDepartmentId('')

    showToast(t('superAdmin.accounts.toast.createSuccess', { name: cleanName }))
    setNextStepPrompt({ account: newAccount, open: true })
  }

  // Edit Account
  const handleEditAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return

    const cleanName = editName.trim()
    const cleanEmail = editEmail.trim().toLowerCase()

    if (!cleanName || !cleanEmail) return

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === selectedAccount.id
          ? { ...a, email: cleanEmail, name: cleanName, position: editPosition.trim() }
          : a
      )
    )

    setSelectedAccount((prev) =>
      prev ? { ...prev, email: cleanEmail, name: cleanName, position: editPosition.trim() } : null
    )

    setIsEditModalOpen(false)
    showToast(t('superAdmin.accounts.toast.updateSuccess'))
  }

  // Change Role
  const handleRoleChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return

    if (targetRole === 'SUPER_ADMIN') {
      alert(t('superAdmin.accounts.errors.singletonSuperAdmin'))
      return
    }

    if (targetRole === 'SPENDING_APPROVER') {
      const existingApprover = accounts.find((a) => a.role === 'SPENDING_APPROVER' && a.id !== selectedAccount.id)
      if (existingApprover) {
        alert(t('superAdmin.accounts.errors.singletonApprover', { name: existingApprover.name }))
        return
      }
    }

    let targetDept = departments.find((d) => d.id === selectedAccount.departmentId)
    if (targetRole === 'MANAGER') {
      if (!targetDeptIdForManager) {
        alert(t('superAdmin.accounts.errors.selectDeptManager'))
        return
      }
      targetDept = departments.find((d) => d.id === targetDeptIdForManager)
    }

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === selectedAccount.id) {
          return {
            ...a,
            departmentCode: targetDept?.code || a.departmentCode,
            departmentId: targetDept?.id || a.departmentId,
            departmentName: targetDept?.name || a.departmentName,
            role: targetRole
          }
        }
        if (targetRole === 'MANAGER' && targetDept && a.departmentId === targetDept.id && a.role === 'MANAGER') {
          return { ...a, role: 'EMPLOYEE' }
        }
        return a
      })
    )

    setSelectedAccount((prev) =>
      prev
        ? {
            ...prev,
            departmentCode: targetDept?.code || prev.departmentCode,
            departmentId: targetDept?.id || prev.departmentId,
            departmentName: targetDept?.name || prev.departmentName,
            role: targetRole
          }
        : null
    )

    setIsChangeRoleModalOpen(false)
    setRoleChangeReason('')
    showToast(t('superAdmin.accounts.toast.roleUpdatedSuccess', { name: selectedAccount.name, role: targetRole }))
  }

  // Toggle Lock
  const handleToggleLock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccount) return

    const newStatus: AccountStatus = selectedAccount.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'

    setAccounts((prev) =>
      prev.map((a) => (a.id === selectedAccount.id ? { ...a, status: newStatus } : a))
    )

    setSelectedAccount((prev) => (prev ? { ...prev, status: newStatus } : null))
    setIsLockModalOpen(false)
    setLockReason('')
    showToast(
      newStatus === 'LOCKED'
        ? t('superAdmin.accounts.toast.accountLocked', { name: selectedAccount.name })
        : t('superAdmin.accounts.toast.accountUnlocked', { name: selectedAccount.name })
    )
  }

  // Resend invitation
  const handleResendInvitation = () => {
    if (!selectedAccount) return
    showToast(t('superAdmin.accounts.toast.invitationResent', { email: selectedAccount.email }))
  }

  // Export CSV
  const handleExportAccountsCsv = () => {
    const headers = ['Mã NV', 'Họ và tên', 'Email', 'Chức danh', 'Phòng ban', 'Mã thiết bị', 'Role duy nhất', 'Trạng thái']
    const rows = filteredAccounts.map((a) => [
      a.employeeCode,
      `"${a.name}"`,
      a.email,
      `"${a.position}"`,
      `"${a.departmentName || 'Chưa xếp phòng'}"`,
      `"${a.assignedDeviceCode || 'Chưa định danh'}"`,
      a.role,
      a.status
    ])

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `danh_sach_tai_khoan_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(t('superAdmin.accounts.toast.exportCsvSuccess'))
  }

  return {
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
  }
}
