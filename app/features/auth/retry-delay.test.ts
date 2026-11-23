import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'

import { getRetryDelaySeconds } from './retry-delay'

describe('retry delay', () => {
  it('uses the login block detail when present', () => {
    const error = new AxiosError('blocked', '429', undefined, undefined, {
      data: { error: { code: 'AUTH.LOGIN_TEMPORARILY_BLOCKED', details: { retryAfterSeconds: 37 } } },
      status: 429,
      headers: new AxiosHeaders(),
      statusText: 'Too Many Requests',
      config: { headers: new AxiosHeaders() }
    })
    expect(getRetryDelaySeconds(error)).toBe(37)
  })

  it('uses Retry-After for global rate limiting', () => {
    const error = new AxiosError('blocked', '429', undefined, undefined, {
      data: { error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
      status: 429,
      headers: new AxiosHeaders({ 'Retry-After': '12' }),
      statusText: 'Too Many Requests',
      config: { headers: new AxiosHeaders() }
    })
    expect(getRetryDelaySeconds(error)).toBe(12)
  })
})
