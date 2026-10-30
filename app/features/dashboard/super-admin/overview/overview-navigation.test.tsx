import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useNavigate, useSearchParams } from 'react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminScreen } from '../super-admin-screen'
import { isValidSuperAdminTab } from '../super-admin-nav'

const server = setupServer()
const browserBackLabel = 'Browser back'
const departmentId = '11111111-1111-4111-8111-111111111111'
const department = {
  id: departmentId,
  code: 'OPS',
  name: 'Operations',
  function: null,
  status: 'ACTIVE',
  costCenter: null,
  itAdmin: null,
  head: null,
  memberCount: 5,
  warnings: [],
  successor: null,
  headHistory: [],
  headHistoryHasMore: false,
  projects: [],
  projectTotal: 0,
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
  deactivatedAt: null
}
const page = (items: unknown[]) => ({
  items,
  pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: items.length ? 1 : 0 }
})
function Harness() {
  const navigate = useNavigate()
  const [parameters, setParameters] = useSearchParams()
  const tab = parameters.get('tab')
  return (
    <>
      <button type='button' onClick={() => void navigate(-1)}>
        {browserBackLabel}
      </button>
      {
        <SuperAdminScreen
          tab={isValidSuperAdminTab(tab) ? tab : 'overview'}
          onSelectTab={(next, extra) => setParameters({ tab: next, ...extra })}
        />
      }
    </>
  )
}
function mount(url = '/dashboard/super-admin') {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[url]}>
        <Harness />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('resolves a warning department code through the API and opens its actual detail', async () => {
  let requestedSearch: string | null = null
  server.use(
    http.get('*/api/v1/onboarding-checklist', () =>
      HttpResponse.json({
        success: true,
        data: {
          steps: [
            {
              step: 1,
              key: 'ORGANIZATION',
              status: 'DONE',
              reasons: [],
              warnings: [{ code: 'MISSING_HEAD', departmentCode: 'OPS', departmentName: 'Operations' }]
            }
          ]
        }
      })
    ),
    http.get('*/api/v1/super-admin-watch', () =>
      HttpResponse.json({ success: true, data: { status: 'HEALTHY', reasons: {}, warnings: {}, holder: null } })
    ),
    http.get('*/api/v1/departments', ({ request }) => {
      requestedSearch = new URL(request.url).searchParams.get('search')
      return HttpResponse.json({ success: true, data: page([department]) })
    }),
    http.get(`*/api/v1/departments/${departmentId}`, () => HttpResponse.json({ success: true, data: department })),
    http.get(`*/api/v1/departments/${departmentId}/employees`, () =>
      HttpResponse.json({ success: true, data: page([]) })
    )
  )
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Review Operations' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Operations' })).toBeInTheDocument()
  expect(requestedSearch).toBe('OPS')
  fireEvent.click(screen.getByRole('button', { name: 'Back to departments' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Organization' })).toBeInTheDocument()
  await waitFor(() => expect(screen.getByLabelText('Search departments')).toHaveValue('OPS'))
})

it('opens the import panel directly from a contextual personnel link', async () => {
  mount('/dashboard/super-admin?tab=personnel&section=imports')
  expect(await screen.findByLabelText('Employee file')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Employee import' })).toHaveAttribute('aria-pressed', 'true')
})

it('resolves an exact department code beyond the first filtered server page', async () => {
  const requestedPages: number[] = []
  server.use(
    http.get('*/api/v1/departments', ({ request }) => {
      const pageNumber = Number(new URL(request.url).searchParams.get('page') ?? 1)
      requestedPages.push(pageNumber)
      return HttpResponse.json({
        success: true,
        data: {
          items:
            pageNumber === 1
              ? [{ ...department, id: 'other', code: 'OPS-OTHER', name: 'Other operations' }]
              : [department],
          pagination: { page: pageNumber, pageSize: 100, totalItems: 101, totalPages: 2 }
        }
      })
    }),
    http.get(`*/api/v1/departments/${departmentId}`, () => HttpResponse.json({ success: true, data: department })),
    http.get(`*/api/v1/departments/${departmentId}/employees`, () =>
      HttpResponse.json({ success: true, data: page([]) })
    )
  )
  mount('/dashboard/super-admin?tab=departments&departmentCode=OPS')
  expect(await screen.findByRole('heading', { level: 1, name: 'Operations' })).toBeInTheDocument()
  expect(requestedPages).toEqual([1, 2])
})

it('restores the department from URL context when browser history returns from another detail', async () => {
  const finance = { ...department, id: '22222222-2222-4222-8222-222222222222', code: 'FIN', name: 'Finance' }
  server.use(
    http.get('*/api/v1/departments', ({ request }) =>
      HttpResponse.json({
        success: true,
        data: page(new URL(request.url).searchParams.get('search') === 'Finance' ? [finance] : [department])
      })
    ),
    http.get(`*/api/v1/departments/${departmentId}`, () => HttpResponse.json({ success: true, data: department })),
    http.get(`*/api/v1/departments/${finance.id}`, () => HttpResponse.json({ success: true, data: finance })),
    http.get('*/api/v1/departments/:id/employees', () => HttpResponse.json({ success: true, data: page([]) }))
  )
  mount('/dashboard/super-admin?tab=departments&departmentCode=OPS')
  await screen.findByRole('heading', { level: 1, name: 'Operations' })
  fireEvent.click(screen.getByRole('button', { name: 'Back to departments' }))
  fireEvent.change(screen.getByLabelText('Search departments'), { target: { value: 'Finance' } })
  fireEvent.click(await screen.findByRole('button', { name: 'View Finance' }))
  await screen.findByRole('heading', { level: 1, name: 'Finance' })
  fireEvent.click(screen.getByRole('button', { name: 'Browser back' }))
  await screen.findByRole('heading', { level: 1, name: 'Organization' })
  fireEvent.click(screen.getByRole('button', { name: 'Browser back' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Operations' })).toBeInTheDocument()
})
