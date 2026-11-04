import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminAccountsView } from './views/super-admin-accounts-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

it('opens spending approvers directly and queries their actual account role', async () => {
  await setAppLanguage('en', false)
  const roles: Array<string | null> = []
  server.use(
    http.get('*/api/v1/app-users', ({ request }) => {
      roles.push(new URL(request.url).searchParams.get('role'))
      return HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SuperAdminAccountsView section='responsibilities' />
    </QueryClientProvider>
  )
  expect(screen.getByRole('tab', { name: 'Spending approver' })).toHaveAttribute('aria-selected', 'true')
  await screen.findByText('No matching records')
  expect(roles).toEqual(['SPENDING_APPROVER'])
})

it('opens an account linked from an employee profile and clears its selected URL context on close', async () => {
  await setAppLanguage('en', false)
  const accountId = '33333333-3333-4333-8333-333333333333'
  const onCloseAccount = vi.fn()
  server.use(
    http.get('*/api/v1/app-users', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [],
          pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 }
        }
      })
    ),
    http.get('*/api/v1/app-users/:id', ({ params }) => {
      expect(params.id).toBe(accountId)
      return HttpResponse.json({
        success: true,
        data: {
          id: accountId,
          loginEmail: 'linked@example.invalid',
          status: 'ACTIVE',
          activationState: 'ACTIVATED',
          employee: { id: 'employee', employeeCode: 'EMP-001', fullName: 'Linked employee' },
          roles: ['EMPLOYEE'],
          roleHistory: [],
          roleHistoryHasMore: false,
          invitation: null,
          createdAt: '2026-11-01T00:00:00Z'
        }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SuperAdminAccountsView accountId={accountId} onCloseAccount={onCloseAccount} />
    </QueryClientProvider>
  )
  const dialog = await screen.findByRole('dialog', { name: 'View details' })
  expect(await within(dialog).findByText('linked@example.invalid')).toBeInTheDocument()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
  expect(onCloseAccount).toHaveBeenCalledOnce()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
