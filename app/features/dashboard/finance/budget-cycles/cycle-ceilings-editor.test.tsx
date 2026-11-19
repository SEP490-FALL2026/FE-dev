import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CycleCeilingsEditor } from './components/cycle-ceilings-editor'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const departments = [
  { departmentId: 'dep-1', departmentName: 'Engineering', departmentCode: 'ENG' },
  { departmentId: 'dep-2', departmentName: 'Design', departmentCode: 'DES' }
]
const cycle = {
  year: 2027,
  sharedPoolReserve: vnd('50000000'),
  ceilings: {
    // an older division kept in three parts: the screen shows their sum as one figure
    'dep-1': {
      signedCommitments: vnd('10000000'),
      plannedSeats: vnd('20000000'),
      priority: vnd('70000000'),
      explanation: 'Core product'
    }
  }
}

describe('CycleCeilingsEditor', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []

  beforeEach(async () => {
    requests = []
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data: {} } }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (readOnly = false) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <CycleCeilingsEditor
          cycle={cycle as unknown as Parameters<typeof CycleCeilingsEditor>[0]['cycle']}
          departments={departments as unknown as Parameters<typeof CycleCeilingsEditor>[0]['departments']}
          readOnly={readOnly}
        />
      </QueryClientProvider>
    )

  it('asks for one ceiling per department and sends it as the single figure', async () => {
    mount()
    expect(screen.queryByText('Signed commitments')).toBeNull()
    expect(screen.queryByText('Planned seats')).toBeNull()
    const engineering = screen.getByLabelText('Engineering — Department ceiling') as HTMLInputElement
    expect(engineering.value).toBe('100,000,000')
    fireEvent.change(screen.getByLabelText('Design — Department ceiling'), { target: { value: '40000000' } })
    fireEvent.change(screen.getByLabelText('Design — Explanation'), { target: { value: 'Brand work' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save division' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'put')).toBe(true))
    const body = JSON.parse(requests.find((request) => request.method === 'put')?.data)
    expect(body.sharedPoolReserve).toEqual({ amount: '50000000' })
    expect(body.departments).toEqual([
      {
        departmentId: 'dep-1',
        signedCommitments: { amount: '0' },
        plannedSeats: { amount: '0' },
        priority: { amount: '100000000' },
        explanation: 'Core product'
      },
      {
        departmentId: 'dep-2',
        signedCommitments: { amount: '0' },
        plannedSeats: { amount: '0' },
        priority: { amount: '40000000' },
        explanation: 'Brand work'
      }
    ])
  })

  it('cannot be focused or typed into once the cycle is published', () => {
    mount(true)
    for (const label of ['Engineering — Department ceiling', 'Engineering — Explanation', 'Design — Explanation'])
      expect((screen.getByLabelText(label) as HTMLInputElement).disabled).toBe(true)
    expect(screen.queryByRole('button', { name: 'Save division' })).toBeNull()
  })
})
