import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import {
  apiLine,
  apiPage,
  apiResponse,
  apiVersion,
  budgetTestLanguage,
  exactMoney,
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
      if (path.endsWith('/lines')) return apiResponse(config, apiPage([apiLine], config.params?.page))
      return apiResponse(config, { version: currentVersion })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })
  const mount = () => renderBudget(<FinanceBudgetNegotiationView itemId='version-1' onSelectTab={vi.fn()} />)
  const write = (suffix: string) =>
    requests.find((request) => request.method !== 'get' && request.url?.endsWith(suffix))
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
    expect(JSON.parse(write('/budget-versions/version-1')?.data).base.amount).toBe('9007199254740993.99')
    await waitFor(() =>
      expect(
        requests.filter((request) => request.method === 'get' && request.url?.endsWith('/budget-versions/version-1'))
          .length
      ).toBeGreaterThan(1)
    )
  })
  it('creates a revision of the approved Cost Center and year', async () => {
    currentVersion = { ...apiVersion, state: 'APPROVED' }
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Create revision' }))
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'New service needs' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/revisions')).toBeDefined())
    expect(JSON.parse(write('/revisions')?.data)).toMatchObject({
      costCenterId: 'center-1',
      year: 2027,
      reason: 'New service needs',
      base: exactMoney
    })
  })
  it('adds a line using the generated lines body', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Add line' }))
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New planned tool' } })
    fireEvent.change(screen.getByLabelText(/^Amount/), { target: { value: exactMoney.amount } })
    fireEvent.click(screen.getByRole('button', { name: 'Save line' }))
    await waitFor(() => expect(write('/version-1/lines')).toBeDefined())
    expect(JSON.parse(write('/version-1/lines')?.data).lines[0]).toMatchObject({
      description: 'New planned tool',
      amount: exactMoney
    })
  })
  it('updates the selected position and clears nullable plan fields', async () => {
    mount()
    await openLine()
    fireEvent.click(screen.getByRole('button', { name: 'Edit line' }))
    fireEvent.change(screen.getByLabelText('Seats'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save line' }))
    await waitFor(() => expect(write('/version-1/lines/1')).toBeDefined())
    expect(JSON.parse(write('/version-1/lines/1')?.data)).toMatchObject({
      seats: null,
      planId: null,
      amount: exactMoney
    })
  })
  it('moves an approved purchase window without submitting any amount', async () => {
    currentVersion = { ...apiVersion, state: 'APPROVED' }
    mount()
    await openLine()
    fireEvent.click(screen.getByRole('button', { name: 'Move purchase window' }))
    fireEvent.change(screen.getByLabelText('Purchase window from'), { target: { value: '2027-02-01' } })
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Quote delayed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save window' }))
    await waitFor(() => expect(write('/lines/1/window')).toBeDefined())
    expect(JSON.parse(write('/lines/1/window')?.data)).toEqual({
      windowFrom: '2027-02-01',
      windowTo: '2027-03-31',
      reason: 'Quote delayed'
    })
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
    expect(write('/version-1/imports')?.data).toBeInstanceOf(FormData)
    expect((write('/version-1/imports')?.data as FormData).get('file')).toBeInstanceOf(File)
    expect(await screen.findByText('Added 2 lines; rejected 1 rows.')).toBeTruthy()
  })
  it('requests history pages from the server and reads line changes separately', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View history' }))
    const drawer = screen.getByRole('dialog')
    await within(drawer).findAllByText('Figures updated')
    fireEvent.click(within(drawer).getByRole('button', { name: 'Next' }))
    await waitFor(() =>
      expect(requests.some((request) => request.url?.endsWith('/history') && request.params?.page === 2)).toBe(true)
    )
    fireEvent.click(within(drawer).getByRole('button', { name: 'Close' }))
    await openLine()
    fireEvent.click(screen.getByRole('button', { name: 'Purchase window history' }))
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/lines/1/changes'))).toBe(true))
    expect(await screen.findAllByText('Move purchase')).not.toHaveLength(0)
  })
  it('retains a rejected draft', async () => {
    rejectWrite = true
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit figures' }))
    fireEvent.change(screen.getByLabelText(/^Base amount/), { target: { value: '123.45' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save version' }))
    await waitFor(() => expect(write('/budget-versions/version-1')).toBeDefined())
    expect((screen.getByLabelText(/^Base amount/) as HTMLInputElement).value).toBe('123.45')
  })
})
