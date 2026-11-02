import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, renderHook, screen } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ApprovalsButton } from '../components/approvals-ui'
import { useApprovalsFeedback } from './use-approvals-feedback'

const approveLabel = 'Approve'

function failure(status: number, code: string, headers: Record<string, string> = {}) {
  return new AxiosError('Private backend detail', undefined, undefined, undefined, {
    status,
    statusText: '',
    config: { headers: new AxiosHeaders() },
    headers,
    data: { error: { code } }
  })
}

beforeEach(async () => {
  await setAppLanguage('en', false)
})

describe('Spending Approver mutation recovery', () => {
  it.each([
    failure(409, 'SPEND.RECHECKED_NEEDS_FINANCE_REVIEW'),
    failure(503, 'SERVICE_UNAVAILABLE'),
    new AxiosError('Network Error')
  ])('invalidates authoritative approval data after conflicts or uncertain writes', async (error) => {
    const client = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    client.setQueryData(['approval', 'request'], { state: 'PENDING' })
    client.setQueryData(['approval-list'], { total: 1 })
    client.setQueryData(['unrelated'], { total: 2 })
    const { result } = renderHook(() => useApprovalsFeedback([['approval'], ['approval-list']]), { wrapper })
    await act(() => result.current.onError(error))
    expect(client.getQueryState(['approval', 'request'])?.isInvalidated).toBe(true)
    expect(client.getQueryState(['approval-list'])?.isInvalidated).toBe(true)
    expect(client.getQueryState(['unrelated'])?.isInvalidated).toBe(false)
    expect(client.getQueryData(['approval', 'request'])).toEqual({ state: 'PENDING' })
  })

  it('keeps rate-limited data and displays the retry window on action controls', async () => {
    const client = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    client.setQueryData(['approval-list'], { total: 1 })
    const { result } = renderHook(() => useApprovalsFeedback([['approval-list']]), { wrapper })
    await act(() => result.current.onError(failure(429, 'HTTP_TOO_MANY_REQUESTS', { 'retry-after': '15' })))
    render(<ApprovalsButton>{approveLabel}</ApprovalsButton>, { wrapper })
    expect(screen.getByRole('button', { name: /Retry in \d+ seconds/ })).toBeDisabled()
    expect(client.getQueryState(['approval-list'])?.isInvalidated).toBe(false)
  })
})
