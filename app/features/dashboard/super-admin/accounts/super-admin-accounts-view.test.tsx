import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { env } from '~/shared/config/env'
import { adminAccounts } from '~/shared/i18n/locales/en/admin-accounts'
import { SuperAdminAccountsView } from './views/super-admin-accounts-view'

const endpoint = `${env.API_BASE_URL}/api/v1`
const account = {
  id: 'account-1',
  loginEmail: 'alex@example.com',
  status: 'ACTIVE',
  activationState: 'INVITED',
  createdAt: '2026-10-01T00:00:00Z',
  employee: { id: 'employee-1', employeeCode: 'EMP-001', fullName: 'Alex' },
  roles: ['EMPLOYEE']
}
const envelope = (data: unknown) => ({ success: true, message: 'APP_USER.LISTED', data })
const page = (items = [account], currentPage = 1) =>
  envelope({ items, pagination: { page: currentPage, pageSize: 20, totalItems: 21, totalPages: 2 } })
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
  i18n.addResourceBundle('en', 'adminAccounts', adminAccounts, true, true)
  server.use(
    http.get(`${endpoint}/me`, () =>
      HttpResponse.json(
        envelope({
          appUserId: 'previous-admin',
          loginEmail: 'admin@example.com',
          employee: {
            id: 'previous-employee',
            employeeCode: 'E-001',
            fullName: 'Previous Administrator',
            department: null,
            jobTitle: null
          },
          roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] },
          selfServiceOnly: false
        })
      )
    ),
    http.get(`${endpoint}/app-users`, () => HttpResponse.json(page())),
    http.get(`${endpoint}/app-users/:id`, () =>
      HttpResponse.json(envelope({ ...account, roleHistory: [], roleHistoryHasMore: false, invitation: null }))
    ),
    http.get(`${endpoint}/account-candidates`, () =>
      HttpResponse.json(
        envelope({
          items: [
            {
              id: 'employee-2',
              employeeCode: 'EMP-002',
              fullName: 'Jamie',
              workEmail: 'jamie@example.com',
              department: 'IT'
            }
          ]
        })
      )
    ),
    http.get(`${endpoint}/approval-roles`, () => HttpResponse.json(envelope({ items: [] })))
  )
})
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <SuperAdminAccountsView />
    </QueryClientProvider>
  )
  return client
}

describe('Super Admin account requests', () => {
  it('requests server filters and pagination rather than filtering the current page', async () => {
    const requests: URL[] = []
    server.use(
      http.get(`${endpoint}/app-users`, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(page())
      })
    )
    mount()
    await screen.findByText('alex@example.com')
    fireEvent.change(screen.getByLabelText('Account status'), { target: { value: 'LOCKED' } })
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('status')).toBe('LOCKED'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('page')).toBe('2'))
  })

  it('sends the selected candidate and retains the form after rejection', async () => {
    const create = vi.fn()
    server.use(
      http.post(`${endpoint}/app-users`, async ({ request }) => {
        create(await request.json())
        return HttpResponse.json({ success: false, error: { code: 'APP_USER.LOGIN_EMAIL_TAKEN' } }, { status: 409 })
      })
    )
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Invite account' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByLabelText('Find employee')).toHaveAttribute(
      'placeholder',
      'Enter a name, employee code or work email'
    )
    fireEvent.click(await within(dialog).findByRole('radio', { name: /Jamie/ }))
    fireEvent.change(within(dialog).getByLabelText('Login email'), { target: { value: 'other@example.com' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Send invitation' }))
    await waitFor(() =>
      expect(create).toHaveBeenCalledWith({
        employeeId: 'employee-2',
        loginEmail: 'other@example.com',
        roles: ['EMPLOYEE']
      })
    )
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Send invitation' })).toBeEnabled())
    expect(within(dialog).getByLabelText('Login email')).toHaveValue('other@example.com')
  })

  it('blocks duplicate invite submissions while pending and invalidates the account list on success', async () => {
    let creates = 0
    server.use(
      http.post(`${endpoint}/app-users`, async () => {
        creates++
        await delay(100)
        return HttpResponse.json(envelope(account), { status: 201 })
      })
    )
    const client = mount()
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    fireEvent.click(screen.getByRole('button', { name: 'Invite account' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(await within(dialog).findByRole('radio', { name: /Jamie/ }))
    const submit = within(dialog).getByRole('button', { name: 'Send invitation' })
    fireEvent.click(submit)
    fireEvent.click(submit)
    await waitFor(() => expect(submit).toBeDisabled())
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(creates).toBe(1)
    expect(invalidate).toHaveBeenCalledWith({ queryKey: [expect.stringContaining('/app-users')] })
  })

  it('blocks status dependent writes for an unrecognized account status', async () => {
    server.use(
      http.get(`${endpoint}/app-users/:id`, () =>
        HttpResponse.json(
          envelope({ ...account, status: 'FUTURE', roleHistory: [], roleHistoryHasMore: false, invitation: null })
        )
      )
    )
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
    const dialog = await screen.findByRole('dialog')
    await within(dialog).findByText('Unknown')
    expect(within(dialog).getByRole('button', { name: 'Lock account' })).toBeDisabled()
    expect(within(dialog).getByRole('button', { name: 'Grant role' })).toBeDisabled()
  })

  it('only offers direct grant roles and sends a strict role payload', async () => {
    const grant = vi.fn()
    server.use(
      http.post(`${endpoint}/app-users/:id/role-grants`, async ({ request }) => {
        grant(await request.json())
        return HttpResponse.json(envelope(account), { status: 201 })
      })
    )
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Grant role' }))
    const dialog = screen.getByRole('dialog')
    const picker = within(dialog).getByLabelText('Role')
    expect(within(picker).queryByRole('option', { name: 'Manager' })).not.toBeInTheDocument()
    expect(within(picker).queryByRole('option', { name: 'Spending Approver' })).not.toBeInTheDocument()
    expect(within(picker).queryByRole('option', { name: 'Super Admin' })).not.toBeInTheDocument()
    fireEvent.change(picker, { target: { value: 'FINANCE' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(grant).toHaveBeenCalledWith({ role: 'FINANCE' }))
  })

  it.each([
    ['ACTIVE', 'Lock account', 'lock'],
    ['LOCKED', 'Unlock account', 'unlock']
  ])('sends a reason for %s status changes', async (status, label, operation) => {
    const save = vi.fn()
    server.use(
      http.get(`${endpoint}/app-users/:id`, () =>
        HttpResponse.json(
          envelope({ ...account, status, roleHistory: [], roleHistoryHasMore: false, invitation: null })
        )
      ),
      http.post(`${endpoint}/app-users/:id/${operation}`, async ({ request }) => {
        save(await request.json())
        return HttpResponse.json(envelope(account))
      })
    )
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
    fireEvent.click(await screen.findByRole('button', { name: label }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText('Reason'), { target: { value: '  Security review  ' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(save).toHaveBeenCalledWith({ reason: 'Security review' }))
  })

  it('assigns approval responsibility using employee ID from paged activated accounts', async () => {
    const assign = vi.fn()
    const requests: URL[] = []
    server.use(
      http.get(`${endpoint}/approval-roles`, () =>
        HttpResponse.json(
          envelope({ items: [{ role: 'CONFLICT_SUBSTITUTE', holder: null, history: [], historyHasMore: false }] })
        )
      ),
      http.get(`${endpoint}/app-users`, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(page([{ ...account, activationState: 'ACTIVATED' }]))
      }),
      http.put(`${endpoint}/approval-roles/CONFLICT_SUBSTITUTE`, async ({ request }) => {
        assign(await request.json())
        return HttpResponse.json(envelope({ items: [] }))
      })
    )
    mount()
    fireEvent.click(screen.getByRole('tab', { name: 'Approval responsibilities' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Assign or replace' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(await within(dialog).findByRole('radio', { name: /Alex/ }))
    expect(requests.at(-1)?.searchParams.get('activationState')).toBe('ACTIVATED')
    expect(requests.at(-1)?.searchParams.get('employeeLeft')).toBe('false')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(assign).toHaveBeenCalledWith({ employeeId: 'employee-1' }))
  })

  it('confirms transfer and sends only successorAppUserId', async () => {
    const transfer = vi.fn()
    server.use(
      http.get(`${endpoint}/app-users`, () => HttpResponse.json(page([{ ...account, activationState: 'ACTIVATED' }]))),
      http.post(`${endpoint}/super-admin-transfers`, async ({ request }) => {
        transfer(await request.json())
        return HttpResponse.json(envelope({}))
      })
    )
    mount()
    fireEvent.click(screen.getByRole('tab', { name: 'Approval responsibilities' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Transfer Super Admin' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(await within(dialog).findByRole('radio', { name: /Alex/ }))
    fireEvent.click(within(dialog).getByRole('checkbox'))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(transfer).toHaveBeenCalledWith({ successorAppUserId: 'account-1' }))
    expect(within(dialog).queryByLabelText(/password/i)).not.toBeInTheDocument()
  })

  it('shows a retryable read error and recovers to an empty state', async () => {
    server.use(
      http.get(`${endpoint}/app-users`, () =>
        HttpResponse.json({ success: false, error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
      )
    )
    mount()
    await screen.findByRole('alert')
    server.use(http.get(`${endpoint}/app-users`, () => HttpResponse.json(page([]))))
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('No matching records')).toBeInTheDocument()
  })

  it('honors Retry-After without clearing the invitation form', async () => {
    server.use(
      http.post(`${endpoint}/app-users`, () =>
        HttpResponse.json(
          { success: false, error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      )
    )
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Invite account' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(await within(dialog).findByRole('radio', { name: /Jamie/ }))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Send invitation' }))
    expect(await within(dialog).findByRole('button', { name: /Try again in/ })).toBeDisabled()
    expect(within(dialog).getByLabelText('Login email')).toHaveValue('jamie@example.com')
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeEnabled()
  })
})
