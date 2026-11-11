import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RequestEventTimeline } from './components/request-event-timeline'
import { groupRequestEvents, type RequestEvent } from './request-event-groups'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
const actor = { employeeId: 'head-1', employeeCode: 'M1', fullName: 'Lê Minh Cường' }
function memberEvent(index: number, overrides: Partial<RequestEvent> = {}): RequestEvent {
  return {
    id: `event-${index}`,
    kind: 'LINE_NEED_DECIDED',
    occurredAt: `2026-11-10T12:30:0${index}.000Z`,
    actor,
    actorKind: 'USER',
    actorRole: 'MANAGER',
    line: {
      employeeId: `employee-${index}`,
      employeeCode: `E${index}`,
      fullName: ['Vũ Quốc Phong', 'Đặng Quốc Huy', 'Lương Hoàng Phi'][index - 1] ?? `Employee ${index}`
    },
    reason: null,
    ...overrides
  }
}
const events: RequestEvent[] = [
  memberEvent(0, {
    id: 'submitted',
    kind: 'SUBMITTED',
    occurredAt: '2026-11-10T12:24:00.000Z',
    line: null,
    actor: { employeeId: 'requester', employeeCode: 'E0', fullName: 'Phạm Thu Dung' }
  }),
  memberEvent(1),
  memberEvent(2, { reason: 'Cần tài khoản cho dự án thiết kế' }),
  memberEvent(3),
  memberEvent(4, { id: 'approved', kind: 'NEED_APPROVED', line: null })
]
const pagination = { page: 1, pageSize: 20, totalItems: events.length, totalPages: 1 }
function mount(groupMemberDecisions = true) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RequestEventTimeline id='request-1' groupMemberDecisions={groupMemberDecisions} />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockResolvedValue({ success: true, data: { items: events, pagination } })
})

it.each([
  {
    language: 'vi',
    title: 'Đã quyết nhu cầu thành viên',
    count: '3 thành viên',
    submitted: 'Đã gửi yêu cầu',
    approved: 'Đã duyệt nhu cầu'
  },
  {
    language: 'en',
    title: 'Group need decided',
    count: '3 members',
    submitted: 'Request submitted',
    approved: 'Need approved'
  }
] as const)(
  'groups the three member decisions into one entry in $language without losing people or reasons',
  async ({ language, title, count, submitted, approved }) => {
    await setAppLanguage(language, false)
    mount()
    const header = await screen.findByText(title)
    expect(screen.getAllByText(title)).toHaveLength(1)
    const row = within(header.closest('li')!)
    expect(row.getByText(count)).toBeInTheDocument()
    expect(row.getAllByText(actor.fullName)).toHaveLength(1)
    for (const event of events.slice(1, 4)) expect(row.getByText(event.line!.fullName)).toBeInTheDocument()
    expect(row.getByText('Cần tài khoản cho dự án thiết kế')).toBeInTheDocument()
    expect(header.closest('li')!.querySelectorAll('time')).toHaveLength(1)
    expect(screen.getByText(submitted)).toBeInTheDocument()
    expect(screen.getByText(approved)).toBeInTheDocument()
    expect(request.mock.calls[0][0].params).toEqual({ page: 1, pageSize: 20 })
  }
)

it('keeps the default shared timeline ungrouped for other screens', async () => {
  mount(false)
  await screen.findAllByText('Group need decided')
  expect(screen.getAllByText('Group need decided')).toHaveLength(3)
  expect(screen.queryByText('3 members')).not.toBeInTheDocument()
})

it.each([
  { label: 'different minutes', patch: { occurredAt: '2026-11-10T12:31:00.000Z' } },
  { label: 'different actors', patch: { actor: { ...actor, employeeId: 'another-head' } } },
  { label: 'different roles', patch: { actorRole: 'SPENDING_APPROVER' } },
  { label: 'different event kinds', patch: { kind: 'LINE_SPEND_DECIDED' as const } },
  { label: 'unknown actors', patch: { actor: null } },
  { label: 'repeated decisions for one person', patch: { line: memberEvent(1).line } }
])('preserves separate history entries for $label', ({ patch }) => {
  expect(groupRequestEvents([memberEvent(1), memberEvent(2, patch)])).toHaveLength(2)
})

it('does not merge across intervening events or mutate the server records', () => {
  const items = Object.freeze([memberEvent(1), memberEvent(0, { kind: 'NEED_APPROVED', line: null }), memberEvent(2)])
  expect(groupRequestEvents(items)).toEqual(items.map((event) => [event]))
  expect(items.map((event) => event.id)).toEqual(['event-1', 'event-0', 'event-2'])
})

it('retains server pagination rather than replacing totals with the grouped row count', async () => {
  request.mockImplementation(async (config) => ({
    success: true,
    data: {
      items:
        config.params.page === 1
          ? events
          : [memberEvent(5, { occurredAt: '2026-11-11T12:30:00.000Z', reason: 'Second page decision' })],
      pagination: { ...pagination, page: config.params.page, totalItems: 21, totalPages: 2 }
    }
  }))
  mount()
  await screen.findByText('3 members')
  expect(screen.getByText('1 / 2')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('Second page decision')).toBeInTheDocument()
  expect(screen.getByText('2 / 2')).toBeInTheDocument()
  expect(screen.queryByText('3 members')).not.toBeInTheDocument()
  await waitFor(() => expect(request.mock.calls.at(-1)![0].params.page).toBe(2))
})
