import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { approvalsBudget } from '~/shared/i18n/locales/en/approvals-budget'
import { formatMoney } from '~/shared/lib/money'
import { ProposalComparison } from './approval-annual-budget-summary'

const query = vi.hoisted(() => ({ requested: { amount: '0', currency: 'USD' } }))
vi.mock('~/shared/api/generated/operations/budget-proposals/budget-proposal-get', () => ({
  useBudgetProposalGet: () => ({ data: { data: { proposal: { requestedAmount: query.requested } } } })
}))

beforeEach(async () => {
  await setAppLanguage('en', false)
})

describe('budget proposal comparison', () => {
  it('shows an exact difference for amounts beyond safe integer precision', () => {
    query.requested = { amount: '9007199254740992.20', currency: 'USD' }
    render(<ProposalComparison proposalId='proposal' base={{ amount: '9007199254740993.25', currency: 'USD' }} />)
    const cell = screen.getByText(approvalsBudget.baseVsRequested).parentElement!
    expect(within(cell).getByText(formatMoney({ amount: '1.05', currency: 'USD' }, 'en'))).toBeInTheDocument()
  })

  it('does not subtract amounts in different currencies', () => {
    query.requested = { amount: '100', currency: 'USD' }
    render(<ProposalComparison proposalId='proposal' base={{ amount: '100', currency: 'VND' }} />)
    const cell = screen.getByText(approvalsBudget.baseVsRequested).parentElement!
    expect(within(cell).getByText(approvalsBudget.unavailable)).toBeInTheDocument()
  })
})
