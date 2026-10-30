import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
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
    appUserId: 'u1',
    loginEmail: 'person@example.com',
    employee: { id: 'e1', employeeCode: '001', fullName: 'Person', department: null, jobTitle: null },
    roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] },
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

  it('updates effective permissions when /me is read again after a responsibility change', async () => {
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
      data: { ...me.data, roles: { direct: ['SUPER_ADMIN'], derived: [], effective: ['SUPER_ADMIN'] } }
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

    expect(getAuthSession()?.user.roles.effective).toEqual(['EMPLOYEE'])
  })

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
