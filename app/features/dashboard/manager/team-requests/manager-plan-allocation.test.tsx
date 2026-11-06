import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { requestId } from '../../../../../test/fixtures/employee-api'
import { ManagerNeedForm } from './components/manager-need-form'
const written = vi.fn()
const server = setupServer(
  http.post('*/api/v1/access-requests/:id/need-decision', async ({ request }) => {
    written(await request.json())
    return HttpResponse.json({ success: true, data: null })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  written.mockClear()
  await setAppLanguage('en', false)
})
it('approves without requesting removed plan-line routes or sending allocation fields', async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ManagerNeedForm id={requestId} />
    </QueryClientProvider>
  )
  expect(screen.queryByLabelText('Outside the annual plan')).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/Reason for confirming a term/)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(written).toHaveBeenCalledWith({ decision: 'APPROVE' }))
})
