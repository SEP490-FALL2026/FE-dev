import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { beforeAll, afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { SuperAdminOverviewView } from './views/super-admin-overview-view'

const server = setupServer()
const watchResponse = {
  success: true,
  data: {
    status: 'HEALTHY',
    reasons: {},
    warnings: {},
    holder: {
      id: 'holder',
      fullName: 'API Administrator',
      employeeCode: 'SA-1',
      workState: 'WORKING',
      lastWorkingDay: null
    }
  }
}
function mountOverview(onSelectTab = vi.fn()) {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SuperAdminOverviewView onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  return onSelectTab
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Super Admin overview localization', () => {
  beforeEach(async () => {
    await setAppLanguage('vi', false)
  })

  it('renders authoritative checklist and holder instead of demo metrics', async () => {
    await setAppLanguage('en', false)
    server.use(
      http.get('*/api/v1/onboarding-checklist', () =>
        HttpResponse.json({
          success: true,
          data: {
            steps: [
              {
                step: 1,
                key: 'ORGANIZATION',
                status: 'INCOMPLETE',
                reasons: ['NO_EMPLOYEE'],
                facts: {
                  activeDepartments: 13,
                  activeEmployees: 0,
                  departmentsWithoutCostCenter: 2,
                  latestImport: null
                }
              }
            ]
          }
        })
      ),
      http.get('*/api/v1/super-admin-watch', () =>
        HttpResponse.json({
          success: true,
          data: {
            status: 'HEALTHY',
            reasons: {},
            warnings: {},
            holder: {
              id: 'holder',
              fullName: 'API Administrator',
              employeeCode: 'SA-1',
              workState: 'WORKING',
              lastWorkingDay: null
            }
          }
        })
      )
    )
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <SuperAdminOverviewView onSelectTab={vi.fn()} />
      </QueryClientProvider>
    )
    expect(await screen.findByText('API Administrator')).toBeInTheDocument()
    expect((await screen.findAllByText('13')).length).toBeGreaterThan(0)
    expect(screen.queryByText('Minh Anh')).not.toBeInTheDocument()
  })

  it('groups department issues, excludes unavailable stages from progress and opens the affected department', async () => {
    await setAppLanguage('en', false)
    server.use(
      http.get('*/api/v1/super-admin-watch', () => HttpResponse.json(watchResponse)),
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
                facts: {
                  activeDepartments: 7,
                  activeEmployees: 17,
                  departmentsWithoutCostCenter: 1,
                  latestImport: null
                },
                warnings: [
                  { code: 'MISSING_HEAD', departmentCode: 'OPS', departmentName: 'Operations' },
                  { code: 'MISSING_IT_ADMIN', departmentCode: 'OPS', departmentName: 'Operations' },
                  { code: 'MISSING_COST_CENTER', departmentCode: 'OPS', departmentName: 'Operations' }
                ]
              },
              { step: 2, key: 'APPLICATIONS', status: 'DONE', reasons: [], facts: { applications: 4 } },
              { step: 3, key: 'SUBSCRIPTIONS', status: 'DONE', reasons: [], facts: { plans: 6, subscriptions: 8 } },
              {
                step: 4,
                key: 'BASELINE',
                status: 'INCOMPLETE',
                reasons: [],
                facts: { assignments: 10, closed: false, closedAt: null }
              },
              { step: 5, key: 'USAGE', status: 'NOT_AVAILABLE', reasons: ['NOT_BUILT_YET'] }
            ]
          }
        })
      )
    )
    const onSelectTab = mountOverview()
    expect(await screen.findByRole('progressbar', { name: 'Setup progress' })).toHaveAttribute('aria-valuenow', '75')
    expect(screen.getAllByRole('heading', { name: 'Operations' })).toHaveLength(1)
    expect(screen.getByText('Finance is responsible')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Departments' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Review Operations' }))
    expect(onSelectTab).toHaveBeenCalledWith('departments', { departmentCode: 'OPS' })
    const stage = screen.getByRole('button', { name: /Plans and subscriptions/ })
    fireEvent.click(stage)
    expect(stage).toHaveAttribute('aria-expanded', 'true')
    expect(within(screen.getByRole('region', { name: 'Plans and subscriptions' })).getByText('8')).toBeInTheDocument()
  })

  it('refreshes both API sources and never substitutes invented totals when data is absent', async () => {
    await setAppLanguage('en', false)
    let checklistReads = 0
    let watchReads = 0
    server.use(
      http.get('*/api/v1/super-admin-watch', () => {
        watchReads++
        return HttpResponse.json(watchResponse)
      }),
      http.get('*/api/v1/onboarding-checklist', () => {
        checklistReads++
        return HttpResponse.json({ success: true, data: { steps: [] } })
      })
    )
    mountOverview()
    await screen.findByText('API Administrator')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Refresh data' })).toBeEnabled())
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Refresh data' }))
    await waitFor(() => expect([checklistReads, watchReads]).toEqual([2, 2]))
  })
})
