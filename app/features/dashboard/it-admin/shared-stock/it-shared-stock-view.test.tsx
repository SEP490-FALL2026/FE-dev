import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
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
          items: [{ id: 'p1', applicationId: 'a1', applicationName: 'Example', name: 'Team', provisioningType: 'K2' }],
          pagination: { totalItems: 1 }
        }
      })
    ),
    http.get('*/api/v1/stock-summary', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              plan: {
                planId: 'p1',
                applicationId: 'a1',
                applicationName: 'Example',
                planName: 'Team',
                provisioningType: 'K2'
              },
              stock: { kind: 'SEATS', purchased: 10, assigned: 7, free: 3, revoking: 0 }
            }
          ],
          pagination: { totalItems: 1 }
        }
      })
    ),
    http.get('*/api/v1/subscriptions', ({ request }) => {
      expect(new URL(request.url).searchParams.has('mine')).toBe(false)
      return HttpResponse.json({ success: true, data: { items: [{ id: 's1' }], pagination: { totalItems: 1 } } })
    }),
    http.get('*/api/v1/subscriptions/s1/seat-usage', () =>
      HttpResponse.json({ success: true, data: { purchased: 10, occupied: 7, free: 3 } })
    ),
    http.get('*/api/v1/license-assignments', ({ request }) => {
      const params = new URL(request.url).searchParams
      expect(params.get('subscriptionId')).toBe('s1')
      expect(params.get('activeOnly')).toBe('true')
      return HttpResponse.json({
        success: true,
        data: {
          items: [{ id: 'right-1', employee: { fullName: 'Alice', employeeCode: 'E01' }, revocation: null }],
          pagination: { totalItems: 1 }
        }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItSharedStockView onOpenGrants={openGrants} />
    </QueryClientProvider>
  )
  const planCard = (await screen.findByText('Example · Team')).closest('article')!
  expect(await within(planCard).findByText('Free')).toBeInTheDocument()
  expect(within(planCard).getByText('3')).toBeInTheDocument()
  expect(within(planCard).getByText('Purchased')).toBeInTheDocument()
  fireEvent.click(within(planCard).getByRole('button', { name: 'View subscriptions' }))
  expect(await screen.findByText('10')).toBeInTheDocument()
  expect(screen.getByText('7')).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'View holders' }))
  expect(await screen.findByText('Alice · E01')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Open grant queue' }))
  expect(openGrants).toHaveBeenCalledOnce()
})

it('lets an administrator select a K4 subscription and import keys', async () => {
  await setAppLanguage('en', false)
  const imported = vi.fn()
  server.use(
    http.get('*/api/v1/plans', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ id: 'p4', applicationId: 'a1', applicationName: 'Editor', name: 'Pro', provisioningType: 'K4' }],
          pagination: { totalItems: 1 }
        }
      })
    ),
    http.get('*/api/v1/stock-summary', () => {
      return HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              plan: {
                planId: 'p4',
                applicationId: 'a1',
                applicationName: 'Editor',
                planName: 'Pro',
                provisioningType: 'K4'
              },
              stock: { kind: 'KEYS', inStore: 3, assigned: 2, withdrawn: 0 }
            }
          ],
          pagination: { totalItems: 1 }
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
  fireEvent.click(await screen.findByRole('button', { name: 'View subscriptions' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Import and manage keys' }))
  const input = await screen.findByRole('textbox', { name: 'License keys (one per line)' })
  expect(input).toBeRequired()
  fireEvent.change(input, { target: { value: 'EXAMPLE-KEY' } })
  fireEvent.click(screen.getByRole('button', { name: 'Import keys' }))
  await vi.waitFor(() => expect(imported).toHaveBeenCalledWith({ subscriptionId: 's4', keys: ['EXAMPLE-KEY'] }))
})

it('keeps catalog plans visible when there is no active stock for the current administrator', async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/plans', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              id: 'p5',
              applicationId: 'a5',
              applicationName: 'Internal Tool',
              name: 'Standard',
              provisioningType: 'K5'
            },
            { id: 'p2', applicationId: 'a2', applicationName: 'Design', name: 'Team', provisioningType: 'K2' }
          ],
          pagination: { totalItems: 2 }
        }
      })
    ),
    http.get('*/api/v1/stock-summary', () =>
      HttpResponse.json({ success: true, data: { items: [], pagination: { totalItems: 0, totalPages: 0 } } })
    )
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItSharedStockView />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Internal Tool · Standard')).toBeInTheDocument()
  expect(screen.getByText('Design · Team')).toBeInTheDocument()
  expect(screen.getByText('Internal software does not use subscriptions.')).toBeInTheDocument()
  expect(await screen.findByText('No active stock is available for this plan.')).toBeInTheDocument()
})

it('keeps plans visible and offers retry when the stock summary cannot be loaded', async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/plans', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ id: 'p2', applicationId: 'a2', applicationName: 'Design', name: 'Team', provisioningType: 'K2' }],
          pagination: { totalItems: 1 }
        }
      })
    ),
    http.get('*/api/v1/stock-summary', () => HttpResponse.json({ success: false }, { status: 503 }))
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItSharedStockView />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Design · Team')).toBeInTheDocument()
  expect(
    await screen.findByText('Stock availability could not be loaded. The plan list is still available.')
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  expect(screen.queryByText('No active stock is available for this plan.')).not.toBeInTheDocument()
})
