import type { UserRole } from '~/entities/user-role/user-role'
import { demoAccounts, type DemoAccount } from './demo-accounts'

const SESSION_STORAGE_KEY = 'saas_sentry_auth_session'

let inMemorySession: DemoAccount | null = null

export function getAuthSession(): DemoAccount | null {
  if (typeof window === 'undefined') {
    return inMemorySession
  }
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as DemoAccount
    }
  } catch {
    // sessionStorage unavailable or restricted
  }
  return inMemorySession
}

export function setAuthSession(account: DemoAccount): void {
  inMemorySession = account
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(account))
    } catch {
      // sessionStorage unavailable or restricted
    }
  }
}

export function clearAuthSession(): void {
  inMemorySession = null
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // sessionStorage unavailable or restricted
    }
  }
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}

export function getCurrentUserRole(): UserRole | null {
  const session = getAuthSession()
  return session ? (session.role as UserRole) : null
}

export function seedDefaultSessionForRole(role: UserRole): DemoAccount {
  const account = demoAccounts.find((item) => item.role === role) || demoAccounts[0]
  setAuthSession(account)
  return account
}
