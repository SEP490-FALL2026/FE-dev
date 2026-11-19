import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ApprovalInYearView } from './approval-in-year-view'

vi.mock('~/shared/api/generated/operations/budget-review-periods/budget-review-period-list', () => ({
  useBudgetReviewPeriodList: () => ({ isPending: true, isError: false })
}))
vi.mock('~/shared/api/generated/operations/budget-review-periods/budget-review-period-get', () => ({
  useBudgetReviewPeriodGet: () => ({ isPending: true, isError: false })
}))
vi.mock('../../shared/hooks/use-budget-year-options', () => ({
  useBudgetYearOptions: () => ({ options: [], loading: false })
}))

beforeAll(async () => {
  await setAppLanguage('en', false)
})

describe('in-year budget', () => {
  it.each([undefined, 'section:adjustments', 'section:deadlines', 'adjustment:old-id'])(
    'shows review periods for the entry %s without removed tabs',
    (itemId) => {
      render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <ApprovalInYearView itemId={itemId} onSelectTab={vi.fn()} />
        </QueryClientProvider>
      )
      expect(
        screen.getByText('Finance closes each month and signs the quarterly review. This view is read-only.')
      ).toBeVisible()
      expect(screen.queryByRole('button', { name: 'Adjustments' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Missed deadlines' })).not.toBeInTheDocument()
    }
  )

  it('keeps review period details accessible and returns to the list', () => {
    const onSelectTab = vi.fn()
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ApprovalInYearView itemId='period:review-id' onSelectTab={onSelectTab} />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Back to review periods' }))
    expect(onSelectTab).toHaveBeenCalledWith('in-year', { id: 'section:periods' })
  })
})
