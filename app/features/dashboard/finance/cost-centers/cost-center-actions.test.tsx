import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { finance } from '~/shared/i18n/locales/en/finance'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { CostCenterCreateDialog } from './components/cost-center-create-dialog'
import { CostCenterManageActions } from './components/cost-center-manage-actions'

const item = {
  id: 'cc-1',
  code: 'CC-ENG',
  name: 'Engineering',
  kind: 'UNIT',
  status: 'ACTIVE',
  department: { id: 'dep-1', code: 'ENG', name: 'Engineering' },
  linkedAt: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  deactivatedAt: null
} as const

describe('Finance cost center catalogue writes', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  const reply = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({
    config,
    status,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data: { success: true, message: 'OK', data }
  })

  beforeEach(async () => {
    requests = []
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (config.method === 'get' && url.includes('/baseline'))
        return reply(config, {
          year: new Date().getFullYear(),
          departments: [
            { departmentId: 'dep-9', departmentCode: 'OPS', departmentName: 'Operations', costCenterId: null },
            { departmentId: 'dep-1', departmentCode: 'ENG', departmentName: 'Engineering', costCenterId: 'cc-1' }
          ]
        })
      return reply(config, item)
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (ui: React.ReactNode) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        {ui}
      </QueryClientProvider>
    )
  const write = (method: string, suffix: string) =>
    requests.find((request) => request.method === method && request.url?.endsWith(suffix))

  it('adds a UNIT cost center for a department without one, taken from the baseline of the current year', async () => {
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    await screen.findByRole('option', { name: 'OPS · Operations' })
    expect(screen.queryByRole('option', { name: 'ENG · Engineering' })).toBeNull()
    fireEvent.change(screen.getByLabelText(/^Code/), { target: { value: 'CC-OPS' } })
    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: 'Operations' } })
    fireEvent.change(screen.getByLabelText(/^Department/), { target: { value: 'dep-9' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    await waitFor(() => expect(write('post', '/cost-centers')).toBeDefined())
    expect(JSON.parse(write('post', '/cost-centers')?.data)).toEqual({
      code: 'CC-OPS',
      name: 'Operations',
      kind: 'UNIT',
      departmentId: 'dep-9'
    })
  })

  it('refuses a code that does not match the pattern', async () => {
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    fireEvent.change(screen.getByLabelText(/^Code/), { target: { value: '-bad' } })
    expect(screen.getByText(/must start with a letter or digit/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('renames with only the name and retires after a confirmation', async () => {
    mount(<CostCenterManageActions item={item} />)
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }))
    expect(screen.getByRole('button', { name: 'Save name' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: 'Platform' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save name' }))
    await waitFor(() => expect(write('patch', '/cost-centers/cc-1')).toBeDefined())
    expect(JSON.parse(write('patch', '/cost-centers/cc-1')?.data)).toEqual({ name: 'Platform' })

    fireEvent.click(await screen.findByRole('button', { name: 'Retire' }))
    fireEvent.click(screen.getByRole('button', { name: 'Retire cost center' }))
    await waitFor(() => expect(write('post', '/cost-centers/cc-1/deactivate')).toBeDefined())
  })
})
