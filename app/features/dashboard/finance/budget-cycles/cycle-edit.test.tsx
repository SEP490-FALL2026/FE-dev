import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CycleDetail } from './components/cycle-detail'

const vnd = (amount: string) => ({ amount, currency: 'VND' })

describe('Budget cycle edit', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let status = 'DRAFT'

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
    sharedPoolReserve: vnd('50000000'),
    available: vnd('450000000'),
    priorities: null,
    status,
    openedAt: null
  })

  beforeEach(async () => {
    requests = []
    status = 'DRAFT'
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

  it('edits a draft freely: no reason is asked and only what changed is sent', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit cycle' }))
    fireEvent.change(screen.getByDisplayValue('500,000,000'), { target: { value: '600000000' } })
    expect(screen.queryByLabelText(/Reason for the new amount/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'patch')).toBe(true))
    const patch = requests.find((request) => request.method === 'patch')
    expect(patch?.url?.endsWith('/budget-cycles/2027')).toBe(true)
    expect(JSON.parse(patch?.data)).toEqual({ annualCeiling: { amount: '600000000' } })
  })

  it('asks for a reason once the cycle is open', async () => {
    status = 'OPEN'
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit cycle' }))
    fireEvent.change(screen.getByDisplayValue('500,000,000'), { target: { value: '600000000' } })
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/Reason for the new amount/), { target: { value: 'Leadership raised it' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'patch')).toBe(true))
    expect(JSON.parse(requests.find((request) => request.method === 'patch')?.data)).toEqual({
      annualCeiling: { amount: '600000000' },
      reason: 'Leadership raised it'
    })
  })

  it('does not accept a shared-pool reserve above the annual ceiling', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit cycle' }))
    fireEvent.change(screen.getByDisplayValue('50,000,000'), { target: { value: '900000000' } })
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    expect(screen.getByText(/should not be larger than the annual ceiling/)).toBeTruthy()
  })

  it('locks the cycle: no edit, no open, no delete', async () => {
    status = 'LOCKED'
    mount()
    expect(await screen.findByText(/locked after the submission deadline/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Edit cycle' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Open cycle' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Delete draft' })).toBeNull()
  })

  it('offers opening and deleting a draft, and opens with no body', async () => {
    mount()
    expect(await screen.findByRole('button', { name: 'Delete draft' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Open cycle' }))
    // Opening notifies every department head, so it asks first.
    expect(screen.getByText(/Every department head is notified/)).toBeTruthy()
    expect(requests.some((request) => request.url?.endsWith('/opening'))).toBe(false)
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Open cycle' }))
    await waitFor(() =>
      expect(requests.some((request) => request.url?.endsWith('/budget-cycles/2027/opening'))).toBe(true)
    )
  })
})
