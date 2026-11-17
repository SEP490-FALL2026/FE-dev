import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import { FinanceVersionHistoryView } from './views/finance-version-history-view'
import {
  apiPage,
  apiResponse,
  budgetSideList,
  apiVersion,
  budgetTestLanguage,
  renderBudget
} from './budget-test-fixtures'

describe('budget version API operations', () => {
  const originalAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  let currentVersion = apiVersion
  let rejectWrite = false
  beforeEach(async () => {
    await budgetTestLanguage()
    requests = []
    currentVersion = apiVersion
    rejectWrite = false
    apiClient.defaults.adapter = async (config) => {
      const sideList = budgetSideList(config)
      if (sideList) return sideList
      requests.push(config)
      if (rejectWrite && config.method !== 'get')
        throw new AxiosError('Rejected', 'ERR_BAD_REQUEST', config, undefined, {
          ...apiResponse(config, null),
          status: 422,
          data: { error: { code: 'VALIDATION_ERROR' } }
        })
      const path = config.url?.split('/api/v1')[1] ?? ''
      if (path.endsWith('/history'))
        return apiResponse(
          config,
          apiPage(
            [
              {
                seq: 1,
                kind: 'FIGURES_UPDATED',
                versionState: 'DRAFT',
                position: null,
                lines: null,
                changes: [{ field: 'base', before: '10', after: '20' }],
                currency: 'USD',
                by: null,
                at: '2026-11-01T00:00:00Z'
              }
            ],
            config.params?.page
          )
        )
      if (path.endsWith('/changes'))
        return apiResponse(
          config,
          apiPage(
            [
              {
                before: { windowFrom: '2027-01-01', windowTo: '2027-03-31' },
                after: { windowFrom: '2027-02-01', windowTo: '2027-04-30' },
                reason: 'Move purchase',
                changedBy: null,
                changedAt: '2026-11-01T00:00:00Z'
              }
            ],
            config.params?.page
          )
        )
      if (path.endsWith('/imports'))
        return apiResponse(config, { result: { added: 2, rejected: 1, errors: [{ row: 3, code: 'INVALID_AMOUNT' }] } })
      return apiResponse(config, { version: currentVersion })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })
  const selectTab = vi.fn()
  const mount = () => renderBudget(<FinanceBudgetNegotiationView itemId='version-1' onSelectTab={selectTab} />)
  const mountHistory = () => renderBudget(<FinanceVersionHistoryView itemId='version-1' onSelectTab={selectTab} />)
  const write = (suffix: string) =>
    requests.find((request) => request.method !== 'get' && request.url?.endsWith(suffix))
  it('updates figures with exact decimals and invalidates the version', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit figures' }))
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '9007199254740993.99' } })
    fireEvent.change(screen.getByLabelText(/Reason for changing the base/), { target: { value: 'Leadership change' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/budget-versions/version-1')).toBeDefined())
    expect(JSON.parse(write('/budget-versions/version-1')?.data).base.amount).toBe('9007199254740993.99')
    await waitFor(() =>
      expect(
        requests.filter((request) => request.method === 'get' && request.url?.endsWith('/budget-versions/version-1'))
          .length
      ).toBeGreaterThan(1)
    )
  })
  it('does not expose the removed revision operation for approved budgets', async () => {
    currentVersion = { ...apiVersion, state: 'APPROVED' }
    mount()
    await screen.findAllByText('Engineering API')
    expect(screen.queryByRole('button', { name: 'Create revision' })).not.toBeInTheDocument()
  })
  it('opens the history on its own screen instead of a drawer', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View history' }))
    expect(selectTab).toHaveBeenCalledWith('version-history', { id: 'version-1' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('requests history pages from the server on the history screen', async () => {
    mountHistory()
    const history = await screen.findByRole('region', { name: 'Version history' })
    await within(history).findAllByText('Figures updated')
    fireEvent.click(within(history).getByRole('button', { name: 'Next' }))
    await waitFor(() =>
      expect(requests.some((request) => request.url?.endsWith('/history') && request.params?.page === 2)).toBe(true)
    )
    fireEvent.click(screen.getByRole('button', { name: 'Back to budget version' }))
    expect(selectTab).toHaveBeenCalledWith('budget-negotiation', { id: 'version-1' })
  })
  it('retains a rejected draft', async () => {
    rejectWrite = true
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit figures' }))
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '123.45' } })
    fireEvent.change(screen.getByLabelText(/Reason for changing the base/), { target: { value: 'Leadership change' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/budget-versions/version-1')).toBeDefined())
    expect((screen.getByLabelText(/^Base amount/) as HTMLInputElement).value).toBe('123.45')
  })
})
