import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MyRequestsPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/myRequestsPageResponseDtoDataItemsItem'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  employeeId,
  planId,
  requestId,
  plan,
  person,
  accessRequest,
  pageResponse
} from '../../../../../test/fixtures/employee-api'
import { catalogPlanDetails } from '../../../../../test/fixtures/employee-catalog'
import { EmployeeLiveRequestsView } from './views/employee-live-requests-view'

const item: MyRequestsPageResponseDtoDataItemsItem = {
  id: requestId,
  type: 'GRANT',
  branch: 'PAID_IN_CATALOG',
  state: 'PENDING',
  plan,
  softwareName: null,
  beneficiary: person,
  lineCount: 1,
  termMonths: 3,
  submittedAt: '2026-11-01T03:00:00Z',
  updatedAt: '2026-11-01T03:00:00Z',
  needStep: { state: 'PENDING', assignee: null, waitingReason: null },
  spend: null,
  outcome: null,
  withdrawal: null,
  canWithdraw: true
}
const draft = {
  id: employeeId,
  kind: 'INDIVIDUAL',
  planId,
  departmentId: employeeId,
  beneficiaryCount: 1,
  createdAt: '2026-11-01T03:00:00Z'
}
const server = setupServer(
  http.get('*/api/v1/me/access-requests', () => HttpResponse.json(pageResponse([item]))),
  http.get('*/api/v1/access-requests/drafts', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/requestable-plans/:id', () => HttpResponse.json({ success: true, data: catalogPlanDetails }))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function RouteProbe() {
  return <output data-testid='route'>{useLocation().search}</output>
}
function mount(url = '/?tab=my-requests') {
  const navigate = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>
        <EmployeeLiveRequestsView onSelectTab={navigate} />
        <RouteProbe />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return navigate
}
function section(name: string) {
  return within(screen.getByRole('heading', { name, level: 2 }).closest('section')!)
}

describe('Employee submitted request list', () => {
  it('lists submitted requests before drafts, loads actual rows and opens the selected request', async () => {
    const navigate = mount()
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Submitted requests',
      'Drafts'
    ])
    const list = section('Submitted requests')
    expect(await list.findByText('Test Software')).toBeInTheDocument()
    expect(list.getByText('Test Employee')).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
    fireEvent.click(list.getByRole('button', { name: 'View details' }))
    expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId })
    expect(list.queryByRole('button', { name: 'Submit draft' })).not.toBeInTheDocument()
  })

  it('paginates from the server and resets to page one when filtering by state, type and processing view', async () => {
    const reads: URLSearchParams[] = []
    server.use(
      http.get('*/api/v1/me/access-requests', ({ request }) => {
        const query = new URL(request.url).searchParams
        reads.push(query)
        const current = Number(query.get('page'))
        return HttpResponse.json({
          ...pageResponse([{ ...item, plan: { ...plan, applicationName: `Server page ${current}` } }], current, 4),
          data: {
            items: [{ ...item, plan: { ...plan, applicationName: `Server page ${current}` } }],
            pagination: { page: current, pageSize: 20, totalItems: 61, totalPages: 4 }
          }
        })
      })
    )
    mount('/?tab=my-requests&page=3&draftsPage=2')
    const list = section('Submitted requests')
    expect(await list.findByText('Server page 3')).toBeInTheDocument()
    expect(list.getByText('61 requests')).toBeInTheDocument()
    fireEvent.click(list.getByRole('button', { name: 'Next' }))
    expect(await list.findByText('Server page 4')).toBeInTheDocument()
    expect(list.getByRole('button', { name: 'Next' })).toBeDisabled()
    fireEvent.change(list.getByLabelText('Status'), { target: { value: 'COMPLETED' } })
    expect(await list.findByText('Server page 1')).toBeInTheDocument()
    await waitFor(() => expect(reads.at(-1)?.get('state')).toBe('COMPLETED'))
    fireEvent.change(list.getByLabelText('Request type'), { target: { value: 'GROUP_GRANT' } })
    await waitFor(() => expect(reads.at(-1)?.get('type')).toBe('GROUP_GRANT'))
    fireEvent.change(list.getByLabelText('Processing'), { target: { value: 'ended' } })
    await waitFor(() => expect(reads.at(-1)?.get('view')).toBe('ended'))
    expect(reads.at(-1)?.get('state')).toBe('COMPLETED')
    expect(reads.at(-1)?.get('page')).toBe('1')
    expect(reads.every((query) => query.get('pageSize') === '20')).toBe(true)
    expect(screen.getByTestId('route').textContent).toContain('draftsPage=2')
    expect(screen.getByTestId('route').textContent).not.toMatch(/(?:\?|&)page=/)
    fireEvent.click(list.getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => expect(reads.at(-1)?.has('state')).toBe(false))
    expect(reads.at(-1)?.has('type')).toBe(false)
    expect(reads.at(-1)?.has('view')).toBe(false)
  })

  it('keeps sent and draft pagination independent', async () => {
    const sentPages: number[] = []
    const draftPages: number[] = []
    server.use(
      http.get('*/api/v1/me/access-requests', ({ request }) => {
        const current = Number(new URL(request.url).searchParams.get('page'))
        sentPages.push(current)
        return HttpResponse.json(pageResponse([{ ...item, softwareName: `Sent ${current}`, plan: null }], current, 2))
      }),
      http.get('*/api/v1/access-requests/drafts', ({ request }) => {
        const current = Number(new URL(request.url).searchParams.get('page'))
        draftPages.push(current)
        return HttpResponse.json(pageResponse([draft], current, 2))
      })
    )
    mount()
    const sent = section('Submitted requests')
    const drafts = section('Drafts')
    await sent.findByText('Sent 1')
    await drafts.findByRole('button', { name: 'Next' })
    fireEvent.click(sent.getByRole('button', { name: 'Next' }))
    await sent.findByText('Sent 2')
    fireEvent.click(drafts.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(draftPages).toEqual([1, 2]))
    expect(sentPages).toEqual([1, 2])
    expect(screen.getByTestId('route').textContent).toContain('page=2')
    expect(screen.getByTestId('route').textContent).toContain('draftsPage=2')
  })

  it('shows filtered empty results and ignores invalid filter values before calling the API', async () => {
    const read = vi.fn()
    server.use(
      http.get('*/api/v1/me/access-requests', ({ request }) => {
        read(new URL(request.url).searchParams.toString())
        return HttpResponse.json(pageResponse([]))
      })
    )
    mount('/?tab=my-requests&requestState=made-up&requestType=ADMIN&requestView=all&page=-1')
    const list = section('Submitted requests')
    expect(await list.findByText('No requests match these filters')).toBeInTheDocument()
    expect(read).toHaveBeenCalledWith('page=1&pageSize=20')
    expect(list.getByRole('table', { name: 'Submitted requests' })).toBeInTheDocument()
    expect(list.getByLabelText('Status')).toHaveValue('')
    fireEvent.click(list.getByRole('button', { name: 'Clear filters' }))
    expect(await list.findByText('No submitted requests')).toBeInTheDocument()
  })

  it('retries a failed list without showing an error as zero requests', async () => {
    let fail = true
    server.use(
      http.get('*/api/v1/me/access-requests', () =>
        fail ? HttpResponse.json({ success: false }, { status: 503 }) : HttpResponse.json(pageResponse([item]))
      )
    )
    mount()
    const list = section('Submitted requests')
    expect(await list.findByRole('alert')).toBeInTheDocument()
    expect(list.queryByText('0 requests')).not.toBeInTheDocument()
    expect(list.queryByText('No submitted requests')).not.toBeInTheDocument()
    fail = false
    fireEvent.click(list.getByRole('button', { name: 'Try again' }))
    expect(await list.findByText('Test Software')).toBeInTheDocument()
  })

  it('refreshes submitted requests after submitting a draft with the contract body', async () => {
    let sent = false
    const written = vi.fn()
    server.use(
      http.get('*/api/v1/me/access-requests', () => HttpResponse.json(pageResponse(sent ? [item] : []))),
      http.get('*/api/v1/access-requests/drafts', () => HttpResponse.json(pageResponse(sent ? [] : [draft]))),
      http.post('*/api/v1/access-requests/drafts/:id/submission', async ({ request }) => {
        written(await request.json())
        sent = true
        return HttpResponse.json({ success: true, data: { request: accessRequest } }, { status: 201 })
      })
    )
    const navigate = mount()
    await section('Submitted requests').findByText('No submitted requests')
    fireEvent.click(await screen.findByRole('button', { name: 'Submit draft' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(await section('Submitted requests').findByText('Test Software')).toBeInTheDocument()
    expect(written).toHaveBeenCalledWith({})
    expect(written).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId }))
  })
})
