import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { ItOffboardingView } from './views/it-offboarding-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
vi.mock('./components/offboarding-details', () => ({
  OffboardingDetails: ({ id, onBack }: { id: string; onBack: () => void }) => (
    <div>
      <p>{id}</p>
      <button onClick={onBack}>{i18n.t('back', { ns: 'itOffboarding' })}</button>
    </div>
  )
}))
const request = vi.mocked(customAxios)
function CurrentUrl() {
  return <output data-testid='current-url'>{useLocation().search}</output>
}
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockResolvedValue({
    data: {
      items: [
        {
          id: 'case-1',
          employee: { fullName: 'Departing employee', employeeCode: 'EMP1' },
          state: 'HANDING_OVER',
          lastWorkingDay: '2026-11-16',
          heldRights: 2,
          revocation: { dueOn: '2026-11-17', overdue: true },
          accountLockMissing: true,
          closed: false
        }
      ],
      pagination: { totalItems: 41 }
    }
  })
})
it('restores offboarding calendar filters and page and preserves them when opening and leaving a case', async () => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter
        initialEntries={[
          '/dashboard/it-admin?tab=offboarding&page=2&state=HANDING_OVER&revocationOverdue=true&lastWorkingDayFrom=2026-11-16&lastWorkingDayTo=2026-11-30'
        ]}
      >
        <ItOffboardingView onSelectTab={vi.fn()} />
        <CurrentUrl />
      </MemoryRouter>
    </QueryClientProvider>
  )
  await screen.findByText('Departing employee')
  expect(request.mock.calls.at(-1)?.[0].params).toMatchObject({
    page: 2,
    state: 'HANDING_OVER',
    revocationOverdue: 'true',
    lastWorkingDayFrom: '2026-11-16',
    lastWorkingDayTo: '2026-11-30'
  })
  expect(screen.getByLabelText('Last day from')).toHaveValue('2026-11-16')
  fireEvent.click(screen.getByRole('button', { name: /Departing employee/ }))
  expect(screen.getByTestId('current-url')).toHaveTextContent('id=case-1')
  fireEvent.click(screen.getByRole('button', { name: 'Back to cases' }))
  await screen.findByText('Departing employee')
  expect(screen.getByTestId('current-url')).toHaveTextContent('page=2')
  expect(screen.getByTestId('current-url')).not.toHaveTextContent('id=')
  fireEvent.click(screen.getByRole('button', { name: 'All' }))
  await waitFor(() => expect(request.mock.calls.at(-1)?.[0].params).toMatchObject({ page: 1 }))
  expect(request.mock.calls.at(-1)?.[0].params).not.toHaveProperty('state', 'HANDING_OVER')
})
