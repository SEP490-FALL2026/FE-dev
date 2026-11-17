import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AccountInviteDialog } from './components/account-invite-dialog'

const candidates = Array.from({ length: 20 }, (_, index) => ({
  id: `employee-${index + 1}`,
  employeeCode: `CAND-${index + 1}`,
  fullName: `Candidate ${index + 1}`,
  workEmail: `candidate${index + 1}@example.test`,
  department: 'Engineering'
}))
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('shows at most five candidates and can search for and invite someone outside that initial set', async () => {
  await setAppLanguage('en', false)
  let submitted: unknown
  server.use(
    http.get('*/api/v1/account-candidates', ({ request }) => {
      const search = new URL(request.url).searchParams.get('search')
      return HttpResponse.json({ success: true, data: { items: search ? [candidates[13]] : candidates } })
    }),
    http.post('*/api/v1/app-users', async ({ request }) => {
      submitted = await request.json()
      return HttpResponse.json({ success: true, data: null }, { status: 201 })
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <AccountInviteDialog onClose={() => {}} />
    </QueryClientProvider>
  )
  expect(await screen.findAllByRole('radio', { name: /CAND-/ })).toHaveLength(5)
  expect(screen.queryByRole('radio', { name: /CAND-6 / })).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Find employee'), { target: { value: 'Candidate 14' } })
  fireEvent.click(await screen.findByRole('radio', { name: /CAND-14/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Send invitation' }))
  await waitFor(() => expect(submitted).toEqual({ employeeId: 'employee-14', role: 'EMPLOYEE' }))
})
