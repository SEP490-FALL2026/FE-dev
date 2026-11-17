import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { onlineManager } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from '~/shared/api/axios-client'
import { createQueryClient } from '~/shared/api/query-client'
import { env } from '~/shared/config/env'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import {
  clearAuthSession,
  configureAuthQueryClient,
  getAuthSession,
  getAuthState,
  initializeAuthSession,
  login,
  logout,
  refreshAccessToken
} from './auth-session'

const tokenPair = (suffix: string) => ({
  success: true,
  message: 'AUTH.LOGGED_IN',
  data: {
    accessToken: `access-${suffix}`,
    refreshToken: `refresh-${suffix}`,
    tokenType: 'Bearer',
    expiresAt: new Date(Date.now() + 600_000).toISOString(),
    refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString()
  }
})

const me = {
  success: true,
  message: 'ME.RETRIEVED',
  data: {
    managerScope: null,
    appUserId: 'u1',
    loginEmail: 'person@example.com',
    employee: { unplaced: false, id: 'e1', employeeCode: '001', fullName: 'Person', department: null, jobTitle: null },
    roles: ['EMPLOYEE'],
    selfServiceOnly: false
  }
}

describe('auth session', () => {
  const previousAdapter = apiClient.defaults.adapter

  beforeEach(() => {
    clearAuthSession()
    sessionStorage.clear()
    configureAuthQueryClient(createQueryClient())
  })

  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
    configureAuthQueryClient(null)
  })

  it('logs in with generated API, persists tokens, and loads /me', async () => {
    const requests: string[] = []
    const tokens = tokenPair('one')
    apiClient.defaults.adapter = async (config) => {
      requests.push(config.url ?? '')
      return {
        config,
        data: config.url?.endsWith('/me') ? me : tokens,
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }

    await login('person@example.com', 'secret')

    expect(requests).toEqual([`${env.API_BASE_URL}/api/v1/auth/login`, `${env.API_BASE_URL}/api/v1/me`])
    expect(getAuthSession()?.user.loginEmail).toBe('person@example.com')
    expect(JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? 'null')).toEqual(tokens.data)
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
    expect(sessionStorage.getItem('saas-sentry.access-token')).toBeNull()
  })

  it.each([
    { apiRoles: ['MANAGER'], expected: 'manager' },
    { apiRoles: ['SPENDING_APPROVER'], expected: 'spending-approver' },
    { apiRoles: ['IT_ADMIN'], expected: 'it-admin' },
    { apiRoles: ['FINANCE'], expected: 'finance' },
    { apiRoles: ['SUPER_ADMIN'], expected: 'super-admin' },
    { apiRoles: ['EMPLOYEE'], expected: 'employee' }
  ])('opens the $expected workspace from the single API role', async ({ apiRoles, expected }) => {
    apiClient.defaults.adapter = async (config) => ({
      config,
      data: config.url?.endsWith('/me') ? { ...me, data: { ...me.data, roles: apiRoles } } : tokenPair('role'),
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })

    const session = await login('person@example.com', 'secret')

    expect(session.role).toBe(expected)
    expect(session.roles).toContain(expected)
    expect(session.roles).toHaveLength(apiRoles.length)
  })

  it.each([
    { selfServiceOnly: true, expectedRole: null, expectedRoles: [] },
    { selfServiceOnly: false, expectedRole: null, expectedRoles: [] }
  ])(
    'limits an account with no granted roles to self service only when authorized: $selfServiceOnly',
    async ({ selfServiceOnly, expectedRole, expectedRoles }) => {
      apiClient.defaults.adapter = async (config) => ({
        config,
        data: config.url?.endsWith('/me')
          ? { ...me, data: { ...me.data, roles: [], selfServiceOnly } }
          : tokenPair('self-service'),
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      })

      const session = await login('person@example.com', 'secret')

      expect(session.role).toBe(expectedRole)
      expect(session.roles).toEqual(expectedRoles)
      expect(session.user.roles).toEqual([])
    }
  )

  it('uses one refresh call for concurrent requests and rotates the refresh token', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    const refresh = vi.fn(async (config: InternalAxiosRequestConfig) => ({
      config,
      data: tokenPair('two'),
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    }))
    apiClient.defaults.adapter = refresh

    await Promise.all([refreshAccessToken(), refreshAccessToken()])

    expect(refresh).toHaveBeenCalledTimes(1)
    expect(JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? 'null').refreshToken).toBe('refresh-two')
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
  })

  it('does not clear a newer login when an older refresh is rejected', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-old')
    let rejectOld!: (error: unknown) => void
    apiClient.defaults.adapter = async (config) => {
      if (config.url?.endsWith('/auth/refresh'))
        return new Promise((_, reject) => {
          rejectOld = reject
        })
      return {
        config,
        data: config.url?.endsWith('/me') ? me : tokenPair('new'),
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }
    const oldRefresh = refreshAccessToken()
    await vi.waitFor(() => expect(rejectOld).toBeDefined())
    await login('person@example.com', 'secret')
    rejectOld(
      new AxiosError('invalid session', 'ERR_BAD_REQUEST', undefined, undefined, {
        data: { error: { code: 'AUTH.SESSION_INVALID' } },
        status: 401
      } as never)
    )
    await expect(oldRefresh).rejects.toBeInstanceOf(AxiosError)
    expect(getAuthState().status).toBe('authenticated')
    expect(JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? 'null').refreshToken).toBe('refresh-new')
  })

  it('does not share an old session refresh with a newer login', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-old')
    let resolveOld!: (response: AxiosResponse) => void
    let oldConfig!: InternalAxiosRequestConfig
    apiClient.defaults.adapter = async (config) => {
      if (config.url?.endsWith('/auth/refresh')) {
        if (JSON.parse(config.data as string).refreshToken === 'refresh-old') {
          oldConfig = config
          return new Promise((resolve) => {
            resolveOld = resolve
          })
        }
        return { config, data: tokenPair('rotated'), headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
      }
      return {
        config,
        data: config.url?.endsWith('/me') ? me : tokenPair('new'),
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }
    const oldRefresh = refreshAccessToken()
    await vi.waitFor(() => expect(resolveOld).toBeDefined())
    await login('person@example.com', 'secret')
    const newRefresh = refreshAccessToken()
    resolveOld({
      config: oldConfig,
      data: tokenPair('old'),
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })
    await expect(oldRefresh).resolves.toBeNull()
    await expect(newRefresh).resolves.toBe('access-rotated')
  })

  it('updates apiRoles permissions when /me is read again after a responsibility change', async () => {
    const client = createQueryClient()
    configureAuthQueryClient(client)
    apiClient.defaults.adapter = async (config) => ({
      config,
      data: config.url?.endsWith('/me') ? me : tokenPair('one'),
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })
    await login('person@example.com', 'secret')
    client.setQueryData(getMeGetQueryKey(), {
      ...me,
      data: { ...me.data, roles: ['SUPER_ADMIN'] }
    })
    expect(getAuthSession()?.roles).toEqual(['super-admin'])
  })

  it('restores a tab by refreshing then fetching /me', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    apiClient.defaults.adapter = async (config) => ({
      config,
      data: config.url?.endsWith('/me') ? me : tokenPair('two'),
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })

    await initializeAuthSession()

    expect(getAuthSession()?.user.roles).toEqual(['EMPLOYEE'])
  })

  it('shows a recoverable state when checking a session takes too long without duplicating refresh', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    let finishRefresh!: (value: AxiosResponse) => void
    let refreshConfig!: InternalAxiosRequestConfig
    const requests: string[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push(config.url ?? '')
      if (config.url?.endsWith('/auth/refresh')) {
        refreshConfig = config
        return new Promise((resolve) => {
          finishRefresh = resolve
        })
      }
      return { config, data: me, headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }
    try {
      const initialization = initializeAuthSession()
      await vi.waitFor(() => expect(getAuthState().status).toBe('unavailable'), { timeout: 10000, interval: 50 })
      expect(getAuthState().status).toBe('unavailable')
      const retry = initializeAuthSession()
      expect(requests.filter((url) => url.endsWith('/auth/refresh'))).toHaveLength(1)
      finishRefresh({
        config: refreshConfig,
        data: tokenPair('two'),
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      })
      await Promise.all([initialization, retry])
      expect(getAuthState().status).toBe('authenticated')
    } finally {
      if (getAuthState().status !== 'authenticated' && finishRefresh) {
        finishRefresh({
          config: refreshConfig,
          data: tokenPair('two'),
          headers: new AxiosHeaders(),
          status: 200,
          statusText: 'OK'
        })
      }
    }
  }, 15000)

  it('stops checking after a profile timeout without retrying, retains the token, and allows recovery', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    const requests: string[] = []
    let offline = true
    apiClient.defaults.adapter = async (config) => {
      requests.push(config.url ?? '')
      if (offline && config.url?.endsWith('/me')) {
        throw new AxiosError('Request timed out', 'ECONNABORTED', config)
      }
      return {
        config,
        data: config.url?.endsWith('/me') ? me : tokenPair('two'),
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }

    await initializeAuthSession()

    expect(getAuthState().status).toBe('unavailable')
    expect(requests.filter((url) => url.endsWith('/me'))).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? 'null').refreshToken).toBe('refresh-two')

    offline = false
    await initializeAuthSession()
    expect(getAuthState().status).toBe('authenticated')
  })

  it('retains the refresh token after a refresh timeout and recovers on retry', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('Request timed out', 'ECONNABORTED', config)
    }

    await initializeAuthSession()

    expect(getAuthState().status).toBe('unavailable')
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBe('refresh-one')

    apiClient.defaults.adapter = async (config) => ({
      config,
      data: config.url?.endsWith('/me') ? me : tokenPair('two'),
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })
    await initializeAuthSession()

    expect(getAuthState().status).toBe('authenticated')
  })

  it('leaves checking when the browser goes offline before loading the profile', async () => {
    const client = createQueryClient()
    configureAuthQueryClient(client)
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    apiClient.defaults.adapter = async (config) => {
      if (config.url?.endsWith('/me')) throw new AxiosError('Network Error', 'ERR_NETWORK', config)
      onlineManager.setOnline(false)
      return { config, data: tokenPair('two'), headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }

    const initializing = initializeAuthSession()
    try {
      await vi.waitFor(() => expect(getAuthState().status).toBe('unavailable'))
      expect(JSON.parse(localStorage.getItem('saas-sentry.auth-tokens') ?? 'null').refreshToken).toBe('refresh-two')
    } finally {
      await client.cancelQueries()
      onlineManager.setOnline(true)
      await initializing
    }
  })

  it('sends logout with the refresh token and clears the local session', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    const requests: string[] = []
    apiClient.defaults.adapter = async (config) => {
      requests.push(config.url ?? '')
      return { config, data: undefined, headers: new AxiosHeaders(), status: 204, statusText: 'No Content' }
    }

    await logout()

    expect(requests).toEqual([`${env.API_BASE_URL}/api/v1/auth/logout`])
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
  })

  it('logs out with the rotated token when refresh and logout overlap', async () => {
    sessionStorage.setItem('saas-sentry.refresh-token', 'refresh-one')
    let logoutBody: { refreshToken: string } | null = null
    apiClient.defaults.adapter = async (config) => {
      if (config.url?.endsWith('/auth/logout')) logoutBody = JSON.parse(config.data as string)
      return {
        config,
        data: config.url?.endsWith('/auth/refresh') ? tokenPair('two') : undefined,
        headers: new AxiosHeaders(),
        status: config.url?.endsWith('/auth/refresh') ? 200 : 204,
        statusText: 'OK'
      }
    }

    await Promise.all([refreshAccessToken(), logout()])

    expect(logoutBody).toEqual({ refreshToken: 'refresh-two' })
    expect(sessionStorage.getItem('saas-sentry.refresh-token')).toBeNull()
  })
})
