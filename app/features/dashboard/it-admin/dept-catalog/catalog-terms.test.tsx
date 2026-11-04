import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogPlanTerms } from './components/catalog-plan-terms'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('loads persisted terms and records the business owner opinion without adding approval steps', async () => {
  await setAppLanguage('en', false)
  let body: unknown
  server.use(
    http.get('*/api/v1/plans/plan-1/terms', () =>
      HttpResponse.json({
        success: true,
        data: {
          planId: 'plan-1',
          applicable: true,
          terms: { termsUrl: 'https://example.invalid/terms', lastReviewedOn: '2026-11-03' },
          opinions: [],
          warnings: [],
          opinionTotal: 0,
          warningTotal: 0
        }
      })
    ),
    http.get('*/api/v1/plans/plan-1/term-opinions', () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    ),
    http.post('*/api/v1/plans/plan-1/term-opinions', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogPlanTerms planId='plan-1' onBack={vi.fn()} />
    </QueryClientProvider>
  )
  expect(await screen.findByText('https://example.invalid/terms')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Record owner opinion' }))
  fireEvent.change(screen.getByLabelText('Business owner opinion'), { target: { value: 'Approved for company data' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save opinion' }))
  await waitFor(() => expect(body).toEqual({ opinion: 'Approved for company data' }))
})

it('blocks repeated owner opinions after an uncertain write response', async () => {
  await setAppLanguage('en', false)
  let writes = 0
  server.use(
    http.get('*/api/v1/plans/plan-1/terms', () =>
      HttpResponse.json({
        success: true,
        data: {
          planId: 'plan-1',
          applicable: true,
          terms: null,
          opinions: [],
          warnings: [],
          opinionTotal: 0,
          warningTotal: 0
        }
      })
    ),
    http.get('*/api/v1/plans/plan-1/term-opinions', () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    ),
    http.post('*/api/v1/plans/plan-1/term-opinions', () => {
      writes++
      return HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogPlanTerms planId='plan-1' onBack={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Record owner opinion' }))
  fireEvent.change(screen.getByLabelText('Business owner opinion'), { target: { value: 'Owner agreed' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save opinion' }))
  await screen.findByText(
    'The result is uncertain. Close this form and review the opinion history before recording it again.'
  )
  expect(screen.getByRole('button', { name: 'Save opinion' })).toBeDisabled()
  expect(writes).toBe(1)
})
