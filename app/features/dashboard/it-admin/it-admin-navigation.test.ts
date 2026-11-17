import { expect, it } from 'vitest'
import { getParentMenuKey, isValidItAdminTab, itAdminMenuItems } from './it-admin-nav'

it('groups the catalog and department configuration under software catalog', () => {
  const group = itAdminMenuItems.find((item) => item.key === 'software-catalog')
  expect(group?.children?.map((child) => child.key)).toEqual(['dept-catalog', 'department-software'])
  expect(getParentMenuKey('dept-catalog')).toBe('software-catalog')
  expect(getParentMenuKey('department-software')).toBe('software-catalog')
})

it('does not expose reconciliation in the IT administrator workspace', () => {
  expect(isValidItAdminTab('reconciliation')).toBe(false)
  const tabs: string[] = itAdminMenuItems.flatMap((item) => item.children ?? []).map((item) => item.key)
  expect(tabs).not.toContain('reconciliation')
})

it('makes the shared stock workspace accessible from navigation', () => {
  expect(isValidItAdminTab('shared-stock')).toBe(true)
  const tabs: string[] = itAdminMenuItems.flatMap((item) => item.children ?? []).map((item) => item.key)
  expect(tabs).toContain('shared-stock')
})
