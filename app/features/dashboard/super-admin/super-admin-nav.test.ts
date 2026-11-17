import { describe, expect, it } from 'vitest'
import { isValidSuperAdminTab, superAdminNavItems } from './super-admin-nav'

describe('super admin navigation', () => {
  it('no longer offers the removed audit page, including old links', () => {
    expect(superAdminNavItems.map((item) => item.key)).not.toContain('audit-trail')
    expect(isValidSuperAdminTab('audit-trail')).toBe(false)
    expect(isValidSuperAdminTab('personnel')).toBe(true)
  })

  it.each(['ghost-seats', 'settings'])('removes %s from navigation and old links', (tab) => {
    expect(superAdminNavItems.map((item) => item.key)).not.toContain(tab)
    expect(isValidSuperAdminTab(tab)).toBe(false)
  })
})
