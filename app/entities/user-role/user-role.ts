export const USER_ROLES = ['super-admin', 'it-admin', 'manager', 'spending-approver', 'finance', 'employee'] as const

export type UserRole = (typeof USER_ROLES)[number]

export function parseUserRole(value: unknown): UserRole | null {
  return typeof value === 'string' && USER_ROLES.includes(value as UserRole) ? (value as UserRole) : null
}
