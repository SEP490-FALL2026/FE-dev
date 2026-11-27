import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { FinanceOverviewView } from '../overview/views/finance-overview-view'
import { FinanceStatus } from './components/finance-ui'
import { OverviewWorkQueue } from '../overview/components/overview-work-queue'

const calls: URL[] = []
const server = setupServer(
  ...['budget-proposals', 'budget-versions', 'purchase-invoices'].map((path, index) =>
    http.get(`*/api/v1/${path}`, ({ request }) => {
      calls.push(new URL(request.url))
      return HttpResponse.json({
        success: true,
        message: 'FINANCE.LISTED',
        data: {
          items: [],
          pagination: { page: 1, pageSize: 1, totalItems: index + 5, totalPages: index + 5 }
        }
      })
    })
  ),
  ...['budgets', 'budget-commitments'].map((path) =>
    http.get(`*/api/v1/${path}`, () =>
      HttpResponse.json({
        success: true,
        message: 'FINANCE.LISTED',
        data: { items: [], pagination: { page: 1, pageSize: 100, totalItems: 0, totalPages: 0 } }
      })
    )
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  calls.length = 0
  server.resetHandlers()
  await setAppLanguage('en', false)
})

describe('Finance workspace', () => {
  it('reads server totals rather than counting the first page or rendering demo statistics', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={queryClient}>
        <FinanceOverviewView onSelectTab={() => undefined} />
      </QueryClientProvider>
    )
    expect(await screen.findByRole('button', { name: /Submitted proposals\s*5/ })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /Budget versions\s*6/ })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /Invoices awaiting signature\s*7/ })).toBeInTheDocument()
    await waitFor(() => expect(calls).toHaveLength(3))
    expect(calls.every((url) => url.searchParams.get('pageSize') === '1' && url.searchParams.has('state'))).toBe(true)
    queryClient.clear()
  })

  it('opens the invoice signing queue and requests only submitted invoices for its count', async () => {
    const onSelectTab = vi.fn()
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <OverviewWorkQueue onSelectTab={onSelectTab} />
      </QueryClientProvider>
    )
    fireEvent.click(await screen.findByRole('button', { name: /Invoices awaiting signature\s*7/ }))
    expect(onSelectTab).toHaveBeenCalledWith('purchase-invoices')
    expect(
      calls.some((url) => url.pathname.endsWith('/purchase-invoices') && url.searchParams.get('state') === 'SUBMITTED')
    ).toBe(true)
    client.clear()
  })

  it('keeps a failed queue reachable and shows unavailable data instead of a zero', async () => {
    server.use(http.get('*/api/v1/purchase-invoices', () => HttpResponse.json({}, { status: 503 })))
    const onSelectTab = vi.fn()
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <OverviewWorkQueue onSelectTab={onSelectTab} />
      </QueryClientProvider>
    )
    const invoiceQueue = await screen.findByRole('button', { name: /Invoices awaiting signature\s*Data unavailable/ })
    expect(within(invoiceQueue).queryByText('0')).not.toBeInTheDocument()
    fireEvent.click(invoiceQueue)
    expect(onSelectTab).toHaveBeenCalledWith('purchase-invoices')
    expect(await screen.findByRole('button', { name: /Submitted proposals\s*5/ })).toBeEnabled()
    client.clear()
  })

  it('uses a safe translated fallback for an unknown backend status', () => {
    render(<FinanceStatus value='UNRECOGNIZED_SERVER_STATE' />)
    expect(screen.getByText('Unknown status')).toBeInTheDocument()
    expect(screen.queryByText('UNRECOGNIZED_SERVER_STATE')).not.toBeInTheDocument()
  })
})
