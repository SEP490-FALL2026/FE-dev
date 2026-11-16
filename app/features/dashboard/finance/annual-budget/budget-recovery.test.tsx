import { fireEvent, screen, waitFor } from '@testing-library/react'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import { apiResponse, budgetSideList, apiVersion, budgetTestLanguage, renderBudget } from './budget-test-fixtures'

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
      return apiResponse(config, { version: currentVersion })
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
})
