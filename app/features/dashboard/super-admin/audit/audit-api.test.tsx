import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminAuditView } from './views/super-admin-audit-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
it('sends audit filters and server pagination together', async () => {
  const requests: URLSearchParams[] = []
  server.use(
    http.get('*/api/v1/audit-events', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params)
      return HttpResponse.json({
        success: true,
        data: {
          items: [],
          pagination: { page: Number(params.get('page')), pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SuperAdminAuditView />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Resource type'), { target: { value: 'Department' } })
  fireEvent.change(screen.getByLabelText('Resource ID'), { target: { value: 'department-1' } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
  await waitFor(() => expect(requests.at(-1)?.get('resourceType')).toBe('Department'))
  fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.at(-1)?.get('page')).toBe('2'))
  expect(requests.at(-1)?.get('resourceId')).toBe('department-1')
})
