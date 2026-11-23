import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DepartmentSoftware } from './department-software'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('shows a read-only list and removes a package through the selection screen', async () => {
  const changes: unknown[] = []
  const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
  server.use(
    http.get('*/api/v1/departments/dept/software-list', () =>
      HttpResponse.json({
        data: {
          items: [
            {
              entryId: 'entry',
              applicationId: 'app',
              applicationName: 'Claude',
              planId: 'plan',
              planName: 'Team',
              addedAt: '2026-11-19T00:00:00Z',
              note: null
            }
          ],
          pagination
        }
      })
    ),
    http.get('*/api/v1/plans', () =>
      HttpResponse.json({
        data: {
          items: [
            { id: 'plan', name: 'Team', applicationId: 'app', applicationName: 'Claude' },
            { id: 'new-plan', name: 'Pro', applicationId: 'app', applicationName: 'Claude' }
          ],
          pagination
        }
      })
    ),
    http.post('*/api/v1/departments/dept/software-list/changes', async ({ request }) => {
      changes.push(await request.json())
      return HttpResponse.json({ data: null })
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <DepartmentSoftware departmentId='dept' departmentName='IT' canManage onBack={() => {}} />
    </QueryClientProvider>
  )
  await screen.findByText('Claude · Team')
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Review changes' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Choose packages' }))
  const checkbox = await screen.findByRole('checkbox', { name: 'Claude · Team' })
  await waitFor(() => expect(checkbox).toBeChecked())
  fireEvent.click(checkbox)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Claude · Pro' }))
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() =>
    expect(changes).toEqual([{ add: [{ applicationId: 'app', planId: 'new-plan' }], remove: ['entry'] }])
  )
})

it('allows removing existing suggestions even if the catalogue no longer lists their packages', async () => {
  const changes: unknown[] = []
  const pagination = { page: 1, pageSize: 20, totalItems: 2, totalPages: 1 }
  server.use(
    http.get('*/api/v1/departments/dept/software-list', () =>
      HttpResponse.json({
        data: {
          items: [
            {
              entryId: 'whole',
              applicationId: 'app',
              applicationName: 'Claude',
              planId: null,
              planName: null,
              addedAt: '2026-11-19T00:00:00Z',
              note: null
            },
            {
              entryId: 'old',
              applicationId: 'other',
              applicationName: 'Old',
              planId: 'old-plan',
              planName: 'Retired',
              addedAt: '2026-11-19T00:00:00Z',
              note: null
            }
          ],
          pagination
        }
      })
    ),
    http.get('*/api/v1/plans', () =>
      HttpResponse.json({ data: { items: [], pagination: { ...pagination, totalItems: 0 } } })
    ),
    http.post('*/api/v1/departments/dept/software-list/changes', async ({ request }) => {
      changes.push(await request.json())
      return HttpResponse.json({ data: null })
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <DepartmentSoftware departmentId='dept' departmentName='IT' canManage onBack={() => {}} />
    </QueryClientProvider>
  )
  await screen.findByText('Old · Retired')
  fireEvent.click(screen.getByRole('button', { name: 'Choose packages' }))
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Claude · All packages' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Old · Retired' }))
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() => expect(changes).toEqual([{ remove: ['old', 'whole'] }]))
})
