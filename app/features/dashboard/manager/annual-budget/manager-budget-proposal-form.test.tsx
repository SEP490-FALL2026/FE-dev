import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { ManagerBudgetForm } from './views/manager-budget-form'

const server = setupServer(...managerReadHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('submits the exact unformatted requested amount with selected BM-10 files', async () => {
  await setAppLanguage('vi', false)
  const submitted = vi.fn()
  server.use(
    http.get('*/api/v1/budget-attachments/mine', () =>
      HttpResponse.json(
        pageResponse([
          {
            id: requestId,
            target: 'PROPOSAL',
            status: 'UPLOADED',
            fileName: 'BM-10.xlsx',
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            sizeBytes: 100,
            versionId: null,
            createdAt: '2026-11-01T00:00:00Z',
            expiresAt: '2099-01-01T00:00:00Z'
          }
        ])
      )
    ),
    http.post('*/api/v1/budget-proposals', async ({ request }) => {
      submitted(await request.json())
      return HttpResponse.json({ success: true, data: {} }, { status: 201 })
    })
  )
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/dashboard/manager/annual-budget/new?year=2027']}>
        <ManagerBudgetForm costCenterId={employeeId} costCenterName='Engineering' />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.focus(screen.getByRole('textbox', { name: 'Số tiền' }))
  fireEvent.input(screen.getByRole('textbox', { name: 'Số tiền' }), { target: { value: '9007199254740993' } })
  fireEvent.blur(screen.getByRole('textbox', { name: 'Số tiền' }))
  expect(screen.getByRole('textbox', { name: 'Số tiền' })).toHaveValue('9.007.199.254.740.993')
  fireEvent.click(await screen.findByRole('checkbox', { name: /BM-10.xlsx/ }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Gửi' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Gửi' }))
  await waitFor(() =>
    expect(submitted).toHaveBeenCalledWith({
      year: 2027,
      costCenterId: employeeId,
      requestedAmount: { amount: '9007199254740993' },
      attachmentIds: [requestId]
    })
  )
  expect(submitted).toHaveBeenCalledOnce()
  client.clear()
})
