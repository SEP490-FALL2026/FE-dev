import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ContractCreateDialog } from './components/contract-create-dialog'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('blocks a second contract creation when the first response has an unknown outcome', async () => {
  await setAppLanguage('en', false)
  let writes = 0
  server.use(
    http.post('*/api/v1/contracts', () => {
      writes++
      return HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ContractCreateDialog onClose={vi.fn()} onCreated={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Contract name'), { target: { value: 'Annual contract' } })
  fireEvent.click(screen.getByRole('button', { name: 'Create contract' }))
  await screen.findByText(
    'The creation result is uncertain. Check the contract with the administrator before creating it again.'
  )
  const submit = screen.getByRole('button', { name: 'Create contract' })
  expect(submit).toBeDisabled()
  fireEvent.click(submit)
  await waitFor(() => expect(writes).toBe(1))
  expect(screen.getByLabelText('Contract name')).toHaveValue('Annual contract')
})

it('keeps creation unresolved when a successful envelope omits the contract reference', async () => {
  await setAppLanguage('en', false)
  server.use(http.post('*/api/v1/contracts', () => HttpResponse.json({ success: true, data: null })))
  const close = vi.fn(),
    created = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ContractCreateDialog onClose={close} onCreated={created} />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Create contract' }))
  await screen.findByText(
    'The creation result is uncertain. Check the contract with the administrator before creating it again.'
  )
  expect(close).not.toHaveBeenCalled()
  expect(created).not.toHaveBeenCalled()
})
