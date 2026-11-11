import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { assignmentId, planId } from '../../../../../test/fixtures/employee-api'
import { catalogApplication, catalogPlanDetails } from '../../../../../test/fixtures/employee-catalog'
import { EmployeeSoftwareRights } from './components/employee-software-rights'

const applicationId = '3f6c2a1e-7b4d-4c8e-9a21-000000000501'
const right: MySoftwarePageResponseDtoDataItemsItem = {
  assignmentId,
  application: { id: applicationId, name: 'Granted Software' },
  plan: { id: planId, name: 'Team plan' },
  provisioningType: 'K4',
  status: 'ACTIVE',
  effectiveFrom: '2026-10-01',
  grantedOn: '2026-10-01',
  effectiveFromLabel: null,
  expectedEndDate: '2026-11-08',
  expiringSoon: true,
  validUntil: null,
  successorAssignmentId: null
}
const applicationRequests = vi.fn()
const planRequests = vi.fn()
function rightsResponse(items = [right]) {
  return HttpResponse.json({
    success: true,
    data: {
      asOf: '2026-11-01',
      view: 'current',
      items,
      pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1 }
    }
  })
}
const server = setupServer(
  http.get('*/api/v1/me/software-rights', () => rightsResponse()),
  http.get('*/api/v1/requestable-applications/:id', ({ params }) => {
    applicationRequests(params.id)
    return HttpResponse.json({
      success: true,
      data: {
        ...catalogApplication,
        id: applicationId,
        functionalGroup: { id: applicationId, name: 'Development tools' }
      }
    })
  }),
  http.get('*/api/v1/requestable-plans/:id', ({ params }) => {
    planRequests(params.id)
    return HttpResponse.json({ success: true, data: catalogPlanDetails })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function mount() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <EmployeeSoftwareRights />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
async function openDetails(name = 'Details for Granted Software') {
  const button = await screen.findByRole('button', { name })
  button.focus()
  fireEvent.click(button)
  return { button, drawer: screen.getByRole('dialog') }
}

describe('Employee software right details', () => {
  it.each([
    {
      language: 'en' as const,
      action: 'Details for Granted Software',
      title: 'Software access details',
      close: 'Close details',
      sharing: 'Sharing not allowed'
    },
    {
      language: 'vi' as const,
      action: 'Chi tiết Granted Software',
      title: 'Chi tiết quyền sử dụng',
      close: 'Đóng chi tiết',
      sharing: 'Không cho phép chia sẻ'
    }
  ])(
    'opens from the final action column with localized metadata ($language)',
    async ({ language, action, title, close, sharing }) => {
      await setAppLanguage(language, false)
      mount()
      await screen.findByText('Granted Software')
      expect(applicationRequests).not.toHaveBeenCalled()
      expect(planRequests).not.toHaveBeenCalled()
      fireEvent.click(screen.getByText('Granted Software'))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      const { button, drawer } = await openDetails(action)
      expect(button.closest('td')).toBe(button.closest('tr')?.lastElementChild)
      expect(drawer).toHaveAccessibleName(title)
      expect(drawer).toHaveFocus()
      expect(await within(drawer).findByText('Test Vendor')).toBeInTheDocument()
      expect(await within(drawer).findByText(sharing)).toBeInTheDocument()
      expect(within(drawer).getByText('Development tools')).toBeInTheDocument()
      expect(applicationRequests).toHaveBeenCalledWith(applicationId)
      expect(planRequests).toHaveBeenCalledWith(planId)
      expect(drawer).not.toHaveTextContent(assignmentId)
      expect(drawer).not.toHaveTextContent(/PRICED|FINANCE_SETUP_INCOMPLETE|canSubmit/)
      fireEvent.keyDown(drawer, { key: 'Tab' })
      expect(within(drawer).getByRole('button', { name: close })).toHaveFocus()
      fireEvent.keyDown(drawer, { key: 'Escape' })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(button).toHaveFocus()
      expect(document.body.style.overflow).not.toBe('hidden')
    }
  )

  it.each([403, 404, 409])('keeps assigned access when the application catalog answers %s', async (status) => {
    server.use(
      http.get('*/api/v1/requestable-applications/:id', () =>
        HttpResponse.json({ message: 'private detail' }, { status })
      )
    )
    mount()
    const { drawer } = await openDetails()
    expect(await within(drawer).findByText(/Catalog information is currently unavailable/)).toBeInTheDocument()
    expect(await within(drawer).findByText('Sharing not allowed')).toBeInTheDocument()
    expect(within(drawer).getByText('Active')).toBeInTheDocument()
    expect(within(drawer).getByText('License key')).toBeInTheDocument()
    expect(within(drawer).getByText('Expires within 7 days')).toBeInTheDocument()
    expect(drawer).not.toHaveTextContent('private detail')
    expect(within(drawer).queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('loads each section independently and retries a failed plan without losing the right', async () => {
    let failed = true
    server.use(
      http.get('*/api/v1/requestable-plans/:id', async () => {
        await delay(100)
        return failed
          ? HttpResponse.json({ message: 'private detail' }, { status: 503 })
          : HttpResponse.json({ success: true, data: catalogPlanDetails })
      })
    )
    mount()
    const { drawer } = await openDetails()
    expect(within(drawer).getAllByRole('status').length).toBeGreaterThan(0)
    expect(await within(drawer).findByText('Test Vendor')).toBeInTheDocument()
    expect(await within(drawer).findByRole('alert')).not.toHaveTextContent('private detail')
    expect(within(drawer).getByText('Active')).toBeInTheDocument()
    failed = false
    fireEvent.click(within(drawer).getByRole('button', { name: 'Try again' }))
    expect(await within(drawer).findByText('Sharing not allowed')).toBeInTheDocument()
    expect(applicationRequests).toHaveBeenCalledTimes(1)
  })

  it('shows baseline labels, ended dates and renewal information without inventing a grant date', async () => {
    server.use(
      http.get('*/api/v1/me/software-rights', () =>
        rightsResponse([
          {
            ...right,
            status: 'ENDED',
            grantedOn: null,
            effectiveFromLabel: 'Recorded from baseline; grant date unknown',
            expectedEndDate: null,
            expiringSoon: false,
            validUntil: '2026-11-01',
            successorAssignmentId: planId
          }
        ])
      ),
      http.get('*/api/v1/requestable-applications/:id', () => HttpResponse.json({ success: true, data: null })),
      http.get('*/api/v1/requestable-plans/:id', () => HttpResponse.json({ success: true, data: null }))
    )
    mount()
    const { drawer } = await openDetails()
    expect(within(drawer).getByText('Recorded from baseline; grant date unknown')).toBeInTheDocument()
    expect(within(drawer).getByText('No end date recorded')).toBeInTheDocument()
    expect(within(drawer).getByText('Access ended on')).toBeInTheDocument()
    expect(within(drawer).getByText('A renewal continues this access')).toBeInTheDocument()
    await waitFor(() =>
      expect(within(drawer).getAllByText(/Catalog information is currently unavailable/)).toHaveLength(2)
    )
    expect(within(drawer).queryByText('Expires within 7 days')).not.toBeInTheDocument()
    fireEvent.click(within(drawer).getByRole('button', { name: 'Close details' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('fetches the selected row ids when opening another right', async () => {
    const otherId = '3f6c2a1e-7b4d-4c8e-9a21-000000000502'
    server.use(
      http.get('*/api/v1/me/software-rights', () =>
        rightsResponse([
          right,
          {
            ...right,
            assignmentId: otherId,
            application: { id: otherId, name: 'Other Software' },
            plan: { id: otherId, name: 'Other plan' }
          }
        ])
      )
    )
    mount()
    const first = await openDetails()
    await within(first.drawer).findByText('Test Vendor')
    fireEvent.keyDown(first.drawer, { key: 'Escape' })
    const second = await openDetails('Details for Other Software')
    expect(within(second.drawer).getByText('Other Software')).toBeInTheDocument()
    await waitFor(() => expect(applicationRequests).toHaveBeenLastCalledWith(otherId))
    await waitFor(() => expect(planRequests).toHaveBeenLastCalledWith(otherId))
  })
})
