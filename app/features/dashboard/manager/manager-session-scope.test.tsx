import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse } from '../../../../test/fixtures/employee-api'
import { managerProfile } from '../../../../test/fixtures/manager-api'
import { ManagerScreen } from './manager-screen'

const server = setupServer(
  http.get(`*/api/v1/departments/${employeeId}`, () =>
    HttpResponse.json({
      success: true,
      data: { id: employeeId, code: 'ENG', name: 'Engineering', status: 'ACTIVE', memberCount: 0, costCenter: null }
    })
  ),
  http.get(`*/api/v1/departments/${employeeId}/employees`, () => HttpResponse.json(pageResponse()))
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

function mount(scope: { departmentId: string; departmentCode: string; departmentName: string } | null) {
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({ success: true, data: { ...managerProfile, managerScope: scope } })
    )
  )
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/dashboard/manager?tab=my-team']}>
        <ManagerScreen tab='my-team' onSelectTab={() => {}} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('loads the signed-in manager department from /me without requiring a department ID in the URL', async () => {
  mount({ departmentId: employeeId, departmentCode: 'ENG', departmentName: 'Engineering' })

  expect(await screen.findByText('No members to display')).toBeInTheDocument()
  expect(screen.queryByText('Link your department to load the list')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Department ID')).not.toBeInTheDocument()
})

it('blocks Manager workspace access when /me has no manager scope', async () => {
  mount(null)

  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(screen.queryByLabelText('Department ID')).not.toBeInTheDocument()
})
