import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeCatalogHandlers } from '../../../../../test/fixtures/employee-catalog'
import { accessRequest, planId, requestPreview } from '../../../../../test/fixtures/employee-api'
import { ManagerPersonalRequest } from './views/manager-personal-request'

const server = setupServer(...employeeCatalogHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount() {
  const onOpen = vi.fn()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[`/?tab=personal-request&planId=${planId}`]}>
        <ManagerPersonalRequest onOpen={onOpen} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return onOpen
}

it('submits a manager re-request for themselves as a personal request during grace', async () => {
  const sent = vi.fn(),
    group = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/preview', () =>
      HttpResponse.json({
        success: true,
        data: {
          preview: {
            ...requestPreview,
            limitExemption: 'TRANSFER_GRACE',
            existingAccess: { assignmentId: planId },
            canSubmit: true
          }
        }
      })
    ),
    http.post('*/api/v1/access-requests', async ({ request }) => {
      sent(await request.json())
      return HttpResponse.json({ success: true, data: { request: accessRequest } })
    }),
    http.post('*/api/v1/group-requests', () => {
      group()
      return new HttpResponse(null, { status: 400 })
    })
  )
  const open = mount()
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard'))
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Continue in my new department' } })
  fireEvent.click(screen.getByRole('button', { name: 'Review request' }))
  await screen.findByText('Requesting again during your transfer grace period')
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(sent).toHaveBeenCalledWith({ planId, businessReason: 'Continue in my new department' }))
  await waitFor(() => expect(open).toHaveBeenCalledWith(accessRequest.id))
  expect(group).not.toHaveBeenCalled()
})
it('requires another preview when the end date changes and respects duplicate refusals', async () => {
  const send = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/preview', () =>
      HttpResponse.json({
        success: true,
        data: {
          preview: {
            ...requestPreview,
            canSubmit: false,
            limitExemption: 'TRANSFER_GRACE',
            limits: { ...requestPreview.limits, refusal: 'HAS_OPEN_REQUEST' }
          }
        }
      })
    ),
    http.post('*/api/v1/access-requests', () => {
      send()
      return HttpResponse.json({ success: true })
    })
  )
  mount()
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard'))
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Need access' } })
  fireEvent.click(screen.getByRole('button', { name: 'Review request' }))
  await screen.findByText('Requesting again during your transfer grace period')
  expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Expected end date'), { target: { value: '2026-12-20' } })
  expect(screen.queryByText('Requesting again during your transfer grace period')).not.toBeInTheDocument()
  expect(send).not.toHaveBeenCalled()
})
