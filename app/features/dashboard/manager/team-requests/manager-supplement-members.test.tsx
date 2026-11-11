import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, planId, requestId, pageResponse, person } from '../../../../../test/fixtures/employee-api'
import { ManagerSpendCorrections } from './components/manager-spend-corrections'

const written = vi.fn()
const reads: number[] = []
const server = setupServer(
  http.get('*/api/v1/access-requests/:id/supplements', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/access-requests/:id/lines', ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page'))
    reads.push(page)
    return HttpResponse.json(
      pageResponse(
        [
          {
            employee: {
              ...person,
              employeeId: page === 1 ? employeeId : planId,
              fullName: page === 1 ? 'Alex' : 'Robin'
            },
            state: 'NEED_CONFIRMED'
          }
        ],
        page,
        2
      )
    )
  }),
  http.post('*/api/v1/access-requests/:id/supplements', async ({ request }) => {
    written(await request.json())
    return HttpResponse.json({ success: true, data: {} })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  written.mockClear()
  reads.length = 0
  await setAppLanguage('en', false)
})

it('loads all member pages, submits the named selection and keeps at least one person', async () => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ManagerSpendCorrections id={requestId} group />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Supplement request' }))
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).queryByRole('textbox', { name: 'People to remove from this request' })).not.toBeInTheDocument()
  const robin = await within(dialog).findByRole('checkbox', { name: /Robin/ })
  expect(reads).toEqual([1, 2])
  fireEvent.click(robin)
  expect(within(dialog).getByRole('checkbox', { name: /Alex/ })).toBeDisabled()
  fireEvent.change(within(dialog).getByLabelText('Reason'), { target: { value: 'Scope reduced' } })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(written).toHaveBeenCalledExactlyOnceWith({ reason: 'Scope reduced', dropEmployeeIds: [planId] })
  )
})

it('shows a recoverable member error and keeps an empty selection from being submitted', async () => {
  server.use(http.get('*/api/v1/access-requests/:id/lines', () => new HttpResponse(null, { status: 503 })))
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ManagerSpendCorrections id={requestId} group />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Supplement request' }))
  const dialog = screen.getByRole('dialog')
  expect(await within(dialog).findByRole('button', { name: 'Retry' })).toBeInTheDocument()
  expect(within(dialog).queryByRole('checkbox')).not.toBeInTheDocument()
  expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(written).not.toHaveBeenCalled()
})
