import { expect, it } from 'vitest'
import { isValidItAdminTab, itAdminMenuItems } from './it-admin-nav'

it('does not expose cost reconciliation without a backend workflow', () => {
  expect(isValidItAdminTab('reconciliation')).toBe(false)
  const tabs: string[] = itAdminMenuItems.flatMap((item) => item.children ?? []).map((item) => item.key)
  expect(tabs).not.toContain('reconciliation')
})

it('makes the shared stock workspace accessible from navigation', () => {
  expect(isValidItAdminTab('shared-stock')).toBe(true)
  const tabs: string[] = itAdminMenuItems.flatMap((item) => item.children ?? []).map((item) => item.key)
  expect(tabs).toContain('shared-stock')
})
