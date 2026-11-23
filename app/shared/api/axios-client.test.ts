import { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { env } from '~/shared/config/env'

import { apiClient, createApiClient, type ApiAuthAdapter } from './axios-client'
import { authLogin } from './generated/operations/auth/auth-login'
import { customAxios } from './mutator/custom-axios'

function unauthorized(config: InternalAxiosRequestConfig): AxiosError {
  return new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
    config,
    data: { success: false, error: { code: 'INVALID_ACCESS_TOKEN' } },
    headers: new AxiosHeaders(),
    status: 401,
    statusText: 'Unauthorized'
  })
}

describe('Axios API client', () => {
  it('bounds requests by default so session initialization cannot wait indefinitely', async () => {
    const client = createApiClient(() => null)
    let timeout: number | undefined
    client.defaults.adapter = async (config) => {
      timeout = config.timeout
      return { config, data: 'ok', headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }

    await client.get('/api/v1/me')

    expect(timeout).toBeGreaterThan(0)
    expect(timeout).toBeLessThanOrEqual(15_000)
  })
  it('routes a generated Orval operation through the shared Axios client', async () => {
    const previousAdapter = apiClient.defaults.adapter
    const requestedUrls: string[] = []
    apiClient.defaults.adapter = async (config) => {
      requestedUrls.push(config.url ?? '')
      return { config, data: { success: true }, headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }

    try {
      await expect(authLogin({ email: 'a@example.com', password: 'secret' })).resolves.toEqual({ success: true })
      expect(requestedUrls).toEqual([`${env.API_BASE_URL}/api/v1/auth/login`])
    } finally {
      apiClient.defaults.adapter = previousAdapter
    }
  })

  it('keeps the generated URL, method, and body when per-request options are provided', async () => {
    const previousAdapter = apiClient.defaults.adapter
    const sentRequests: Array<{ url: string | undefined; method: string | undefined; body: unknown }> = []
    apiClient.defaults.adapter = async (config) => {
      sentRequests.push({ url: config.url, method: config.method, body: config.data })
      return { config, data: { id: 'account-1' }, headers: new AxiosHeaders(), status: 201, statusText: 'Created' }
    }

    try {
      await customAxios(
        { url: '/api/accounts', method: 'POST', data: { name: 'Alice' } },
        { headers: { 'X-Request-Id': 'request-1' } }
      )
      expect(sentRequests).toEqual([{ url: '/api/accounts', method: 'post', body: JSON.stringify({ name: 'Alice' }) }])
    } finally {
      apiClient.defaults.adapter = previousAdapter
    }
  })

  it('adds the current access token without replacing an explicit Authorization header', async () => {
    const requests: Array<string | undefined> = []
    const authAdapter: ApiAuthAdapter = {
      getAccessToken: () => 'current-token',
      refreshAccessToken: vi.fn()
    }
    const client = createApiClient(() => authAdapter)
    const transport: AxiosAdapter = async (config) => {
      requests.push(config.headers.get('Authorization')?.toString())
      return { config, data: 'ok', headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }
    client.defaults.adapter = transport

    await client.get('/api/accounts')
    await client.get('/api/accounts', { headers: { Authorization: 'Bearer explicit-token' } })
    await client.get('/api/public', { skipAuth: true })

    expect(requests).toEqual(['Bearer current-token', 'Bearer explicit-token', undefined])
  })

  it('refreshes once for concurrent 401 responses and retries each request with the new token', async () => {
    let accessToken = 'expired-token'
    const refreshAccessToken = vi.fn(async () => {
      await Promise.resolve()
      accessToken = 'renewed-token'
      return accessToken
    })
    const authAdapter: ApiAuthAdapter = { getAccessToken: () => accessToken, refreshAccessToken }
    const client = createApiClient(() => authAdapter)
    const requests: string[] = []
    client.defaults.adapter = async (config) => {
      const authorization = config.headers.get('Authorization')?.toString() ?? ''
      requests.push(authorization)
      if (authorization === 'Bearer expired-token') throw unauthorized(config)
      return { config, data: 'saved', headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }

    const responses = await Promise.all([client.get('/api/accounts'), client.get('/api/departments')])

    expect(responses.map((response) => response.data)).toEqual(['saved', 'saved'])
    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(requests).toEqual([
      'Bearer expired-token',
      'Bearer expired-token',
      'Bearer renewed-token',
      'Bearer renewed-token'
    ])
  })

  it('reports a failed refresh once and never retries the original request', async () => {
    const onSessionExpired = vi.fn()
    const refreshAccessToken = vi.fn(async () => null)
    const authAdapter: ApiAuthAdapter = {
      getAccessToken: () => 'expired-token',
      onSessionExpired,
      refreshAccessToken
    }
    const client = createApiClient(() => authAdapter)
    const transport = vi.fn<AxiosAdapter>(async (config) => {
      throw unauthorized(config)
    })
    client.defaults.adapter = transport

    const results = await Promise.allSettled([client.get('/api/accounts'), client.get('/api/departments')])

    expect(results.every((result) => result.status === 'rejected')).toBe(true)
    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
    expect(transport).toHaveBeenCalledTimes(2)
  })

  it('skips refresh for auth requests and stops after one retry returns 401', async () => {
    const refreshAccessToken = vi.fn(async () => 'renewed-token')
    const authAdapter: ApiAuthAdapter = {
      getAccessToken: () => 'expired-token',
      refreshAccessToken
    }
    const client = createApiClient(() => authAdapter)
    const transport = vi.fn<AxiosAdapter>(async (config) => {
      throw unauthorized(config)
    })
    client.defaults.adapter = transport

    await expect(
      client.post('/api/auth/refresh', undefined, { skipAuth: true, skipAuthRefresh: true })
    ).rejects.toBeInstanceOf(AxiosError)
    await expect(client.get('/api/accounts')).rejects.toBeInstanceOf(AxiosError)

    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(transport).toHaveBeenCalledTimes(3)
  })

  it('does not refresh for an unrelated 401 or an unauthenticated request', async () => {
    const refreshAccessToken = vi.fn(async () => 'new-token')
    const client = createApiClient(() => ({ getAccessToken: () => null, refreshAccessToken }))
    client.defaults.adapter = async (config) => {
      throw unauthorized(config)
    }

    await expect(client.get('/api/v1/me')).rejects.toBeInstanceOf(AxiosError)
    expect(refreshAccessToken).not.toHaveBeenCalled()
  })

  it('preserves the session when refresh is temporarily unavailable', async () => {
    const onSessionExpired = vi.fn()
    const client = createApiClient(() => ({
      getAccessToken: () => 'old-token',
      refreshAccessToken: async () => {
        throw new AxiosError('unavailable', 'ERR_BAD_RESPONSE', undefined, undefined, {
          data: { error: { code: 'AUTH.UNAVAILABLE' } },
          status: 503
        } as never)
      },
      onSessionExpired
    }))
    client.defaults.adapter = async (config) => {
      throw unauthorized(config)
    }

    await expect(client.get('/api/v1/me')).rejects.toBeInstanceOf(AxiosError)
    expect(onSessionExpired).not.toHaveBeenCalled()
  })
})
