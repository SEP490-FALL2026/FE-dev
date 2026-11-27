import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OverviewKpis } from './overview-kpis'

beforeEach(async () => {
  await setAppLanguage('en', false)
})

function mount({ pending = false, error = false } = {}) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <OverviewKpis
        query={{ isPending: false, isError: false, error: null, refetch: vi.fn() }}
        totals={{ currency: 'VND', total: 1000, committed: 100, spent: 200, remaining: 700, overCommittedCount: 0 }}
        money={{ full: (value) => `${value} VND`, compact: (value) => String(value) }}
        periodLabel='2026'
        periodCommitments={{ amount: 0, count: 0 }}
        commitmentsPending={pending}
        commitmentsError={error}
      />
    </QueryClientProvider>
  )
}

it('does not present failed commitment data as zero while preserving loaded budget figures', () => {
  mount({ error: true })
  expect(screen.getByText('Data unavailable')).toBeVisible()
  expect(screen.queryByText('0 VND')).not.toBeInTheDocument()
  expect(screen.queryByText('0 new commitments')).not.toBeInTheDocument()
  expect(screen.getByText('1000 VND')).toBeVisible()
})

it('waits for commitment data before showing a count', () => {
  mount({ pending: true })
  expect(screen.getByLabelText('Loading data…')).toBeInTheDocument()
  expect(screen.queryByText('0 new commitments')).not.toBeInTheDocument()
})

it('shows a genuine empty period as zero once loading succeeds', () => {
  mount()
  expect(screen.getByText('0 VND')).toBeVisible()
})
