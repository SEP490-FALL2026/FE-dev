import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { EmployeeQueryState } from './employee/shared/components/employee-api-ui'
import { ManagerQueryState } from './manager/shared/components/manager-api-ui'

beforeEach(async () => {
  await setAppLanguage('en', false)
})
afterEach(() => vi.useRealTimers())
function error(status: number, code: string) {
  return new AxiosError('private message', undefined, undefined, undefined, {
    status,
    statusText: '',
    headers: { 'retry-after': '2' },
    config: { headers: new AxiosHeaders() },
    data: { error: { code } }
  })
}

it('keeps the Retry-After window across Employee and Manager query surfaces', () => {
  vi.useFakeTimers()
  const client = new QueryClient()
  const refetch = vi.fn()
  const query = { isPending: false, isError: true, error: error(429, 'HTTP_TOO_MANY_REQUESTS'), refetch }
  const view = render(
    <QueryClientProvider client={client}>
      <EmployeeQueryState query={query} />
    </QueryClientProvider>
  )
  expect(screen.getByRole('button', { name: /2 seconds/ })).toBeDisabled()
  view.rerender(
    <QueryClientProvider client={client}>
      <ManagerQueryState query={{ ...query, error: error(503, 'SERVICE_UNAVAILABLE') }} />
    </QueryClientProvider>
  )
  expect(screen.getByRole('button', { name: /2s/ })).toBeDisabled()
  act(() => {
    vi.advanceTimersByTime(2250)
  })
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(refetch).toHaveBeenCalledOnce()
})

it('does not offer a futile retry for a forbidden Employee query', () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <EmployeeQueryState
        query={{
          isPending: false,
          isError: true,
          error: error(403, 'HANDOVER_DUTY.SCOPE_FORBIDDEN'),
          refetch: vi.fn()
        }}
      />
    </QueryClientProvider>
  )
  expect(screen.getByRole('alert')).toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(screen.queryByText('private message')).not.toBeInTheDocument()
})
