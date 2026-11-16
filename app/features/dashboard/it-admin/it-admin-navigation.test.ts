import { expect, it } from 'vitest'
import { isValidItAdminTab, itAdminMenuItems } from './it-admin-nav'

it('exposes the backend reconciliation workflow', () => {
  expect(isValidItAdminTab('reconciliation')).toBe(true)
  const tabs: string[] = itAdminMenuItems.flatMap((item) => item.children ?? []).map((item) => item.key)
  expect(tabs).toContain('reconciliation')
})

it('makes the shared stock workspace accessible from navigation', () => {
  expect(isValidItAdminTab('shared-stock')).toBe(true)
  const tabs: string[] = itAdminMenuItems.flatMap((item) => item.children ?? []).map((item) => item.key)
  expect(tabs).toContain('shared-stock')
})
