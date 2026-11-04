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
it('uses the scoped dashboard and preserves unavailable and at-source metrics', async () => {
  await setAppLanguage('en', false)
  const counted = (count: number) => ({
    state: 'COUNTED',
    count,
    sourceOperationId: 'provisioningTaskList',
    reason: null
  })
  const unavailable = { state: 'NOT_AVAILABLE', count: null, sourceOperationId: null, reason: 'USAGE_NOT_DELIVERED' }
  server.use(
    http.get('*/api/v1/dashboards/it-admin', () =>
      HttpResponse.json({
        success: true,
        data: {
          asOf: '2026-11-03',
          scope: { departments: 3 },
          sections: {
            grantTasks: counted(101),
            revocationTasks: counted(5),
            saasIssues: counted(12),
            offboardingHandovers: counted(7),
            licenseKeys: counted(0),
            termsToReview: counted(2),
            discrepancies: unavailable,
            unconfirmedDevices: unavailable,
            cancellationDeadlines: {
              state: 'AT_SOURCE',
              count: null,
              sourceOperationId: 'subscriptionList',
              reason: null
            }
          }
        }
      })
    )
  )
  const navigate = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItOverviewView onSelectTab={navigate} />
    </QueryClientProvider>
  )
  expect(await screen.findByText('101')).toBeInTheDocument()
  expect(screen.getByText('3 departments in your scope')).toBeInTheDocument()
  expect(screen.getAllByText('Not available')).toHaveLength(2)
  expect(screen.getByText('View at source')).toBeInTheDocument()
  expect(screen.getAllByText('0')).toHaveLength(1)
  fireEvent.click(screen.getByRole('button', { name: /Pending grants/ }))
  expect(navigate).toHaveBeenCalledWith('provisioning', { scope: 'MINE' })
})
