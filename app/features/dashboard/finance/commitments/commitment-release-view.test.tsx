import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { finance } from '~/shared/i18n/locales/en/finance'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { FinanceCommitmentReleaseView } from './views/finance-commitment-release-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const commitment = {
  id: 'commit-01',
  requestId: 'req-01',
  costCenter: { id: 'cc-01', code: 'CC-IT', name: 'IT Department' },
  year: 2026,
  amount: vnd('10000000'),
  released: vnd('2000000'),
  held: vnd('8000000'),
  state: 'HELD',
  attached: true,
  attachedAt: null,
  unattachedReason: null,
  createdAt: '2026-01-01T00:00:00Z',
  request: { id: 'req-01', software: { name: 'Figma Enterprise' } }
}

describe('Finance commitment release screen', () => {
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
                reasonText: 'Vendor billed less',
                releasedBy: { employeeId: 'e1', employeeCode: 'EMP-1', fullName: 'Finance User' },
                releasedAt: '2026-10-01T00:00:00Z'
              }
            ],
            pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
          }
        })
      if (config.url?.endsWith('/release') && config.method === 'post')
        return reply(config, { success: true, message: 'BUDGET_COMMITMENT.RELEASED', data: {} })
      return reply(config, {
        success: true,
        message: 'BUDGET_COMMITMENT.LISTED',
        data: { items: [commitment], pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 } }
      })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  function mount() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/?tab=commitment-release&id=commit-01&request=req-01']}>
          <FinanceCommitmentReleaseView itemId='commit-01' onSelectTab={selectTab} />
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('shows the commitment and the earlier releases, and releases with a required reason', async () => {
    mount()
    expect((await screen.findAllByText('IT Department')).length).toBeGreaterThan(0)
    expect((await screen.findAllByText('Vendor billed less')).length).toBeGreaterThan(0)
    expect(requests.some((request) => request.params?.requestId === 'req-01')).toBe(true)

    const submit = screen.getByRole('button', { name: 'Release remainder' })
    expect((submit as HTMLButtonElement).disabled).toBe(true)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  All invoiced  ' } })
    fireEvent.click(submit)

    await waitFor(() => expect(requests.some((request) => request.method === 'post')).toBe(true))
    const post = requests.find((request) => request.method === 'post')
    expect(JSON.parse(post?.data)).toEqual({ reason: 'All invoiced' })
    await waitFor(() => expect(selectTab).toHaveBeenCalledWith('commitments'))
  })

  it('goes back to the commitments list without releasing', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Back to commitments' }))
    expect(selectTab).toHaveBeenCalledWith('commitments')
    expect(requests.some((request) => request.method === 'post')).toBe(false)
  })
})
