import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeCatalogHandlers } from '../../../../../test/fixtures/employee-catalog'
import { accessRequest, pageResponse, planId, requestPreview } from '../../../../../test/fixtures/employee-api'
import { departmentSoftwareEntry } from '../../../../../test/fixtures/personnel-flows'
import { EmployeeLiveCreateView } from './views/employee-live-create-view'

const server = setupServer(...employeeCatalogHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(search = '/?tab=create-request') {
  const onSelectTab = vi.fn()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[search]}>
        <EmployeeLiveCreateView onSelectTab={onSelectTab} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return onSelectTab
}

it('defaults to department software and selects the listed plan from authorized plan details', async () => {
  const catalog = vi.fn()
  server.use(
    http.get('*/api/v1/me/department-software-list', () =>
      HttpResponse.json({
        ...pageResponse([departmentSoftwareEntry]),
        data: { ...pageResponse([departmentSoftwareEntry]).data, departmentId: planId }
      })
    ),
    http.get('*/api/v1/requestable-applications', () => {
      catalog()
      return HttpResponse.json(pageResponse())
    })
  )
  mount()
  expect(screen.getByRole('button', { name: 'Department software' })).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  fireEvent.click(await screen.findByRole('option', { name: /Test Software/ }))
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard'))
  expect(catalog).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  expect(await screen.findByRole('option', { name: /Test Software/ })).toHaveAttribute('aria-selected', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Entire catalog' }))
  fireEvent.click(screen.getByRole('button', { name: 'Department software' }))
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  expect(await screen.findByRole('option', { name: /Test Software/ })).toHaveAttribute('aria-selected', 'true')
})
it('keeps the entire catalog available when the department list is empty', async () => {
  server.use(
    http.get('*/api/v1/me/department-software-list', () =>
      HttpResponse.json({ ...pageResponse(), data: { ...pageResponse().data, departmentId: planId } })
    )
  )
  mount()
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  expect(await screen.findByText('Your department has no software listed yet.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Entire catalog' }))
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  expect(await screen.findByRole('option', { name: /Test Software/ })).toBeInTheDocument()
})
it.each([true, false])('uses server canSubmit for an existing right during grace (allowed=%s)', async (allowed) => {
  const submit = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/preview', () =>
      HttpResponse.json({
        success: true,
        data: {
          preview: {
            ...requestPreview,
            limitExemption: 'TRANSFER_GRACE',
            existingAccess: { assignmentId: planId },
            canSubmit: allowed,
            limits: {
              ...requestPreview.limits,
              refusal: allowed ? null : 'HAS_OPEN_REQUEST',
              openRequestId: allowed ? null : planId
            }
          }
        }
      })
    ),
    http.post('*/api/v1/access-requests', async ({ request }) => {
      submit(await request.json())
      return HttpResponse.json({ success: true, data: { request: accessRequest } })
    })
  )
  mount(`/?tab=create-request&planId=${planId}`)
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard'))
  fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Continue in Operations' } })
  fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
  expect(await screen.findByText('Requesting again during your transfer grace period')).toBeInTheDocument()
  expect(screen.queryByText('You already hold access to this plan.')).not.toBeInTheDocument()
  const send = screen.getByRole('button', { name: 'Submit request' })
  if (allowed) {
    fireEvent.click(send)
    await waitFor(() => expect(submit).toHaveBeenCalledWith({ planId, businessReason: 'Continue in Operations' }))
  } else {
    expect(send).toBeDisabled()
    expect(submit).not.toHaveBeenCalled()
  }
})
