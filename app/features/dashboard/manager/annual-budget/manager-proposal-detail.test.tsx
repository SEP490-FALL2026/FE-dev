import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import type { ProposalLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-proposals/proposalLinePageResponseDtoDataItemsItem'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { proposal } from '../../../../../test/fixtures/manager-api'
import { ManagerProposalDetail } from './components/manager-proposal-detail'

const longName = `${'vendor-quote-2028-'.repeat(9)}.pdf`
const fileId = '99999999-9999-4999-8999-999999999999'
const line: ProposalLinePageResponseDtoDataItemsItem = {
  position: 1,
  description: 'Software for the engineering department with a long description that must remain readable',
  planId: null,
  seats: 12,
  amount: { amount: '450000000', currency: 'VND' },
  note: 'Supporting context\nSecond line',
  lineType: 'NEW',
  priorityRank: 1,
  overCeiling: null,
  zbb: {
    purpose: 'Improve delivery',
    alternatives: 'Keep current tooling',
    consequenceIfNot: 'Manual work',
    usageIndicator: 'Weekly active users'
  }
}
const document = {
  id: fileId,
  fileName: longName,
  contentType: 'application/pdf',
  sizeBytes: 2048,
  status: 'ATTACHED',
  uploadedBy: null,
  attachedAt: '2026-10-31T03:00:00Z',
  removedAt: null
}
const server = setupServer(
  http.get('*/api/v1/budget-proposals/:id', () =>
    HttpResponse.json({
      success: true,
      data: {
        proposal: {
          ...proposal,
          state: 'REVIEWED',
          total: { amount: '500000000', currency: 'VND' }
        }
      }
    })
  ),
  http.get('*/api/v1/budget-proposals/:id/lines', () => HttpResponse.json(pageResponse([line]))),
  http.get('*/api/v1/budget-proposals/:id/attachments', () => HttpResponse.json(pageResponse([document])))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
function Location() {
  const location = useLocation()
  return (
    <output data-testid='location'>
      {location.pathname}
      {location.search}
    </output>
  )
}
function Subject() {
  const location = useLocation()
  return (
    <>
      {new URLSearchParams(location.search).has('proposalId') && <ManagerProposalDetail id={requestId} />}
      <Location />
    </>
  )
}
function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter
        initialEntries={[`/dashboard/manager?tab=annual-budget&year=2027&proposalId=${requestId}&linePage=1`]}
      >
        <Subject />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it.each([
  {
    language: 'en' as const,
    title: 'Budget proposal',
    lines: 'Proposed items',
    total: 'Total proposed budget',
    close: 'Close'
  },
  {
    language: 'vi' as const,
    title: 'Đề xuất ngân sách',
    lines: 'Các khoản đề xuất',
    total: 'Tổng ngân sách đề xuất',
    close: 'Đóng'
  }
])(
  'presents the server summary, full item content and attachments in $language',
  async ({ language, title, lines, total, close }) => {
    await setAppLanguage(language, false)
    mount()
    const drawer = screen.getByRole('dialog', { name: title })
    expect(await within(drawer).findByText('Engineering')).toBeInTheDocument()
    expect(within(drawer).getByText('2027')).toBeInTheDocument()
    expect(within(drawer).getByText(proposal.submittedBy?.fullName ?? '')).toBeInTheDocument()
    expect(within(drawer).getByText(total).nextElementSibling).toHaveTextContent(
      language === 'en' ? '500,000,000' : '500.000.000'
    )
    const items = within(drawer).getByRole('region', { name: lines })
    expect(await within(items).findByText(line.description)).toBeInTheDocument()
    expect(within(items).getByText('Supporting context Second line')).toBeInTheDocument()
    expect(within(items).getByText('Improve delivery')).toBeInTheDocument()
    expect(await within(drawer).findByText(longName)).toHaveAttribute('title', longName)
    expect(within(drawer).getByRole('button', { name: new RegExp(longName.slice(0, 25)) })).toBeEnabled()
    fireEvent.click(within(drawer).getByRole('button', { name: close }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('tab=annual-budget&year=2027')
    expect(screen.getByTestId('location')).not.toHaveTextContent('proposalId')
    expect(screen.getByTestId('location')).not.toHaveTextContent('linePage')
  }
)

it('keeps the return reason visible and navigates to revision only when eligible', async () => {
  server.use(
    http.get('*/api/v1/budget-proposals/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          proposal: {
            ...proposal,
            state: 'RETURNED',
            returned: { reason: 'Please explain the seat count', by: null, at: proposal.submittedAt }
          }
        }
      })
    )
  )
  mount()
  expect(await screen.findByText('Please explain the seat count')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Withdraw' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit revised proposal' }))
  expect(screen.getByTestId('location')).toHaveTextContent(`/dashboard/manager/annual-budget/${requestId}/revise`)
})

it('preserves confirmation, blocks closing while withdrawing, and refreshes the state', async () => {
  const withdraw = vi.fn()
  let withdrawn = false
  server.use(
    http.get('*/api/v1/budget-proposals/:id', () =>
      HttpResponse.json({
        success: true,
        data: { proposal: { ...proposal, state: withdrawn ? 'WITHDRAWN' : 'REVIEWED' } }
      })
    ),
    http.post('*/api/v1/budget-proposals/:id/withdrawal', async () => {
      withdraw()
      await delay(150)
      withdrawn = true
      return HttpResponse.json({ success: true, data: { proposal: { ...proposal, state: 'WITHDRAWN' } } })
    })
  )
  mount()
  const button = await screen.findByRole('button', { name: 'Withdraw' })
  expect(button.closest('footer')).toBeInTheDocument()
  fireEvent.click(button)
  const confirmation = screen.getByRole('dialog', { name: 'Withdraw' })
  fireEvent.click(within(confirmation).getByRole('button', { name: 'Cancel' }))
  expect(withdraw).not.toHaveBeenCalled()
  fireEvent.click(button)
  const reopened = screen.getByRole('dialog', { name: 'Withdraw' })
  fireEvent.click(within(reopened).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(withdraw).toHaveBeenCalledOnce())
  const drawer = screen.getByRole('dialog', { name: 'Budget proposal' })
  expect(within(drawer).getAllByRole('button', { name: 'Close' })[0]).toBeDisabled()
  fireEvent.keyDown(drawer, { key: 'Escape' })
  expect(drawer).toBeInTheDocument()
  expect(await screen.findByText('Withdrawn')).toBeInTheDocument()
  expect(screen.queryByRole('dialog', { name: 'Withdraw' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Withdraw' })).not.toBeInTheDocument()
})

it('uses the server item total and keeps line pagination independent of the proposal summary', async () => {
  server.use(
    http.get('*/api/v1/budget-proposals/:id/lines', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page'))
      return HttpResponse.json({
        success: true,
        data: {
          items: [{ ...line, description: `Page ${page} item`, position: page }],
          pagination: { page, pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  mount()
  expect(await screen.findByText('21 items')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('Page 2 item')).toBeInTheDocument()
  expect(screen.getByText('Engineering')).toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('linePage=2')
})

it('preserves file downloads and allows retrying a line failure without hiding the summary', async () => {
  let failed = true
  const linked = vi.fn()
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
  server.use(
    http.get('*/api/v1/budget-proposals/:id/lines', () =>
      failed
        ? HttpResponse.json({ message: 'private error' }, { status: 503 })
        : HttpResponse.json(pageResponse([line]))
    ),
    http.post('*/api/v1/budget-attachments/:id/links', () => {
      linked()
      return HttpResponse.json({
        success: true,
        data: { url: 'https://storage.example.test/download', expiresAt: '2099-01-01T00:00:00Z' }
      })
    })
  )
  mount()
  expect(await screen.findByRole('alert')).not.toHaveTextContent('private error')
  expect(screen.getByText('Engineering')).toBeInTheDocument()
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText(line.description)).toBeInTheDocument()
  fireEvent.click(await screen.findByRole('button', { name: `Download: ${longName}` }))
  await waitFor(() => expect(click).toHaveBeenCalledOnce())
  expect(linked).toHaveBeenCalledOnce()
})
