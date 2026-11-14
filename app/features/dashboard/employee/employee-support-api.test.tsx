import { employeeCatalogHandlers, chooseCatalogPlan } from '../../../../test/fixtures/employee-catalog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  assignmentId,
  employeeId,
  pageResponse,
  plan,
  groupCheck,
  planId,
  requestId,
  softwareIssue
} from '../../../../test/fixtures/employee-api'
import { EmployeeLiveCreateView } from './software-request/views/employee-live-create-view'
import { EmployeeIssueDetail } from './saas-issues/views/employee-issue-detail'
import { EmployeeReportIssue } from './saas-issues/views/employee-report-issue'

const server = setupServer(...employeeCatalogHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, url: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
describe('Employee support and group contracts', () => {
  it('selects department candidates from server pages and sends only IDs for the checked people', async () => {
    const check = vi.fn()
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        HttpResponse.json(
          pageResponse([
            { employeeId, fullName: 'Test Colleague', workEmail: 'colleague@example.test' },
            { employeeId: planId, fullName: 'Second Employee', workEmail: 'second@example.test' }
          ])
        )
      ),
      http.post('*/api/v1/group-requests/check', async ({ request }) => {
        check(await request.json())
        return HttpResponse.json({
          success: true,
          data: {
            ...groupCheck,
            lines: [{ employeeId, ok: false, reason: 'HAS_ACCESS' }]
          }
        })
      })
    )
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />, '/?tab=create-request&mode=group')
    await chooseCatalogPlan()
    fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Team development' } })
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Colleague/ }))
    fireEvent.click(screen.getByRole('option', { name: /Second Employee/ }))
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    expect(await screen.findByRole('button', { name: 'Submit request' })).toBeDisabled()
    expect(screen.getByText('Already has access')).toBeInTheDocument()
    expect(screen.getByText('$9,007,199,254,740,993.25')).toBeInTheDocument()
    expect(check).toHaveBeenCalledWith({
      planId,
      businessReason: 'Team development',

      lines: [{ employeeId }, { employeeId: planId }]
    })
  })
  it('blocks a group request when the plan is ineligible even if every person is eligible', async () => {
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        HttpResponse.json(
          pageResponse([
            { employeeId, fullName: 'Test Colleague', workEmail: 'colleague@example.test' },
            { employeeId: planId, fullName: 'Second Employee', workEmail: 'second@example.test' }
          ])
        )
      ),
      http.post('*/api/v1/group-requests/check', () =>
        HttpResponse.json({
          success: true,
          data: { ...groupCheck, plan: { eligible: false, reason: 'KIND_NOT_MULTI_SEAT' } }
        })
      )
    )
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />, '/?tab=create-request&mode=group')
    await chooseCatalogPlan()
    fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Team development' } })
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Colleague/ }))
    fireEvent.click(screen.getByRole('option', { name: /Second Employee/ }))
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    expect(await screen.findByText('This plan does not support multiple seats')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
  })
  it('maps backend field errors to accessible input validation without exposing server messages', async () => {
    server.use(
      http.post('*/api/v1/access-requests/drafts', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Raw internal message',
              requestId: 'test-trace',
              details: { issues: [{ path: 'businessReason' }] }
            }
          },
          { status: 422 }
        )
      )
    )
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />, '/?tab=create-request')
    await chooseCatalogPlan()
    fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Reason' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
    await waitFor(() => expect(screen.getByLabelText(/Business reason/)).toHaveAttribute('aria-invalid', 'true'))
    expect(screen.queryByText('Raw internal message')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Business reason/)).toHaveValue('Reason')
  })
  it('displays the server Retry-After delay and prevents writes during the countdown', async () => {
    let writes = 0
    server.use(
      http.post('*/api/v1/access-requests/drafts', () => {
        writes++
        return HttpResponse.json(
          { success: false, error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
          { status: 429, headers: { 'Retry-After': '5' } }
        )
      })
    )
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />, '/?tab=create-request')
    await chooseCatalogPlan()
    fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Reason' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
    expect(await screen.findByRole('button', { name: /Try again in 5 seconds/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled()
    expect(writes).toBe(1)
  })
  it('blocks another issue submission when a successful response contains no tracking ID', async () => {
    server.use(
      http.get('*/api/v1/saas-issues/options', () =>
        HttpResponse.json({
          success: true,
          data: {
            secretWarning: { code: 'WARNING', message: '' },
            descriptionMaxLength: 2000,
            categories: {},
            impacts: {},
            ...pageResponse([{ assignmentId, plan, grantTaskId: null }]).data
          }
        })
      ),
      http.post('*/api/v1/saas-issues', () => HttpResponse.json({ success: true, data: null }, { status: 201 }))
    )
    const created = vi.fn()
    mount(<EmployeeReportIssue onCreated={created} onBack={vi.fn()} />, '/?tab=report-issue')
    fireEvent.click(await screen.findByRole('radio', { name: 'Test Software · Standard' }))
    fireEvent.change(screen.getByLabelText('Occurred at'), { target: { value: '2026-10-31T09:00' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Cannot sign in' } })
    fireEvent.click(screen.getByRole('button', { name: 'Report issue' }))
    expect(await screen.findByText(/The result is uncertain/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Report issue' })).toBeDisabled()
    expect(created).not.toHaveBeenCalled()
  })
  it('posts an issue reply once and refreshes the conversation only after confirmation', async () => {
    const posted = vi.fn()
    let entriesReads = 0
    server.use(
      http.get('*/api/v1/saas-issues/:id', () => HttpResponse.json({ success: true, data: softwareIssue })),
      http.get('*/api/v1/saas-issues/:id/entries', () => {
        entriesReads++
        return HttpResponse.json(pageResponse())
      }),
      http.post('*/api/v1/saas-issues/:id/messages', async ({ request }) => {
        posted(await request.json())
        return HttpResponse.json({ success: true, data: softwareIssue })
      })
    )
    mount(<EmployeeIssueDetail id={requestId} onBack={vi.fn()} />, '/?tab=issue-detail')
    fireEvent.change(await screen.findByLabelText('Message'), { target: { value: 'Still unable to access' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send reply' }))
    await waitFor(() => expect(posted).toHaveBeenCalledWith({ body: 'Still unable to access' }))
    await waitFor(() => expect(entriesReads).toBeGreaterThan(1))
    expect(screen.getByLabelText('Message')).toHaveValue('')
  })
})
