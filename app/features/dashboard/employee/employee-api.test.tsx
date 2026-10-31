import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  accessRequest,
  employeeId,
  employeeProfile,
  pageResponse,
  planId,
  requestId,
  requestPreview
} from '../../../../test/fixtures/employee-api'
import { EmployeeLiveCreateView } from './software-request/views/employee-live-create-view'
import { EmployeeLiveRequestsView } from './my-requests/views/employee-live-requests-view'
import { EmployeeLiveRequestDetail } from './my-requests/views/employee-live-request-detail'
import { EmployeeStatus } from './shared/components/employee-api-ui'
import { EmployeeScreen } from './employee-screen'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, url = '/?tab=create-request') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  const view = render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
  return { ...view, client }
}
function fillIndividual() {
  fireEvent.change(screen.getByLabelText('Plan ID supplied by IT'), { target: { value: planId } })
  fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Development work' } })
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '3' } })
}
describe('Employee API workflows', () => {
  it('previews before submission, sends only contract fields and blocks double submission', async () => {
    let resolveSubmission: () => void = () => undefined
    const pending = new Promise<void>((resolve) => {
      resolveSubmission = resolve
    })
    const submitted = vi.fn()
    const previewed = vi.fn()
    server.use(
      http.post('*/api/v1/access-requests/preview', async ({ request }) => {
        previewed(await request.json())
        return HttpResponse.json({ success: true, data: { preview: requestPreview } })
      }),
      http.post('*/api/v1/access-requests', async ({ request }) => {
        submitted(await request.json())
        await pending
        return HttpResponse.json({ success: true, data: { request: accessRequest } }, { status: 201 })
      })
    )
    const navigate = vi.fn()
    mount(<EmployeeLiveCreateView onSelectTab={navigate} />)
    fillIndividual()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    const submit = await screen.findByRole('button', { name: 'Submit request' })
    expect(previewed).toHaveBeenCalledWith({ planId, termMonths: 3 })
    expect(screen.getByText('$9,007,199,254,740,993.25')).toBeInTheDocument()
    fireEvent.click(submit)
    await waitFor(() => expect(submit).toBeDisabled())
    fireEvent.click(submit)
    await waitFor(() => expect(submitted).toHaveBeenCalledTimes(1))
    expect(submitted).toHaveBeenCalledWith({ planId, termMonths: 3, businessReason: 'Development work' })
    expect(navigate).not.toHaveBeenCalled()
    resolveSubmission()
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId }))
  })
  it('does not redirect a user who leaves the form before submission finishes', async () => {
    let finish: () => void = () => undefined
    const pending = new Promise<void>((resolve) => {
      finish = resolve
    })
    let received = false
    server.use(
      http.post('*/api/v1/access-requests/preview', () =>
        HttpResponse.json({ success: true, data: { preview: requestPreview } })
      ),
      http.post('*/api/v1/access-requests', async () => {
        received = true
        await pending
        return HttpResponse.json({ success: true, data: { request: accessRequest } }, { status: 201 })
      })
    )
    const navigate = vi.fn()
    const view = mount(<EmployeeLiveCreateView onSelectTab={navigate} />)
    fillIndividual()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Submit request' }))
    await waitFor(() => expect(received).toBe(true))
    view.unmount()
    finish()
    await waitFor(() => expect(view.client.isMutating()).toBe(0))
    expect(navigate).not.toHaveBeenCalled()
  })
  it('requires a fresh preview after the form changes and honors canSubmit=false', async () => {
    server.use(
      http.post('*/api/v1/access-requests/preview', () =>
        HttpResponse.json({ success: true, data: { preview: { ...requestPreview, canSubmit: false } } })
      )
    )
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />)
    fillIndividual()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    expect(await screen.findByRole('button', { name: 'Submit request' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '6' } })
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Submit request' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Preview request' })).toBeEnabled()
  })
  it('retains input and prevents resubmission after an uncertain write outcome', async () => {
    let calls = 0
    server.use(
      http.post('*/api/v1/access-requests/proposals', () => {
        calls++
        return HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE', requestId: 'trace-test' } }, { status: 503 })
      })
    )
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />, '/?tab=create-request&mode=proposal')
    for (const [label, value] of [
      ['Software name', 'Test Tool'],
      ['Homepage', 'https://example.test'],
      ['Purpose', 'Collaboration'],
      ['Data to be processed', 'Public documentation']
    ])
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
    expect(await screen.findByText(/The result is uncertain/)).toBeInTheDocument()
    expect(screen.getByLabelText('Software name')).toHaveValue('Test Tool')
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
    expect(calls).toBe(1)
  })
  it('submits a draft with an empty body and reads server pagination', async () => {
    const submitted = vi.fn()
    const pages: number[] = []
    server.use(
      http.get('*/api/v1/access-requests/drafts', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'))
        pages.push(page)
        return HttpResponse.json(
          pageResponse(
            [
              {
                id: requestId,
                kind: 'INDIVIDUAL',
                planId,
                departmentId: employeeId,
                beneficiaryCount: 1,
                createdAt: '2026-10-31T03:00:00Z'
              }
            ],
            page,
            2
          )
        )
      }),
      http.post('*/api/v1/access-requests/drafts/:id/submission', async ({ request }) => {
        submitted(await request.json())
        return HttpResponse.json({ success: true, data: { request: accessRequest } }, { status: 201 })
      })
    )
    const navigate = vi.fn()
    mount(<EmployeeLiveRequestsView onSelectTab={navigate} />, '/?tab=my-requests')
    fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
    await waitFor(() => expect(pages).toContain(2))
    fireEvent.click(await screen.findByRole('button', { name: 'Submit draft' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(submitted).toHaveBeenCalledWith({}))
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId }))
  })
  it('does not submit a draft whose business kind is not recognized', async () => {
    server.use(
      http.get('*/api/v1/access-requests/drafts', () =>
        HttpResponse.json(
          pageResponse([
            {
              id: requestId,
              kind: 'FUTURE_KIND',
              planId,
              departmentId: employeeId,
              beneficiaryCount: 1,
              createdAt: '2026-10-31T03:00:00Z'
            }
          ])
        )
      )
    )
    mount(<EmployeeLiveRequestsView onSelectTab={vi.fn()} />, '/?tab=my-requests')
    expect(await screen.findByText('Unsupported status')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit draft' })).toBeDisabled()
  })
  it('uses actual request state, handles unknown states safely and offers no withdrawal', async () => {
    server.use(
      http.get('*/api/v1/access-requests/:id', () =>
        HttpResponse.json({ success: true, data: { request: { ...accessRequest, state: 'FUTURE_STATE' } } })
      ),
      http.get('*/api/v1/access-requests/:id/timings', () => HttpResponse.json({ success: true, data: null }))
    )
    mount(<EmployeeLiveRequestDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
    expect(await screen.findByText('Unsupported status')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Withdraw request' })).not.toBeInTheDocument()
  })
  it('loads personal data from /me and suppresses business calls for self-service-only sessions', async () => {
    server.use(
      http.get('*/api/v1/me', () =>
        HttpResponse.json({ success: true, data: { ...employeeProfile, selfServiceOnly: true } })
      ),
      http.get('*/api/v1/me/departure-notice', () => HttpResponse.json({ success: true, data: null })),
      http.get('*/api/v1/handover-duties', () => HttpResponse.json(pageResponse())),
      http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread: 0 } }))
    )
    mount(<EmployeeScreen tab='create-request' onSelectTab={vi.fn()} />)
    expect(await screen.findByRole('heading', { name: 'Test Employee' })).toBeInTheDocument()
    expect(screen.getByText(/Your account is in the handover phase/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Create request' })).not.toBeInTheDocument()
  })
  it('shows a safe fallback for a status absent from the contract', () => {
    mount(<EmployeeStatus value='FUTURE_STATUS' />)
    expect(screen.getByText('Unsupported status')).toBeInTheDocument()
    expect(screen.queryByText('FUTURE_STATUS')).not.toBeInTheDocument()
  })
  it('refreshes both request status and processing timeline after withdrawal', async () => {
    let withdrawn = false
    let timingsReads = 0
    server.use(
      http.get('*/api/v1/access-requests/:id', () =>
        HttpResponse.json({
          success: true,
          data: { request: { ...accessRequest, state: withdrawn ? 'WITHDRAWN' : 'PENDING' } }
        })
      ),
      http.get('*/api/v1/access-requests/:id/timings', () => {
        timingsReads++
        return HttpResponse.json({ success: true, data: null })
      }),
      http.post('*/api/v1/access-requests/:id/withdraw', () => {
        withdrawn = true
        return HttpResponse.json({ success: true, data: { request: { ...accessRequest, state: 'WITHDRAWN' } } })
      })
    )
    mount(<EmployeeLiveRequestDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Withdraw request' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Withdraw request' }))
    expect(await screen.findByText('Withdrawn')).toBeInTheDocument()
    await waitFor(() => expect(timingsReads).toBeGreaterThan(1))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
  it('shows a recoverable missing-record state for a detail URL without an ID', async () => {
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: employeeProfile })))
    const navigate = vi.fn()
    mount(<EmployeeScreen tab='request-detail' onSelectTab={navigate} />, '/?tab=request-detail')
    expect(
      await screen.findByRole('heading', { name: 'No record was found within your permitted scope.' })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(navigate).toHaveBeenCalledWith('my-requests')
  })
})
