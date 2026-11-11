import { http, HttpResponse } from 'msw'
import type { ManagerDashboardResponseDtoData } from '~/shared/api/generated/model/dashboards/managerDashboardResponseDtoData'
import type { NeedQueueResponseDtoDataItemsItem } from '~/shared/api/generated/model/need-decisions/needQueueResponseDtoDataItemsItem'
import type { ReturnResponseDtoDataReturnRequest } from '~/shared/api/generated/model/return-requests/returnResponseDtoDataReturnRequest'
import type { DepartmentToolsResponseDtoDataItemsItem } from '~/shared/api/generated/model/departments/departmentToolsResponseDtoDataItemsItem'
import { employeeCatalogHandlers, catalogPlan } from './employee-catalog'
import {
  assignmentId,
  employeeId,
  pageResponse,
  person,
  planId,
  pricing,
  requestId,
  requestPreview
} from './employee-api'
import { managerId, managerProfile } from './manager-api'

const unavailable = { state: 'NOT_AVAILABLE', count: null, sourceOperationId: null, reason: 'NO_DATA_SOURCE' } as const
export const managerDashboard: NonNullable<ManagerDashboardResponseDtoData> = {
  asOf: '2026-11-02',
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  sections: {
    needApprovals: { state: 'COUNTED', count: 0, sourceOperationId: 'needDecisionList', reason: null },
    departmentSoftware: { state: 'COUNTED', count: 27, sourceOperationId: 'departmentToolsInUse', reason: null },
    transferReviews: { state: 'COUNTED', count: 0, sourceOperationId: 'transferReviewList', reason: null },
    ghostSeats: { ...unavailable, reason: 'USAGE_DATA_NOT_DELIVERED' },
    spending: { ...unavailable, reason: 'FINANCE_FIGURES_NOT_DELIVERED' },
    spendQueue: { state: 'AT_SOURCE', count: null, sourceOperationId: 'spendQueueList', reason: null },
    budgetProposals: { state: 'AT_SOURCE', count: null, sourceOperationId: 'budgetProposalList', reason: null },
    approvedBudgetLines: { state: 'AT_SOURCE', count: null, sourceOperationId: 'budgetMineLineList', reason: null }
  }
}
export const needItem: NeedQueueResponseDtoDataItemsItem = {
  requestId,
  stepId: assignmentId,
  stepKind: 'NEED',
  deciderRole: 'MANAGER',
  type: 'GRANT',
  openedAt: '2026-11-01T03:00:00Z',
  assignedAt: '2026-11-01T03:00:00Z',
  slaWorkingDays: 3,
  dueOn: '2026-11-04',
  plan: { planId, planName: 'Standard', applicationName: 'Test Software' },
  softwareName: null,
  requester: person,
  beneficiary: person,
  lineCount: 1,
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  businessReasonExcerpt: 'Design work',
  termMonths: 13,
  pricing: { status: 'PRICED', amount: pricing.amount },
  expectedEndDate: null
}
export const assignedTool: DepartmentToolsResponseDtoDataItemsItem = {
  assignmentId,
  employeeCode: person.employeeCode,
  fullName: person.fullName,
  holderStatus: 'ACTIVE',
  kind: 'PERSONAL',
  source: 'REQUEST',
  application: { id: planId, name: 'Test Software' },
  plan: { id: planId, name: 'Standard' },
  effectiveFrom: '2026-10-01',
  effectiveFromLabel: null,
  terminating: false,
  terminatingUntil: null
}
export const managerReturn: ReturnResponseDtoDataReturnRequest = {
  id: requestId,
  state: 'AWAITING_REVOCATION',
  source: 'HEAD_CONFIRMATION',
  assignmentId,
  plan: { planId, planName: 'Standard', applicationId: planId, applicationName: 'Test Software' },
  holder: person,
  requestedBy: { ...person, employeeId: managerId, fullName: 'Test Manager' },
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  requestedOn: '2026-11-02',
  handover: { required: true, dueOn: '2026-11-05', confirmed: false, flagged: false },
  createdAt: '2026-11-02T03:00:00Z',
  completedAt: null,
  failedAt: null,
  reason: 'No longer needed',
  revocationNote: 'Export work files',
  originRequestId: null,
  handoverConfirmedBy: null,
  handoverConfirmedAt: null,
  failureReason: null
}
export const managerCatalogHandlers = [
  ...employeeCatalogHandlers,
  http.get('*/api/v1/requestable-plans/:id', () =>
    HttpResponse.json({
      success: true,
      data: { ...catalogPlan, vendorName: 'Test Vendor', sharingPolicy: 'NOT_ALLOWED', dataLossOnRemoval: true }
    })
  ),
  http.post('*/api/v1/access-requests/preview', () =>
    HttpResponse.json({ success: true, data: { preview: requestPreview } })
  )
]
export const managerReadHandlers = [
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
  http.get('*/api/v1/budgets/mine', () => HttpResponse.json({ success: true, data: null })),
  http.get('*/api/v1/budget-cycles/:year/baseline', () =>
    HttpResponse.json({ success: true, data: { departments: [] } })
  ),
  http.get('*/api/v1/departments/:id/access-requests', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/access-requests/:id/events', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/departments/:id', ({ params }) =>
    HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        code: 'ENG',
        name: 'Engineering',
        costCenter: { id: employeeId, code: 'ENG', name: 'Engineering' }
      }
    })
  ),
  http.get('*/api/v1/budget-attachments/mine', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/budget-proposals/:id/attachments', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/dashboards/manager', () => HttpResponse.json({ success: true, data: managerDashboard })),
  http.get('*/api/v1/need-decisions', ({ request }) =>
    HttpResponse.json(
      pageResponse(
        new URL(request.url).searchParams.get('pageSize') === '100'
          ? [{ ...needItem, stepId: requestId, termMonths: 3, termConfirmationRequired: false }]
          : []
      )
    )
  ),
  http.get('*/api/v1/access-requests/:id/plan-line-suggestions', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/access-requests/:id/timings', () => HttpResponse.json({ success: true, data: null }))
]
