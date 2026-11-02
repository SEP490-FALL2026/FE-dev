import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { FinanceOverviewView } from '../overview/views/finance-overview-view'
import { FinanceWorkspaceSearch } from './components/finance-workspace-search'
import { FinanceStatus } from './components/finance-ui'

const calls: string[] = []
const server = setupServer(
  ...['budget-proposals', 'budget-versions', 'finance-reviews', 'budget-information-requests'].map((path, index) =>
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
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  calls.length = 0
  server.resetHandlers()
  await setAppLanguage('en', false)
})

function Location() {
  return <output data-testid='location'>{useLocation().search}</output>
}

describe('Finance workspace', () => {
  it('reads server totals rather than counting the first page or rendering demo statistics', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={queryClient}>
        <FinanceOverviewView onSelectTab={() => undefined} />
      </QueryClientProvider>
    )
    expect(await screen.findByRole('button', { name: '5' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: '8' })).toBeInTheDocument()
    await waitFor(() => expect(calls).toHaveLength(4))
    expect(calls.every((search) => search.includes('pageSize=1') && search.includes('state='))).toBe(true)
    queryClient.clear()
  })

  it('provides a translated search hint and navigates to a matching Finance function', async () => {
    render(
      <MemoryRouter>
        <FinanceWorkspaceSearch />
        <Location />
      </MemoryRouter>
    )
    const search = screen.getByRole('searchbox', { name: 'Search' })
    expect(search).toHaveAttribute('placeholder', 'Find a function: budgets, exchange rates…')
    fireEvent.change(search, { target: { value: 'exchange' } })
    expect(search).toHaveValue('exchange')
    fireEvent.click(screen.getByRole('button', { name: 'Exchange rates' }))
    expect(screen.getByTestId('location')).toHaveTextContent('?tab=exchange-rates')
    expect(search).toHaveValue('')
  })

  it('uses a safe translated fallback for an unknown backend status', () => {
    render(<FinanceStatus value='UNRECOGNIZED_SERVER_STATE' />)
    expect(screen.getByText('Unknown status')).toBeInTheDocument()
    expect(screen.queryByText('UNRECOGNIZED_SERVER_STATE')).not.toBeInTheDocument()
  })
})
