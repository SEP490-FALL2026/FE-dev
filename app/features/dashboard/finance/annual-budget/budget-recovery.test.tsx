import { fireEvent, screen, waitFor } from '@testing-library/react'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import {
  apiLine,
  apiPage,
  apiResponse,
  budgetSideList,
  apiVersion,
  budgetTestLanguage,
  renderBudget
} from './budget-test-fixtures'

describe('budget recovery workflows', () => {
  const originalAdapter = apiClient.defaults.adapter
  let offline: boolean
  let currentVersion = apiVersion
  let requests: InternalAxiosRequestConfig[]
  beforeEach(async () => {
    await budgetTestLanguage()
    offline = false
    currentVersion = apiVersion
    requests = []
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      requests.push(config)
      if (offline) throw new AxiosError('Offline', 'ERR_NETWORK', config)
      if (config.method === 'post' && config.url?.endsWith('/budget-versions'))
        return apiResponse(config, {
          version: { ...apiVersion, id: 'replacement-version', rejectedPredecessorId: apiVersion.id }
        })
      return apiResponse(config, config.url?.endsWith('/lines') ? apiPage([apiLine]) : { version: currentVersion })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })

  it('rebuilds a rejected version from its original proposal with exact figures', async () => {
    currentVersion = { ...apiVersion, state: 'REJECTED' }
    const navigate = vi.fn()
    renderBudget(<FinanceBudgetNegotiationView itemId={apiVersion.id} onSelectTab={navigate} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Rebuild rejected version' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('budget-negotiation', { id: 'replacement-version' }))
    const request = requests.find((item) => item.method === 'post' && item.url?.endsWith('/budget-versions'))
    expect(JSON.parse(request?.data)).toMatchObject({
      proposalId: 'proposal-1',
      base: { amount: apiVersion.base.amount }
    })
  })

  it('keeps a line draft when both the write and the refresh fail', async () => {
    renderBudget(<FinanceBudgetNegotiationView itemId={apiVersion.id} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Add line' }))
    fireEvent.change(screen.getByLabelText(/^Description/), { target: { value: 'Unsaved line draft' } })
    fireEvent.change(screen.getByLabelText(/^Amount/), { target: { value: '123.45' } })
    offline = true
    fireEvent.click(screen.getByRole('button', { name: 'Save line' }))
    await waitFor(() => expect(requests.some((item) => item.method === 'post')).toBe(true))
    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0))
    expect(screen.getByLabelText(/^Description/)).toHaveValue('Unsaved line draft')
    expect(screen.getByLabelText(/^Amount/)).toHaveValue('123.45')
    expect(screen.getByRole('button', { name: 'Save line' })).toBeDisabled()
  })

  it('can retry a failed line refresh without closing its edit draft', async () => {
    const baseAdapter = apiClient.defaults.adapter
    let failLines = false
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      if (config.method === 'put') {
        failLines = true
        throw new AxiosError('Offline write', 'ERR_NETWORK', config)
      }
      if (failLines && config.url?.endsWith('/lines')) throw new AxiosError('Offline lines', 'ERR_NETWORK', config)
      if (typeof baseAdapter !== 'function') throw new Error('Expected test adapter')
      return baseAdapter(config)
    }
    renderBudget(<FinanceBudgetNegotiationView itemId={apiVersion.id} />)
    fireEvent.click((await screen.findAllByRole('button', { name: 'View details' }))[0])
    fireEvent.click(screen.getByRole('button', { name: 'Edit line' }))
    fireEvent.change(screen.getByLabelText(/^Description/), { target: { value: 'Keep edited draft' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save line' }))
    const retry = await screen.findByRole('button', { name: 'Try again' })
    expect(screen.getByLabelText(/^Description/)).toHaveValue('Keep edited draft')
    failLines = false
    fireEvent.click(retry)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save line' })).toBeEnabled())
    expect(screen.getByLabelText(/^Description/)).toHaveValue('Keep edited draft')
  })
})
