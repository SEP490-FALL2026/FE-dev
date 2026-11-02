import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  accessRequest,
  employeeProfile,
  pageResponse,
  planId,
  requestId
} from '../../../../../test/fixtures/employee-api'
import {
  catalogPlan,
  catalogPlanDetails,
  chooseCatalogPlan,
  employeeCatalogHandlers
} from '../../../../../test/fixtures/employee-catalog'
import { EmployeeLiveCreateView } from './views/employee-live-create-view'
import { EmployeeScreen } from '../employee-screen'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const server = setupServer(...employeeCatalogHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode = <EmployeeLiveCreateView onSelectTab={vi.fn()} />) {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={['/?tab=create-request&mode=service']}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
async function fill() {
  await chooseCatalogPlan()
  fireEvent.change(screen.getByLabelText('Expected account identifier'), { target: { value: '  ci-build-bot  ' } })
  fireEvent.change(screen.getByLabelText('Automation purpose'), { target: { value: '  Automated builds  ' } })
  fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: '  Build pipeline  ' } })
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '6' } })
}
function review() {
  fireEvent.click(screen.getByRole('button', { name: 'Review service account request' }))
  return within(screen.getByRole('dialog', { name: 'Confirm service account request' })).getByRole('button', {
    name: 'Submit request'
  })
}
it('closes the service-account drawer back to the normal request form with Escape', () => {
  mount()
  fireEvent.keyDown(screen.getByRole('dialog', { name: 'Service account' }), { key: 'Escape' })
  expect(screen.queryByRole('dialog', { name: 'Service account' })).not.toBeInTheDocument()
  expect(screen.getByRole('combobox', { name: 'Software' })).toBeInTheDocument()
})
it('sends a strict service-account payload only after review and blocks duplicate submission', async () => {
  const written = vi.fn()
  const navigate = vi.fn()
  let finish: () => void = () => undefined
  const waiting = new Promise<void>((resolve) => {
    finish = resolve
  })
  server.use(
    http.post('*/api/v1/access-requests/service-accounts', async ({ request }) => {
      written(await request.json())
      await waiting
      return HttpResponse.json(
        { success: true, data: { request: { ...accessRequest, type: 'SERVICE_ACCOUNT' } } },
        { status: 201 }
      )
    })
  )
  mount(<EmployeeLiveCreateView onSelectTab={navigate} />)
  await fill()
  fireEvent.change(screen.getByLabelText('Project label (optional)'), { target: { value: '  CI platform  ' } })
  fireEvent.change(screen.getByLabelText('Expected spend date (optional)'), { target: { value: '2026-11-04' } })
  expect(screen.queryByRole('button', { name: 'Save draft' })).not.toBeInTheDocument()
  const button = review()
  expect(
    within(screen.getByRole('dialog', { name: 'Confirm service account request' })).getByText('ci-build-bot')
  ).toBeInTheDocument()
  expect(written).not.toHaveBeenCalled()
  fireEvent.click(button)
  fireEvent.click(button)
  await waitFor(() =>
    expect(written).toHaveBeenCalledExactlyOnceWith({
      planId,
      purpose: 'Automated builds',
      expectedIdentifier: 'ci-build-bot',
      businessReason: 'Build pipeline',
      termMonths: 6,
      projectLabel: 'CI platform',
      expectedSpendOn: '2026-11-04'
    })
  )
  expect(button).toBeDisabled()
  expect(navigate).not.toHaveBeenCalled()
  finish()
  await waitFor(() => expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId }))
})
it('omits empty optional fields and does not submit spend dates for internal software', async () => {
  const written = vi.fn()
  server.use(
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...catalogPlanDetails,
          provisioningType: 'K5',
          costsMoney: false,
          application: { ...catalogPlanDetails.application, kind: 'INTERNAL' }
        }
      })
    ),
    http.post('*/api/v1/access-requests/service-accounts', async ({ request }) => {
      written(await request.json())
      return HttpResponse.json({ success: true, data: { request: accessRequest } }, { status: 201 })
    })
  )
  mount()
  await fill()
  expect(screen.queryByLabelText('Expected spend date (optional)')).not.toBeInTheDocument()
  fireEvent.click(review())
  await waitFor(() =>
    expect(written).toHaveBeenCalledExactlyOnceWith({
      planId,
      purpose: 'Automated builds',
      expectedIdentifier: 'ci-build-bot',
      businessReason: 'Build pipeline',
      termMonths: 6
    })
  )
})
it.each(['K4', 'FUTURE_TYPE'])('does not submit unsupported provisioning type %s', async (provisioningType) => {
  const written = vi.fn()
  server.use(
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({ success: true, data: { ...catalogPlanDetails, provisioningType } })
    ),
    http.post('*/api/v1/access-requests/service-accounts', () => {
      written()
      return HttpResponse.json({ success: true })
    })
  )
  mount()
  await fill()
  expect(
    screen.getByText(
      'This plan cannot be requested as a service account. Choose a subscription seat or an internal software plan.'
    )
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Review service account request' })).toBeDisabled()
  expect(written).not.toHaveBeenCalled()
})
it('keeps a plan with missing pricing selectable while honoring its submission eligibility', async () => {
  server.use(
    http.get('*/api/v1/requestable-plans', () =>
      HttpResponse.json(
        pageResponse([{ ...catalogPlan, price: { status: 'MISSING', missingReason: 'NO_PRICED_SUBSCRIPTION' } }])
      )
    ),
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({
        success: true,
        data: { ...catalogPlanDetails, price: { status: 'MISSING', missingReason: 'NO_PRICED_SUBSCRIPTION' } }
      })
    )
  )
  mount()
  await fill()
  expect(screen.getByRole('button', { name: 'Review service account request' })).toBeEnabled()
  expect(review()).toBeEnabled()
})
it.each(['list', 'detail'])('honors submission blocks from %s without offering unsupported drafts', async (source) => {
  server.use(
    http.get('*/api/v1/requestable-plans', () =>
      HttpResponse.json(pageResponse([{ ...catalogPlan, canSubmit: source !== 'list' }]))
    ),
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({ success: true, data: { ...catalogPlanDetails, canSubmit: source !== 'detail' } })
    )
  )
  mount()
  await fill()
  expect(screen.getByText('Financial setup is incomplete. Sending is currently unavailable.')).toBeInTheDocument()
  expect(screen.queryByText(/keep this plan in a draft/)).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Review service account request' })).toBeDisabled()
})
it('retains form data when IT has not closed the seat baseline', async () => {
  server.use(
    http.post('*/api/v1/access-requests/service-accounts', () =>
      HttpResponse.json(
        { error: { code: 'SERVICE_ACCOUNT_REQUEST.BASELINE_NOT_CLOSED', message: 'private internal detail' } },
        { status: 409 }
      )
    )
  )
  mount()
  await fill()
  fireEvent.click(review())
  await waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith(
      'IT must finish the initial seat setup before you can request a service account.',
      expect.any(Object)
    )
  )
  expect(screen.queryByText('private internal detail')).not.toBeInTheDocument()
  fireEvent.click(
    within(screen.getByRole('dialog', { name: 'Confirm service account request' })).getByRole('button', {
      name: 'Cancel'
    })
  )
  expect(screen.getByLabelText('Expected account identifier')).toHaveValue('  ci-build-bot  ')
  expect(screen.getByLabelText('Automation purpose')).toHaveValue('  Automated builds  ')
})
it('shows server field validation without losing the submitted input', async () => {
  server.use(
    http.post('*/api/v1/access-requests/service-accounts', () =>
      HttpResponse.json(
        { error: { code: 'VALIDATION_ERROR', details: { issues: [{ path: ['expectedIdentifier'] }] } } },
        { status: 422 }
      )
    )
  )
  mount()
  await fill()
  fireEvent.click(review())
  await waitFor(() => expect(toast.error).toHaveBeenCalled())
  fireEvent.click(
    within(screen.getByRole('dialog', { name: 'Confirm service account request' })).getByRole('button', {
      name: 'Cancel'
    })
  )
  expect(screen.getByLabelText(/Expected account identifier/)).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText(/Expected account identifier/)).toHaveValue('  ci-build-bot  ')
})
it('honors Retry-After without automatically retrying the write', async () => {
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/service-accounts', () => {
      written()
      return HttpResponse.json(
        { error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
        { status: 429, headers: { 'Retry-After': '20' } }
      )
    })
  )
  mount()
  await fill()
  fireEvent.click(review())
  const button = await within(screen.getByRole('dialog', { name: 'Confirm service account request' })).findByRole(
    'button',
    { name: 'Try again in 20 seconds' }
  )
  expect(button).toBeDisabled()
  fireEvent.click(button)
  expect(written).toHaveBeenCalledOnce()
})
it('locks resubmission when a write has an unknown outcome', async () => {
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/service-accounts', () => {
      written()
      return HttpResponse.json({}, { status: 503 })
    })
  )
  mount()
  await fill()
  fireEvent.click(review())
  await waitFor(() =>
    expect(
      within(screen.getByRole('dialog', { name: 'Confirm service account request' })).getByRole('button', {
        name: 'Submit request'
      })
    ).toBeDisabled()
  )
  await waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('result is uncertain'), expect.any(Object))
  )
  fireEvent.click(
    within(screen.getByRole('dialog', { name: 'Confirm service account request' })).getByRole('button', {
      name: 'Submit request'
    })
  )
  expect(written).toHaveBeenCalledOnce()
})
it('rejects blank required text before opening confirmation', async () => {
  mount()
  await fill()
  fireEvent.change(screen.getByLabelText('Automation purpose'), { target: { value: '   ' } })
  fireEvent.click(screen.getByRole('button', { name: 'Review service account request' }))
  expect(screen.queryByRole('dialog', { name: 'Confirm service account request' })).not.toBeInTheDocument()
  expect(screen.getByLabelText(/Automation purpose/)).toHaveAttribute('aria-invalid', 'true')
})
it('does not mount service-account creation for self-service-only employees', async () => {
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({ success: true, data: { ...employeeProfile, selfServiceOnly: true } })
    ),
    http.get('*/api/v1/me/departure-notice', () => HttpResponse.json({ success: true, data: null })),
    http.get('*/api/v1/handover-duties', () => HttpResponse.json(pageResponse()))
  )
  mount(<EmployeeScreen tab='create-request' onSelectTab={vi.fn()} />)
  expect(
    await screen.findByText(
      'Your account is in the handover phase. Only notifications, handovers and your profile are available.'
    )
  ).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Service account' })).not.toBeInTheDocument()
})
