import { describe, expect, it } from 'vitest'

import { resources } from './resources'

describe('translation resources', () => {
  it('organizes both locales into matching shared and pre-auth namespaces', () => {
    const expectedNamespaces = ['auth', 'common', 'dashboard', 'errors', 'landing', 'notFound', 'theme']

    expect(Object.keys(resources.vi).sort()).toEqual(expectedNamespaces)
    expect(Object.keys(resources.en).sort()).toEqual(expectedNamespaces)
    expect(resources.vi).toHaveProperty('landing.lifecycle.purchased')
    expect(resources.en).toHaveProperty('landing.lifecycle.purchased')
    expect(resources.vi).toHaveProperty('auth.roles.spending-approver.label')
    expect(resources.en).toHaveProperty('auth.roles.spending-approver.label')
    expect(resources.vi).toHaveProperty('dashboard.navigation.overview')
    expect(resources.en).toHaveProperty('dashboard.navigation.overview')
  })
})
