import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningGrantQueue } from './components/provisioning-grant-queue'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const api = vi.mocked(customAxios)
let free: number | null
let failSeats: boolean
let provisioningType: string
let granted: boolean
let assigned: boolean
let rejectGrant: boolean
let requestType: string
const row = (id: string) => ({
  requestId: id,
  type: requestType,
  lineCount: 1,
  boundaryState: requestType === 'SERVICE_ACCOUNT' ? 'ACCEPTED' : null,
  expectedEndDate: null,
  submittedAt: '2026-11-01T00:00:00Z',
  beneficiary: { employeeId: id, employeeCode: id, fullName: id },
  requester: { employeeId: id, employeeCode: id, fullName: id },
  plan: { planId: 'plan', applicationName: 'ChatGPT', planName: 'Plus' }
})
function setup() {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ProvisioningGrantQueue onCreated={vi.fn()} />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  vi.resetAllMocks()
  free = 1
  failSeats = false
  provisioningType = 'K2'
  granted = false
  assigned = true
  rejectGrant = false
  requestType = 'GRANT'
  await setAppLanguage('en', false)
  api.mockImplementation(async (config) => {
    const url = config.url ?? ''
    if (config.method === 'POST') {
      if (rejectGrant) {
        free = 0
        throw Object.assign(new Error('capacity'), {
          response: { status: 409, data: { error: { code: 'LICENSE_ASSIGNMENT.SEAT_CAPACITY' } } }
        })
      }
      granted = true
      return { data: { task: { id: 'created' } } }
    }
    if (url.endsWith('/me')) return { data: { roles: ['IT_ADMIN'], employee: { id: 'it' } } }
    if (url.endsWith('/departments'))
      return {
        data: {
          items:
            config.params?.page === 2
              ? [{ id: 'sales', name: 'Sales', itAdmin: { employeeId: assigned ? 'it' : 'other', usable: true } }]
              : [{ id: 'hr', name: 'HR', itAdmin: { employeeId: 'other', usable: true } }],
          pagination: { totalPages: 2, totalItems: 2 }
        }
      }
    if (url.endsWith('/grant-queue'))
      return {
        data: {
          items: config.params?.page === 2 ? (granted ? [] : [row('Alice')]) : [row('Bob')],
          pagination: { totalPages: 2, totalItems: 2 }
        }
      }
    if (url.endsWith('/departments/sales/technical-members'))
      return {
        data: {
          items:
            config.params?.page === 2
              ? [
                  { id: 'Alice', code: 'E1', fullName: 'Alice', departmentId: 'sales', employmentStatus: 'WORKING' },
                  {
                    id: 'replacement',
                    code: 'E2',
                    fullName: 'Replacement Owner',
                    departmentId: 'sales',
                    employmentStatus: 'WORKING'
                  }
                ]
              : [
                  {
                    id: 'departed',
                    code: 'E3',
                    fullName: 'Departed Owner',
                    departmentId: 'sales',
                    employmentStatus: 'LEFT'
                  }
                ],
          pagination: { totalPages: 2, totalItems: 3 }
        }
      }
    if (url.endsWith('/plans/plan')) return { data: { provisioningType } }
    if (url.endsWith('/subscriptions'))
      return {
        data: {
          items: [
            {
              id: 'private-uuid-full',
              ownerDepartmentId: 'sales',
              planName: 'Plus',
              startDate: '2026-01-01',
              endDate: '2027-01-01'
            },
            {
              id: 'private-uuid-free',
              ownerDepartmentId: 'sales',
              planName: 'Plus',
              startDate: '2026-02-01',
              endDate: '2027-02-01'
            },
            { id: 'private-uuid-foreign', ownerDepartmentId: 'hr', planName: 'Plus' }
          ],
          pagination: { totalPages: 1, totalItems: 3 }
        }
      }
    if (url.endsWith('/seat-usage')) {
      if (failSeats) throw new Error('offline')
      return {
        data: {
          purchased: 1,
          occupied: url.includes('uuid-full') ? 1 : 0,
          free: url.includes('uuid-full') ? 0 : free,
          asOf: '2026-11-06'
        }
      }
    }
    throw new Error('Unhandled URL: ' + url)
  })
})
it('shows only beneficiaries in assigned departments, including matches beyond the first API page', async () => {
  setup()
  expect(await screen.findByText(/Alice/)).toBeInTheDocument()
  expect(screen.queryByText(/Bob/)).not.toBeInTheDocument()
  expect(screen.queryByText('HR')).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/UUID/)).not.toBeInTheDocument()
  expect(api.mock.calls.some(([config]) => config.url?.includes('/employees/'))).toBe(false)
})
it('requires an eligible subscription and hides UUIDs and exhausted or foreign purchases', async () => {
  setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  const dialog = within(screen.getByRole('dialog'))
  expect(dialog.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.click(await dialog.findByRole('combobox', { name: 'Subscription' }))
  await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
  expect(screen.queryByText(/private-uuid/)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('option'))
  fireEvent.click(dialog.getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(api.mock.calls.find(([c]) => c.method === 'POST')?.[0].data).toMatchObject({
      subscriptionId: 'private-uuid-free',
      requestId: 'Alice'
    })
  )
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(screen.queryByText(/Alice/)).not.toBeInTheDocument()
})
it('does not load requests when no department is assigned', async () => {
  assigned = false
  setup()
  expect(
    await screen.findByText('You are not assigned to any department. Contact the Super Admin for an assignment.')
  ).toBeInTheDocument()
  expect(api.mock.calls.some(([config]) => config.url?.endsWith('/grant-queue'))).toBe(false)
})
it('refreshes seats after a concurrent capacity conflict and preserves the account input', async () => {
  rejectGrant = true
  setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  fireEvent.click(await screen.findByRole('combobox', { name: 'Subscription' }))
  fireEvent.click(await screen.findByRole('option'))
  fireEvent.change(screen.getByLabelText('Account identifier'), { target: { value: 'alice@example.org' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  expect(await screen.findByText('No subscription with available seats for this department.')).toBeInTheDocument()
  expect(screen.getByLabelText('Account identifier')).toHaveValue('alice@example.org')
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
})
it.each([0, null])('blocks granting when capacity is %s', async (capacity) => {
  free = capacity
  setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  expect(await screen.findByText('No subscription with available seats for this department.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
})
it('blocks submission when seat availability cannot be loaded', async () => {
  failSeats = true
  setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  await screen.findByRole('alert')
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
})
it('grants internal K5 access without a subscription', async () => {
  provisioningType = 'K5'
  setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(api.mock.calls.find(([c]) => c.method === 'POST')).toBeDefined())
  expect(api.mock.calls.find(([c]) => c.method === 'POST')?.[0].data).not.toHaveProperty('subscriptionId')
})
it('allows selecting an active replacement responsible person from the assigned department', async () => {
  requestType = 'SERVICE_ACCOUNT'
  provisioningType = 'K5'
  setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  const chooser = await screen.findByRole('combobox', { name: 'Responsible employee' })
  await waitFor(() => expect(chooser).toBeEnabled())
  fireEvent.click(chooser)
  fireEvent.click(await screen.findByRole('option', { name: /Replacement Owner/ }))
  expect(screen.queryByRole('option', { name: /Departed Owner/ })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Account identifier'), { target: { value: 'robot@example.org' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(api.mock.calls.find(([c]) => c.method === 'POST')?.[0].data).toMatchObject({
      responsibleEmployeeId: 'replacement',
      accountIdentifier: 'robot@example.org'
    })
  )
})
