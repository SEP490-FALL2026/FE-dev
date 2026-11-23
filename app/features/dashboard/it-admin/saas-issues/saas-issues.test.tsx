import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItSaasIssuesView } from './views/it-saas-issues-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('loads all-scope SaaS issues with server state filtering and pagination', async () => {
  const calls: URLSearchParams[] = []
  server.use(
    http.get('*/api/v1/saas-issues', ({ request }) => {
      const params = new URL(request.url).searchParams
      calls.push(params)
      return HttpResponse.json({
        success: true,
        data: {
          items: [],
          pagination: { page: Number(params.get('page')), pageSize: 20, totalItems: 25, totalPages: 2 }
        }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItSaasIssuesView />
    </QueryClientProvider>
  )
  await screen.findByText('No matching records.')
  fireEvent.click(screen.getByRole('combobox', { name: 'State' }))
  fireEvent.click(screen.getByRole('option', { name: 'In progress' }))
  await waitFor(() => expect(calls.at(-1)?.get('state')).toBe('IN_PROGRESS'))
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(calls.at(-1)?.get('page')).toBe('2'))
  expect(calls.at(-1)?.get('scope')).toBe('assigned')
})

it('shows a retry state for failed reads instead of demo issues', async () => {
  let attempt = 0
  server.use(
    http.get('*/api/v1/saas-issues', () => {
      attempt++
      return attempt === 1
        ? HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
        : HttpResponse.json({
            success: true,
            data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
          })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItSaasIssuesView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('No matching records.')).toBeInTheDocument()
})
