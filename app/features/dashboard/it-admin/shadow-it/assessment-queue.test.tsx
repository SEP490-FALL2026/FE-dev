import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItShadowItView } from './views/it-shadow-it-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('lists server assessment rows, pages on the server and opens an explicit request', async () => {
  await setAppLanguage('en', false)
  const pages: string[] = []
  let lookup = ''
  server.use(
    http.get('*/api/v1/assessment-queue', ({ request }) => {
      const page = new URL(request.url).searchParams.get('page') ?? '1'
      pages.push(page)
      return HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              requestId: '12345678-1234-1234-1234-123456789012',
              software: { name: page === '1' ? 'New drawing tool' : 'Second page tool', expectedUsers: 4 },
              requester: { fullName: 'Test Requester' },
              department: { name: 'Engineering' },
              holder: { fullName: 'Test Holder' },
              assignee: null,
              waitingReason: null,
              canAct: false,
              started: false,
              classification: null,
              readiness: 'INCOMPLETE',
              missingCount: 3,
              quote: 'MISSING',
              slaWorkingDays: 5,
              waitingSince: '2026-11-01T00:00:00Z'
            }
          ],
          pagination: { page: Number(page), pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    }),
    http.get('*/api/v1/access-requests/:id/assessment', ({ params }) => {
      lookup = String(params.id)
      return HttpResponse.json({ success: true, data: null })
    }),
    http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: { roles: ['IT_ADMIN'] } }))
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItShadowItView />
    </QueryClientProvider>
  )
  expect(await screen.findByText('New drawing tool')).toBeInTheDocument()
  expect(screen.getByText('View only')).toBeInTheDocument()
  expect(lookup).toBe('')
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('Second page tool')).toBeInTheDocument()
  expect(pages).toEqual(['1', '2'])
  fireEvent.click(screen.getByRole('button', { name: 'View assessment' }))
  await screen.findByText('No matching records.')
  expect(lookup).toBe('12345678-1234-1234-1234-123456789012')
  expect(screen.queryByRole('button', { name: 'Save assessment' })).not.toBeInTheDocument()
})
