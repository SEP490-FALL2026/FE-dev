import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ManagerBudgetLine, budgetLineFromForm } from './components/manager-budget-lines'
import { getManagerError } from '../shared/hooks/manager-errors'
import { AxiosError, AxiosHeaders } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('requires a complete justification when a proposal line is a new purchase', () => {
  // The plan picker is not opened, so this test only drives proposal input requirements.
  render(
    <form data-testid='proposal'>
      <ManagerBudgetLine
        index={0}
        initial={{
          lineType: 'NEW',
          priorityRank: 3,
          amount: { amount: '9007199254740993.25' },
          description: 'New tool'
        }}
      />
    </form>,
    { wrapper: BudgetTestProviders }
  )
  for (const label of [
    'Purpose and expected value',
    'Alternatives considered',
    'Impact if not funded',
    'Usage or effectiveness indicator'
  ]) {
    const input = screen.getByLabelText(label)
    expect(input).toBeRequired()
    fireEvent.change(input, { target: { value: label } })
  }
  const form = new FormData(screen.getByTestId('proposal') as HTMLFormElement)
  const body = budgetLineFromForm(form, 0)
  expect(body).toMatchObject({
    lineType: 'NEW',
    priorityRank: 3,
    amount: { amount: '9007199254740993.25' },
    zbb: { purpose: 'Purpose and expected value', alternatives: 'Alternatives considered' }
  })
  expect(body.amount).not.toHaveProperty('currency')
})

it('maps one-based backend positions to the affected justification inputs', () => {
  const error = new AxiosError('validation', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 422,
    statusText: 'Unprocessable',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { error: { code: 'BUDGET.ZBB_REQUIRED', details: { positions: [2] } } }
  })
  expect(getManagerError(error).fields).toEqual([
    'lines.1.zbb.purpose',
    'lines.1.zbb.alternatives',
    'lines.1.zbb.consequenceIfNot',
    'lines.1.zbb.usageIndicator'
  ])
})

function BudgetTestProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  )
}
