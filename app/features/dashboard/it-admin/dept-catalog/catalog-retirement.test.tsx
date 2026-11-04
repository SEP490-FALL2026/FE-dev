import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogRetirementConfirmation } from './components/catalog-retirement-confirmation'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('records owner confirmation independently of the irreversible retirement action', async () => {
  await setAppLanguage('en', false)
  let body: unknown
  server.use(
    http.post('*/api/v1/applications/app-1/retirement-confirmations', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  const close = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CatalogRetirementConfirmation
        applicationId='app-1'
        owner={{ employeeId: 'owner-1', fullName: 'Test Owner' }}
        onClose={close}
      />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Confirmation evidence'), {
    target: { value: 'Confirmed today after data export' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Record confirmation' }))
  await waitFor(() =>
    expect(body).toEqual({ businessOwnerEmployeeId: 'owner-1', note: 'Confirmed today after data export' })
  )
  await waitFor(() => expect(close).toHaveBeenCalledOnce())
})
