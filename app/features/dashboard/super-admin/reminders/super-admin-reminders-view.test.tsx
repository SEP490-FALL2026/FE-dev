import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminRemindersView } from './views/super-admin-reminders-view'

const parameterKeys = [
  'APPROVAL_SLA_WORKING_DAYS',
  'BACKLOG_ALERT_THRESHOLD',
  'ACTIVITY_WINDOW_MINUTES',
  'FISCAL_YEAR_START_MONTH',
  'SPEND_SUBMISSION_WAIT_WORKING_DAYS',
  'TRANSFER_REVIEW_WORKING_DAYS'
] as const
const parameters = parameterKeys.map((key, position) => ({
  key,
  value: position === 1 ? 15 : 2,
  default: position === 1 ? 10 : 2,
  isDefault: position !== 1,
  unit: ['working days', 'steps', 'minutes per day', 'month of the year', 'working days', 'working days'][position],
  description: 'Raw backend description',
  constraints: { kind: 'int', min: 1, max: 30 },
  changedAt: position === 1 ? '2026-11-01T03:00:00Z' : null
}))

function mountParameters() {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <SuperAdminRemindersView />
    </QueryClientProvider>
  )
}

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('sends numeric values, preserves failed drafts and prevents duplicate saves', async () => {
  let calls = 0
  let release: (() => void) | undefined
  let received: unknown
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              key: 'APPROVAL_SLA_WORKING_DAYS',
              value: 3,
              default: 3,
              isDefault: true,
              unit: 'days',
              description: '',
              constraints: { kind: 'int', min: 1, max: 30 },
              changedAt: null
            }
          ]
        }
      })
    ),
    http.put('*/api/v1/operating-parameters/APPROVAL_SLA_WORKING_DAYS', async ({ request }) => {
      calls += 1
      received = await request.json()
      await new Promise<void>((resolve) => {
        release = resolve
      })
      return HttpResponse.json(
        { success: false, error: { code: 'PARAMETER.VALUE_INVALID', requestId: 'req-1' } },
        { status: 422 }
      )
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <SuperAdminRemindersView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
  fireEvent.change(screen.getByLabelText('Current value'), { target: { value: '7' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(calls).toBe(1))
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  expect(received).toEqual({ value: 7 })
  release?.()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
  expect(screen.getByLabelText('Current value')).toHaveValue(7)
  expect(calls).toBe(1)
})

it.each([
  ['vi', 'Thời hạn xử lý phê duyệt', 'Ngày làm việc', 'Đang dùng mặc định', 'Đã tùy chỉnh'],
  ['en', 'Approval processing deadline', 'Working days', 'Using default', 'Customized']
] as const)(
  'localizes parameter names, units and value states in %s',
  async (language, name, unit, defaultState, customState) => {
    await setAppLanguage(language, false)
    server.use(
      http.get('*/api/v1/operating-parameters', () => HttpResponse.json({ success: true, data: { items: parameters } }))
    )
    mountParameters()
    expect(await screen.findByRole('heading', { name })).toBeInTheDocument()
    expect(screen.getAllByText(unit).length).toBeGreaterThan(0)
    expect(screen.getAllByText(defaultState)).toHaveLength(5)
    expect(screen.getByText(customState)).toBeInTheDocument()
    expect(document.querySelector('time[datetime="2026-11-01T03:00:00Z"]')).not.toBeNull()
    expect(screen.queryByText('2026-11-01T03:00:00Z')).not.toBeInTheDocument()
    for (const key of parameterKeys) expect(screen.queryByText(key, { exact: true })).not.toBeInTheDocument()
    for (const rawUnit of ['working days', 'steps', 'minutes per day', 'month of the year'])
      expect(screen.queryByText(rawUnit, { exact: true })).not.toBeInTheDocument()
    expect(screen.queryByText('Raw backend description')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: language === 'vi' ? 'Thời hạn rà soát sau điều chuyển' : 'Post-transfer review deadline'
      })
    ).toBeInTheDocument()
  }
)

it('keeps new API parameters visible with safe label and unit fallbacks', async () => {
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ ...parameters[0], key: 'NEW_PARAMETER', unit: 'unrecognized backend unit' }]
        }
      })
    )
  )
  mountParameters()
  expect(await screen.findByRole('heading', { name: 'Other parameter' })).toBeInTheDocument()
  expect(screen.queryByText('NEW_PARAMETER')).not.toBeInTheDocument()
  expect(screen.getByText('Unit label unavailable')).toBeInTheDocument()
  expect(screen.queryByText('unrecognized backend unit')).not.toBeInTheDocument()
})

it('uses the translated parameter name in editing and history and distinguishes current from previous values', async () => {
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({ success: true, data: { items: [parameters[0]] } })
    ),
    http.get('*/api/v1/operating-parameters/APPROVAL_SLA_WORKING_DAYS/history', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            { value: 2, from: '2026-11-01T03:00:00Z', until: null },
            { value: 3, from: '2026-10-01T03:00:00Z', until: '2026-11-01T03:00:00Z' }
          ],
          hasMore: true
        }
      })
    )
  )
  mountParameters()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
  expect(screen.getByRole('dialog')).toHaveTextContent('Approval processing deadline')
  expect(screen.getByRole('dialog')).not.toHaveTextContent(parameterKeys[0])
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  fireEvent.click(screen.getByRole('button', { name: 'History' }))
  expect(await screen.findByRole('heading', { name: 'History · Approval processing deadline' })).toBeInTheDocument()
  expect(await screen.findByText('Currently applied')).toBeInTheDocument()
  expect(screen.getByText('No longer applied')).toBeInTheDocument()
  expect(screen.getByText('Earlier changes are not included in this response.')).toBeInTheDocument()
})

it('shows labels and groups returned by BE even for new parameter keys', async () => {
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              ...parameters[0],
              key: 'NEW_PARAMETER',
              label: 'Tên mới từ BE',
              group: 'WORKFLOW',
              groupLabel: 'Nhóm từ BE',
              unitLabel: 'ngày từ BE'
            }
          ]
        }
      })
    )
  )
  mountParameters()
  expect(await screen.findByRole('heading', { name: 'Tên mới từ BE' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Nhóm từ BE' })).toBeInTheDocument()
  expect(screen.getByText('ngày từ BE')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
  expect(screen.getByRole('dialog')).toHaveTextContent('Tên mới từ BE')
})

it('uses BE enum labels and sends the selected enum code', async () => {
  let received: unknown
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              ...parameters[0],
              key: 'RULE_SCHEDULE_G1_G2',
              value: 'DAILY',
              default: 'DAILY',
              label: 'Lịch chạy luật',
              constraints: {
                kind: 'enum',
                options: ['DAILY', 'WEEKLY'],
                optionLabels: { DAILY: 'Hằng ngày', WEEKLY: 'Hằng tuần' }
              }
            }
          ]
        }
      })
    ),
    http.put('*/api/v1/operating-parameters/RULE_SCHEDULE_G1_G2', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: true, data: {} })
    })
  )
  mountParameters()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
  fireEvent.click(screen.getByRole('radio', { name: 'Hằng tuần' }))
  expect(screen.getByRole('radio', { name: 'Hằng tuần' })).toBeChecked()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(received).toEqual({ value: 'WEEKLY' }))
})

it('keeps unsupported constraint kinds read only', async () => {
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              ...parameters[0],
              constraints: { kind: 'future' },
              value: { hours: 2 }
            }
          ]
        }
      })
    )
  )
  mountParameters()
  expect(await screen.findByRole('button', { name: 'Edit' })).toBeDisabled()
  expect(screen.getByText('{"hours":2}')).toBeInTheDocument()
})
