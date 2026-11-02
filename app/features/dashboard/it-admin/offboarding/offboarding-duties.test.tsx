import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OffboardingServiceDuties } from './components/offboarding-service-duties'
import { OffboardingHandoverDuties } from './components/offboarding-handover-duties'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})
function mount(child: React.ReactNode) {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      {child}
    </QueryClientProvider>
  )
}
it('transfers a listed service assignment and preserves the successor draft on failure', async () => {
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') throw new Error('failed')
    return {
      data: {
        items: [
          {
            assignmentId: 'assignment-1',
            accountIdentifier: 'bot@company',
            plan: { applicationName: 'Build tool', planName: 'Team' },
            fileId: 'case-1',
            fileKind: 'OFFBOARDING'
          }
        ],
        pagination: { totalItems: 1 }
      }
    }
  })
  mount(<OffboardingServiceDuties caseId='case-1' employeeId='employee-1' authorized />)
  fireEvent.click(await screen.findByRole('button', { name: 'Transfer responsibility' }))
  fireEvent.change(screen.getByLabelText('Successor employee ID'), {
    target: { value: '11111111-1111-4111-8111-111111111111' }
  })
  fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2026-11-01' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/license-assignments/assignment-1/responsible-changes'),
        data: { employeeId: '11111111-1111-4111-8111-111111111111', effectiveFrom: '2026-11-01' }
      }),
      undefined
    )
  )
  expect(screen.getByDisplayValue('11111111-1111-4111-8111-111111111111')).toBeInTheDocument()
})
it('does not let IT confirm a department head duty even when a stale row says canConfirm', async () => {
  request.mockResolvedValue({
    data: {
      items: [
        {
          id: 'duty-1',
          application: { name: 'Tool' },
          plan: { name: 'Team' },
          role: 'DEPARTMENT_HEAD',
          status: 'OPEN',
          canConfirm: true
        }
      ],
      pagination: { totalItems: 1 }
    }
  })
  mount(<OffboardingHandoverDuties caseId='case-1' employeeId='employee-1' authorized />)
  expect(await screen.findByRole('button', { name: 'Record IT handover' })).toBeDisabled()
  expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(false)
})
it('confirms only a currently allowed IT duty with HANDLED after reading its detail', async () => {
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: { id: 'duty-1', status: 'CONFIRMED' } }
    if (config.url?.endsWith('/duty-1'))
      return { data: { id: 'duty-1', role: 'IT_ADMIN', status: 'OPEN', canConfirm: true } }
    return {
      data: {
        items: [
          {
            id: 'duty-1',
            application: { name: 'Tool' },
            plan: { name: 'Team' },
            role: 'IT_ADMIN',
            status: 'OPEN',
            canConfirm: true
          }
        ],
        pagination: { totalItems: 1 }
      }
    }
  })
  mount(<OffboardingHandoverDuties caseId='case-1' employeeId='employee-1' authorized />)
  fireEvent.click(await screen.findByRole('button', { name: 'Record IT handover' }))
  await waitFor(() => expect(screen.getAllByRole('button', { name: 'Record IT handover' }).at(-1)).toBeEnabled())
  fireEvent.click(screen.getAllByRole('button', { name: 'Record IT handover' }).at(-1)!)
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/handover-duties/duty-1/confirmations'),
        data: { value: 'HANDLED' }
      }),
      undefined
    )
  )
  expect(request).toHaveBeenCalledWith(
    expect.objectContaining({ params: { employeeId: 'employee-1', scope: 'all', page: 1, pageSize: 20 } }),
    undefined
  )
})
