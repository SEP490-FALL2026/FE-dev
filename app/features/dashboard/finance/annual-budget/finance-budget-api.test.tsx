import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeBudget } from '~/shared/i18n/locales/en/finance-budget'
import { FinanceAnnualProposalsView } from './views/finance-annual-proposals-view'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import { budgetSideList } from './budget-test-fixtures'

const money = { amount: '9007199254740993.25', currency: 'USD' }
const costCenter = { id: 'center-1', code: 'ENG', name: 'Engineering API' }
const proposal = {
  id: 'proposal-1',
  costCenter,
  year: 2027,
  state: 'SUBMITTED',
  previousProposalId: null,
  total: money,
  submittedAt: '2026-11-01T00:00:00Z',
  submittedBy: null,
  returned: null,
  successorOfProposalId: null,
  successorProposalId: null,
  withdrawnAt: null,
  succeededAt: null,
  closedAt: null
}
const version = {
  id: 'version-1',
  costCenter,
  year: 2027,
  number: 1,
  kind: 'INITIAL',
  state: 'DRAFT',
  proposalId: proposal.id,
  base: money,
  reserve: { amount: '0', currency: 'USD' },
  total: money,
  highValuePercent: 10,
  highValueAmount: null,
  quarters: null,
  reason: null,
  decision: null
}
const line = {
  position: 1,
  description: 'API plan line',
  amount: money,
  planId: null,
  seats: 2,
  windowFrom: '2027-01-01',
  windowTo: '2027-03-31',
  servicePeriodMonths: 12,
  repeatCycle: 'ANNUAL',
  quoteValidUntil: null,
  financeComment: null,
  adjustmentReason: null,
  overdue: false
}
const page = (items: unknown[], pageNumber = 1) => ({
  items,
  pagination: { page: pageNumber, pageSize: 20, totalItems: 21, totalPages: 2 }
})

describe('finance annual budget API workflows', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  let sent: boolean
  beforeEach(async () => {
    requests = []
    sent = false
    i18n.addResourceBundle('en', 'financeBudget', financeBudget)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      let data: unknown = null
      if (path === '/budget-proposals')
        data = page(
          config.params?.page === 2
            ? [{ ...proposal, id: 'proposal-2', costCenter: { ...costCenter, name: 'Second API page' } }]
            : [proposal],
          config.params?.page
        )
      if (path === '/budget-proposals/proposal-1') data = { proposal }
      if (path === '/budget-proposals/proposal-1/lines') data = page([line])
      if (path === '/budget-proposals/proposal-1/return') data = { proposal: { ...proposal, state: 'RETURNED' } }
      if (path === '/budget-versions' && config.method === 'get') data = page([version])
      if (path === '/budget-versions' && config.method === 'post') data = { version }
      if (path === '/budget-versions/version-1') data = { version: { ...version, state: sent ? 'SENT' : 'DRAFT' } }
      if (path === '/budget-versions/version-1/lines') data = page([line])
      if (path === '/budget-versions/version-1/history') data = page([])
      if (path === '/budget-versions/version-1/submission') {
        sent = true
        data = { version: { ...version, state: 'SENT' } }
      }
      if (path === '/budgets')
        data = page([
          {
            costCenter,
            year: 2027,
            versionId: 'version-1',
            number: 1,
            total: money,
            committed: money,
            spent: money,
            remaining: money,
            overCommitted: false
          }
        ])
      return {
        config,
        data: { success: true, message: 'OK', data },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: 'OK'
      }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  function mount(element: React.ReactNode) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(<QueryClientProvider client={client}>{element}</QueryClientProvider>)
    return client
  }
  it('loads proposals and obtains the next page from the server', async () => {
    mount(<FinanceAnnualProposalsView formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/budget-proposals'))).toBe(true))
    await screen.findAllByText('Engineering API')
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => expect(requests.some((request) => request.params?.page === 2)).toBe(true))
    expect(await screen.findAllByText('Second API page')).not.toHaveLength(0)
  })
  it('loads proposal detail and separate paged lines before returning with a reason', async () => {
    mount(<FinanceAnnualProposalsView itemId='proposal-1' formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/proposal-1/lines'))).toBe(true))
    await screen.findAllByText('API plan line')
    fireEvent.click(screen.getByRole('button', { name: 'Return proposal' }))
    fireEvent.change(screen.getByLabelText(/^Reason/), { target: { value: 'Please review seats' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm return' }))
    await waitFor(() =>
      expect(
        requests.some(
          (request) => request.url?.endsWith('/return') && JSON.parse(request.data).reason === 'Please review seats'
        )
      ).toBe(true)
    )
  })
  it('creates from a proposal without rounding the decimal amount', async () => {
    const navigate = vi.fn()
    mount(<FinanceAnnualProposalsView itemId='proposal-1' formatCurrency={() => ''} onSelectTab={navigate} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Create version' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() =>
      expect(requests.some((request) => request.method === 'post' && request.url?.endsWith('/budget-versions'))).toBe(
        true
      )
    )
    const request = requests.find((request) => request.method === 'post' && request.url?.endsWith('/budget-versions'))
    expect(JSON.parse(request?.data)).toEqual({
      source: 'PROPOSAL',
      proposalId: 'proposal-1',
      base: { amount: money.amount }
    })
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('budget-negotiation', { id: 'version-1' }))
  })
  it('keeps sending disabled until the version has an explanation file', async () => {
    const delegate = apiClient.defaults.adapter as (config: InternalAxiosRequestConfig) => Promise<never>
    apiClient.defaults.adapter = async (config) => budgetSideList(config, false) ?? delegate(config)
    mount(<FinanceBudgetNegotiationView itemId='version-1' formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    const send = await screen.findByRole('button', { name: 'Send for decision' })
    expect(send).toHaveProperty('disabled', true)
  })
  it('sends a draft and refetches its server state; Finance has no approval action', async () => {
    mount(<FinanceBudgetNegotiationView itemId='version-1' formatCurrency={() => ''} onSelectTab={vi.fn()} />)
    const send = await screen.findByRole('button', { name: 'Send for decision' })
    await waitFor(() => expect(send).toHaveProperty('disabled', false))
    fireEvent.click(send)
    fireEvent.click(screen.getByRole('button', { name: 'Confirm send' }))
    await waitFor(() =>
      expect(
        requests.filter((request) => request.method === 'get' && request.url?.endsWith('/budget-versions/version-1'))
          .length
      ).toBeGreaterThan(1)
    )
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Send for decision' })).toBeNull())
  })
})
