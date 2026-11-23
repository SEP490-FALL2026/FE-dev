import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningGrantQueue } from './components/provisioning-grant-queue'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
let workEmail: string | null

beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  workEmail = 'alice@company.example'
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: { task: { id: 'task-1' } } }
    if (config.url?.endsWith('/grant-queue'))
      return {
        data: {
          items: [
            {
              requestId: 'request-1',
              type: 'GRANT',
              state: 'WAITING',
              stock: { kind: 'NONE', free: 0, inRevocation: 0 },
              beneficiary: { employeeId: 'employee-1', fullName: 'Alice', workEmail },
              plan: { planId: 'plan-1', applicationName: 'App', planName: 'Personal' }
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    if (config.url?.endsWith('/plans/plan-1')) return { data: { provisioningType: 'K1' } }
    return { data: { items: [{ id: 'subscription-1', planName: 'Personal' }], pagination: { totalItems: 1 } } }
  })
})

async function openGrant() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ProvisioningGrantQueue onCreated={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled())
}

it('prefills the beneficiary work email and lets the server use it by default', async () => {
  await openGrant()
  expect(screen.getByLabelText('Account email')).toHaveValue('alice@company.example')
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  expect(request.mock.calls.find(([config]) => config.method === 'POST')?.[0].data).toEqual({ requestId: 'request-1' })
})

it('sends an alternative email entered by IT', async () => {
  await openGrant()
  fireEvent.change(screen.getByLabelText('Account email'), { target: { value: 'other@company.example' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  expect(request.mock.calls.find(([config]) => config.method === 'POST')?.[0].data).toEqual({
    requestId: 'request-1',
    accountIdentifier: 'other@company.example'
  })
})

it('warns when the beneficiary has no work email', async () => {
  workEmail = null
  await openGrant()
  expect(
    screen.getByText(
      'No work email on the employee profile. Ask a Super Admin to add one, or enter another company email.'
    )
  ).toBeInTheDocument()
})
