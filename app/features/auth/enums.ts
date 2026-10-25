export const AUTH_ROLES = [
  'super-admin',
  'it-admin',
  'manager',
  'spending-approver',
  'finance',
  'employee'
] as const

export type AuthRole = (typeof AUTH_ROLES)[number]

export const AUTH_STATUSES = ['IDLE', 'AUTHENTICATING', 'AUTHENTICATED', 'ERROR'] as const
export type AuthStatus = (typeof AUTH_STATUSES)[number]
