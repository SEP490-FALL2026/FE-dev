import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItSharedStockView } from './it-shared-stock-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('opens a shared seat plan and shows the subscription availability from the API', async () => {
  await setAppLanguage('en', false)
  const openGrants = vi.fn()
  server.use(
    http.get('*/api/v1/plans', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ id: 'p1', applicationName: 'Example', name: 'Team', provisioningType: 'K2' }],
          pagination: { totalItems: 1 }
        }
      })
    ),
    http.get('*/api/v1/subscriptions', () =>
      HttpResponse.json({ success: true, data: { items: [{ id: 's1' }], pagination: { totalItems: 1 } } })
    ),
    http.get('*/api/v1/subscriptions/s1/seat-usage', () =>
      HttpResponse.json({ success: true, data: { purchased: 10, occupied: 7, free: 3 } })
    )
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItSharedStockView onOpenGrants={openGrants} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'View subscriptions' }))
  expect(await screen.findByText('10')).toBeInTheDocument()
  expect(screen.getByText('7')).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Open grant queue' }))
  expect(openGrants).toHaveBeenCalledOnce()
})

it('lets an administrator select a K4 subscription and import keys', async () => {
  await setAppLanguage('en', false)
  const imported = vi.fn()
  server.use(
    http.get('*/api/v1/plans', ({ request }) => {
      const kind = new URL(request.url).searchParams.get('provisioningType')
      return HttpResponse.json({
        success: true,
        data: {
          items:
            kind === 'K4'
              ? [{ id: 'p4', applicationId: 'a1', applicationName: 'Editor', name: 'Pro', provisioningType: 'K4' }]
              : [],
          pagination: { totalItems: kind === 'K4' ? 1 : 0 }
        }
      })
    }),
    http.get('*/api/v1/subscriptions', () =>
      HttpResponse.json({
        success: true,
        data: { items: [{ id: 's4', planName: 'Pro', status: 'ACTIVE' }], pagination: { totalItems: 1 } }
      })
    ),
    http.get('*/api/v1/subscriptions/s4/seat-usage', () =>
      HttpResponse.json({ success: true, data: { purchased: 5, occupied: 2, free: 3 } })
    ),
    http.get('*/api/v1/license-keys', () =>
      HttpResponse.json({ success: true, data: { items: [], pagination: { totalItems: 0 }, summary: {} } })
    ),
    http.post('*/api/v1/license-keys/imports', async ({ request }) => {
      imported(await request.json())
      return HttpResponse.json({ success: true, data: { imported: 1, errors: [], summary: { warning: null } } })
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ItSharedStockView />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: /License keys/ }))
  fireEvent.click(await screen.findByRole('button', { name: 'View subscriptions' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Import and manage keys' }))
  const input = await screen.findByRole('textbox', { name: 'License keys (one per line)' })
  expect(input).toBeRequired()
  fireEvent.change(input, { target: { value: 'EXAMPLE-KEY' } })
  fireEvent.click(screen.getByRole('button', { name: 'Import keys' }))
  await vi.waitFor(() => expect(imported).toHaveBeenCalledWith({ subscriptionId: 's4', keys: ['EXAMPLE-KEY'] }))
})
