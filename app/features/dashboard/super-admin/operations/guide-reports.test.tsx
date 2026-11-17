import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OperationsReports } from './components/operations-reports'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
const client = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })

it('reads the revocation report with server paging and the selected grouping', async () => {
  await setAppLanguage('en', false)
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/reports/revocation-sla', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json({
        success: true,
        data: {
          from: '2026-11-01',
          to: '2026-11-17',
          completed: 3,
          onTime: 2,
          overdueOpen: 1,
          medianWorkingDays: null,
          onTimeRate: null,
          rows: [],
          pagination: { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  render(
    <QueryClientProvider client={client()}>
      <OperationsReports report='sla' />
    </QueryClientProvider>
  )
  fireEvent.change(await screen.findByLabelText('Group results by'), { target: { value: 'department' } })
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('groupBy')).toBe('department'))
  fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('page')).toBe('2'))
})
