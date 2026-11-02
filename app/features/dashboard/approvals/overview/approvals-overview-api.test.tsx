import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { ApprovalsOverviewView } from './views/approvals-overview-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
const originalAdapter = apiClient.defaults.adapter
const requestId = '12345678-1234-4234-8234-123456789012'
let requests: Array<{ url: string; params: unknown }>
beforeEach(() => {
  requests = []
  apiClient.defaults.adapter = async (config) => {
    requests.push({ url: config.url ?? '', params: config.params })
    const notification = {
      id: 'notification',
      code: 'STEP_ASSIGNED',
      params: { stepKind: 'NEED', requestId },
      subject: { type: 'ACCESS_REQUEST', id: requestId },
      createdAt: '2026-11-02T03:15:00Z',
      readAt: null
    }
    const data = config.url?.endsWith('/notifications')
      ? {
          items: [
            notification,
            { ...notification, id: 'duplicate' },
            { ...notification, id: 'other-kind', params: { stepKind: 'IT_ASSESSMENT', requestId } }
          ],
          pagination: { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      : {
          items: [],
          pagination: {
            page: 1,
            pageSize: 1,
            totalItems: config.url?.endsWith('/spend-approvals') ? 37 : 4,
            totalPages: 37
          }
        }
    return { config, data: { success: true, data }, status: 200, statusText: 'OK', headers: new AxiosHeaders() }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})

it('uses server totals and deduplicates only assigned NEED notifications on the current page', async () => {
  const onSelectTab = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalsOverviewView onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  expect(await screen.findByText('37')).toBeInTheDocument()
  expect(await screen.findByText('4')).toBeInTheDocument()
  const openButtons = await screen.findAllByRole('button', { name: 'openNeed' })
  expect(openButtons).toHaveLength(1)
  expect(screen.getByText('notificationScope')).toBeInTheDocument()
  fireEvent.click(openButtons[0])
  expect(onSelectTab).toHaveBeenCalledWith('need', { id: requestId })
  fireEvent.click(screen.getByRole('button', { name: 'next' }))
  await waitFor(() =>
    expect(
      requests.some(
        (request) => request.url.endsWith('/notifications') && (request.params as { page?: number })?.page === 2
      )
    ).toBe(true)
  )
  expect(
    requests.some(
      (request) => request.url.endsWith('/budget-versions') && (request.params as { state?: string })?.state === 'SENT'
    )
  ).toBe(true)
})
