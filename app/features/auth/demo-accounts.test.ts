import { describe, expect, it } from 'vitest'

import { USER_ROLES } from '~/entities/user-role/user-role'

import { demoAccounts, matchDemoAccount } from './demo-accounts'

describe('demo accounts', () => {
  it('provides one login account for every human role', () => {
    expect(demoAccounts.map(({ role }) => role)).toEqual(USER_ROLES)
    expect(new Set(demoAccounts.map(({ email }) => email)).size).toBe(6)
  })

  it('matches normalized email with an exact password', () => {
    expect(matchDemoAccount(' FINANCE@SAAS-SENTRY.TEST ', 'Demo@123')?.role).toBe('finance')
    expect(matchDemoAccount('finance@saas-sentry.test', ' Demo@123')).toBeNull()
  })

  it('rejects unknown credentials', () => {
    expect(matchDemoAccount('nobody@saas-sentry.test', 'Demo@123')).toBeNull()
    expect(matchDemoAccount('', '')).toBeNull()
  })
})
