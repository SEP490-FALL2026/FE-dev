import type { ReviewPeriodDetailResponseDtoDataPeriod } from '~/shared/api/generated/model/budget-review-periods/reviewPeriodDetailResponseDtoDataPeriod'
import type { ReviewPeriodDetailResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-review-periods/reviewPeriodDetailResponseDtoDataItemsItem'
import type { AdjustmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-adjustments/adjustmentListResponseDtoDataItemsItem'
import type { SeatMonthChargesResponseDtoDataItemsItem } from '~/shared/api/generated/model/seat-month-charges/seatMonthChargesResponseDtoDataItemsItem'
import { employeeId, planId, requestId } from './employee-api'

export const budgetMoney = (amount: string) => ({ amount, currency: 'VND' })
const costCenter = { id: employeeId, code: 'ENG', name: 'Engineering' }
export const reviewPeriod: ReviewPeriodDetailResponseDtoDataPeriod = {
  id: requestId,
  year: 2026,
  month: 9,
  kind: 'QUARTER',
  state: 'AWAITING_EXPLANATIONS',
  currency: 'VND',
  closedBy: null,
  closedAt: '2026-10-01T01:00:00Z',
  explanationsDueOn: '2026-10-08',
  signedBy: null,
  signedAt: null,
  note: null,
  lightCounts: { GREEN: 0, YELLOW: 0, RED: 1, UNDER: 0 },
  company: null
}
export const reviewLine: ReviewPeriodDetailResponseDtoDataItemsItem = {
  id: planId,
  costCenter,
  base: budgetMoney('100000'),
  reserve: budgetMoney('20000'),
  spent: budgetMoney('20000'),
  spentAfterMonth: budgetMoney('3000'),
  changedAfterSnapshot: budgetMoney('1000'),
  committed: budgetMoney('10000'),
  pendingSpend: budgetMoney('5000'),
  remaining: budgetMoney('85000'),
  variancePpm: 0,
  priceIncrease: budgetMoney('1000'),
  forecast: budgetMoney('140000'),
  paceBasisPoints: 10000,
  light: 'RED',
  explanationStatus: 'PENDING',
  explanation: null
}
export const savedExplanation: NonNullable<ReviewPeriodDetailResponseDtoDataItemsItem['explanation']> = {
  cause: 'Vendor increased prices',
  persistence: 'ONGOING',
  action: 'Review unused seats',
  knownNeedsToYearEnd: { amount: budgetMoney('9007199254740993'), note: 'Renewal in December' },
  explainedBy: null,
  explainedAt: '2026-10-10T02:00:00Z'
}
export const seatMonthCharge: SeatMonthChargesResponseDtoDataItemsItem = {
  id: planId,
  subscriptionId: requestId,
  assignmentId: planId,
  employee: { employeeId, employeeCode: 'EMP-01', fullName: 'Test Employee' },
  department: costCenter,
  costCenter,
  days: 15,
  daysInMonth: 30,
  monthlyPrice: budgetMoney('30000'),
  amount: budgetMoney('15000'),
  appliedToCommitment: budgetMoney('10000')
}
export const budgetAdjustment: AdjustmentListResponseDtoDataItemsItem = {
  id: planId,
  year: 2026,
  kind: 'SUPPLEMENT',
  from: null,
  to: costCenter,
  amount: budgetMoney('9007199254740993'),
  reason: 'Additional team capacity',
  transferReason: null,
  state: 'APPROVED',
  createdBy: null,
  createdAt: '2026-10-01T01:00:00Z',
  decidedBy: null,
  decidedAt: '2026-10-02T01:00:00Z',
  decisionReason: null,
  createdVersionId: null
}
