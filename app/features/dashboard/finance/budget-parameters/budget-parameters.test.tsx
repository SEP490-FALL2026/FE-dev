import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { intRange, isValidParameterValue, pickBudgetParameters, type BudgetParameter } from './budget-parameters'
import { FinanceBudgetParametersView } from './views/finance-budget-parameters-view'

const parameter = (key: string, value: number, min = 0, max = 100): BudgetParameter => ({
  key,
  label: `Label ${key}`,
  group: 'BUDGET',
  groupLabel: 'Budget',
  value,
  default: 10,
  isDefault: value === 10,
  unit: 'PERCENT',
  unitLabel: '%',
  description: 'About the value.',
  constraints: { kind: 'int', min, max },
  changedAt: null
})

describe('Budget parameters', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []

  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })

  beforeEach(async () => {
    requests = []
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (url.endsWith('/history'))
        return reply(config, {
          success: true,
          message: 'OK',
          data: { items: [{ value: 10, from: '2026-01-01T00:00:00Z', until: null }], hasMore: false }
        })
      if (config.method === 'put') return reply(config, { success: true, message: 'OK', data: parameter('X', 20) })
      return reply(config, {
        success: true,
        message: 'OK',
        data: {
          items: [
            parameter('BUDGET_RESERVE_DEFAULT_PERCENT', 10),
            parameter('SOMETHING_ELSE', 5),
            parameter('BUDGET_ZBB_KPI3_BELOW_PERCENT', 70, 1, 100)
          ]
        }
      })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  it('keeps only the three budget parameters Finance owns, in a fixed order', () => {
    const picked = pickBudgetParameters([
      parameter('BUDGET_ZBB_KPI3_BELOW_PERCENT', 70),
      parameter('OTHER', 1),
      parameter('BUDGET_RESERVE_DEFAULT_PERCENT', 10)
    ])
    expect(picked.map((item) => item.key)).toEqual(['BUDGET_RESERVE_DEFAULT_PERCENT', 'BUDGET_ZBB_KPI3_BELOW_PERCENT'])
  })

  it('checks a value against the integer domain of the parameter', () => {
    const range = intRange(parameter('BUDGET_ZBB_KPI3_BELOW_PERCENT', 70, 1, 100))
    expect(range).toEqual({ min: 1, max: 100 })
    expect(isValidParameterValue('0', range!)).toBe(false)
    expect(isValidParameterValue('101', range!)).toBe(false)
    expect(isValidParameterValue('7.5', range!)).toBe(false)
    expect(isValidParameterValue('70', range!)).toBe(true)
  })

  it('lists the budget parameters only and saves a new value with PUT', async () => {
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <FinanceBudgetParametersView />
      </QueryClientProvider>
    )
    expect((await screen.findAllByText('Default reserve of the annual budget')).length).toBeGreaterThan(0)
    expect(screen.queryAllByText('BUDGET_RESERVE_DEFAULT_PERCENT')).toHaveLength(0)
    expect(screen.queryAllByText('SOMETHING_ELSE')).toHaveLength(0)
    fireEvent.click(screen.getAllByRole('button', { name: 'Change' })[0])
    const input = await screen.findByDisplayValue('10')
    expect(screen.getByRole('button', { name: 'Save value' })).toBeDisabled()
    fireEvent.change(input, { target: { value: '150' } })
    expect(screen.getByText('Enter a whole number between 0 and 100.')).toBeTruthy()
    fireEvent.change(input, { target: { value: '20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save value' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'put')).toBe(true))
    const put = requests.find((request) => request.method === 'put')
    expect(put?.url?.endsWith('/operating-parameters/BUDGET_RESERVE_DEFAULT_PERCENT')).toBe(true)
    expect(JSON.parse(put?.data)).toEqual({ value: 20 })
  })
})
