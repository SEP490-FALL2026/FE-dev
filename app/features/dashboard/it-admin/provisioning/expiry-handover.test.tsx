import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ExpiryHandoverDialog } from './components/expiry-handover'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('shows the designated confirmer and plan notice while blocking confirmation for another role', async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/handover-duties/duty-1', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'duty-1',
          role: 'DEPARTMENT_HEAD',
          status: 'OPEN',
          canConfirm: false,
          dueOn: '2026-11-05',
          confirmer: { fullName: 'Department Head' },
          plan: { id: 'plan-1' },
          noticeText: 'Export workspace data before removal',
          waitingReason: null
        }
      })
    ),
    http.get('*/api/v1/plans/plan-1', () =>
      HttpResponse.json({ success: true, data: { id: 'plan-1', revocationNote: 'Keep the shared project archive' } })
    )
  )
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ExpiryHandoverDialog id='duty-1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Department Head')).toBeInTheDocument()
  expect(await screen.findByText('Keep the shared project archive')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm handover handled' })).toBeDisabled()
})
