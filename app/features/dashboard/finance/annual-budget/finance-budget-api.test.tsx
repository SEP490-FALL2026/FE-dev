import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceAnnualProposalsView } from './views/finance-annual-proposals-view'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import {
  apiLine,
  apiPage,
  apiProposal,
  apiProposalLine,
  apiResponse,
  apiVersion,
  budgetSideList,
  budgetTestLanguage,
  exactMoney,
  renderBudget,
  writeTo
} from './budget-test-fixtures'

describe('finance annual budget API workflows', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  let sent: boolean
  beforeEach(async () => {
    requests = []
    sent = false
    await budgetTestLanguage()
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      let data: unknown = null
      if (path === '/budget-proposals')
        data = apiPage(
          config.params?.page === 2
            ? [{ ...apiProposal, id: 'proposal-2', costCenter: { ...apiProposal.costCenter, name: 'Second API page' } }]
            : [apiProposal],
          config.params?.page
        )
      if (path === '/budget-proposals/proposal-1') data = { proposal: apiProposal }
      if (path === '/budget-proposals/proposal-1/lines') data = apiPage([apiProposalLine])
      if (path === '/budget-proposals/proposal-1/return') data = { proposal: { ...apiProposal, state: 'RETURNED' } }
      if (path === '/budget-versions' && config.method === 'get') data = apiPage([apiVersion])
      if (path === '/budget-versions' && config.method === 'post') data = { version: apiVersion }
      if (path === '/budget-versions/version-1') data = { version: { ...apiVersion, state: sent ? 'SENT' : 'DRAFT' } }
      if (path === '/budget-versions/version-1/lines') data = apiPage([apiLine])
      if (path === '/budget-versions/version-1/history') data = apiPage([])
      if (path === '/budget-versions/version-1/submission') {
        sent = true
        data = { version: { ...apiVersion, state: 'SENT' } }
      }
      return apiResponse(config, data)
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  const listRequests = (path: string) =>
    requests.filter((request) => request.method === 'get' && request.url?.endsWith(path))
  async function openCreateForm(navigate = vi.fn()) {
    renderBudget(<FinanceAnnualProposalsView itemId='proposal-1' formatCurrency={() => ''} onSelectTab={navigate} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Approve and draft a version' }))
    return navigate
  }

  it('lists submitted proposals by default and obtains the next page from the server', async () => {
    renderBudget(<FinanceAnnualProposalsView formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    await screen.findAllByText('Engineering API')
    expect(listRequests('/budget-proposals')[0]?.params).toMatchObject({ page: 1, state: 'SUBMITTED' })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => expect(requests.some((request) => request.params?.page === 2)).toBe(true))
    expect(await screen.findAllByText('Second API page')).not.toHaveLength(0)
  })
  it('lists draft versions awaiting confirmation by default', async () => {
    renderBudget(<FinanceBudgetNegotiationView formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    expect(await screen.findByRole('heading', { name: 'Awaiting final confirmation' })).toBeTruthy()
    await screen.findAllByText('Engineering API')
    expect(listRequests('/budget-versions')[0]?.params).toMatchObject({ page: 1, state: 'DRAFT' })
  })
  it('loads proposal detail and paged lines before rejecting with a reason', async () => {
    renderBudget(<FinanceAnnualProposalsView itemId='proposal-1' formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/proposal-1/lines'))).toBe(true))
    await screen.findAllByText('API plan line')
    fireEvent.click(screen.getByRole('button', { name: 'Reject – return to the department head' }))
    const confirm = screen.getByRole('button', { name: 'Return to the department head' })
    expect(confirm).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/^Reason/), { target: { value: 'Please review seats' } })
    fireEvent.click(confirm)
    await waitFor(() => expect(writeTo(requests, '/return')?.body).toEqual({ reason: 'Please review seats' }))
  })
  it('creates a version from a proposal with an empty reserve, sending no reserve or currency', async () => {
    const navigate = await openCreateForm()
    expect(screen.getByLabelText(/^Reserve amount/)).toHaveValue('')
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(writeTo(requests, '/budget-versions')).toBeDefined())
    expect(writeTo(requests, '/budget-versions')?.body).toEqual({
      proposalId: 'proposal-1',
      base: { amount: exactMoney.amount }
    })
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('budget-negotiation', { id: 'version-1' }))
  })
  it('requires a reserve reason when the reserve differs from 10% of the base', async () => {
    await openCreateForm()
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '1000' } })
    fireEvent.change(screen.getByLabelText(/^Reserve amount/), { target: { value: '150' } })
    const reason = screen.getByLabelText(/^Reserve reason/)
    expect(reason).toBeRequired()
    // Submitting past native validation still hits the form's own check.
    const form = screen.getByRole('button', { name: 'Save version' }).closest('form')
    if (!form) throw new Error('Version form is missing')
    fireEvent.submit(form)
    expect(await screen.findByText('Review the required fields and decimal amounts.')).toBeTruthy()
    expect(reason).toHaveAttribute('aria-invalid', 'true')
    expect(writeTo(requests, '/budget-versions')).toBeUndefined()
    fireEvent.change(screen.getByLabelText(/^Reserve reason/), { target: { value: '15 more Figma users' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(writeTo(requests, '/budget-versions')).toBeDefined())
    expect(writeTo(requests, '/budget-versions')?.body).toEqual({
      proposalId: 'proposal-1',
      base: { amount: '1000' },
      reserve: { amount: '150' },
      reserveReason: '15 more Figma users'
    })
  })
  it('asks no reserve reason when the reserve equals the 10% default', async () => {
    await openCreateForm()
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '1000' } })
    fireEvent.change(screen.getByLabelText(/^Reserve amount/), { target: { value: '100' } })
    expect(screen.queryByLabelText(/^Reserve reason/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(writeTo(requests, '/budget-versions')).toBeDefined())
    expect(writeTo(requests, '/budget-versions')?.body).toEqual({
      proposalId: 'proposal-1',
      base: { amount: '1000' },
      reserve: { amount: '100' }
    })
  })
  it('sends a draft to /submission and refetches it; Finance has no approve or decide action', async () => {
    renderBudget(<FinanceBudgetNegotiationView itemId='version-1' formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Final confirmation – send to the Spending Approver' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Once sent, the Spending Approver decides')
    fireEvent.click(screen.getByRole('button', { name: 'Send to the Spending Approver' }))
    await waitFor(() => expect(writeTo(requests, '/budget-versions/version-1/submission')).toBeDefined())
    expect(writeTo(requests, '/budget-versions/version-1/submission')?.request.method).toBe('post')
    await waitFor(() => expect(listRequests('/budget-versions/version-1').length).toBeGreaterThan(1))
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Final confirmation – send to the Spending Approver' })).toBeNull()
    )
    for (const name of ['Approve', 'Reject', 'Decide', 'Request changes'])
      expect(screen.queryByRole('button', { name })).toBeNull()
    expect(requests.some((request) => request.url?.endsWith('/decision'))).toBe(false)
  })
})
