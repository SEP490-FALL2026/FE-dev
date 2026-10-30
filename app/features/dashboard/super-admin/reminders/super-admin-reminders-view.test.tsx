import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminRemindersView } from './views/super-admin-reminders-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('sends numeric values, preserves failed drafts and prevents duplicate saves', async () => {
  let calls = 0
  let release: (() => void) | undefined
  let received: unknown
  server.use(
    http.get('*/api/v1/operating-parameters', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              key: 'SLA_WORKING_DAYS',
              value: 3,
              default: 3,
              isDefault: true,
              unit: 'days',
              description: '',
              constraints: {},
              changedAt: null
            }
          ]
        }
      })
    ),
    http.put('*/api/v1/operating-parameters/SLA_WORKING_DAYS', async ({ request }) => {
      calls += 1
      received = await request.json()
      await new Promise<void>((resolve) => {
        release = resolve
      })
      return HttpResponse.json(
        { success: false, error: { code: 'PARAMETER.VALUE_INVALID', requestId: 'req-1' } },
        { status: 422 }
      )
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <SuperAdminRemindersView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
  fireEvent.change(screen.getByLabelText('Current value'), { target: { value: '7' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(calls).toBe(1))
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  expect(received).toEqual({ value: 7 })
  release?.()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
  expect(screen.getByLabelText('Current value')).toHaveValue(7)
  expect(calls).toBe(1)
})
