import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogPlanTerms } from './components/catalog-plan-terms'

const server = setupServer()
const data = {
  planId: 'plan-1',
  applicable: true,
  terms: { termsUrl: 'https://example.invalid/terms', lastReviewedOn: '2026-11-03' },
  warnings: []
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
  server.use(http.get('*/api/v1/plans/plan-1/terms', () => HttpResponse.json({ success: true, data })))
})
function mount() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogPlanTerms planId='plan-1' onBack={vi.fn()} />
    </QueryClientProvider>
  )
}

it('edits persisted plan terms without using the removed Business Owner opinion APIs', async () => {
  let body: unknown
  server.use(
    http.put('*/api/v1/plans/plan-1/terms', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ success: true, data })
    })
  )
  mount()
  expect(await screen.findByText('https://example.invalid/terms')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Record owner opinion' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Edit terms' }))
  fireEvent.change(await screen.findByLabelText('Terms URL'), {
    target: { value: 'https://example.invalid/new-terms' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(body).toEqual({
      termsUrl: 'https://example.invalid/new-terms',
      lastReviewedOn: '2026-11-03',
      aiTraining: null,
      dataLocation: null,
      commercialUse: null,
      cancellationRefund: null,
      installLimit: { maxDevicesPerKey: null, note: null }
    })
  )
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})

it('does not offer a terms edit for internal K5 software', async () => {
  server.use(
    http.get('*/api/v1/plans/plan-1/terms', () =>
      HttpResponse.json({ success: true, data: { ...data, applicable: false, terms: null } })
    )
  )
  mount()
  expect(await screen.findByText('Terms review does not apply to internal K5 software.')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Edit terms' })).not.toBeInTheDocument()
})
