import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { managerProfile } from '../../../../../test/fixtures/manager-api'
import { employeeId, planId } from '../../../../../test/fixtures/employee-api'
import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { ManagerScreen } from '../manager-screen'

const departmentRead = vi.fn()
const profile = {
  ...managerProfile,
  managerScope: null,
  upcomingUnits: [
    {
      departmentId: planId,
      departmentCode: 'NEW',
      departmentName: 'Upcoming department',
      effectiveFrom: '2027-01-01',
      costCenterId: employeeId
    }
  ]
}
const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: profile })),
  http.get('*/api/v1/departments/:id', () => {
    departmentRead()
    return HttpResponse.json({}, { status: 403 })
  }),
  ...managerReadHandlers
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  departmentRead.mockClear()
  await setAppLanguage('en', false)
})

it('allows an assigned future department head to prepare BM-10 without requesting the privileged department record', async () => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[`/dashboard/manager/annual-budget/new?departmentId=${planId}&year=2027`]}>
        <ManagerScreen tab='annual-budget' onSelectTab={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  expect(await screen.findByLabelText('Description')).toBeInTheDocument()
  expect(screen.getByLabelText('Department cost center')).toHaveValue('Upcoming department')
  expect(screen.getByLabelText('Fiscal year')).toHaveValue(2027)
  expect(departmentRead).not.toHaveBeenCalled()
})

it('does not grant current team operations to the future head', async () => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/dashboard/manager/annual-budget/new']}>
        <ManagerScreen tab='my-team' onSelectTab={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  await screen.findByLabelText('Description')
  expect(screen.queryByRole('heading', { name: 'Personnel' })).not.toBeInTheDocument()
  expect(departmentRead).not.toHaveBeenCalled()
})
