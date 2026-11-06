import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItOperationsOverview } from './components/it-operations-overview'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    const url = config.url ?? ''
    if (url.endsWith('/dashboards/it-admin')) return { data: null }
    if (url.endsWith('/departments'))
      return { data: { items: [{ id: 'dept-1', code: 'ENG', name: 'Engineering' }], pagination: { totalItems: 1 } } }
    if (url.endsWith('/technical-members'))
      return {
        data: {
          items: [
            {
              id: 'employee-1',
              code: 'EMP-01',
              fullName: 'Alex Engineer',
              employmentStatus: 'WORKING',
              effectiveOn: '2026-11-01'
            }
          ],
          pagination: { totalItems: 25 }
        }
      }
    if (url.endsWith('/tools-in-use'))
      return {
        data: {
          items: [
            {
              assignmentId: 'assignment-1',
              employeeCode: 'EMP-01',
              fullName: 'Alex Engineer',
              holderStatus: 'WORKING',
              kind: 'PERSONAL',
              source: 'REQUEST',
              application: { id: 'app-1', name: 'Design suite' },
              plan: { id: 'plan-1', name: 'Professional' },
              effectiveFrom: '2026-11-01',
              terminating: false
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    if (url.endsWith('/department-warnings'))
      return {
        data: {
          items: [{ departmentId: 'dept-1', code: 'ENG', name: 'Engineering', warning: 'MISSING_IT_ADMIN' }],
          pagination: { totalItems: 1 }
        }
      }
    if (url.endsWith('/controlled-waits'))
      return {
        data: {
          items: [
            {
              requestId: 'request-1',
              stepId: 'step-1',
              stepKind: 'IT_ASSESSMENT',
              waitingReason: 'NO_IT_ADMIN_IN_CHARGE',
              configurationHint: 'NAME_IT_ADMIN_IN_CHARGE',
              waitingSince: '2026-11-01',
              requester: { fullName: 'Alex Engineer', employeeCode: 'EMP-01', employeeId: 'employee-1' },
              department: { id: 'dept-1', name: 'Engineering', code: 'ENG' }
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    return { data: null }
  })
})
function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItOperationsOverview onSelectTab={vi.fn()} />
    </QueryClientProvider>
  )
}
it('opens a scoped department workspace and paginates technical members without loading a global directory', async () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Department operations' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Open department' }))
  expect(await screen.findByText('Alex Engineer')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open department' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringMatching(/\/departments\/dept-1\/technical-members$/),
        params: { page: 2, pageSize: 20 }
      }),
      undefined
    )
  )
  expect(request.mock.calls.some(([config]) => /\/employees(?:\?|$)/.test(config.url ?? ''))).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Software in use' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  expect(within(screen.getByRole('dialog')).getByText('Professional')).toBeInTheDocument()
})
it('shows configuration waits in a separate view with request details in a drawer', async () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Department operations' }))
  fireEvent.click(screen.getByRole('button', { name: 'Requests awaiting configuration' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByText('No IT administrator in charge')).toBeInTheDocument()
  expect(within(dialog).getByText('Ask the administrator to name the IT administrator in charge.')).toBeInTheDocument()
})
