import type { UserRole } from '~/entities/user-role/user-role'

export type DemoAccount = {
  displayName: string
  email: string
  password: string
  role: UserRole
}

export const demoAccounts: readonly DemoAccount[] = [
  {
    displayName: 'Minh Anh',
    email: 'superadmin@saas-sentry.test',
    password: 'Demo@123',
    role: 'super-admin'
  },
  {
    displayName: 'Quang Huy',
    email: 'itadmin@saas-sentry.test',
    password: 'Demo@123',
    role: 'it-admin'
  },
  {
    displayName: 'Thu Hà',
    email: 'manager@saas-sentry.test',
    password: 'Demo@123',
    role: 'manager'
  },
  {
    displayName: 'Hoàng Nam',
    email: 'approver@saas-sentry.test',
    password: 'Demo@123',
    role: 'spending-approver'
  },
  {
    displayName: 'Ngọc Lan',
    email: 'finance@saas-sentry.test',
    password: 'Demo@123',
    role: 'finance'
  },
  {
    displayName: 'Đức Anh',
    email: 'employee@saas-sentry.test',
    password: 'Demo@123',
    role: 'employee'
  }
]

export function matchDemoAccount(email: string, password: string): DemoAccount | null {
  const normalizedEmail = email.trim().toLocaleLowerCase('en-US')

  return (
    demoAccounts.find(
      (account) => account.email.toLocaleLowerCase('en-US') === normalizedEmail && account.password === password
    ) ?? null
  )
}
