import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { NoticeActionForm } from '~/features/dashboard/super-admin/personnel/components/notice-action-form'
import { EmployeeEventForm } from '~/features/dashboard/super-admin/personnel/components/employee-event-form'
import { ProvisioningActionDialog } from '~/features/dashboard/it-admin/provisioning/components/provisioning-action-dialog'
import { OffboardingDetails } from '~/features/dashboard/it-admin/offboarding/components/offboarding-details'
import { TransferDetail } from '~/features/dashboard/it-admin/transfers/components/transfer-detail'
import { ManagerPersonalRequest } from '~/features/dashboard/manager/personal-requests/views/manager-personal-request'
import { employeeProfile, pageResponse, planId } from '../fixtures/employee-api'
import { catalogApplication, catalogPlanDetails } from '../fixtures/employee-catalog'
import { auditCase, auditNotice, auditTask, auditTransfer } from './mf23-contract-fixtures'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({ success: true, data: { ...employeeProfile, roles: ['IT_ADMIN'] } })
    ),
    http.get('*/api/v1/employees', () => HttpResponse.json(pageResponse())),
    http.get('*/api/v1/departments', () =>
      HttpResponse.json(pageResponse([{ id: planId, code: 'ENG', name: 'Engineering' }]))
    )
  )
})
function mount(component: React.ReactNode, entry = '/') {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[entry]}>{component}</MemoryRouter>
    </QueryClientProvider>
  )
}
function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

it('MF3: a Manager can save their personal re-request as a draft when the new department lacks finance setup', async () => {
  server.use(
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...catalogPlanDetails,
          canSubmit: false,
          submitBlockedReason: 'FINANCE_SETUP_INCOMPLETE'
        }
      })
    ),
    http.get('*/api/v1/requestable-applications/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...catalogApplication,
          canSubmit: false,
          submitBlockedReason: 'FINANCE_SETUP_INCOMPLETE'
        }
      })
    )
  )
  mount(<ManagerPersonalRequest onOpen={vi.fn()} />, `/?tab=personal-request&planId=${planId}`)
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard'))
  fill('Reason', 'Continue working after my department transfer')
  expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled()
})

it('MF2: recording a departure from BM09 includes the required access-block mode', async () => {
  const record = vi.fn()
  mount(
    <NoticeActionForm
      notice={auditNotice}
      action='record'
      pending={false}
      onClose={vi.fn()}
      onRecord={record}
      onLink={vi.fn()}
      onReject={vi.fn()}
    />
  )
  fill('Verification method', 'ATTACHED_DOCUMENT')
  fill('Verification reference', 'Verified HR decision')
  fill('Personnel document type', 'HR_DECISION')
  fill('Personnel document reference', 'HR-123')
  fill('Personnel document issuer', 'Authorized HR office')
  fill('Personnel document issue date', '2026-11-01')
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(record).toHaveBeenCalledOnce())
  expect(record.mock.calls[0][0].event).toHaveProperty('accessBlockMode', 'WITH_LAST_DAY')
})

it.each(['DEPARTURE', 'STILL_EMPLOYED'] as const)(
  'MF2/MF3: K1 revocation sends the server checklist (%s)',
  async (variant) => {
    const posted = vi.fn()
    const checklist =
      variant === 'DEPARTURE'
        ? auditTask.k1Checklist
        : {
            variant,
            items: auditTask.k1Checklist!.items.filter((item) =>
              ['RENEWAL_DISABLED', 'EVIDENCE_RECORDED'].includes(item.code)
            )
          }
    server.use(
      http.post('*/api/v1/provisioning-tasks/:id/revocation-completion', async ({ request }) => {
        posted(await request.json())
        return HttpResponse.json({ error: { code: 'REVOCATION.K1_CHECKLIST_INCOMPLETE' } }, { status: 422 })
      })
    )
    mount(
      <ProvisioningActionDialog task={{ ...auditTask, k1Checklist: checklist }} action='revocation' onClose={vi.fn()} />
    )
    fill('Evidence', 'Vendor renewal cancelled and steps completed')
    fill('Paid through', '2026-12-01')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(posted).toHaveBeenCalledOnce())
    expect(posted.mock.calls[0][0]).toHaveProperty('k1Checklist.items', expect.any(Array))
  }
)

it('MF2: IT can record step 1b after the company account is blocked', async () => {
  server.use(
    http.get('*/api/v1/offboarding-cases/:id', () => HttpResponse.json({ success: true, data: auditCase })),
    http.get('*/api/v1/offboarding-cases/:id/rights', () => HttpResponse.json(pageResponse())),
    http.get('*/api/v1/offboarding-cases/:id/open-requests', () => HttpResponse.json(pageResponse())),
    http.get('*/api/v1/offboarding-cases/:id/open-grant-tasks', () => HttpResponse.json(pageResponse()))
  )
  mount(<OffboardingDetails id={auditCase.id} onBack={vi.fn()} />)
  await screen.findByText(/Company account blocked/)
  expect(screen.getByRole('button', { name: /mailbox/i })).toBeEnabled()
})

it('MF3: IT sees the old rights returned for a transfer during grace', async () => {
  server.use(
    http.get('*/api/v1/department-transfers/:id', () => HttpResponse.json({ success: true, data: auditTransfer }))
  )
  mount(<TransferDetail id={auditTransfer.id} onBack={vi.fn()} />)
  await screen.findByRole('heading', { level: 1 })
  expect(screen.getByText('Legacy Jira')).toBeVisible()
})

it.each(['offboarding', 'transfer'] as const)('MF2/MF3: %s shows impact preview before recording', async (kind) => {
  const order: string[] = []
  const resource = kind === 'offboarding' ? 'offboarding-cases' : 'department-transfers'
  server.use(
    http.post(`*/api/v1/${resource}/preview`, () => {
      order.push('preview')
      return HttpResponse.json({ success: true, data: {} })
    }),
    http.post(`*/api/v1/${resource}`, () => {
      order.push('record')
      return HttpResponse.json({ error: { code: 'VALIDATION_ERROR' } }, { status: 422 })
    })
  )
  mount(<EmployeeEventForm kind={kind} employee={auditCase.employee} onClose={vi.fn()} />)
  if (kind === 'offboarding') fill('Last working day', '2026-12-01')
  else {
    await screen.findByRole('option', { name: /Engineering/ })
    fill('Destination department', planId)
    fill('Effective date', '2026-12-01')
  }
  fill('Authoritative basis', 'Decision HR-123')
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(order.length).toBeGreaterThan(0))
  expect(order[0]).toBe('preview')
})
