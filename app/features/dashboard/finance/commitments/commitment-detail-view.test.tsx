import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { finance } from '~/shared/i18n/locales/en/finance'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { FinanceCommitmentDetailView } from './views/finance-commitment-detail-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const commitment = {
  id: 'commit-01',
  requestId: 'req-01',
  costCenter: { id: 'cc-01', code: 'CC-IT', name: 'IT Department' },
  year: 2026,
  amount: vnd('10000000'),
  released: vnd('2000000'),
  held: vnd('5000000'),
  invoiced: vnd('3000000'),
  invoiceCount: 1,
  hasDiscrepancy: true,
  state: 'HELD',
  attached: true,
  attachedAt: null,
  unattachedReason: null,
  createdAt: '2026-01-01T00:00:00Z',
  request: {
    id: 'req-01',
    software: { name: 'Figma Enterprise' },
    plan: { name: 'Annual Pro' },
    requester: { employeeCode: 'EMP-02', fullName: 'Alice Designer' },
    beneficiaryCount: 5,
    spendApprovedAt: '2026-01-02T00:00:00Z'
  }
}
const other = { ...commitment, id: 'commit-02', requestId: 'req-02' }

describe('Finance commitment detail screen', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  const selectTab = vi.fn()

  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })

  beforeEach(async () => {
    requests = []
    selectTab.mockReset()
    i18n.addResourceBundle('en', 'finance', finance)
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      if (config.url?.endsWith('/invoices'))
        return reply(config, {
          success: true,
          message: 'BUDGET_COMMITMENT.INVOICES_LISTED',
          data: {
            items: [
              {
                id: 'inv-1',
                number: 'SV-INV-001',
                issuedOn: '2026-03-05',
                netAmount: vnd('3000000'),
                deductibleTax: vnd('0'),
                nonDeductibleTax: vnd('0'),
                actualCost: vnd('3000000'),
                matchResult: 'PRICE_QUANTITY_EXCEPTION',
                servicePeriodMonth: '2026-03',
                label: 'PERIOD',
                paymentSource: 'COMPANY_CARD',
                note: null,
                recordedBy: null,
                recordedAt: '2026-03-06T00:00:00Z'
              }
            ],
            pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
          }
        })
      if (config.url?.endsWith('/releases'))
        return reply(config, {
          success: true,
          message: 'BUDGET_COMMITMENT.RELEASES_LISTED',
          data: {
            items: [
              {
                id: 'rel-1',
                amount: vnd('2000000'),
                reason: 'REMAINDER',
                reasonText: null,
                releasedBy: null,
                releasedAt: '2026-10-01T00:00:00Z'
              }
            ],
            pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
          }
        })
      return reply(config, {
        success: true,
        message: 'BUDGET_COMMITMENT.LISTED',
        data: { items: [other, commitment], pagination: { page: 1, pageSize: 100, totalItems: 2, totalPages: 1 } }
      })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (search: string) =>
    render(
      <MemoryRouter initialEntries={[`/finance${search}`]}>
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <FinanceCommitmentDetailView itemId='commit-01' onSelectTab={selectTab} />
        </QueryClientProvider>
      </MemoryRouter>
    )

  it('finds the commitment by id in the list narrowed by the row hints, and shows its facts, invoices and releases', async () => {
    mount('?request=req-01&cc=cc-01&year=2026')
    expect((await screen.findAllByText('Figma Enterprise')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Alice Designer', { exact: false }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('SV-INV-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('By period').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Company card').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Price or quantity differs').length).toBeGreaterThan(0)
    expect(screen.getByText(/differs from what was approved/)).toBeTruthy()
    expect(requests.some((request) => request.url?.endsWith('/releases'))).toBe(true)

    const listCall = requests.find((request) => request.url?.endsWith('/budget-commitments'))
    expect(listCall?.params).toMatchObject({ requestId: 'req-01', costCenterId: 'cc-01', year: 2026 })
    expect(requests.some((request) => request.method === 'post')).toBe(false)
  })

  it('opens straight from a link with no hints by scanning the current year, and links to the Request', async () => {
    mount('')
    expect((await screen.findAllByText('Figma Enterprise')).length).toBeGreaterThan(0)
    const listCall = requests.find((request) => request.url?.endsWith('/budget-commitments'))
    expect(listCall?.params).toMatchObject({ year: new Date().getFullYear() })
    expect(listCall?.params.requestId).toBeUndefined()

    fireEvent.click(screen.getByRole('button', { name: 'Open Request' }))
    expect(selectTab).toHaveBeenCalledWith('request-monitor', { id: 'req-01' })
    fireEvent.click(screen.getByRole('button', { name: finance.releaseRemainder }))
    expect(selectTab).toHaveBeenCalledWith('commitment-release', { id: 'commit-01', request: 'req-01' })
  })
})
