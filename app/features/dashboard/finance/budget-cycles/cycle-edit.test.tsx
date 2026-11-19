import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CycleDetail } from './components/cycle-detail'

const vnd = (amount: string) => ({ amount, currency: 'VND' })

describe('Budget cycle edit', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let status = 'NOT_PUBLISHED'

  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })
  const cycle = () => ({
    year: 2027,
    submissionDeadline: '2026-11-02',
    decisionDeadline: '2026-12-02',
    annualCeiling: vnd('500000000'),
    sharedPoolReserve: null,
    priorities: null,
    status,
    openedAt: '2026-10-01T00:00:00Z',
    publishedAt: null,
    firstPublishedAt: null,
    allocated: vnd('0'),
    unallocated: vnd('500000000'),
    ceilings: {}
  })

  beforeEach(async () => {
    requests = []
    status = 'NOT_PUBLISHED'
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (url.endsWith('/package'))
        return reply(config, {
          success: true,
          message: 'OK',
          data: {
            year: 2027,
            available: null,
            proposalsTotal: null,
            versionsTotal: null,
            overBy: null,
            proposalsOverAvailable: false,
            departments: []
          }
        })
      if (url.endsWith('/baseline'))
        return reply(config, {
          success: true,
          message: 'OK',
          data: {
            basis: 'HOLDER_DEPARTMENT',
            year: 2027,
            currency: 'VND',
            computedAt: '2026-11-10T00:00:00Z',
            departmentsTotal: 0,
            departments: [],
            sharedPoolUnallocated: null
          }
        })
      return reply(config, { success: true, message: 'OK', data: cycle() })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = () =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <CycleDetail year={2027} onBack={() => undefined} />
      </QueryClientProvider>
    )

  it('edits an unpublished cycle and sends only what changed, with a reason for a new ceiling', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit cycle' }))
    const ceiling = screen.getByDisplayValue('500,000,000')
    fireEvent.change(ceiling, { target: { value: '600000000' } })
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/Reason for the new ceiling/), { target: { value: 'Leadership raised it' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'patch')).toBe(true))
    const patch = requests.find((request) => request.method === 'patch')
    expect(patch?.url?.endsWith('/budget-cycles/2027')).toBe(true)
    expect(JSON.parse(patch?.data)).toEqual({
      annualCeiling: { amount: '600000000' },
      reason: 'Leadership raised it'
    })
  })

  it('locks the cycle once it is published: no edit, no ceilings change, no second publication', async () => {
    status = 'PUBLISHED'
    mount()
    expect(await screen.findByText(/The cycle is published: its details/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Edit cycle' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Publish department ceilings' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Save division' })).toBeNull()
    expect((screen.getByLabelText('Reserve for shared software') as HTMLInputElement).disabled).toBe(true)
  })

  it('offers the publication while the cycle is not published', async () => {
    mount()
    expect(await screen.findByRole('button', { name: 'Publish department ceilings' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save division' })).toBeTruthy()
  })
})
