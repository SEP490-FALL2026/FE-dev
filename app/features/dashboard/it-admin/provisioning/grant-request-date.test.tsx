import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningGrantQueue } from './components/provisioning-grant-queue'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: { task: { id: 'task-1' } } }
    if (config.url?.endsWith('/grant-queue'))
      return {
        data: {
          items: [
            {
              requestId: 'request-1',
              type: 'PERSONAL',
              expectedEndDate: '2026-12-01',
              beneficiary: { employeeId: 'employee-1', fullName: 'Employee' },
              plan: { planId: 'plan-1', applicationName: 'Workspace', planName: 'Business' }
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
})
it('keeps the approved request end date read only and omits it from the grant body', async () => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ProvisioningGrantQueue onCreated={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Start grant' }))
  expect(screen.queryByLabelText('Expected end date')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  expect(request.mock.calls.find(([config]) => config.method === 'POST')![0].data).toEqual({
    requestId: 'request-1',
    beneficiaryEmployeeId: 'employee-1'
  })
})
