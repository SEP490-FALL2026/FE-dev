import { employeeCatalogHandlers, chooseCatalogPlan } from '../../../../../test/fixtures/employee-catalog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, planId, requestId, groupCheck, pageResponse } from '../../../../../test/fixtures/employee-api'
import { EmployeeLiveCreateView } from './views/employee-live-create-view'

const colleague = { employeeId, fullName: 'Test Colleague', workEmail: 'colleague@example.test' }
const other = { employeeId: requestId, fullName: 'Test Colleague', workEmail: 'design@example.test' }
const groupUrl = '/?tab=create-request&mode=group'
const server = setupServer(...employeeCatalogHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(url = groupUrl) {
  const navigate = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>
        <EmployeeLiveCreateView onSelectTab={navigate} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return navigate
}
function closePeople() {
  fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
}

describe('Employee group request dropdowns', () => {
  it('omits the retired project field and loads the requester catalog without privileged API calls', async () => {
    const privileged = vi.fn()
    server.use(
      http.get('*/api/v1/plans', () => {
        privileged()
        return HttpResponse.json(pageResponse([]))
      })
    )
    mount('/?tab=create-request&mode=group')
    expect(screen.getByRole('combobox', { name: 'Beneficiaries' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Project label (optional)')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Plan ID supplied by IT')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Use the official plan or assignment ID and explain what you need.')
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Track by ID' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preview request' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled()
    await chooseCatalogPlan()
    expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard')
    expect(privileged).not.toHaveBeenCalled()
  })

  it('keeps selected names  across server pages and searches', async () => {
    const reads: string[] = []
    server.use(
      http.get('*/api/v1/group-request-candidates', ({ request }) => {
        const params = new URL(request.url).searchParams
        reads.push(params.toString())
        const current = Number(params.get('page'))
        const filtered = !!params.get('q')
        return HttpResponse.json(
          pageResponse(filtered || current === 2 ? [other] : [colleague], current, filtered ? 1 : 2)
        )
      })
    )
    mount()
    await chooseCatalogPlan()
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /colleague@example.test/ }))
    closePeople()
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(await screen.findByRole('option', { name: /design@example.test/ }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  design  ' } })
    await waitFor(() =>
      expect(reads.some((value) => value.includes('q=design') && value.includes('page=1'))).toBe(true)
    )
    expect(await screen.findByRole('option', { name: /design@example.test/ })).toHaveAttribute('aria-selected', 'true')
    closePeople()
    expect(screen.getByRole('combobox', { name: 'Beneficiaries' })).toHaveTextContent('2 / 10 selected')
    const selected = screen.getByRole('list', { name: 'Selected beneficiaries' })
    fireEvent.click(within(selected).getAllByRole('button', { name: 'Remove Test Colleague' })[1]!)
    expect(screen.queryByRole('group', { name: /design@example.test/ })).not.toBeInTheDocument()
  })

  it('keeps the checked selection while searching and clears the preview when people change', async () => {
    const checked = vi.fn()
    server.use(
      http.get('*/api/v1/group-request-candidates', () => HttpResponse.json(pageResponse([colleague, other]))),
      http.post('*/api/v1/group-requests/check', async ({ request }) => {
        const body = (await request.json()) as { lines: { employeeId: string }[] }
        checked(body)
        return HttpResponse.json({
          success: true,
          data: { ...groupCheck, lines: body.lines.map((line) => ({ ...line, ok: true, reason: null })) }
        })
      })
    )
    mount()
    await chooseCatalogPlan()
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /colleague@example.test/ }))
    fireEvent.click(screen.getByRole('option', { name: /design@example.test/ }))
    closePeople()
    fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Team development' } })
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    expect(await screen.findByRole('button', { name: 'Submit request' })).toBeEnabled()
    expect(checked).toHaveBeenCalledWith({
      planId,

      businessReason: 'Team development',
      lines: [{ employeeId }, { employeeId: requestId }]
    })
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'colleague' } })
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeEnabled()
    closePeople()
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove Test Colleague' })[0]!)
    expect(screen.queryByRole('button', { name: 'Submit request' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preview request' })).toBeDisabled()
  })

  it('retries candidate errors and allows no more than ten beneficiaries', async () => {
    let fail = true
    const people = Array.from({ length: 11 }, (_, index) => ({
      employeeId: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
      fullName: `Employee ${index}`,
      workEmail: `employee${index}@example.test`
    }))
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        fail ? HttpResponse.json({ success: false }, { status: 503 }) : HttpResponse.json(pageResponse(people))
      )
    )
    mount()
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    fail = false
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await screen.findByRole('option', { name: /employee0@example.test/ })
    for (let index = 0; index < 10; index++)
      fireEvent.click(screen.getByRole('option', { name: new RegExp(`employee${index}@example.test`) }))
    expect(screen.getByRole('option', { name: /employee10@example.test/ })).toBeDisabled()
    closePeople()
    fireEvent.click(screen.getByRole('button', { name: 'Remove Employee 0' }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    expect(screen.getByRole('option', { name: /employee10@example.test/ })).toBeEnabled()
  })
})
