import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import type {
  DepartmentMembersResponseDtoDataItemsItem,
  DepartmentToolsResponseDtoDataItemsItem
} from '~/shared/api/generated/model'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, planId, requestId } from '../../../../test/fixtures/employee-api'
import { managerRequest } from '../../../../test/fixtures/manager-api'
import { ManagerRequestLookup } from './team-requests/views/manager-live-request-lookup'
import { ManagerLiveTeam } from './team/views/manager-live-team'

const server = setupServer(
  http.get('*/api/v1/departments/:id', () =>
    HttpResponse.json({ success: true, data: { id: employeeId, name: 'Engineering' } })
  )
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
function mount(children: ReactNode, url = `/dashboard/manager?departmentId=${employeeId}`) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>
        {children}
        <RouteProbe />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
function member(index: number, fullName = `Member ${index}`): DepartmentMembersResponseDtoDataItemsItem {
  return {
    employeeCode: `EMP-${index}`,
    fullName,
    status: 'ACTIVE',
    workState: 'WORKING',
    hasWorkEmail: true,
    memberSince: '2026-10-01'
  }
}
function tool(index: number, name = 'Other app'): DepartmentToolsResponseDtoDataItemsItem {
  return {
    assignmentId: `assignment-${index}`,
    employeeCode: `EMP-${index}`,
    fullName: `Employee ${index}`,
    holderStatus: 'ACTIVE',
    kind: 'PERSONAL',
    source: 'REQUEST',
    application: { id: planId, name },
    plan: { id: planId, name: `Standard ${index}` },
    effectiveFrom: '2026-10-01',
    effectiveFromLabel: null,
    terminating: false,
    terminatingUntil: null
  }
}
function page(items: unknown[], current: number, totalItems: number, pageSize: number) {
  return HttpResponse.json({
    success: true,
    data: { items, pagination: { page: current, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) } }
  })
}
function search(name: string, value: string) {
  fireEvent.change(screen.getByRole('searchbox', { name }), { target: { value } })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
}

describe('Manager searchable lists', () => {
  it('keeps the NEED list explicit about the missing backend API and searches a real request before opening it', async () => {
    const opened = vi.fn()
    const read = vi.fn()
    server.use(
      http.get('*/api/v1/access-requests/:id', ({ params }) => {
        read(params.id)
        return HttpResponse.json({ success: true, data: { request: managerRequest } })
      })
    )
    mount(<ManagerRequestLookup onOpen={opened} />)
    expect(screen.getByRole('table', { name: 'Requests awaiting need approval' })).toBeInTheDocument()
    expect(screen.getByText('The request queue API is not available yet')).toBeInTheDocument()
    expect(screen.queryByText('Need approval process')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(read).not.toHaveBeenCalled()

    search('Request ID', 'partial-id')
    expect(screen.getByText('Enter the complete request ID to search')).toBeInTheDocument()
    expect(read).not.toHaveBeenCalled()
    search('Request ID', requestId)
    const table = await screen.findByRole('table', { name: 'Search results' })
    expect(await within(table).findByText('Test Software')).toBeInTheDocument()
    expect(read).toHaveBeenCalledWith(requestId)
    expect(opened).not.toHaveBeenCalled()
    fireEvent.click(within(table).getByRole('button', { name: 'Open' }))
    expect(opened).toHaveBeenCalledWith(requestId)
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByText('The request queue API is not available yet')).toBeInTheDocument()
    expect(screen.queryByText('Test Software')).not.toBeInTheDocument()
  })

  it('finds members beyond the current server page and paginates all accent-insensitive matches', async () => {
    const reads: string[] = []
    const all = [
      ...Array.from({ length: 100 }, (_, i) => member(i)),
      ...Array.from({ length: 42 }, (_, i) => member(100 + i, `Nguyễn ${i + 1}`))
    ]
    server.use(
      http.get('*/api/v1/departments/:id/employees', ({ request }) => {
        const params = new URL(request.url).searchParams
        const current = Number(params.get('page'))
        const size = Number(params.get('pageSize'))
        reads.push(`${current}/${size}`)
        return page(all.slice((current - 1) * size, current * size), current, all.length, size)
      })
    )
    mount(<ManagerLiveTeam departmentId={employeeId} />)
    expect(await screen.findByText('Member 0')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Member 20')).toBeInTheDocument()
    search('Search department members', 'nguyen')
    expect(await screen.findByText('Nguyễn 1')).toBeInTheDocument()
    expect(screen.getByText('42 records')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(21)
    expect(screen.queryByText('Nguyễn 21')).not.toBeInTheDocument()
    expect(screen.getByTestId('route').textContent).not.toContain('page=')
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Nguyễn 21')).toBeInTheDocument()
    expect(screen.getByTestId('route').textContent).toContain('search=nguyen')
    expect(reads).toEqual(['1/20', '2/20', '1/100', '2/100'])
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(await screen.findByText('Member 0')).toBeInTheDocument()
    expect(screen.getByTestId('route').textContent).not.toMatch(/search=|page=/)
    expect(screen.getByTestId('route').textContent).toContain(`departmentId=${employeeId}`)
  })

  it('finds tools across server pages and paginates matching assignments', async () => {
    const all = [
      ...Array.from({ length: 100 }, (_, i) => tool(i)),
      ...Array.from({ length: 21 }, (_, i) => tool(100 + i, 'Figma'))
    ]
    server.use(
      http.get('*/api/v1/departments/:id/tools-in-use', ({ request }) => {
        const params = new URL(request.url).searchParams
        const current = Number(params.get('page'))
        const size = Number(params.get('pageSize'))
        return page(all.slice((current - 1) * size, current * size), current, all.length, size)
      })
    )
    mount(<ManagerLiveTeam departmentId={employeeId} tools />)
    expect(await screen.findByText('Employee 0')).toBeInTheDocument()
    search('Search assigned tools', 'figma')
    expect(await screen.findByText('Employee 100')).toBeInTheDocument()
    expect(screen.getAllByText('Figma')).toHaveLength(20)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Employee 120')).toBeInTheDocument()
    expect(screen.getAllByText('Figma')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    search('Search assigned tools', 'assignment-120')
    expect(await screen.findByText('Employee 120')).toBeInTheDocument()
    expect(screen.queryByText('Employee 100')).not.toBeInTheDocument()
  })

  it('does not expose partial matches when a later search page fails and retries the complete list', async () => {
    let fail = true
    server.use(
      http.get('*/api/v1/departments/:id/employees', ({ request }) => {
        const current = Number(new URL(request.url).searchParams.get('page'))
        if (current === 2 && fail) return HttpResponse.json({ success: false }, { status: 503 })
        return page([member(current, `Match ${current}`)], current, 101, 100)
      })
    )
    mount(<ManagerLiveTeam departmentId={employeeId} />, `/dashboard/manager?search=match`)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByText('Match 1')).not.toBeInTheDocument()
    fail = false
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('Match 1')).toBeInTheDocument()
    expect(screen.getByText('Match 2')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('shows an unlinked department list without sending an invalid UUID request', () => {
    mount(<ManagerLiveTeam />)
    expect(screen.getByRole('table', { name: 'Department members' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeDisabled()
    expect(screen.getByText('Link your department to load the list')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).queryByRole('status')).not.toBeInTheDocument()
  })
})
