import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminTransferView } from '../transfer/views/super-admin-transfer-view'

const server = setupServer()
const employeeId = '11111111-1111-4111-8111-111111111111'
const transferId = '22222222-2222-4222-8222-222222222222'
const page = (items: unknown[], current = 1) => ({
  success: true,
  data: { items, pagination: { page: current, pageSize: 20, totalItems: 21, totalPages: 2 } }
})
function renderView() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <SuperAdminTransferView />
    </QueryClientProvider>
  )
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

describe('personnel API integration', () => {
  it('loads real department transfers and requests the next server page', async () => {
    const pages: string[] = []
    server.use(
      http.get('*/api/v1/department-transfers', ({ request }) => {
        const current = new URL(request.url).searchParams.get('page') ?? '1'
        pages.push(current)
        return HttpResponse.json(
          page(
            [
              {
                id: transferId,
                employee: { id: employeeId, employeeCode: 'E-01', fullName: `Person page ${current}` },
                from: { department: { id: 'from', code: 'OPS', name: 'Operations' } },
                to: { department: { id: 'to', code: 'FIN', name: 'Finance' } },
                effectiveOn: '2026-11-02',
                status: 'PENDING'
              }
            ],
            Number(current)
          )
        )
      })
    )
    renderView()
    expect(await screen.findByText('Person page 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: i18n.t('next', { ns: 'admin' }) }))
    expect(await screen.findByText('Person page 2')).toBeInTheDocument()
    expect(pages).toEqual(['1', '2'])
  })

  it('unknown transfer statuses cannot open state-changing actions', async () => {
    server.use(
      http.get('*/api/v1/department-transfers', () =>
        HttpResponse.json(
          page([
            {
              id: transferId,
              employee: { id: employeeId, fullName: 'Future state' },
              from: { department: { id: 'from', code: 'A', name: 'A' } },
              to: { department: { id: 'to', code: 'B', name: 'B' } },
              effectiveOn: '2026-11-02',
              status: 'FUTURE_STATE'
            }
          ])
        )
      )
    )
    renderView()
    expect(await screen.findByText('Future state')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('button', { name: /reschedule/i })).not.toBeInTheDocument())
  })
})
