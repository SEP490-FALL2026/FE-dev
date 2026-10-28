import { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { apiClient, createApiClient, type ApiAuthAdapter } from './axios-client'
import { getApiStatus } from './generated/operations/system/get-api-status'
import { customAxios } from './mutator/custom-axios'

function unauthorized(config: InternalAxiosRequestConfig): AxiosError {
  return new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
    config,
    data: { message: 'Unauthorized' },
    headers: new AxiosHeaders(),
    status: 401,
    statusText: 'Unauthorized'
  })
}

describe('Axios API client', () => {
  it('routes a generated Orval operation through the shared Axios client', async () => {
    const previousAdapter = apiClient.defaults.adapter
    const requestedUrls: string[] = []
    apiClient.defaults.adapter = async (config) => {
      requestedUrls.push(config.url ?? '')
      return { config, data: 'Hello World!', headers: new AxiosHeaders(), status: 200, statusText: 'OK' }
    }

    try {
      await expect(getApiStatus()).resolves.toBe('Hello World!')
      expect(requestedUrls).toEqual(['/api/'])
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
})
