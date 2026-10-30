import { AxiosError, AxiosHeaders } from 'axios'
import { expect, it } from 'vitest'
import { createQueryClient } from './query-client'

it('does not retry permission or validation failures and retries a temporary read failure only once', () => {
  const retry = createQueryClient().getDefaultOptions().queries?.retry
  expect(typeof retry).toBe('function')
  if (typeof retry !== 'function') throw new Error('Expected a query retry policy')
  const rejected = (status: number) =>
    new AxiosError('Request rejected', undefined, undefined, undefined, {
      status,
      statusText: 'Rejected',
      data: {},
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() }
    })
  for (const status of [401, 403, 404, 409, 422, 429]) {
    const error = rejected(status)
    expect(retry(0, error)).toBe(false)
  }
  const temporary = rejected(503)
  expect(retry(0, temporary)).toBe(true)
  expect(retry(1, temporary)).toBe(false)
})
