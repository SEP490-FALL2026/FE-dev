import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningGrantQueue } from './components/provisioning-grant-queue'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
let stock = { kind: 'SEATS', free: 0, inRevocation: 0 }
let rejectPurchase = false
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
beforeEach(async () => {
  vi.resetAllMocks()
  stock = { kind: 'SEATS', free: 0, inRevocation: 0 }
  rejectPurchase = false
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') {
      if (rejectPurchase) {
        stock = { kind: 'SEATS', free: 1, inRevocation: 0 }
        throw {
          isAxiosError: true,
          response: { status: 409, data: { error: { code: 'PROVISIONING.PURCHASE_NOT_ALLOWED' } } }
        }
      }
      return { data: { task: { id: 'task-1' } } }
    }
    if (config.url?.endsWith('/grant-queue'))
      return {
        data: {
          items: [
            {
              requestId: 'request-1',
              type: 'GRANT',
              stock: { ...stock },
              expectedEndDate: null,
              beneficiary: { employeeId: 'employee-1', fullName: 'Employee' },
              plan: { planId: 'plan-1', applicationName: 'Workspace', planName: 'Business' }
            }
          ],
          pagination
        }
      }
    return { data: { items: [], pagination: { ...pagination, totalItems: 0 } } }
  })
})
async function open() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ProvisioningGrantQueue onCreated={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
}
const posts = () => request.mock.calls.filter(([config]) => config.method === 'POST')

it.each(['SEATS', 'KEYS'])('requires explicit purchase confirmation for an empty %s pool', async (kind) => {
  stock.kind = kind
  await open()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.click(screen.getByRole('checkbox', { name: 'Purchase one seat or key because the pool is empty' }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({ requestId: 'request-1', beneficiaryEmployeeId: 'employee-1', purchase: {} })
})
it('requires a trimmed reason when rights are being revoked', async () => {
  stock.inRevocation = 2
  await open()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.change(screen.getByLabelText('Purchase reason'), { target: { value: '   ' } })
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Purchase reason'), {
    target: { value: '  Cannot wait for the departing team  ' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data.purchase).toEqual({ reason: 'Cannot wait for the departing team' })
})
it.each([
  { kind: 'SEATS', free: 3, inRevocation: 0 },
  { kind: 'NONE', free: 0, inRevocation: 0 }
])('omits purchase when stock is available or not applicable: $kind/$free', async (value) => {
  stock = value
  await open()
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({ requestId: 'request-1', beneficiaryEmployeeId: 'employee-1' })
})
it('refreshes stock after a refused purchase and drops purchase from the next confirmed payload', async () => {
  rejectPurchase = true
  await open()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  await waitFor(() => expect(screen.queryByRole('checkbox')).not.toBeInTheDocument())
  rejectPurchase = false
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(2))
  expect(posts()[1][0].data).not.toHaveProperty('purchase')
})
