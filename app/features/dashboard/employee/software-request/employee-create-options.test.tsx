import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, configure, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { getMeSoftwareRightListQueryKey } from '~/shared/api/generated/operations/me/me-software-right-list'
import { accessRequest, assignmentId, planId, requestId } from '../../../../../test/fixtures/employee-api'
import { employeeCatalogHandlers } from '../../../../../test/fixtures/employee-catalog'
import { EmployeeLiveCreateView } from './views/employee-live-create-view'

const secondId = '99999999-9999-4999-8999-999999999999'
const right: MySoftwarePageResponseDtoDataItemsItem = {
  assignmentId,
  application: { id: planId, name: 'Team Software' },
  plan: { id: planId, name: 'Standard' },
  provisioningType: 'K2',
  status: 'ACTIVE',
  effectiveFrom: '2026-01-01',
  grantedOn: '2026-01-01',
  effectiveFromLabel: null,
  expectedEndDate: '2026-11-30',
  expiringSoon: false,
  validUntil: null,
  successorAssignmentId: null
}
function response(items: MySoftwarePageResponseDtoDataItemsItem[], page = 1, totalPages = 1) {
  return {
    success: true,
    data: {
      asOf: '2026-11-05',
      view: 'current',
      items,
      pagination: { page, pageSize: 100, totalItems: items.length, totalPages }
    }
  }
}
const server = setupServer(
  ...employeeCatalogHandlers,
  http.get('*/api/v1/me/software-rights', () => HttpResponse.json(response([right])))
)
beforeAll(() => {
  configure({ asyncUtilTimeout: 5000 })
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => {
  configure({ asyncUtilTimeout: 1000 })
  server.close()
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function CurrentUrl() {
  const location = useLocation()
  return <output data-testid='current-url'>{location.pathname + location.search}</output>
}
function mount(mode = 'return', id = '') {
  const navigate = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter
        initialEntries={[
          `/dashboard/employee?tab=create-request&mode=${mode}&keep=1${id ? `&assignmentId=${id}` : ''}`
        ]}
      >
        <CurrentUrl />
        <EmployeeLiveCreateView onSelectTab={navigate} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return { client, navigate }
}
async function openPicker() {
  const picker = screen.getByRole('combobox', { name: 'Software access' })
  await waitFor(() => expect(picker).toBeEnabled())
  fireEvent.click(picker)
  return picker
}
function fillRenewal() {
  fireEvent.change(screen.getByLabelText('Extension in months'), { target: { value: '3' } })
  fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Continue project work' } })
}
it('switches between request types without displaying the request guide', () => {
  mount('renewal')
  expect(screen.queryByText('How to send a request')).not.toBeInTheDocument()
  expect(screen.queryByText('Before you submit')).not.toBeInTheDocument()
  for (const [label, mode] of [
    ['Individual access', 'individual'],
    ['Group access', 'group'],
    ['Propose new software', 'proposal'],
    ['Renew access', 'renewal'],
    ['Return access', 'return']
  ]) {
    fireEvent.click(screen.getByRole('button', { name: label }))
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('current-url')).toHaveTextContent(`mode=${mode}`)
  }
})
it('removes the service-account tab and redirects old links without opening its drawer', async () => {
  mount('service')
  await screen.findByRole('combobox', { name: 'Software' })
  expect(screen.queryByRole('button', { name: 'Service account' })).not.toBeInTheDocument()
  expect(screen.queryByRole('dialog', { name: 'Service account' })).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Automation purpose')).not.toBeInTheDocument()
  expect(screen.getByTestId('current-url')).toHaveTextContent('mode=individual')
  expect(screen.getByTestId('current-url')).toHaveTextContent('keep=1')
})
it('reads all personal-right pages, searches by software name and sends the selected return ID', async () => {
  const reads: string[] = []
  const written = vi.fn()
  server.use(
    http.get('*/api/v1/me/software-rights', ({ request }) => {
      const params = new URL(request.url).searchParams
      reads.push(params.toString())
      return HttpResponse.json(
        response(
          params.get('page') === '1'
            ? [right]
            : [{ ...right, assignmentId: secondId, application: { id: planId, name: 'Phần mềm khác' } }],
          Number(params.get('page')),
          2
        )
      )
    }),
    http.post('*/api/v1/return-requests', async ({ request }) => {
      written(await request.json())
      return HttpResponse.json({ success: true, data: { returnRequest: { id: requestId } } }, { status: 201 })
    })
  )
  const { navigate } = mount()
  expect(screen.queryByLabelText('Assignment ID')).not.toBeInTheDocument()
  await openPicker()
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search software or plan name' }), {
    target: { value: 'phan mem' }
  })
  fireEvent.click(await screen.findByRole('option', { name: /Phần mềm khác/ }))
  fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'No longer needed' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
  await waitFor(() => expect(written).toHaveBeenCalledWith({ assignmentId: secondId, reason: 'No longer needed' }))
  await waitFor(() => expect(navigate).toHaveBeenCalledWith('return-detail', { id: requestId }))
  expect(reads).toContain('view=current&page=2&pageSize=100')
  expect(reads.every((query) => !query.includes('employeeId'))).toBe(true)
})
it('resolves preselected links on later pages and submits a strict renewal payload', async () => {
  const written = vi.fn()
  server.use(
    http.get('*/api/v1/me/software-rights', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page'))
      return HttpResponse.json(
        response(
          page === 1 ? [right] : [{ ...right, assignmentId: secondId, plan: { id: planId, name: 'Extended' } }],
          page,
          2
        )
      )
    }),
    http.post('*/api/v1/access-requests/renewals', async ({ request }) => {
      written(await request.json())
      return HttpResponse.json({ success: true, data: { request: accessRequest } }, { status: 201 })
    })
  )
  const { navigate } = mount('renewal', secondId)
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software access' })).toHaveTextContent('Extended'))
  expect(screen.getByLabelText('Extension in months')).toHaveAttribute('min', '1')
  fillRenewal()
  fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
  await waitFor(() =>
    expect(written).toHaveBeenCalledWith({
      assignmentId: secondId,
      extensionMonths: 3,
      businessReason: 'Continue project work'
    })
  )
  await waitFor(() => expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId }))
})
it('does not trust an assignment ID in the URL that is absent from personal rights', async () => {
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/renewals', () => {
      written()
      return HttpResponse.json({ success: true })
    })
  )
  mount('renewal', secondId)
  await screen.findByText('The access in this link is no longer selectable. Choose another assignment.')
  expect(screen.getByLabelText('Extension in months')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
  fireEvent.submit(screen.getByRole('button', { name: 'Submit request' }).closest('form')!)
  expect(written).not.toHaveBeenCalled()
  await openPicker()
  fireEvent.click(screen.getByRole('option', { name: /Team Software/ }))
  expect(screen.getByLabelText('Extension in months')).toBeEnabled()
  fillRenewal()
  expect(screen.getByRole('button', { name: 'Submit request' })).toBeEnabled()
})
it('only offers held, time-limited assignments without a successor for renewal', async () => {
  server.use(
    http.get('*/api/v1/me/software-rights', () =>
      HttpResponse.json(
        response([
          right,
          { ...right, assignmentId: secondId, expectedEndDate: null, plan: { id: planId, name: 'No expiry' } },
          { ...right, assignmentId: requestId, status: 'REVOKING', plan: { id: planId, name: 'Revoking plan' } },
          {
            ...right,
            assignmentId: planId,
            successorAssignmentId: secondId,
            plan: { id: planId, name: 'Already continued' }
          },
          { ...right, assignmentId: 'upcoming', status: 'UPCOMING', plan: { id: planId, name: 'Upcoming plan' } },
          { ...right, assignmentId: 'expired', status: 'EXPIRED', plan: { id: planId, name: 'Expired plan' } }
        ])
      )
    )
  )
  mount('renewal')
  await openPicker()
  expect(screen.getAllByRole('option')).toHaveLength(2)
  expect(screen.getByRole('option', { name: /Expired plan/ })).toBeInTheDocument()
  expect(
    screen.queryByRole('option', { name: /No expiry|Revoking plan|Already continued|Upcoming plan/ })
  ).not.toBeInTheDocument()
})
it('allows an assignment without an end date to be selected for return', async () => {
  server.use(
    http.get('*/api/v1/me/software-rights', () => HttpResponse.json(response([{ ...right, expectedEndDate: null }])))
  )
  mount()
  await openPicker()
  fireEvent.click(screen.getByRole('option', { name: /No end date/ }))
  expect(screen.getByRole('button', { name: 'Submit request' })).toBeEnabled()
})
it('keeps an empty renewal form neutral until the dropdown is opened', async () => {
  let finish: () => void = () => undefined
  const pending = new Promise<void>((resolve) => {
    finish = resolve
  })
  server.use(
    http.get('*/api/v1/me/software-rights', async () => {
      await pending
      return HttpResponse.json(response([]))
    })
  )
  mount('renewal')
  expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
  expect(screen.getByLabelText('Extension in months')).toBeDisabled()
  await act(async () => finish())
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software access' })).toBeEnabled())
  expect(
    screen.queryByText('You currently have no software access available to select for renewal.')
  ).not.toBeInTheDocument()
  await openPicker()
  expect(screen.getByText('You currently have no software access available to select for renewal.')).toBeInTheDocument()
  fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
  expect(
    screen.queryByText('You currently have no software access available to select for renewal.')
  ).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
})
it('offers retry on a list error instead of falling back to a UUID text field', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/me/software-rights', () =>
      failed ? new HttpResponse(null, { status: 503 }) : HttpResponse.json(response([right]))
    )
  )
  mount()
  const retry = await screen.findByRole('button', { name: 'Try again' })
  expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
  expect(screen.queryByRole('textbox', { name: 'Assignment ID' })).not.toBeInTheDocument()
  failed = false
  fireEvent.click(retry)
  await openPicker()
  expect(screen.getByRole('option', { name: /Team Software/ })).toBeInTheDocument()
})
it('clears the submitted ID and blocks submission when a selected right disappears on refresh', async () => {
  let available = true
  server.use(http.get('*/api/v1/me/software-rights', () => HttpResponse.json(response(available ? [right] : []))))
  const { client } = mount('renewal', assignmentId)
  await waitFor(() =>
    expect(screen.getByRole('combobox', { name: 'Software access' })).toHaveTextContent('Team Software')
  )
  available = false
  await act(async () => {
    await client.invalidateQueries({ queryKey: getMeSoftwareRightListQueryKey() })
  })
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled())
  await waitFor(() => expect(document.querySelector<HTMLInputElement>('input[name="assignmentId"]')?.value).toBe(''))
})
it('reports a pending renewal from the server without automatically submitting again', async () => {
  const errors = vi.spyOn(toast, 'error')
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/renewals', () => {
      written()
      return HttpResponse.json(
        { success: false, error: { code: 'RENEWAL_REQUEST.ALREADY_REQUESTED' } },
        { status: 409 }
      )
    })
  )
  mount('renewal', assignmentId)
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit request' })).toBeEnabled())
  fillRenewal()
  fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
  await waitFor(() =>
    expect(errors).toHaveBeenCalledWith('This access already has a pending renewal request.', expect.anything())
  )
  expect(written).toHaveBeenCalledOnce()
})

it('lets an expired-access renewal supply a backend-required paid-software justification', async () => {
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/renewals', async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>
      written(body)
      if (!body.manyPaidSoftwareReason)
        return HttpResponse.json(
          {
            error: {
              code: 'ACCESS_REQUEST.MANY_PAID_SOFTWARE_REASON_REQUIRED'
            }
          },
          { status: 422 }
        )
      return HttpResponse.json({ success: true, data: { request: { id: requestId } } })
    })
  )
  const { navigate } = mount('renewal', assignmentId)
  await screen.findByRole('region', { name: 'Selected access' })
  fillRenewal()
  fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
  const reason = await screen.findByLabelText('Reason for using multiple paid applications')
  fireEvent.change(reason, { target: { value: 'Customer environment differs from our internal tools' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
  await waitFor(() => expect(navigate).toHaveBeenCalledWith('request-detail', { id: requestId }))
  expect(written).toHaveBeenLastCalledWith({
    assignmentId,
    extensionMonths: 3,
    businessReason: 'Continue project work',
    manyPaidSoftwareReason: 'Customer environment differs from our internal tools'
  })
})

it('shows the backend renewal opening date next to the selected access and keeps the draft', async () => {
  server.use(
    http.post('*/api/v1/access-requests/renewals', () =>
      HttpResponse.json(
        {
          error: {
            code: 'RENEWAL_REQUEST.WINDOW_NOT_OPEN',
            details: { opensOn: '2026-12-01', windowDays: 30 }
          }
        },
        { status: 409 }
      )
    )
  )
  mount('renewal', assignmentId)
  await screen.findByRole('region', { name: 'Selected access' })
  fillRenewal()
  fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
  expect(await screen.findByText(/Renewal requests open on/)).toBeInTheDocument()
  expect(screen.getByLabelText('Extension in months')).toHaveValue(3)
  expect(screen.getByLabelText('Business reason')).toHaveValue('Continue project work')
})
