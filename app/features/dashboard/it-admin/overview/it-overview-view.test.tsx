import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItOverviewView } from './views/it-overview-view'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('uses server totals and opens the matching queue', async () => {
  await setAppLanguage('en', false)
  for (const [path, total] of [
    ['provisioning-tasks', 101],
    ['saas-issues', 12],
    ['offboarding-cases', 7]
  ] as const) {
    server.use(
      http.get('*/api/v1/' + path, () =>
        HttpResponse.json({
          success: true,
          data: { items: [], pagination: { page: 1, pageSize: 1, totalItems: total, totalPages: total } }
        })
      )
    )
  }
  const navigate = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItOverviewView onSelectTab={navigate} />
    </QueryClientProvider>
  )
  expect(await screen.findByText('101')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /Grant and revocation tasks/ }))
  expect(navigate).toHaveBeenCalledWith('provisioning')
})
