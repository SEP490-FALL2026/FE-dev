import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'saas-sentry.auth-tokens'
const tokens = {
  accessToken: 'access-saved',
  refreshToken: 'refresh-saved',
  tokenType: 'Bearer',
  expiresAt: new Date(Date.now() + 600_000).toISOString(),
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString()
}
const me = {
  success: true,
  message: 'ME.RETRIEVED',
  data: {
    appUserId: 'u1',
    loginEmail: 'person@example.com',
    employee: null,
    roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] },
    selfServiceOnly: false
  }
}

async function openApp() {
  vi.resetModules()
  const auth = await import('./auth-session')
  const { apiClient } = await import('~/shared/api/axios-client')
  const { createQueryClient } = await import('~/shared/api/query-client')
  auth.configureAuthQueryClient(createQueryClient())
  return { auth, apiClient }
}

describe('persistent browser authentication', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  afterEach(() => vi.restoreAllMocks())

  it('persists login tokens and sends the access token to the profile API', async () => {
    const { auth, apiClient } = await openApp()
    const authorization: unknown[] = []
    apiClient.defaults.adapter = async (config) => {
      authorization.push(config.headers.get('Authorization'))
      return {
        config,
        data: config.url?.endsWith('/me') ? me : { success: true, data: tokens },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }

    await auth.login('person@example.com', 'secret')

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual(tokens)
    expect(authorization).toEqual([undefined, 'Bearer access-saved'])
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
  })

  it('restores a reopened app using the stored access token without refreshing', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    const { auth, apiClient } = await openApp()
    const requests: unknown[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push([config.url?.split('/').pop(), config.headers.get('Authorization')])
      return { config, data: me, headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }

    await auth.initializeAuthSession()

    expect(auth.getAuthState().status).toBe('authenticated')
    expect(requests).toEqual([['me', 'Bearer access-saved']])
  })

  it('refreshes expired access tokens and persists the rotated pair before loading the profile', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...tokens, expiresAt: '2020-01-01T00:00:00Z' }))
    const { auth, apiClient } = await openApp()
    const requests: unknown[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push([config.url?.split('/').pop(), config.headers.get('Authorization'), config.data])
      return {
        config,
        data: config.url?.endsWith('/me') ? me : { success: true, data: tokens },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }

    await auth.initializeAuthSession()

    expect(auth.getAuthState().status).toBe('authenticated')
    expect(requests).toEqual([
      ['refresh', undefined, '{"refreshToken":"refresh-saved"}'],
      ['me', 'Bearer access-saved', undefined]
    ])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual(tokens)
  })

  it('clears persisted tokens when the backend rejects the refresh session', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...tokens, expiresAt: '2020-01-01T00:00:00Z' }))
    const { auth, apiClient } = await openApp()
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
        config,
        data: { error: { code: 'AUTH.SESSION_INVALID' } },
        headers: new AxiosHeaders(),
        status: 401,
        statusText: 'Unauthorized'
      })
    }

    await auth.initializeAuthSession()

    expect(auth.getAuthState().status).toBe('guest')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('revokes the persisted refresh token and removes browser credentials on logout', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    sessionStorage.setItem('saas-sentry.refresh-token', 'legacy-refresh')
    const { auth, apiClient } = await openApp()
    const requests: unknown[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push([config.url?.split('/').pop(), config.data, config.headers.get('Authorization')])
      return { config, data: undefined, headers: new AxiosHeaders(), status: 204, statusText: 'No Content' }
    }

    await auth.logout()

    expect(requests).toEqual([['logout', '{"refreshToken":"refresh-saved"}', undefined]])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
    expect(auth.getAuthState().status).toBe('guest')
  })

  it('can refresh within the current app when browser storage is blocked', async () => {
    const { auth, apiClient } = await openApp()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked')
    })
    const requests: string[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push(config.url?.split('/').pop() ?? '')
      return {
        config,
        data: config.url?.endsWith('/me') ? me : { success: true, data: tokens },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }

    await auth.login('person@example.com', 'secret')
    await expect(auth.refreshAccessToken()).resolves.toBe('access-saved')
    expect(requests).toEqual(['login', 'me', 'refresh'])
  })

  it('uses the rotated refresh token when persistent storage stays readable but writes fail', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    const { auth, apiClient } = await openApp()
    const originalSetItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (this === localStorage) throw new Error('Quota exceeded')
      originalSetItem.call(this, key, value)
    })
    const refreshBodies: unknown[] = []
    apiClient.defaults.adapter = async (config) => {
      refreshBodies.push(JSON.parse(config.data as string))
      return {
        config,
        data: { success: true, data: { ...tokens, refreshToken: 'refresh-rotated' } },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }

    await auth.refreshAccessToken()
    await auth.logout()

    expect(refreshBodies).toEqual([{ refreshToken: 'refresh-saved' }, { refreshToken: 'refresh-rotated' }])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
  })

  it.each([
    '{broken',
    JSON.stringify({ ...tokens, expiresAt: 'invalid' }),
    JSON.stringify({ accessToken: 'incomplete' })
  ])('treats malformed persisted credentials as a guest', async (stored) => {
    localStorage.setItem(STORAGE_KEY, stored)
    const { auth, apiClient } = await openApp()
    apiClient.defaults.adapter = async () => {
      throw new Error('Unexpected request')
    }

    await auth.initializeAuthSession()

    expect(auth.getAuthState().status).toBe('guest')
  })
})
