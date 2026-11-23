import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { FinanceOverviewView } from '../overview/views/finance-overview-view'
import { FinanceStatus } from './components/finance-ui'

const calls: string[] = []
const server = setupServer(
  ...['budget-proposals', 'budget-versions'].map((path, index) =>
    http.get(`*/api/v1/${path}`, ({ request }) => {
      calls.push(new URL(request.url).search)
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
    expect(await screen.findByRole('button', { name: /^5/ })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /^6/ })).toBeInTheDocument()
    await waitFor(() => expect(calls).toHaveLength(2))
    expect(calls.every((search) => search.includes('pageSize=1') && search.includes('state='))).toBe(true)
    queryClient.clear()
  })

  it('uses a safe translated fallback for an unknown backend status', () => {
    render(<FinanceStatus value='UNRECOGNIZED_SERVER_STATE' />)
    expect(screen.getByText('Unknown status')).toBeInTheDocument()
    expect(screen.queryByText('UNRECOGNIZED_SERVER_STATE')).not.toBeInTheDocument()
  })
})
