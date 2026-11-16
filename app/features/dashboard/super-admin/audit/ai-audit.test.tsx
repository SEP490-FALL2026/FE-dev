import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AiAuditLookup } from './components/ai-audit-lookup'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('reads artificial intelligence content only after explicit submission and preserves the back context', async () => {
  await setAppLanguage('en', false)
  let reads = 0
  server.use(
    http.get('*/api/v1/ai/invocations/:id/content', () => {
      reads++
      return HttpResponse.json({
        success: true,
        data: {
          invocationId: '11111111-1111-4111-8111-111111111111',
          context: {},
          promptText: 'Review the queue',
          rawResponse: null,
          parsed: null,
          result: null
        }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <AiAuditLookup />
    </QueryClientProvider>
  )
  expect(reads).toBe(0)
  fireEvent.change(await screen.findByLabelText('Artificial intelligence call reference'), {
    target: { value: '11111111-1111-4111-8111-111111111111' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Read stored content' }))
  expect(await screen.findByText('Review the queue')).toBeInTheDocument()
  await waitFor(() => expect(reads).toBe(1))
  fireEvent.click(screen.getByRole('button', { name: 'Back to audit search' }))
  expect(screen.getByLabelText('Artificial intelligence call reference')).toHaveValue(
    '11111111-1111-4111-8111-111111111111'
  )
})
