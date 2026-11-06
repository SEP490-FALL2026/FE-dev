import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { ApprovalNeedView } from './views/approval-need-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))

const requestId = '12345678-1234-4234-8234-123456789012'
const originalAdapter = apiClient.defaults.adapter
let posts: unknown[]
let failed: boolean
let stepState: string
let employeeId: string
let termMonths: number
let groupMode: boolean
let unknownGroupState: boolean
let linePages: number[]

beforeEach(() => {
  posts = []
  failed = false
  stepState = 'PENDING'
  employeeId = 'approver'
  termMonths = 6
  groupMode = false
  unknownGroupState = false
  linePages = []
  apiClient.defaults.adapter = async (config) => {
    if (config.method === 'post') {
      posts.push(JSON.parse(config.data))
      // Đợt 1 bodies are strict: any field beyond {decision, reason?} / {lines} is a 422.
      const body = JSON.parse(config.data) as Record<string, unknown>
      if (Object.keys(body).some((key) => !['decision', 'reason', 'lines'].includes(key)))
        throw new AxiosError('Unknown fields', '422', config, undefined, {
          config,
          status: 422,
          statusText: 'Invalid',
          headers: new AxiosHeaders(),
          data: { error: { code: 'VALIDATION_ERROR' } }
        })
      if (failed)
        throw new AxiosError('Conflict', '409', config, undefined, {
          config,
          data: { success: false, error: { code: 'ACCESS_REQUEST.STEP_NOT_PENDING' } },
          status: 409,
          statusText: 'Conflict',
          headers: new AxiosHeaders()
        })
      stepState = 'APPROVED'
    }
    if (config.url?.endsWith('/lines')) {
      const page = Number(config.params?.page ?? 1)
      linePages.push(page)
      const member = (index: number) => ({
        employee: { employeeId: `member-${index}`, fullName: `Member ${index}` },
        position: index,
        state:
          index === 101 && unknownGroupState
            ? 'FUTURE_LINE_STATE'
            : index === 1 || index === 101
              ? 'AWAITING_NEED'
              : 'NEED_CONFIRMED',
        needStep: {
          id: index === 1 || index === 101 ? 'assigned-step' : 'other-step',
          state: index === 1 || index === 101 ? stepState : 'APPROVED',
          assignee: { employeeId: 'approver' }
        }
      })
      return {
        config,
        data: {
          success: true,
          data: {
            items: page === 1 ? Array.from({ length: 100 }, (_, index) => member(index + 1)) : [member(101)],
            pagination: { page, pageSize: 100, totalItems: 101, totalPages: 2 }
          }
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders()
      }
    }
    const data = config.url?.endsWith('/me')
      ? {
          employee: { id: employeeId, department: null },
          roles: ['SPENDING_APPROVER']
        }
      : {
          request: {
            id: requestId,
            type: groupMode ? 'GROUP_GRANT' : 'GRANT',
            branch: 'PAID_IN_CATALOG',
            state: 'PENDING',
            plan: { applicationName: 'Example app', planName: 'Team' },
            proposal: null,
            department: { code: 'ENG', name: 'Engineering' },
            costCenter: { code: 'ENG' },
            requester: { employeeId: 'requester', fullName: 'Requester' },
            beneficiary: { employeeId: 'beneficiary', fullName: 'Beneficiary' },
            businessReason: 'Project collaboration',
            termMonths,
            lineCount: 1,
            pricing: { status: 'READY', amount: null },
            needStep: { state: stepState, assignee: { employeeId: 'approver' } },
            needDecision: null,
            renewal: null
          }
        }
    return { config, data: { success: true, data }, status: 200, statusText: 'OK', headers: new AxiosHeaders() }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalNeedView itemId={requestId} onSelectTab={() => undefined} />
    </QueryClientProvider>
  )
}

it('approves a long paid need with only the decision, without term or plan-line fields', async () => {
  termMonths = 12
  mount()
  const submit = await screen.findByRole('button', { name: 'submit' })
  expect(submit).toBeEnabled()
  expect(screen.queryByLabelText('termReason')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('planPosition')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('offPlan')).not.toBeInTheDocument()
  fireEvent.click(submit)
  await waitFor(() => expect(posts).toEqual([{ decision: 'APPROVE' }]))
})

it('keeps rejection text after a failed write and refreshes authoritative state', async () => {
  failed = true
  mount()
  fireEvent.click(await screen.findByLabelText('reject'))
  const reason = screen.getByLabelText('reason')
  fireEvent.change(reason, { target: { value: '  Duplicate request  ' } })
  fireEvent.click(screen.getByRole('button', { name: 'submit' }))
  await waitFor(() => expect(posts).toEqual([{ decision: 'REJECT', reason: 'Duplicate request' }]))
  expect(reason).toHaveValue('  Duplicate request  ')
})

it.each(['WAITING', 'APPROVED', 'UNKNOWN'])('blocks decisions when need step is %s', async (value) => {
  stepState = value
  mount()
  await screen.findByText('Example app')
  expect(screen.queryByRole('button', { name: 'submit' })).not.toBeInTheDocument()
})

it('blocks writes when another employee holds the need step', async () => {
  employeeId = 'other-employee'
  mount()
  await screen.findByText('Example app')
  expect(screen.queryByRole('button', { name: 'submit' })).not.toBeInTheDocument()
})

it('loads every member page before submitting exactly the people pending on the assigned need step', async () => {
  groupMode = true
  mount()
  const approvals = await screen.findAllByLabelText('approveMember')
  expect(approvals).toHaveLength(2)
  expect(linePages).toEqual([1, 2])
  expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled()
  fireEvent.click(approvals[0])
  fireEvent.click(screen.getAllByLabelText('rejectMember')[1])
  fireEvent.change(screen.getByLabelText('memberReason'), { target: { value: '  Not needed  ' } })
  fireEvent.click(screen.getByRole('button', { name: 'submit' }))
  await waitFor(() =>
    expect(posts).toEqual([
      {
        lines: [
          { employeeId: 'member-1', decision: 'APPROVE' },
          { employeeId: 'member-101', decision: 'REJECT', reason: 'Not needed' }
        ]
      }
    ])
  )
})

it('blocks a group decision when any beneficiary has an unrecognized server state', async () => {
  groupMode = true
  unknownGroupState = true
  mount()
  expect(await screen.findByText('locked')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'submit' })).not.toBeInTheDocument()
  expect(posts).toHaveLength(0)
})

it('approves a paid need as Spending Approver with the strict decision body', async () => {
  mount()
  const submit = await screen.findByRole('button', { name: 'submit' })
  expect(submit).toBeEnabled()
  fireEvent.click(submit)
  await waitFor(() => expect(posts).toEqual([{ decision: 'APPROVE' }]))
})
