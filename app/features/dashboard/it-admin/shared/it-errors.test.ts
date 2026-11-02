import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { getItError } from './hooks/it-errors'

function failure(status: number, code: string, method = 'post') {
  return new AxiosError('sensitive backend message', undefined, { headers: new AxiosHeaders(), method }, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { error: { code, requestId: 'trace-1', message: 'sensitive backend message' } }
  })
}

describe('IT failure feedback', () => {
  it('requires another administrator for self revocation', () => {
    expect(getItError(failure(403, 'PROVISIONING.ANOTHER_IT_ADMIN_NEEDED')).key).toBe('anotherAdmin')
  })
  it('reports uncertain writes without suggesting automatic retry', () => {
    expect(getItError(failure(503, 'UNAVAILABLE')).key).toBe('unknownOutcome')
    expect(getItError(failure(503, 'UNAVAILABLE', 'get')).key).toBe('unavailable')
  })
  it('keeps missing resources distinct from permission failures', () => {
    expect(getItError(failure(404, 'MISSING')).key).toBe('missing')
    expect(getItError(failure(403, 'FORBIDDEN')).key).toBe('forbidden')
  })
})
