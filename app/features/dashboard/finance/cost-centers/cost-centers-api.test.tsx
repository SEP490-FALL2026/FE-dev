import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceCostCentersView } from './views/finance-cost-centers-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const row = {
  costCenter: { id: 'center', code: 'CC-ENG', name: 'Engineering cost' },
  year: 2026,
  versionId: 'version-eng',
  number: 2,
  base: vnd('100000000'),
  reserve: vnd('10000000'),
  total: vnd('110000000'),
  committed: vnd('30000000'),
  spent: vnd('25000000'),
  remaining: vnd('55000000'),
  overCommitted: false
}
const summary = {
  year: 2026,
  lastInvoiceRecordedAt: null,
  totals: {
    VND: {
      currency: 'VND',
      base: vnd('100000000'),
      reserve: vnd('10000000'),
      total: vnd('110000000'),
      committed: vnd('30000000'),
      spent: vnd('25000000'),
      remaining: vnd('55000000'),
      costCenterCount: 1,
      overBudgetCount: 0
    }
  }
}
const commitment = {
  id: 'commitment',
  requestId: 'request',
  costCenter: { id: 'center', code: 'CC-ENG', name: 'Engineering cost' },
  year: 2026,
  amount: vnd('30000000'),
  released: vnd('0'),
  held: vnd('30000000'),
  state: 'HELD',
  request: {
    id: 'request',
    software: { name: 'Figma' },
    plan: { name: 'Professional' },
    requester: { employeeCode: 'EMP-1', fullName: 'Employee One' },
    beneficiaryCount: 1,
    spendApprovedAt: '2026-10-01T00:00:00Z'
  },
  invoiced: vnd('0'),
  invoiceCount: 0,
  hasDiscrepancy: false,
  attached: true,
  attachedAt: '2026-10-01T00:00:00Z',
  unattachedReason: null,
  createdAt: '2026-10-01T00:00:00Z'
}
const line = {
  position: 1,
  proposalPosition: 1,
  description: 'Figma seats',
  planId: null,
  seats: 10,
  amount: vnd('45000000'),
  financeComment: null,
  adjustmentReason: null
}
const page = <Item,>(items: Item[]) => ({
  items,
  pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1 }
})

describe('Finance cost center budgets', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: InternalAxiosRequestConfig[] = []
  beforeEach(async () => {
    requests.length = 0
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      const data = path.endsWith('/budgets/summary')
        ? summary
        : path.endsWith('/budgets')
          ? page([row])
          : path.endsWith('/budget-commitments')
            ? page([commitment])
            : page([line])
      return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data } }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  function mount(onSelectTab = vi.fn()) {
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <FinanceCostCentersView onSelectTab={onSelectTab} />
      </QueryClientProvider>
    )
    return onSelectTab
  }

  it('shows the year totals from the summary and one row per department without a create action', async () => {
    mount()
    // Labels appear both on the summary cards and as table column headers.
    expect((await screen.findAllByText(financeSettings.kpis.base)).length).toBeGreaterThan(1)
    expect(screen.getAllByText(financeSettings.kpis.reserve).length).toBeGreaterThan(1)
    expect(await screen.findByText('1 departments have a budget')).toBeInTheDocument()
    expect((await screen.findAllByText('Engineering cost')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('50%').length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: financeSettings.create })).not.toBeInTheDocument()
    const summaryCall = requests.find((request) => request.url?.endsWith('/budgets/summary'))
    expect(summaryCall?.params?.year).toBe(new Date().getFullYear())
  })

  it('keeps working when the backend does not return base and reserve yet', async () => {
    // The deployed backend (dev 446d6fd2) has no base/reserve on budget rows yet.
    const legacyRow: Partial<typeof row> = { ...row }
    delete legacyRow.base
    delete legacyRow.reserve
    apiClient.defaults.adapter = async (config) => {
      const path = config.url?.split('/api/v1')[1] ?? ''
      const data = path.endsWith('/budgets') ? page([legacyRow]) : page([])
      return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data } }
    }
    mount()
    expect((await screen.findAllByText('Engineering cost')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
    expect(screen.getAllByText('50%').length).toBeGreaterThan(0)
  })

  it('opens a department with its approved spend for the year and links to its version', async () => {
    const onSelectTab = mount()
    fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
    const spend = await screen.findByRole('region', { name: financeSettings.approvedSpend })
    expect(await within(spend).findAllByText('Figma · Professional')).not.toHaveLength(0)
    await waitFor(() =>
      expect(
        requests.some(
          (request) =>
            request.url?.endsWith('/budget-commitments') &&
            request.params?.costCenterId === 'center' &&
            request.params?.year === 2026
        )
      ).toBe(true)
    )
    expect(await screen.findAllByText('Figma seats')).not.toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: /Version 2/ }))
    expect(onSelectTab).toHaveBeenCalledWith('budget-negotiation', { id: 'version-eng' })
  })

  it('opens a commitment in place and comes back to the same department, without leaving the tab', async () => {
    const onSelectTab = vi.fn()
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <FinanceCostCentersView
          onSelectTab={onSelectTab}
          renderCommitment={(target) => (
            <section>
              <p>{`${target.id}/${target.requestId}`}</p>
              <button type='button' onClick={target.onClose}>
                {target.backLabel}
              </button>
            </section>
          )}
        />
      </QueryClientProvider>
    )
    fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
    const spend = await screen.findByRole('region', { name: financeSettings.approvedSpend })
    await within(spend).findAllByText('Figma · Professional')
    fireEvent.click(within(spend).getAllByRole('button', { name: finance.open })[0])
    expect(await screen.findByText('commitment/request')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: financeSettings.approvedSpend })).not.toBeInTheDocument()
    expect(onSelectTab).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Back to Engineering cost' }))
    expect(await screen.findByRole('region', { name: financeSettings.approvedSpend })).toBeInTheDocument()
  })
})
