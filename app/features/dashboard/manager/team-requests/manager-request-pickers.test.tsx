import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { useState, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, planId, requestId, groupCheck } from '../../../../../test/fixtures/employee-api'
import { managerRequest } from '../../../../../test/fixtures/manager-api'
import { ManagerPeoplePicker } from '../shared/components/manager-people-picker'
import type { ManagerChoice } from '../shared/components/manager-choice-select'
import { ManagerLiveCreate } from './views/manager-live-create'

const first = { employeeId, fullName: 'Alex Nguyen', workEmail: 'alex.nguyen@example.test' }
const second = { employeeId: requestId, fullName: 'Alex Nguyen', workEmail: 'alex.design@example.test' }
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

function mount(children: ReactNode, url = '/dashboard/manager') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
function People({ limit = 10 }: { limit?: number }) {
  const [value, setValue] = useState<ManagerChoice[]>([])
  return <ManagerPeoplePicker value={value} onChange={setValue} multiple disabled={false} limit={limit} />
}
function candidatePage(items: (typeof first)[], current = 1, pages = 1) {
  return HttpResponse.json({
    success: true,
    data: {
      items,
      pagination: { page: current, pageSize: 20, totalItems: pages === 1 ? items.length : 21, totalPages: pages }
    }
  })
}

describe('Manager request dropdowns', () => {
  it('keeps selected people across server searches and pages, identifies duplicate names by email and allows removal', async () => {
    const reads: string[] = []
    server.use(
      http.get('*/api/v1/group-request-candidates', ({ request }) => {
        const params = new URL(request.url).searchParams
        reads.push(params.toString())
        const current = Number(params.get('page'))
        return params.get('q') ? candidatePage([second]) : candidatePage(current === 1 ? [first] : [second], current, 2)
      })
    )
    mount(<People />)
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /alex.nguyen@example.test/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    const other = await screen.findByRole('option', { name: /alex.design@example.test/ })
    expect(other).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(other)
    expect(screen.getByRole('combobox')).toHaveTextContent('2 employees selected')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  design  ' } })
    await waitFor(() => expect(reads.some((read) => read.includes('q=design') && read.includes('page=1'))).toBe(true))
    expect(await screen.findByRole('option', { name: /alex.design@example.test/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    expect(screen.getByRole('combobox')).toHaveFocus()
    const selected = screen.getByRole('list', { name: 'Selected employees' })
    expect(within(selected).getAllByRole('listitem')).toHaveLength(2)
    fireEvent.click(within(selected).getAllByRole('button', { name: 'Remove Alex Nguyen' })[0]!)
    expect(within(selected).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('combobox')).toHaveTextContent('1 employees selected')
  })

  it('supports keyboard selection, enforces the person limit and retries failed reads', async () => {
    let fail = true
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        fail ? HttpResponse.json({ success: false }, { status: 503 }) : candidatePage([first, second])
      )
    )
    mount(<People limit={1} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    fail = false
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    const option = await screen.findByRole('option', { name: /alex.nguyen@example.test/ })
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' })
    expect(option).toHaveFocus()
    fireEvent.click(option)
    expect(screen.getByRole('option', { name: /alex.design@example.test/ })).toBeDisabled()
    expect(option).not.toBeDisabled()
    fireEvent.click(option)
    expect(screen.getByRole('option', { name: /alex.design@example.test/ })).not.toBeDisabled()
  })

  it('shows the catalog API gap without ID inputs or privileged directory requests', async () => {
    const privileged = vi.fn()
    server.use(
      http.get('*/api/v1/plans', () => {
        privileged()
        return candidatePage([])
      }),
      http.get('*/api/v1/app-users', () => {
        privileged()
        return candidatePage([])
      })
    )
    mount(<ManagerLiveCreate group onOpen={vi.fn()} />)
    expect(screen.queryByLabelText('Plan ID')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Beneficiary employee IDs (one per line)')).not.toBeInTheDocument()
    expect(screen.getAllByRole('combobox')).toHaveLength(2)
    fireEvent.click(screen.getByRole('combobox', { name: 'Plan' }))
    expect(
      screen.getByText('The backend needs to provide a plan catalog for Manager. No plan has been shared in this link.')
    ).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(privileged).not.toHaveBeenCalled()
  })

  it('submits a group with only the IDs of the named selections after the backend check and confirmation', async () => {
    const checked = vi.fn()
    const submitted = vi.fn()
    server.use(
      http.get('*/api/v1/group-request-candidates', () => candidatePage([first, second])),
      http.post('*/api/v1/group-requests/check', async ({ request }) => {
        checked(await request.json())
        return HttpResponse.json({
          success: true,
          data: {
            ...groupCheck,
            lines: [
              { employeeId, ok: true, reason: null },
              { employeeId: requestId, ok: true, reason: null }
            ]
          }
        })
      }),
      http.post('*/api/v1/group-requests', async ({ request }) => {
        submitted(await request.json())
        return HttpResponse.json({ success: true, data: { request: managerRequest } }, { status: 201 })
      })
    )
    mount(
      <ManagerLiveCreate group onOpen={vi.fn()} />,
      `/dashboard/manager?planId=${planId}&planName=Standard&applicationName=Test%20Software`
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Plan' }))
    fireEvent.click(screen.getByRole('option', { name: /Standard/ }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /alex.nguyen@example.test/ }))
    fireEvent.click(screen.getByRole('option', { name: /alex.design@example.test/ }))
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Design work' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Standard')).toBeInTheDocument()
    expect(within(dialog).getByText('alex.design@example.test')).toBeInTheDocument()
    const expected = {
      businessReason: 'Design work',
      termMonths: 3,
      planId,
      lines: [{ employeeId }, { employeeId: requestId }]
    }
    await waitFor(() => expect(checked).toHaveBeenCalledWith(expected))
    expect(submitted).not.toHaveBeenCalled()
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeEnabled())
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(submitted).toHaveBeenCalledWith(expected))
  })
})
