import { createInstance } from 'i18next'
import { describe, expect, it, vi } from 'vitest'

import { initialResources } from './initial-resources'
import { resourceBackend } from './resource-backend'

describe('on-demand translation resources', () => {
  it('loads a requested business namespace without loading other role resources', async () => {
    const instance = createInstance()
    await instance.use(resourceBackend).init({
      resources: structuredClone(initialResources),
      partialBundledLanguages: true,
      lng: 'vi',
      fallbackLng: 'vi',
      ns: ['common'],
      defaultNS: 'common',
      initAsync: false
    })

    expect(instance.hasResourceBundle('vi', 'itCatalog')).toBe(false)
    expect(instance.hasResourceBundle('vi', 'finance')).toBe(false)
    await instance.loadNamespaces('itCatalog')
    expect(instance.hasResourceBundle('vi', 'itCatalog')).toBe(true)
    expect(instance.hasResourceBundle('vi', 'finance')).toBe(false)
    expect(instance.hasResourceBundle('en', 'itCatalog')).toBe(false)

    await instance.changeLanguage('en')
    expect(instance.hasResourceBundle('en', 'itCatalog')).toBe(true)
    expect(instance.hasResourceBundle('en', 'finance')).toBe(false)
    expect(instance.getResourceBundle('en', 'itCatalog')).not.toEqual(instance.getResourceBundle('vi', 'itCatalog'))
  })

  it('reports unavailable resources to i18next without retrying a nonexistent namespace', () => {
    const callback = vi.fn()
    resourceBackend.read('vi', 'missing-namespace', callback)
    expect(callback).toHaveBeenCalledWith(expect.any(Error), false)
  })
})
