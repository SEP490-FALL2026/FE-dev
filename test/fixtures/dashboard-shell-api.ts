import { http, HttpResponse } from 'msw'
import type {
  BaselineResponseDtoData,
  EmployeeListResponseDtoDataItemsItem,
  MeResponseDtoData,
  RecommendationPageResponseDtoDataItemsItem,
  ReviewPeriodListResponseDtoDataItemsItem
} from '~/shared/api/generated/model'
import { employeeId, planId, requestId } from './employee-api'
import { managerProfile } from './manager-api'

export function dashboardList<T>(items: T[] = [], page = 1, pageSize = 20, totalItems = items.length) {
  return {
    success: true as const,
    message: 'TEST.LISTED',
    data: { items, pagination: { page, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) } }
  }
}

export const itProfile: NonNullable<MeResponseDtoData> = {
  ...managerProfile,
  roles: ['IT_ADMIN']
}

export const directoryEmployee: EmployeeListResponseDtoDataItemsItem = {
  id: employeeId,
  employeeCode: 'EMP-SHELL',
  fullName: 'Shell Directory Employee',
  workEmail: 'shell@example.com',
  employmentType: 'STAFF',
  status: 'ACTIVE',
  workState: 'WORKING',
  hireDate: '2026-01-01',
  jobTitle: 'Designer',
  department: null,
  unplaced: true,
  account: null
}

export const optimizationRecommendation: RecommendationPageResponseDtoDataItemsItem = {
  id: requestId,
  group: 'G4',
  state: 'OPEN',
  closeReason: null,
  tier: 'MONITOR',
  confidenceLabel: 'INTERNAL_DATA',
  application: { applicationId: planId, applicationName: 'Shell Design Tool' },
  plan: { planId, planName: 'Team' },
  subscriptionId: null,
  assignmentId: null,
  holder: { employeeId, employeeCode: 'EMP-SHELL' },
  freeSeats: null,
  countsTowardVacantCost: null,
  revocationTaskId: null,
  labels: { revocationUnderWay: false, terminatingUntil: false, holderLeft: false },
  canReclaim: false,
  confidence: 'HIGH',
  confidenceReasons: [],
  activityStatus: 'INACTIVE',
  inactiveDays: 45,
  lastActiveDate: '2026-09-01',
  activityAfterDecisionOn: null,
  usageLabels: [],
  potentialSaving: null,
  createdAt: '2026-11-03T00:00:00Z'
}

export const itOverviewHandlers = [
  http.get('*/api/v1/dashboards/it-admin', () =>
    HttpResponse.json({ success: true, message: 'DASHBOARD.RETRIEVED', data: null })
  ),
  http.get('*/api/v1/usage-overview', () => HttpResponse.json(dashboardList()))
]

export const reviewPeriod: ReviewPeriodListResponseDtoDataItemsItem = {
  id: requestId,
  year: 2026,
  month: 10,
  kind: 'MONTH',
  state: 'SIGNED',
  currency: 'VND',
  closedBy: null,
  closedAt: '2026-11-01T03:00:00Z',
  explanationsDueOn: null,
  signedBy: null,
  signedAt: '2026-11-02T03:00:00Z',
  note: null,
  lightCounts: { GREEN: 2, YELLOW: 0, RED: 0, UNDER: 0 },
  company: null
}

export const budgetBaseline: NonNullable<BaselineResponseDtoData> = {
  basis: 'HOLDER_DEPARTMENT',
  year: 2026,
  currency: 'VND',
  computedAt: '2026-11-03T00:00:00Z',
  departmentsTotal: 0,
  departments: [],
  sharedPoolUnallocated: null
}

export const selfServiceNoticeHandlers = [
  http.get('*/api/v1/me/department-transfer', () =>
    HttpResponse.json({ success: true, message: 'TRANSFER.RETRIEVED', data: null })
  ),
  http.get('*/api/v1/me/departure-notice', () =>
    HttpResponse.json({ success: true, message: 'DEPARTURE.RETRIEVED', data: null })
  )
]
