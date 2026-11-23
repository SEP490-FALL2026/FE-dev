import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { getMeDepartmentTransferGetQueryKey } from '~/shared/api/generated/operations/me/me-department-transfer-get'
import { transferNotice } from '../../../test/fixtures/personnel-flows'
import { planId } from '../../../test/fixtures/employee-api'
import { PersonnelNotices } from './components/personnel-notices'

const server = setupServer(
  http.get('*/api/v1/me/department-transfer', () => HttpResponse.json({ success: true, data: null })),
  http.get('*/api/v1/me/departure-notice', () => HttpResponse.json({ success: true, data: null }))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const onRequest = vi.fn()
  render(
    <QueryClientProvider client={client}>
      <PersonnelNotices onRequest={onRequest} />
    </QueryClientProvider>
  )
  return { client, onRequest }
}

it('shows no empty personnel panels when neither event exists', async () => {
  mount()
  await waitFor(() => expect(screen.queryByText('Checking your personnel notices')).not.toBeInTheDocument())
  expect(screen.queryByRole('region')).not.toBeInTheDocument()
})
it('shows the server deadline and opens the exact plan for an old right', async () => {
  server.use(
    http.get('*/api/v1/me/department-transfer', () => HttpResponse.json({ success: true, data: transferNotice }))
  )
  const { onRequest } = mount()
  expect(await screen.findByText('Engineering → Operations')).toBeInTheDocument()
  expect(screen.getByText(/Keep your previous access through/)).toHaveTextContent('20')
  fireEvent.click(screen.getByText('Previous access to review (1)'))
  fireEvent.click(screen.getByRole('button', { name: 'Request Test Software · Standard again' }))
  expect(onRequest).toHaveBeenCalledWith(planId)
})
it('does not offer re-request actions for ended or revoking rights and removes an expired grace', async () => {
  let active = true
  server.use(
    http.get('*/api/v1/me/department-transfer', () =>
      HttpResponse.json({
        success: true,
        data: active
          ? { ...transferNotice, rights: transferNotice.rights.map((right) => ({ ...right, state: 'REVOKING' })) }
          : null
      })
    )
  )
  const { client } = mount()
  await screen.findByText('Engineering → Operations')
  fireEvent.click(screen.getByText('Previous access to review (1)'))
  expect(screen.getByText('Being revoked')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Request .* again/ })).not.toBeInTheDocument()
  active = false
  await client.invalidateQueries({ queryKey: getMeDepartmentTransferGetQueryKey() })
  await waitFor(() => expect(screen.queryByText('Engineering → Operations')).not.toBeInTheDocument())
})
it('retains a loaded departure notice when the transfer query fails and supports retry', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/me/department-transfer', () =>
      failed ? new HttpResponse(null, { status: 503 }) : HttpResponse.json({ success: true, data: null })
    ),
    http.get('*/api/v1/me/departure-notice', () =>
      HttpResponse.json({
        success: true,
        data: { lastWorkingDay: '2026-11-20', state: 'HANDING_OVER', level: 'LEAVING', roleFlags: {} }
      })
    )
  )
  mount()
  expect(await screen.findByText('Your departure notice')).toBeInTheDocument()
  await screen.findByRole('alert')
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  expect(screen.getByText('Your departure notice')).toBeInTheDocument()
})
