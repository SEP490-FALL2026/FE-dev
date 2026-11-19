import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { useOffboardingCaseList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import { ItOffboardingView } from './views/it-offboarding-view'

vi.mock('~/shared/api/generated/operations/offboarding-cases/offboarding-case-list', () => ({
  useOffboardingCaseList: vi.fn()
}))

beforeEach(async () => {
  await setAppLanguage('en', false)
  vi.mocked(useOffboardingCaseList).mockReturnValue({
    isPending: false,
    isError: false,
    isFetching: false,
    data: { data: { items: [], pagination: { totalItems: 0 } } }
  } as never)
})

it('selects only one status or overdue filter and preserves the date range', async () => {
  render(
    <MemoryRouter initialEntries={['/?tab=offboarding&state=LEFT&lastWorkingDayFrom=2026-11-01&page=2']}>
      <ItOffboardingView onSelectTab={vi.fn()} />
    </MemoryRouter>
  )
  const overdue = screen.getByRole('button', { name: 'Revocation overdue' })
  fireEvent.click(overdue)
  expect(overdue).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  await waitFor(() =>
    expect(useOffboardingCaseList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: undefined,
        revocationOverdue: 'true',
        lastWorkingDayFrom: '2026-11-01',
        page: 1
      }),
      expect.anything()
    )
  )
  fireEvent.click(overdue)
  expect(overdue).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Handing over' }))
  expect(overdue).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('button', { name: 'Handing over' })).toHaveAttribute('aria-pressed', 'true')
  await waitFor(() =>
    expect(useOffboardingCaseList).toHaveBeenLastCalledWith(
      expect.objectContaining({ state: 'HANDING_OVER', page: 1 }),
      expect.anything()
    )
  )
  fireEvent.click(overdue)
  fireEvent.click(screen.getByRole('button', { name: 'All' }))
  expect(overdue).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  await waitFor(() =>
    expect(useOffboardingCaseList).toHaveBeenLastCalledWith(
      expect.not.objectContaining({ revocationOverdue: 'true' }),
      expect.anything()
    )
  )
})

it('treats overdue as the sole selection when an older link contains both filters', () => {
  render(
    <MemoryRouter initialEntries={['/?tab=offboarding&state=LEFT&revocationOverdue=true']}>
      <ItOffboardingView onSelectTab={vi.fn()} initialState='LEFT' />
    </MemoryRouter>
  )
  expect(screen.getByRole('button', { name: 'Revocation overdue' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false')
  expect(useOffboardingCaseList).toHaveBeenLastCalledWith(
    expect.objectContaining({ state: undefined, revocationOverdue: 'true' }),
    expect.anything()
  )
})
