import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { AxiosError } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceAnnualProposalsView } from './views/finance-annual-proposals-view'
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

describe('budget server states and pending writes', () => {
  const originalAdapter = apiClient.defaults.adapter
  beforeEach(budgetTestLanguage)
  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })
  it('renders loading, then server empty data', async () => {
    let complete: (() => void) | undefined
    const gate = new Promise<void>((resolve) => {
      complete = resolve
    })
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      await gate
      return apiResponse(config, apiPage([]))
    }
    renderBudget(<FinanceAnnualProposalsView />)
    expect(await screen.findByText('Loading data…')).toBeTruthy()
    await act(async () => complete?.())
    expect(await screen.findByText('No matching records.')).toBeTruthy()
  })
  it('offers retry for a failed list and then displays the server response', async () => {
    let failed = true
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      if (failed) throw new AxiosError('Network down', 'ERR_NETWORK', config)
      return apiResponse(config, apiPage([]))
    }
    renderBudget(<FinanceAnnualProposalsView />)
    expect(await screen.findByRole('alert')).toBeTruthy()
    failed = false
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('No matching records.')).toBeTruthy()
  })
  it('uses the unknown status fallback and exposes no edit/send/approve action', async () => {
    apiClient.defaults.adapter = async (config) =>
      budgetSideList(config) ??
      apiResponse(
        config,
        config.url?.endsWith('/lines') ? apiPage([apiLine]) : { version: { ...apiVersion, state: 'FUTURE_STATE' } }
      )
    renderBudget(<FinanceBudgetNegotiationView itemId='version-1' />)
    expect(await screen.findByText('Unknown status')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Send for decision' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Edit figures' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Add line' })).toBeNull()
  })
  it('blocks duplicate sends while a mutation is pending', async () => {
    let sends = 0
    let complete: (() => void) | undefined
    const gate = new Promise<void>((resolve) => {
      complete = resolve
    })
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      if (config.url?.endsWith('/submission')) {
        sends += 1
        await gate
      }
      return apiResponse(config, config.url?.endsWith('/lines') ? apiPage([apiLine]) : { version: apiVersion })
    }
    renderBudget(<FinanceBudgetNegotiationView itemId='version-1' />)
    fireEvent.click(await screen.findByRole('button', { name: 'Send for decision' }))
    const confirm = screen.getByRole('button', { name: 'Confirm send' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await waitFor(() => expect(sends).toBe(1))
    expect(confirm).toHaveProperty('disabled', true)
    await act(async () => complete?.())
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(sends).toBe(1)
  })
})
