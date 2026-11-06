import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'
import { managerProfile } from '../../../../../test/fixtures/manager-api'
import { ManagerScreen } from '../manager-screen'
import { ManagerProfileView } from './views/manager-profile-view'
import { ManagerLiveEmployeeDetail } from './views/manager-live-employee-detail'
import { ManagerLiveToolDetail } from './views/manager-live-tool-detail'
import { ManagerLiveBatch } from '../team-requests/views/manager-live-batch'
import { ManagerNeedQueue } from '../team-requests/components/manager-need-queue'
import { ManagerLiveRequest } from '../team-requests/views/manager-live-request'

const testDeptId = '11111111-1111-4111-8111-111111111111'
const testEmpId = '22222222-2222-4222-8222-222222222222'

const mockEmployeeDetail = {
  id: testEmpId,
  employeeCode: 'EMP-001',
  fullName: 'Nguyen Van A',
  workEmail: 'a.nguyen@example.com',
  employmentType: 'STAFF',
  status: 'ACTIVE',
  workState: 'WORKING',
  hireDate: '2024-01-15',
  jobTitle: 'Senior Software Engineer',
  department: {
    id: testDeptId,
    code: 'ENG',
    name: 'Engineering Department'
  },
  unplaced: false,
  account: {
    id: '33333333-3333-4333-8333-333333333333',
    status: 'ACTIVE',
    activationState: 'ACTIVATED',
    employeeLeft: false,
    roles: ['EMPLOYEE']
  },
  placements: [
    {
      department: {
        id: testDeptId,
        code: 'ENG',
        name: 'Engineering Department'
      },
      validFrom: '2024-01-15',
      validTo: null
    }
  ],
  placementsHasMore: false
}

const mockToolsInUse = {
  items: [
    {
      assignmentId: 'assign-1',
      employeeCode: 'EMP-001',
      fullName: 'Nguyen Van A',
      holderStatus: 'ACTIVE',
      kind: 'PERSONAL',
      source: 'REQUEST',
      application: { id: 'app-1', name: 'JetBrains IntelliJ' },
      plan: { id: 'plan-1', name: 'Ultimate Annual' },
      effectiveFrom: '2024-02-01',
      effectiveFromLabel: null,
      terminating: false,
      terminatingUntil: null
    }
  ],
  pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
}

const server = setupServer(
  http.get('*/api/v1/me', () =>
    HttpResponse.json({
      success: true,
      data: {
        ...managerProfile,
        managerScope: {
          departmentId: testDeptId,
          departmentCode: 'ENG',
          departmentName: 'Engineering Department'
        }
      }
    })
  ),
  http.get(`*/api/v1/departments/${testDeptId}`, () =>
    HttpResponse.json({
      success: true,
      data: {
        id: testDeptId,
        code: 'ENG',
        name: 'Engineering Department',
        status: 'ACTIVE',
        memberCount: 1,
        costCenter: null
      }
    })
  ),
  http.get(`*/api/v1/departments/${testDeptId}/employees`, () =>
    HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            employeeId: testEmpId,
            employeeCode: 'EMP-001',
            fullName: 'Nguyen Van A',
            status: 'ACTIVE',
            workState: 'WORKING',
            hasWorkEmail: true,
            memberSince: '2024-01-15'
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
      }
    })
  ),
  http.get(`*/api/v1/departments/${testDeptId}/tools-in-use`, () =>
    HttpResponse.json({ success: true, data: mockToolsInUse })
  ),
  http.get(`*/api/v1/employees/${testEmpId}`, () => HttpResponse.json({ success: true, data: mockEmployeeDetail })),
  http.get(`*/api/v1/employees/${managerProfile.employee.id}`, () =>
    HttpResponse.json({
      success: true,
      data: {
        ...mockEmployeeDetail,
        id: managerProfile.employee.id,
        employeeCode: managerProfile.employee.employeeCode,
        fullName: managerProfile.employee.fullName
      }
    })
  ),
  http.get('*/api/v1/spend-queue', () =>
    HttpResponse.json({
      success: true,
      data: {
        items: [],
        pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 }
      }
    })
  ),
  http.get('*/api/v1/need-decisions', () =>
    HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            requestId: 'req-1',
            stepId: 'step-1',
            stepKind: 'NEED',
            deciderRole: 'MANAGER',
            type: 'GRANT',
            openedAt: '2026-11-01T03:00:00Z',
            assignedAt: '2026-11-01T03:00:00Z',
            slaWorkingDays: 3,
            dueOn: '2026-11-04',
            plan: { planId: 'p-1', planName: 'Pro', applicationName: 'ChatGPT' },
            softwareName: null,
            requester: { employeeId: 'emp-1', employeeCode: 'EMP-1', fullName: 'Vu Thi Giang' },
            beneficiary: { employeeId: 'emp-1', employeeCode: 'EMP-1', fullName: 'Vu Thi Giang' },
            lineCount: 1,
            department: { id: testDeptId, code: 'ENG', name: 'Engineering Department' },
            businessReasonExcerpt: 'Coding tasks',
            termMonths: 12,
            termConfirmationRequired: false,
            pricing: { status: 'PRICED', amount: { amount: '1500000', currency: 'VND' } },
            planLineRequired: false,
            samePersonAsSpend: false
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
      }
    })
  ),
  http.get('*/api/v1/access-requests/req-1', () =>
    HttpResponse.json({
      success: true,
      data: {
        request: {
          id: 'req-1',
          type: 'GRANT',
          branch: 'PAID_IN_CATALOG',
          state: 'PENDING',
          plan: { planId: 'p-1', planName: 'Pro', applicationId: 'app-1', applicationName: 'ChatGPT' },
          proposal: null,
          department: { id: testDeptId, code: 'ENG', name: 'Engineering Department' },
          costCenter: null,
          requester: { employeeId: 'emp-1', employeeCode: 'EMP-1', fullName: 'Vu Thi Giang' },
          beneficiary: { employeeId: 'emp-1', employeeCode: 'EMP-1', fullName: 'Vu Thi Giang' },
          lineCount: 1,
          businessReason: 'Coding tasks',
          termMonths: 12,
          offPlan: true,
          delegatedBatchId: null,
          expectedEndDate: null,
          serviceAccount: null,
          renewal: null,
          planLineAttached: false,
          spend: null,
          expectedSpendOn: null,
          budgetYear: null,
          pricing: { status: 'PRICED', amount: { amount: '1500000', currency: 'VND' } },
          policy: { version: 1, hasSpendStep: true, slaWorkingDays: 3 },
          submittedAt: '2026-11-01T03:00:00Z',
          needStep: {
            id: 'step-1',
            state: 'PENDING',
            assignee: null,
            routingRow: 1,
            waitingReason: null,
            samePersonAsSpend: false,
            slaWorkingDays: 3,
            createdAt: '2026-11-01T03:00:00Z',
            assignedAt: null,
            decidedAt: null
          },
          needDecision: null,
          withdrawal: null,
          cancellation: null
        }
      }
    })
  ),
  http.get('*/api/v1/access-requests/req-1/timings', () =>
    HttpResponse.json({
      success: true,
      data: { timings: { segments: { NEED: { startedAt: '2026-11-01T03:00:00Z', endedAt: null } } } }
    })
  )
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Manager Personal Profile & Employee Detail Integration', () => {
  it('renders manager personal profile view with official details and security link', async () => {
    renderWithClient(<ManagerProfileView />)

    expect(await screen.findByText(managerProfile.employee.fullName)).toBeInTheDocument()
    expect(screen.getByText(managerProfile.loginEmail)).toBeInTheDocument()
    expect(screen.getByText('Account security')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /change password/i })).toHaveAttribute('href', '/change-password')
  })

  it('renders employee detail view with placement history and assigned tools', async () => {
    const onBack = vi.fn()
    renderWithClient(<ManagerLiveEmployeeDetail id={testEmpId} departmentId={testDeptId} onBack={onBack} />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Nguyen Van A' })).toBeInTheDocument()
    expect(screen.getByText(/Work email active|Đã kích hoạt/i)).toBeInTheDocument()
    expect((await screen.findAllByText('JetBrains IntelliJ')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Ultimate Annual').length).toBeGreaterThan(0)

    const backBtn = screen.getByRole('button', { name: /back to team members/i })
    fireEvent.click(backBtn)
    expect(onBack).toHaveBeenCalled()
  })

  it('gracefully falls back to department member data when employeeGet returns 403 Forbidden', async () => {
    server.use(
      http.get(`*/api/v1/employees/${testEmpId}`, () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 'AUTHORIZATION.FORBIDDEN',
              message: 'Only the Super Admin reads the company-wide employee directory.',
              requestId: '89df7359-fb96-43df-a6b6-5766c3779ec7'
            }
          },
          { status: 403 }
        )
      )
    )

    renderWithClient(<ManagerLiveEmployeeDetail id={testEmpId} departmentId={testDeptId} onBack={vi.fn()} />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Nguyen Van A' })).toBeInTheDocument()
    expect(screen.queryByText(/Your permissions have changed/i)).not.toBeInTheDocument()
    expect(screen.getByText(/EMP-001/)).toBeInTheDocument()
    expect((await screen.findAllByText('JetBrains IntelliJ')).length).toBeGreaterThan(0)
  })

  it('navigates to employee-detail tab when clicking open on a member in department personnel', async () => {
    const onSelectTab = vi.fn()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/dashboard/manager?departmentId=${testDeptId}&tab=my-team`]}>
          <ManagerScreen tab='my-team' onSelectTab={onSelectTab} />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const openMemberBtn = await screen.findByRole('button', { name: 'Nguyen Van A' })
    fireEvent.click(openMemberBtn)

    expect(onSelectTab).toHaveBeenCalledWith('employee-detail', {
      id: testEmpId,
      departmentId: testDeptId
    })
  })

  it('renders create group request button on weekly-batch screen and navigates on click', async () => {
    const onSelectTab = vi.fn()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/dashboard/manager?departmentId=${testDeptId}&tab=weekly-batch`]}>
          <ManagerScreen tab='weekly-batch' onSelectTab={onSelectTab} />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const createGroupBtn = await screen.findByRole('button', { name: /create group request/i })
    expect(createGroupBtn).toBeInTheDocument()
    fireEvent.click(createGroupBtn)

    expect(onSelectTab).toHaveBeenCalledWith('create-employee-request', { scope: 'team' })
  })

  it('replaces total amount column with status column in manager need queue', async () => {
    renderWithClient(<ManagerNeedQueue onOpen={vi.fn()} />)

    expect(await screen.findByRole('columnheader', { name: 'Status' })).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Total' })).not.toBeInTheDocument()
    expect(await screen.findByText('Awaiting need approval')).toBeInTheDocument()
  })

  it('removes status badge from inside the manager request detail view', async () => {
    renderWithClient(
      <ManagerLiveRequest id='req-1' employeeId={managerProfile.employee.id} departmentCode='ENG' onBack={vi.fn()} />
    )

    expect(await screen.findByText('req-1')).toBeInTheDocument()
    expect(screen.getByText('Vu Thi Giang')).toBeInTheDocument()
    expect(screen.queryByText('Pending')).not.toBeInTheDocument()
    expect(screen.queryByText('Awaiting need approval')).not.toBeInTheDocument()
    expect(screen.queryByText('PAID_IN_CATALOG')).not.toBeInTheDocument()
  })

  it('navigates to tool-detail screen when clicking open on a tool in assigned tools table', async () => {
    const onSelectTab = vi.fn()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/dashboard/manager?departmentId=${testDeptId}&tab=team-software`]}>
          <ManagerScreen tab='team-software' onSelectTab={onSelectTab} />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(await screen.findByText('JetBrains IntelliJ')).toBeInTheDocument()
    const toolRow = screen.getByRole('row', { name: /JetBrains IntelliJ/i })
    const openToolBtn = within(toolRow).getByRole('button', { name: 'Open' })
    fireEvent.click(openToolBtn)

    expect(onSelectTab).toHaveBeenCalledWith('tool-detail', {
      id: 'assign-1',
      departmentId: testDeptId
    })
  })

  it('renders dedicated tool detail view with comprehensive license and holder information', async () => {
    const onBack = vi.fn()
    renderWithClient(<ManagerLiveToolDetail id='assign-1' departmentId={testDeptId} onBack={onBack} />)

    expect(await screen.findByRole('heading', { level: 1, name: 'JetBrains IntelliJ' })).toBeInTheDocument()
    expect(screen.getAllByText('Ultimate Annual').length).toBeGreaterThan(0)
    expect(screen.getByText('assign-1')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('EMP-001')).toBeInTheDocument()

    // Test back button
    const backBtn = screen.getByRole('button', { name: /back to assigned tools/i })
    fireEvent.click(backBtn)
    expect(onBack).toHaveBeenCalled()

    // Test clicking 'Request return' opens the return form
    const returnBtn = screen.getAllByRole('button', { name: /request return/i })[0]
    fireEvent.click(returnBtn)
    expect(await screen.findByRole('heading', { name: /return an assigned right/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
  })
})
