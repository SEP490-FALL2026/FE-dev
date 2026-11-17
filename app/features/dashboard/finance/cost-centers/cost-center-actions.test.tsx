import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
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
  let createFailsWith: { status: number; code: string } | null = null
  let departments: {
    departmentId: string
    departmentCode: string
    departmentName: string
    costCenterId: string | null
  }[]
  const reply = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({
    config,
    status,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data: { success: true, message: 'OK', data }
  })

  beforeEach(async () => {
    requests = []
    createFailsWith = null
    departments = [
      { departmentId: 'dep-9', departmentCode: 'OPS', departmentName: 'Operations', costCenterId: null },
      { departmentId: 'dep-1', departmentCode: 'ENG', departmentName: 'Engineering', costCenterId: 'cc-1' }
    ]
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (config.method === 'get' && url.includes('/baseline'))
        return reply(config, { year: new Date().getFullYear(), departments })
      if (config.method === 'post' && url.endsWith('/cost-centers') && createFailsWith)
        throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, {
          status: createFailsWith.status,
          statusText: 'Error',
          headers: new AxiosHeaders(),
          config,
          data: { success: false, error: { code: createFailsWith.code } }
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

  const pickOperations = async () => {
    await screen.findByRole('option', { name: 'OPS · Operations' })
    fireEvent.change(screen.getByLabelText(/^Department/), { target: { value: 'dep-9' } })
  }

  it('adds a UNIT cost center for a department without one, with a code and a name suggested from it', async () => {
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    await screen.findByRole('option', { name: 'OPS · Operations' })
    expect(screen.queryByRole('option', { name: 'ENG · Engineering' })).toBeNull()
    expect(screen.queryByLabelText(/kind/i)).toBeNull()
    await pickOperations()
    expect(screen.getByLabelText(/^Code/)).toHaveValue('CC-OPS')
    expect(screen.getByLabelText(/^Name/)).toHaveValue('Operations')
    expect(screen.getByText('The code cannot be changed after creation; only the name can.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    await waitFor(() => expect(write('post', '/cost-centers')).toBeDefined())
    expect(JSON.parse(write('post', '/cost-centers')?.data)).toEqual({
      code: 'CC-OPS',
      name: 'Operations',
      kind: 'UNIT',
      departmentId: 'dep-9'
    })
  })

  it('locks the code and the name taken from the department, and follows a change of department', async () => {
    departments = [
      { departmentId: 'dep-9', departmentCode: 'OPS', departmentName: 'Operations', costCenterId: null },
      { departmentId: 'dep-7', departmentCode: 'p-fin', departmentName: 'Finance', costCenterId: null }
    ]
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    await screen.findByRole('option', { name: 'OPS · Operations' })
    fireEvent.change(screen.getByLabelText(/^Department/), { target: { value: 'dep-9' } })
    expect(screen.getByLabelText(/^Code/)).toHaveAttribute('readonly')
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('readonly')
    fireEvent.change(screen.getByLabelText(/^Department/), { target: { value: 'dep-7' } })
    expect(screen.getByLabelText(/^Code/)).toHaveValue('CC-P-FIN')
    expect(screen.getByLabelText(/^Name/)).toHaveValue('Finance')
  })

  it('opens the name when the department name is one BE keeps for unallocated costs', async () => {
    departments = [{ departmentId: 'dep-9', departmentCode: 'OPS', departmentName: 'Chưa phân bổ', costCenterId: null }]
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    await screen.findByRole('option', { name: 'OPS · Chưa phân bổ' })
    fireEvent.change(screen.getByLabelText(/^Department/), { target: { value: 'dep-9' } })
    expect(screen.getByText(/kept for the unallocated cost line/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
    expect(screen.getByLabelText(/^Name/)).not.toHaveAttribute('readonly')
    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: 'Operations' } })
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled()
  })

  it('shows an empty state instead of the form when every department has a Cost Center', async () => {
    departments = [
      { departmentId: 'dep-1', departmentCode: 'ENG', departmentName: 'Engineering', costCenterId: 'cc-1' }
    ]
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    expect(await screen.findByText(/Every department already has a Cost Center/)).toBeTruthy()
    expect(screen.queryByLabelText(/^Code/)).toBeNull()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('shows a taken code at the code field and reloads the departments when one is already linked', async () => {
    mount(<CostCenterCreateDialog onClose={() => undefined} />)
    await pickOperations()
    createFailsWith = { status: 409, code: 'COST_CENTER.CODE_TAKEN' }
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('This code is already used, pick another one.')).toBeTruthy()
    expect(screen.getByLabelText(/^Code/)).not.toHaveAttribute('readonly')
    createFailsWith = { status: 409, code: 'COST_CENTER.DEPARTMENT_ALREADY_LINKED' }
    const baselineReads = requests.filter((request) => request.url?.includes('/baseline')).length
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText(/already has a Cost Center\. The department list was reloaded/)).toBeTruthy()
    await waitFor(() =>
      expect(requests.filter((request) => request.url?.includes('/baseline')).length).toBeGreaterThan(baselineReads)
    )
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
