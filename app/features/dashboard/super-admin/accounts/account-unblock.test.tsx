import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AccountActionDialog } from './components/account-action-dialog'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('can explicitly release a departure block on an active account', async () => {
  await setAppLanguage('en', false)
  let received: unknown
  server.use(
    http.post('*/api/v1/app-users/account-1/unlock', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <AccountActionDialog
        account={{
          id: 'account-1',
          loginEmail: 'alex@example.test',
          status: 'ACTIVE',
          activationState: 'ACTIVATED',
          employee: null,
          roles: ['EMPLOYEE'],
          roleHistory: [],
          roleHistoryHasMore: false,
          invitation: null,
          createdAt: '2026-11-01T00:00:00Z'
        }}
        action='unlock'
        blocked={false}
        onClose={() => {}}
      />
    </QueryClientProvider>
  )
  fireEvent.change(await screen.findByLabelText('Reason'), {
    target: { value: 'Departure cancelled after access block' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(received).toEqual({ reason: 'Departure cancelled after access block' }))
})
