import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { assignmentId, pageResponse, planId } from '../../../../../test/fixtures/employee-api'
import { EmployeeLiveAccessView } from './views/employee-live-access-view'

const rights: MySoftwarePageResponseDtoDataItemsItem = {
  assignmentId,
  application: { id: planId, name: 'Granted Software' },
  plan: { id: planId, name: 'Team plan' },
  provisioningType: 'K4',
  status: 'ACTIVE',
  effectiveFrom: '2026-10-01',
  grantedOn: '2026-10-01',
  effectiveFromLabel: null,
  expectedEndDate: '2026-11-08',
  expiringSoon: true,
  validUntil: null,
  successorAssignmentId: null
}
function response(items = [rights], currentPage = 1, totalPages = 1) {
  return {
    success: true,
    data: {
      asOf: '2026-11-01',
      view: 'current',
      items,
      pagination: { page: currentPage, pageSize: 20, totalItems: totalPages === 1 ? items.length : 21, totalPages }
    }
  }
}
const requests = vi.fn()
const reminders = vi.fn()
const returns = vi.fn()
const server = setupServer(
  http.get('*/api/v1/me/software-rights', ({ request }) => {
    requests(new URL(request.url).searchParams.toString())
    return HttpResponse.json(response())
  }),
  http.get('*/api/v1/assignment-expiry-reminders', () => {
    reminders()
    return HttpResponse.json(pageResponse())
  }),
  http.get('*/api/v1/return-requests', () => {
    returns()
    return HttpResponse.json(pageResponse())
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function Location() {
  const location = useLocation()
  return <output data-testid='location'>{location.search}</output>
}
function mount(url = '/?tab=my-software') {
  const onSelectTab = vi.fn()
  const view = render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[url]}>
        <EmployeeLiveAccessView onSelectTab={onSelectTab} />
        <Location />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return { ...view, onSelectTab }
}

describe('Employee software access lists', () => {
  it('defaults to the granted software API and displays real metadata without fetching hidden lists', async () => {
    mount()
    expect(await screen.findByText('Granted Software')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Software' })
    expect(within(table).getByText('Team plan')).toBeInTheDocument()
    expect(within(table).getByText('Active')).toBeInTheDocument()
    expect(within(table).getByText('Expires within 7 days')).toBeInTheDocument()
    expect(screen.getByText('1 software rights')).toBeInTheDocument()
    expect(requests.mock.calls[0][0]).toContain('view=current')
    expect(requests.mock.calls[0][0]).toContain('pageSize=20')
    expect(reminders).not.toHaveBeenCalled()
    expect(returns).not.toHaveBeenCalled()
    expect(screen.queryByText(/license key|budget|price|complete list is not available/i)).not.toBeInTheDocument()
  })

  it('switches between exactly one visible list and fetches each only when selected', async () => {
    mount()
    await screen.findByText('Granted Software')
    fireEvent.click(screen.getByRole('button', { name: 'Expiry reminders' }))
    expect(await screen.findByText('No expiry reminders')).toBeInTheDocument()
    expect(screen.queryByRole('table', { name: 'Software' })).not.toBeInTheDocument()
    expect(reminders).toHaveBeenCalledTimes(1)
    expect(returns).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Return requests' }))
    expect(await screen.findByText('No return requests')).toBeInTheDocument()
    expect(screen.queryByText('No expiry reminders')).not.toBeInTheDocument()
    expect(returns).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('location')).toHaveTextContent('accessList=returns')
  })

  it('uses server pagination and resets to page one when switching access period', async () => {
    server.use(
      http.get('*/api/v1/me/software-rights', ({ request }) => {
        const params = new URL(request.url).searchParams
        requests(params.toString())
        const current = Number(params.get('page'))
        return HttpResponse.json(
          response([{ ...rights, application: { id: planId, name: `Software page ${current}` } }], current, 2)
        )
      })
    )
    mount()
    await screen.findByText('Software page 1')
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Software page 2')).toBeInTheDocument()
    expect(screen.getByText('21 software rights')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Access period'), { target: { value: 'ended' } })
    await waitFor(() => expect(requests.mock.calls.at(-1)?.[0]).toContain('view=ended&page=1'))
    expect(await screen.findByText('Software page 1')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Access ended on' })).toBeInTheDocument()
    expect(screen.getByTestId('location')).not.toHaveTextContent('softwarePage=2')
  })

  it('restores valid URL filters and ignores unknown filter values', async () => {
    const first = mount('/?tab=my-software&rightsView=ended&softwarePage=2')
    await screen.findByText('Granted Software')
    expect(requests.mock.calls[0][0]).toContain('view=ended&page=2')
    first.unmount()
    requests.mockClear()
    mount('/?tab=my-software&accessList=bogus&rightsView=bogus&softwarePage=-1')
    await screen.findByText('Granted Software')
    expect(requests.mock.calls[0][0]).toContain('view=current&page=1')
  })

  it('shows real ended rights without claiming a missing grant date or end date', async () => {
    server.use(
      http.get('*/api/v1/me/software-rights', () =>
        HttpResponse.json(
          response([
            {
              ...rights,
              status: 'EXPIRED',
              grantedOn: null,
              expectedEndDate: null,
              expiringSoon: false,
              validUntil: null
            }
          ])
        )
      )
    )
    mount('/?tab=my-software&rightsView=ended')
    expect(await screen.findByText('Expired')).toBeInTheDocument()
    expect(screen.getByText('Grant date not recorded')).toBeInTheDocument()
    expect(screen.getByText('No end date recorded')).toBeInTheDocument()
    expect(screen.queryByText('Expires within 7 days')).not.toBeInTheDocument()
  })

  it('handles loading, failure and retry without presenting errors as an empty list', async () => {
    let failed = true
    server.use(
      http.get('*/api/v1/me/software-rights', () =>
        failed
          ? HttpResponse.json({ message: 'private backend detail' }, { status: 503 })
          : HttpResponse.json(response())
      )
    )
    mount()
    expect(screen.getByText('Loading data')).toHaveTextContent('Loading data')
    expect(await screen.findByRole('alert')).not.toHaveTextContent('private backend detail')
    expect(screen.queryByText('No software access yet')).not.toBeInTheDocument()
    failed = false
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Granted Software')).toBeInTheDocument()
  })

  it('shows the correct empty state for current and ended rights', async () => {
    server.use(http.get('*/api/v1/me/software-rights', () => HttpResponse.json(response([]))))
    mount()
    expect(await screen.findByText('No software access yet')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Access period'), { target: { value: 'ended' } })
    expect(await screen.findByText('No ended software access')).toBeInTheDocument()
  })

  it('does not label a new backend status as active or expose the raw code', async () => {
    server.use(
      http.get('*/api/v1/me/software-rights', () =>
        HttpResponse.json(
          response([{ ...rights, status: 'NEW_PRIVATE_STATUS' } as unknown as MySoftwarePageResponseDtoDataItemsItem])
        )
      )
    )
    mount()
    expect(await screen.findByText('Unsupported status')).toBeInTheDocument()
    expect(screen.queryByText('NEW_PRIVATE_STATUS')).not.toBeInTheDocument()
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })
})
