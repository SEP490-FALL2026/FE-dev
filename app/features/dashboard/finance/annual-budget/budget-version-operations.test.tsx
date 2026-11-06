import { fireEvent, screen, waitFor, within } from '@testing-library/react'
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
  defaultReserve,
  exactMoney,
  renderBudget,
  writeTo
} from './budget-test-fixtures'

describe('budget version API operations', () => {
  const originalAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  let rejectWrite = false
  beforeEach(async () => {
    await budgetTestLanguage()
    requests = []
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
      if (path.endsWith('/imports'))
        return apiResponse(config, { result: { added: 2, rejected: 1, errors: [{ row: 3, code: 'INVALID_AMOUNT' }] } })
      if (path.endsWith('/lines')) return apiResponse(config, apiPage([apiLine], config.params?.page))
      return apiResponse(config, { version: apiVersion })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })
  const mount = () => renderBudget(<FinanceBudgetNegotiationView itemId='version-1' onSelectTab={vi.fn()} />)
  const write = (suffix: string) => writeTo(requests, suffix)
  async function openLine() {
    await screen.findAllByText('API plan line')
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
  }
  it('updates figures with exact decimals and invalidates the version', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit figures' }))
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '9007199254740993.99' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/budget-versions/version-1')).toBeDefined())
    expect(write('/budget-versions/version-1')?.body).toEqual({
      base: { amount: '9007199254740993.99' },
      reserve: { amount: defaultReserve.amount },
      reserveReason: null,
      quarters: null
    })
    await waitFor(() =>
      expect(
        requests.filter((request) => request.method === 'get' && request.url?.endsWith('/budget-versions/version-1'))
          .length
      ).toBeGreaterThan(1)
    )
  })
  it('sends all four quarters as amounts without a currency', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit figures' }))
    for (const [index, amount] of ['1', '2', '3', '4'].entries())
      fireEvent.change(screen.getByLabelText(`Quarter ${index + 1}`), { target: { value: amount } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/budget-versions/version-1')).toBeDefined())
    expect(write('/budget-versions/version-1')?.body.quarters).toEqual({
      q1: { amount: '1' },
      q2: { amount: '2' },
      q3: { amount: '3' },
      q4: { amount: '4' }
    })
  })
  it('adds a line as { lines: [...] } with an amount and no currency', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Add line' }))
    fireEvent.change(screen.getByLabelText(/^Description/), { target: { value: 'New planned tool' } })
    fireEvent.change(screen.getByLabelText(/^Amount/), { target: { value: exactMoney.amount } })
    fireEvent.change(screen.getByLabelText('Seats'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Note'), { target: { value: 'Needed for Q2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save line' }))
    await waitFor(() => expect(write('/version-1/lines')).toBeDefined())
    expect(write('/version-1/lines')?.body).toEqual({
      lines: [
        { description: 'New planned tool', amount: { amount: exactMoney.amount }, seats: 5, note: 'Needed for Q2' }
      ]
    })
  })
  it('updates the selected position and clears nullable plan fields', async () => {
    mount()
    await openLine()
    fireEvent.click(screen.getByRole('button', { name: 'Edit line' }))
    fireEvent.change(screen.getByLabelText('Seats'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Adjustment reason'), { target: { value: 'Fewer seats' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save line' }))
    await waitFor(() => expect(write('/version-1/lines/1')).toBeDefined())
    expect(write('/version-1/lines/1')?.body).toEqual({
      description: 'API plan line',
      amount: { amount: exactMoney.amount },
      seats: null,
      planId: null,
      financeComment: null,
      adjustmentReason: 'Fewer seats'
    })
  })
  it('offers no purchase-window, revision or line-history action', async () => {
    mount()
    await openLine()
    const drawer = screen.getByRole('dialog')
    expect(within(drawer).getByRole('button', { name: 'Edit line' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Move purchase window' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Purchase window history' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Create revision' })).toBeNull()
    expect(within(drawer).queryByText('Purchase window from')).toBeNull()
  })
  it('uploads multipart data and presents partial import results', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Import lines' }))
    fireEvent.change(screen.getByLabelText(/^Import lines/, { selector: 'input' }), {
      target: { files: [new File(['description,amount\nTool,100'], 'budget.csv', { type: 'text/csv' })] }
    })
    const uploadForm = screen.getByRole('button', { name: 'Upload file' }).closest('form')
    if (!uploadForm) throw new Error('Import form is missing')
    fireEvent.submit(uploadForm)
    await waitFor(() => expect(write('/version-1/imports')).toBeDefined())
    expect(write('/version-1/imports')?.body).toBeInstanceOf(FormData)
    expect((write('/version-1/imports')?.body as FormData).get('file')).toBeInstanceOf(File)
    expect(await screen.findByText('Added 2 lines; rejected 1 rows.')).toBeTruthy()
  })
  it('requests version history pages from the server', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View history' }))
    const drawer = screen.getByRole('dialog')
    await within(drawer).findAllByText('Figures updated')
    fireEvent.click(within(drawer).getByRole('button', { name: 'Next' }))
    await waitFor(() =>
      expect(requests.some((request) => request.url?.endsWith('/history') && request.params?.page === 2)).toBe(true)
    )
  })
  it('retains a rejected draft', async () => {
    rejectWrite = true
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit figures' }))
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '123.45' } })
    fireEvent.change(screen.getByLabelText(/^Reserve amount/), { target: { value: '12' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/budget-versions/version-1')).toBeDefined())
    expect(screen.getByLabelText(/^Base amount/)).toHaveValue('123.45')
  })
})
