export type E2eRole = 'super-admin' | 'finance' | 'it-admin' | 'manager' | 'spending-approver' | 'employee'

export interface E2eAccount {
  role: E2eRole
  email: string
  /** Name of the environment variable that holds the password; the value never appears in the repository. */
  passwordVariable: string
}

// Seed e-mail addresses are the public `.example` ones; passwords come from .env.e2e only.
export const ACCOUNTS: Record<E2eRole, E2eAccount> = {
  'super-admin': {
    role: 'super-admin',
    email: process.env.E2E_SUPER_ADMIN_EMAIL ?? '',
    passwordVariable: 'E2E_SUPER_ADMIN_PASSWORD'
  },
  finance: { role: 'finance', email: 'phuc.trinh@saoviet.example', passwordVariable: 'E2E_SEED_PASSWORD' },
  'it-admin': { role: 'it-admin', email: 'quan.ly@saoviet.example', passwordVariable: 'E2E_SEED_PASSWORD' },
  manager: {
    role: 'manager',
    email: process.env.E2E_MANAGER_EMAIL || 'cuong.le@saoviet.example',
    passwordVariable: 'E2E_SEED_PASSWORD'
  },
  'spending-approver': {
    role: 'spending-approver',
    email: 'an.nguyen@saoviet.example',
    passwordVariable: 'E2E_SEED_PASSWORD'
  },
  employee: {
    role: 'employee',
    email: process.env.E2E_EMPLOYEE_EMAIL ?? '',
    passwordVariable: 'E2E_EMPLOYEE_PASSWORD'
  }
}

export function credentialsFor(role: E2eRole) {
  const account = ACCOUNTS[role]
  const password = process.env[account.passwordVariable]
  return account.email && password ? { email: account.email, password } : null
}
