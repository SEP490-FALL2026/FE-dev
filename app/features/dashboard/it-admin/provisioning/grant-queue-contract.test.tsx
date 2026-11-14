import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningGrantQueue } from './components/provisioning-grant-queue'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
const employeeId = '11111111-1111-4111-8111-111111111111'
let stock: { kind: string; free: number; inRevocation: number } | undefined
let rejectGrant: boolean
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  stock = { kind: 'SEATS', free: 1, inRevocation: 0 }
  rejectGrant = false
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') {
      if (rejectGrant)
        throw { isAxiosError: true, response: { status: 503, data: { error: { code: 'SERVICE_UNAVAILABLE' } } } }
      return { data: { task: { id: 'task-1' } } }
    }
    if (config.url?.endsWith('/grant-queue'))
      return {
        data: {
          items: [
            {
              requestId: 'request-1',
              type: 'GRANT',
              stock,
              expectedEndDate: null,
              beneficiary: { employeeId, fullName: 'Alice' },
              plan: { planId: 'plan-1', applicationName: 'Workspace', planName: 'Business' }
            }
          ],
          pagination: { page: config.params?.page ?? 1, pageSize: 20, totalItems: 41, totalPages: 3 }
        }
      }
    return { data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } } }
  })
})
function mount() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ProvisioningGrantQueue onCreated={vi.fn()} />
    </QueryClientProvider>
  )
}
const posts = () => request.mock.calls.filter(([config]) => config.method === 'POST')

it('uses the server-scoped grant queue and server pagination without recreating department permissions', async () => {
  mount()
  expect(await screen.findByText(/Alice/)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() =>
    expect(
      request.mock.calls.some(([config]) => config.url?.endsWith('/grant-queue') && config.params?.page === 2)
    ).toBe(true)
  )
  expect(request.mock.calls.some(([config]) => config.url?.includes('/departments'))).toBe(false)
})

it('sends the beneficiary filter to the server and returns to the first page', async () => {
  mount()
  await screen.findByText(/Alice/)
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  fireEvent.change(screen.getByLabelText('Beneficiary employee UUID'), { target: { value: employeeId } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply filter' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { page: 1, pageSize: 20, beneficiaryEmployeeId: employeeId } }),
      undefined
    )
  )
})

it('blocks submission when the server does not provide stock availability', async () => {
  stock = undefined
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(posts()).toHaveLength(0)
})

it('grants an internal plan without requiring a subscription or purchase', async () => {
  stock = { kind: 'NONE', free: 0, inRevocation: 0 }
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({ requestId: 'request-1', beneficiaryEmployeeId: employeeId })
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})

it('preserves the account draft and does not automatically repeat an uncertain grant', async () => {
  rejectGrant = true
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  fireEvent.change(screen.getByLabelText('Account identifier'), { target: { value: 'alice@example.org' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled())
  expect(posts()).toHaveLength(1)
  expect(screen.getByLabelText('Account identifier')).toHaveValue('alice@example.org')
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
