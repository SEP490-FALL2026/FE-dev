import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogRetirement } from './components/catalog-retirement'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it.each([false, true])('gates retirement using the server blockers (canRetire=%s)', async (canRetire) => {
  await setAppLanguage('en', false)
  const retire = vi.fn()
  server.use(
    http.get('*/api/v1/applications/app-1/retirement', () =>
      HttpResponse.json({
        success: true,
        data: {
          retirement: {
            status: 'APPROVED',
            retiredAt: null,
            blockers: { assignmentTotal: 0, subscriptionTotal: 0 },
            canRetire
          }
        }
      })
    ),
    http.post('*/api/v1/applications/app-1/retire', () => {
      retire()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogRetirement id='app-1' application={undefined} />
    </QueryClientProvider>
  )
  const button = await screen.findByRole('button', { name: 'Retire application permanently' })
  await waitFor(() => (canRetire ? expect(button).toBeEnabled() : expect(button).toBeDisabled()))
  expect(screen.queryByRole('button', { name: 'Record confirmation' })).not.toBeInTheDocument()
  if (canRetire) {
    fireEvent.click(button)
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Retire application permanently' }))
    await waitFor(() => expect(retire).toHaveBeenCalledOnce())
  } else {
    fireEvent.click(button)
    expect(retire).not.toHaveBeenCalled()
  }
})
