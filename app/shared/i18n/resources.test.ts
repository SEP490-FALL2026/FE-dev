import { describe, expect, it } from 'vitest'

import { resources } from './resources'

describe('translation resources', () => {
  it('organizes both locales into matching shared, auth and business namespaces', () => {
    const expectedNamespaces = [
      'admin',
      'adminAccounts',
      'adminOrganization',
      'adminPersonnel',
      'auth',
      'common',
      'dashboard',
      'employee',
      'errors',
      'landing',
      'manager',
      'notFound',
      'theme'
    ]

    expect(Object.keys(resources.vi).sort()).toEqual(expectedNamespaces)
    expect(Object.keys(resources.en).sort()).toEqual(expectedNamespaces)
    expect(resources.vi).toHaveProperty('landing.lifecycle.purchased')
    expect(resources.en).toHaveProperty('landing.lifecycle.purchased')
    expect(resources.vi).toHaveProperty('auth.roles.spending-approver.label')
    expect(resources.en).toHaveProperty('auth.roles.spending-approver.label')
    expect(resources.vi).toHaveProperty('dashboard.navigation.overview')
    expect(resources.en).toHaveProperty('dashboard.navigation.overview')
  })

  it('keeps every integrated role translation key in both languages', () => {
    function keys(value: Record<string, unknown>, prefix = ''): string[] {
      return Object.entries(value).flatMap(([key, child]) =>
        child && typeof child === 'object'
          ? keys(child as Record<string, unknown>, `${prefix}${key}.`)
          : [`${prefix}${key}`]
      )
    }
    for (const namespace of [
      'admin',
      'adminAccounts',
      'adminOrganization',
      'adminPersonnel',
      'employee',
      'manager'
    ] as const) {
      expect(keys(resources.en[namespace]).sort(), namespace).toEqual(keys(resources.vi[namespace]).sort())
    }
  })
})
