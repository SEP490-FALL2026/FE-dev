import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { managerId, managerRequest } from '../../../../../test/fixtures/manager-api'
import { managerReadHandlers, needItem } from '../../../../../test/fixtures/manager-integration'
import { ManagerLiveRequest } from './views/manager-live-request'

const written = vi.fn()
const matching = {
  ...needItem,
  stepId: managerRequest.needStep.id,
  planLineRequired: false,
  termConfirmationRequired: false
}
const server = setupServer(
  http.get('*/api/v1/need-decisions', () => HttpResponse.json(pageResponse([matching]))),
  ...managerReadHandlers,
  http.get('*/api/v1/access-requests/:id', () =>
    HttpResponse.json({ success: true, data: { request: managerRequest } })
  ),
  http.get('*/api/v1/access-requests/:id/similar-seats', () => HttpResponse.json(pageResponse())),
  http.post('*/api/v1/access-requests/:id/need-decision', async ({ request }) => {
    written(await request.json())
    return HttpResponse.json({ success: true, data: { request: managerRequest } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  written.mockClear()
  await setAppLanguage('en', false)
})
function mount(client = new QueryClient({ defaultOptions: { queries: { retry: false } } })) {
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/?tab=request-approval&id=${requestId}`]}>
        <ManagerLiveRequest id={requestId} employeeId={managerId} onBack={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
it('resolves direct links without removed requirement controls', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  server.use(http.get('*/api/v1/need-decisions', () => HttpResponse.json(pageResponse([matching]))))
  mount(client)
  await screen.findByRole('radio', { name: 'Approve need' })
  expect(screen.queryByLabelText(/Reason for confirming a term/)).not.toBeInTheDocument()
  expect(screen.queryByRole('combobox', { name: 'Budget plan line' })).not.toBeInTheDocument()
})
it('keeps decisions unavailable after a failed requirements read, then allows retry', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/need-decisions', () =>
      failed ? HttpResponse.json({}, { status: 503 }) : HttpResponse.json(pageResponse([matching]))
    )
  )
  mount()
  const retry = await screen.findByRole('button', { name: 'Retry' })
  expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  expect(written).not.toHaveBeenCalled()
  failed = false
  fireEvent.click(retry)
  expect(await screen.findByRole('radio', { name: 'Approve need' })).toBeInTheDocument()
})
it('does not guess requirements or offer a decision when the step has left the queue', async () => {
  server.use(http.get('*/api/v1/need-decisions', () => HttpResponse.json(pageResponse())))
  mount()
  expect(
    await screen.findByText('No pending need step assigned to you was found. Reload the queue to check.')
  ).toBeInTheDocument()
  expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  expect(written).not.toHaveBeenCalled()
})
it('drops the rejection reason when a single request is changed to approval', async () => {
  mount()
  fireEvent.click(await screen.findByRole('radio', { name: 'Reject need' }))
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Old rejection reason' } })
  fireEvent.click(screen.getByRole('radio', { name: 'Approve need' }))
  expect(screen.queryByLabelText('Reason')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(written).toHaveBeenCalledWith({ decision: 'APPROVE' }))
})
