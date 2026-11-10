import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { ControlledWaitListResponseDtoDataItemsItem } from '~/shared/api/generated/model/controlled-waits/controlledWaitListResponseDtoDataItemsItem'
import type { CongestionStepsResponseDtoDataItemsItem } from '~/shared/api/generated/model/step-congestion/congestionStepsResponseDtoDataItemsItem'
import { SuperAdminOperationsView } from './views/super-admin-operations-view'

const requestId = '11111111-1111-4111-8111-111111111111'
const holderId = '22222222-2222-4222-8222-222222222222'
const stepId = '33333333-3333-4333-8333-333333333333'
const departmentId = '44444444-4444-4444-8444-444444444444'
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
const wait: ControlledWaitListResponseDtoDataItemsItem = {
  requestId,
  stepId,
  stepKind: 'SPEND_APPROVAL',
  waitingReason: 'NO_SPENDING_APPROVER',
  configurationHint: 'CONFIGURE_SPENDING_APPROVER',
  waitingSince: '2026-10-25T03:00:00Z',
  alertedAt: null,
  requester: { employeeId: holderId, employeeCode: 'EMP-008', fullName: 'Dana Nguyen' },
  department: { id: departmentId, code: 'ENG', name: 'Engineering' }
}
const step: CongestionStepsResponseDtoDataItemsItem = {
  requestId,
  stepId,
  stepKind: 'NEED',
  state: 'PENDING',
  createdAt: '2026-10-25T03:00:00Z',
  dueAt: '2026-10-28T03:00:00Z',
  ageWorkingDays: 5,
  reminders: 2,
  lastRemindedOn: '2026-10-30'
}
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

function envelope(items: unknown[]) {
  return HttpResponse.json({ success: true, data: { items, pagination } })
}

function mountOperations() {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <SuperAdminOperationsView />
    </QueryClientProvider>
  )
}

function useOperationsHandlers(waitItem: unknown = wait, stepItem: unknown = step) {
  server.use(
    http.get('*/api/v1/controlled-waits', () => envelope([waitItem])),
    http.get('*/api/v1/step-congestion', () =>
      envelope([
        {
          holder: { employeeId: holderId, employeeCode: 'EMP-008', fullName: 'Dana Nguyen' },
          openSteps: 1,
          remindedSteps: 1,
          oldestAgeWorkingDays: 5,
          totalReminders: 2,
          lastRemindedOn: '2026-10-30',
          overThreshold: false
        }
      ])
    ),
    http.get('*/api/v1/step-congestion/steps', ({ request }) => {
      expect(new URL(request.url).searchParams.get('holderEmployeeId')).toBe(holderId)
      return envelope([stepItem])
    }),
    http.get('*/api/v1/step-congestion/incidents', () => envelope([]))
  )
}

it.each([
  ['en', 'Spending approval', 'Needs approval', 'Created', 'Due'],
  ['vi', 'Duyệt chi', 'Duyệt nhu cầu', 'Ngày tạo', 'Hạn xử lý']
] as const)(
  'uses requester and step context without exposing internal IDs in %s',
  async (language, waitKind, stepKind, created, due) => {
    await setAppLanguage(language, false)
    useOperationsHandlers()
    const { container } = mountOperations()
    expect(await screen.findByText('EMP-008')).toBeInTheDocument()
    expect(screen.getAllByText('Dana Nguyen').length).toBeGreaterThan(0)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText(waitKind)).toBeInTheDocument()
    fireEvent.click(screen.getByText(language === 'vi' ? 'Thao tác' : 'Actions'))
    fireEvent.click(screen.getByRole('button', { name: language === 'vi' ? 'Chi tiết' : 'Details' }))
    expect(await screen.findByText(stepKind)).toBeInTheDocument()
    expect(screen.getByText(created)).toBeInTheDocument()
    expect(screen.getByText(due)).toBeInTheDocument()
    for (const id of [requestId, holderId, stepId, departmentId]) expect(container.innerHTML).not.toContain(id)
    for (const code of ['SPEND_APPROVAL', 'FINANCE_REVIEW', 'NO_SPENDING_APPROVER', 'CONFIGURE_SPENDING_APPROVER'])
      expect(container.textContent).not.toContain(code)
  }
)

it('shows a translated fallback for future operation codes', async () => {
  useOperationsHandlers(
    { ...wait, waitingReason: 'FUTURE_WAIT_REASON', stepKind: 'FUTURE_STEP_KIND' },
    { ...step, stepKind: 'NEW_BACKEND_STEP' }
  )
  const { container } = mountOperations()
  await screen.findByText('Engineering')
  fireEvent.click(screen.getByText('Actions'))
  fireEvent.click(screen.getByRole('button', { name: 'Details' }))
  await waitFor(() => expect(screen.getAllByText('Unknown status')).toHaveLength(3))
  for (const code of ['FUTURE_WAIT_REASON', 'FUTURE_STEP_KIND', 'NEW_BACKEND_STEP'])
    expect(container.textContent).not.toContain(code)
})

it('keeps the holder UUID in the incident payload while blocking duplicate saves and preserving failed drafts', async () => {
  useOperationsHandlers()
  let received: unknown
  let calls = 0
  let release: (() => void) | undefined
  server.use(
    http.post('*/api/v1/step-congestion/incidents', async ({ request }) => {
      calls += 1
      received = await request.json()
      await new Promise<void>((resolve) => {
        release = resolve
      })
      return HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR' } }, { status: 422 })
    })
  )
  mountOperations()
  fireEvent.click(await screen.findByText('Actions'))
  fireEvent.click(screen.getByRole('button', { name: 'Record incident' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Description'), { target: { value: ' Waiting on review ' } })
  const form = within(dialog).getByRole('button', { name: 'Save' }).closest('form')
  expect(form).not.toBeNull()
  if (form) {
    fireEvent.submit(form)
    fireEvent.submit(form)
  }
  await waitFor(() => expect(calls).toBe(1))
  expect(received).toEqual({ holderEmployeeId: holderId, description: 'Waiting on review' })
  expect(within(dialog).getByRole('button', { name: 'Saving…' })).toBeDisabled()
  expect(dialog).toHaveAttribute('aria-busy', 'true')
  expect(dialog).not.toHaveTextContent(holderId)
  release?.()
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Save' })).toBeEnabled())
  expect(within(dialog).getByLabelText('Description')).toHaveValue(' Waiting on review ')
  expect(calls).toBe(1)
})
