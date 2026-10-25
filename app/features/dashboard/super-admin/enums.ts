export const SUPER_ADMIN_TAB_KEYS = [
  'overview',
  'departments',
  'accounts',
  'personnel',
  'reminders',
  'settings',
  'transfer',
  'audit-trail'
] as const

export type SuperAdminTabKey = (typeof SUPER_ADMIN_TAB_KEYS)[number]

export const USER_ACCOUNT_ROLES = [
  'EMPLOYEE',
  'MANAGER',
  'FINANCE',
  'SPENDING_APPROVER',
  'IT_ADMIN',
  'SUPER_ADMIN'
] as const

export type UserAccountRole = (typeof USER_ACCOUNT_ROLES)[number]

export const ACCOUNT_STATUSES = ['ACTIVE', 'INVITED', 'LOCKED', 'DEACTIVATED'] as const
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]

export const DEVICE_TYPES = ['LAPTOP', 'DESKTOP', 'MACBOOK', 'WORKSTATION'] as const
export type DeviceType = (typeof DEVICE_TYPES)[number]

export const DEVICE_TRACKING_STATUSES = ['TRACKING', 'PENDING_PAIR', 'OFFLINE', 'UNBOUND'] as const
export type DeviceTrackingStatus = (typeof DEVICE_TRACKING_STATUSES)[number]

export const DEPARTMENT_STATUSES = ['ACTIVE', 'INACTIVE'] as const
export type DepartmentStatus = (typeof DEPARTMENT_STATUSES)[number]
