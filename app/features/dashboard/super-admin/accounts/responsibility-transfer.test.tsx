import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ResponsibilityTransfer } from './components/responsibility-transfer'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
const page = (items: unknown[]) => ({
  success: true,
  data: { items, pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1 } }
})
it('transfers responsibility using authorized department software and current administrators', async () => {
  await setAppLanguage('en', false)
  let received: unknown
  server.use(
    http.get('*/api/v1/departments', () => HttpResponse.json(page([{ id: 'dept-1', name: 'Engineering' }]))),
    http.get('*/api/v1/it-admins', () =>
      HttpResponse.json(page([{ employeeId: 'employee-1', fullName: 'Alex', employeeCode: 'EMP-001' }]))
    ),
    http.get('*/api/v1/departments/dept-1/software-list', () =>
      HttpResponse.json(page([{ entryId: 'entry-1', applicationId: 'app-1', applicationName: 'Figma' }]))
    ),
    http.post('*/api/v1/applications/app-1/responsibility-transfer', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ResponsibilityTransfer onClose={() => {}} />
    </QueryClientProvider>
  )
  fireEvent.change(await screen.findByLabelText('Department using the application'), { target: { value: 'dept-1' } })
  fireEvent.change(await screen.findByLabelText('Application to transfer'), { target: { value: 'app-1' } })
  fireEvent.change(await screen.findByLabelText('Receiving administrator'), { target: { value: 'employee-1' } })
  expect(screen.getByLabelText('Application to transfer')).toHaveAccessibleDescription()
  fireEvent.click(screen.getByRole('button', { name: 'Save new administrator' }))
  await waitFor(() => expect(received).toEqual({ toItAdminEmployeeId: 'employee-1' }))
})
