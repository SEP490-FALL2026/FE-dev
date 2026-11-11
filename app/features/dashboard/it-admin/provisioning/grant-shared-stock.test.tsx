import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningGrantQueue } from './components/provisioning-grant-queue'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('requires a reason before buying when shared stock is being reclaimed', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: { task: { id: 'task-1' } } }
    if (config.url?.endsWith('/grant-queue'))
      return {
        data: {
          items: [
            {
              requestId: 'request-1',
              type: 'PERSONAL',
              beneficiary: { employeeId: 'employee-1', fullName: 'Employee' },
              plan: { planId: 'plan-1', applicationName: 'Workspace', planName: 'Business' },
              stock: { kind: 'SEATS', free: 0, inRevocation: 2 }
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ProvisioningGrantQueue onCreated={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Purchase reason'), { target: { value: 'Urgent access' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  expect(request.mock.calls.find(([config]) => config.method === 'POST')?.[0].data).toMatchObject({
    purchase: { reason: 'Urgent access' }
  })
})
