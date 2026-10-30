import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'

import { getInvalidFields } from './validation-issues'

describe('auth validation issues', () => {
  it('maps backend issue paths to form fields', () => {
    const error = new AxiosError('invalid', '422', undefined, undefined, {
      data: {
        error: { code: 'VALIDATION_ERROR', details: { issues: [{ path: 'body.email' }, { path: ['newPassword'] }] } }
      },
      status: 422,
      headers: new AxiosHeaders(),
      statusText: 'Unprocessable Entity',
      config: { headers: new AxiosHeaders() }
    })
    expect([...getInvalidFields(error)]).toEqual(['email', 'newPassword'])
  })
})
