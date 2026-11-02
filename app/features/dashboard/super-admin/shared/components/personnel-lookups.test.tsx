import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { EmployeeLookup } from './employee-lookup'
import { DepartmentLookup } from './department-lookup'
import { PersonnelForm } from './personnel-form'
import { NoticeEventLookup } from './notice-event-lookup'

const employeeId = '11111111-1111-4111-8111-111111111111'
const departmentId = '22222222-2222-4222-8222-222222222222'
const server = setupServer()
const envelope = (data: unknown) => HttpResponse.json({ success: true, data })
const pagination = (page = 1) => ({ page, pageSize: 20, totalItems: 40, totalPages: 2 })
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => { await setAppLanguage('en', false) })
function mount(element: React.ReactNode) {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{element}</QueryClientProvider>)
}
function expectNoVisibleIds(container: HTMLElement) {
  expect(container.textContent).not.toMatch(/[0-9a-f]{8}-[0-9a-f-]{27}/i)
  for (const input of container.querySelectorAll('input:not([type="hidden"])')) {
    expect((input as HTMLInputElement).value).not.toMatch(/[0-9a-f]{8}-[0-9a-f-]{27}/i)
  }
}

it('selects employee names on later account pages, submits UUIDs and allows clearing', async () => {
  const pages: string[] = []
  server.use(http.get('*/api/v1/app-users', ({ request }) => {
    const params = new URL(request.url).searchParams
    pages.push(params.get('page') ?? '')
    expect(params.has('search')).toBe(false)
    return envelope({ items: [{ id: 'account', employee: { id: employeeId, employeeCode: 'EMP-1', fullName: `Employee page ${params.get('page')}` } }], pagination: pagination(Number(params.get('page'))) })
  }))
  const { container } = mount(<form><EmployeeLookup name='employeeId' required={false} /></form>)
  const field = screen.getByRole('combobox', { name: 'Employee' })
  fireEvent.click(screen.getByRole('button', { name: 'Find employee' }))
  await screen.findByRole('button', { name: /Employee page 1/ })
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  fireEvent.click(await screen.findByRole('button', { name: /Employee page 2/ }))
  expect(field).toHaveDisplayValue('EMP-1 — Employee page 2')
  expect(new FormData(container.querySelector('form')!).get('employeeId')).toBe(employeeId)
  expectNoVisibleIds(container)
  fireEvent.change(field, { target: { value: '' } })
  expect(new FormData(container.querySelector('form')!).get('employeeId')).toBe('')
  expect(pages).toEqual(['1', '2'])
})

it('selects employees without accounts and requires an actual selection', async () => {
  server.use(
    http.get('*/api/v1/app-users', () => envelope({ items: [], pagination: pagination() })),
    http.get('*/api/v1/account-candidates', () => envelope({ items: [{ id: employeeId, employeeCode: 'EMP-2', fullName: 'No Account' }] }))
  )
  const onSubmit = vi.fn()
  const { container } = mount(<PersonnelForm title='Test' pending={false} onClose={vi.fn()} onSubmit={onSubmit} fields={[{ name: 'employeeId', type: 'uuid' }]} />)
  expect(container.querySelector('form')!.checkValidity()).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Find employee' }))
  fireEvent.click(screen.getByRole('button', { name: 'Without accounts' }))
  fireEvent.click(await screen.findByRole('button', { name: /No Account/ }))
  expect(container.querySelector('form')!.checkValidity()).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(onSubmit.mock.calls[0][0].get('employeeId')).toBe(employeeId)
  expectNoVisibleIds(container)
})

it('resolves the initial department name without replacing its UUID and can clear it', async () => {
  server.use(http.get('*/api/v1/departments/:id', () => envelope({ id: departmentId, code: 'ENG', name: 'Engineering' })))
  const { container } = mount(<form><DepartmentLookup name='departmentId' required={false} initial={departmentId} /></form>)
  const field = screen.getByRole('combobox', { name: 'Department' })
  await waitFor(() => expect(field).toHaveDisplayValue('ENG · Engineering'))
  expect(new FormData(container.querySelector('form')!).get('departmentId')).toBe(departmentId)
  expectNoVisibleIds(container)
  fireEvent.change(field, { target: { value: '' } })
  expect(new FormData(container.querySelector('form')!).get('departmentId')).toBe('')
})

it('chooses a recorded event by its route and date with employee-scoped pagination', async () => {
  const eventId = '33333333-3333-4333-8333-333333333333'
  server.use(http.get('*/api/v1/department-transfers', ({ request }) => {
    expect(new URL(request.url).searchParams.get('employeeId')).toBe(employeeId)
    return envelope({ items: [{ id: eventId, employee: { id: employeeId, fullName: 'Dana' }, from: { department: { name: 'Engineering' } }, to: { department: { name: 'Finance' } }, effectiveOn: '2026-10-30', status: 'EFFECTIVE' }], pagination: pagination() })
  }))
  const { container } = mount(<form><NoticeEventLookup employeeId={employeeId} source='transfers' /></form>)
  fireEvent.click(await screen.findByRole('button', { name: /Engineering → Finance/ }))
  expect(new FormData(container.querySelector('form')!).get('eventId')).toBe(eventId)
  expectNoVisibleIds(container)
})
