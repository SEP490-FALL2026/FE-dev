import { committedForecast, financeDataAsOf } from './finance-data'

/*
 * Forecast cost optimization (FIN-35 for Finance, APV-04 for the Spending Approver). Finance turns usage
 * signals from IT into proposals that lower next period's committed cost: reclaim ghost seats, move to a
 * cheaper plan, or cancel a plan that duplicates another tool. Finance only proposes; the Spending Approver
 * decides and IT Admin executes. Amounts are VND borne cost per month.
 */

export type OptimizationKind = 'CANCEL' | 'DOWNGRADE' | 'GHOST_SEAT'
export type OptimizationStatus = 'APPROVED' | 'DRAFT' | 'REJECTED' | 'SENT'
export type GhostSignal = 'INACTIVE' | 'LEFT_COMPANY' | 'NEVER_USED'

export interface GhostSeat {
  lastActivity?: string
  name: string
  signal: GhostSignal
}

export interface OptimizationDecision {
  at: string
  by: string
  reason?: string
}

export interface OptimizationOpportunity {
  app: string
  code: string
  costCenter: string
  currentMonthly: number
  decision?: OptimizationDecision
  /** First month (`YYYY-MM`) billed at the proposed cost. */
  effectiveMonth: string
  financeNote?: string
  ghostSeats?: GhostSeat[]
  id: string
  kind: OptimizationKind
  /** Only for CANCEL: the tool already in the catalog that covers the same need. */
  overlapWith?: string
  /** Only for DOWNGRADE: share of users who touched a feature of the current plan in the last 90 days. */
  plan?: { current: string; featuresLost: string[]; premiumUsage: number; proposed: string }
  proposedMonthly: number
  renewalDate?: string
  seats: { active: number; purchased: number }
  sentAt?: string
  status: OptimizationStatus
  timing: 'IMMEDIATE' | 'NEXT_RENEWAL'
  vendor: string
}

/** The forecast window is the committed L1 forecast (Q4-2026). */
export const forecastMonths = committedForecast.map((month) => month.month.slice(0, 7))

export const optimizationApprover = 'Phạm Hoàng Nam'

export const monthlySaving = (item: OptimizationOpportunity) => item.currentMonthly - item.proposedMonthly

/** Saving inside the forecast window: only months on or after the effective month count. */
export const windowSaving = (item: OptimizationOpportunity) =>
  monthlySaving(item) * forecastMonths.filter((month) => month >= item.effectiveMonth).length

export const annualSaving = (item: OptimizationOpportunity) => monthlySaving(item) * 12

export function inactiveDays(seat: GhostSeat) {
  if (!seat.lastActivity) return null
  return Math.floor((Date.parse(financeDataAsOf) - Date.parse(`${seat.lastActivity}T00:00:00+07:00`)) / 86_400_000)
}

export const optimizationOpportunities: OptimizationOpportunity[] = [
  {
    app: 'Figma Organization',
    code: 'OPT-2026-11',
    costCenter: 'CC-DES',
    currentMonthly: 15_750_000,
    effectiveMonth: '2026-11',
    ghostSeats: [
      { name: 'Ngô Thị Lan', signal: 'NEVER_USED' },
      { lastActivity: '2026-07-02', name: 'Hồ Quang Vinh', signal: 'INACTIVE' },
      { lastActivity: '2026-07-29', name: 'Tạ Minh Châu', signal: 'INACTIVE' },
      { lastActivity: '2026-08-10', name: 'Phan Bảo Ngọc', signal: 'INACTIVE' }
    ],
    id: 'opt-11',
    kind: 'GHOST_SEAT',
    proposedMonthly: 13_230_000,
    seats: { active: 21, purchased: 25 },
    status: 'DRAFT',
    timing: 'IMMEDIATE',
    vendor: 'Figma'
  },
  {
    app: 'Jira Software',
    code: 'OPT-2026-12',
    costCenter: 'CC-ENG',
    currentMonthly: 11_400_000,
    effectiveMonth: '2026-11',
    financeNote: '9 suất không hoạt động; thu hồi trước kỳ thanh toán tháng 11 để giảm chi phí quý 4.',
    ghostSeats: [
      { name: 'Vũ Đức Minh', signal: 'LEFT_COMPANY' },
      { name: 'Đoàn Thị Hoa', signal: 'LEFT_COMPANY' },
      { name: 'Lương Văn Đạt', signal: 'NEVER_USED' },
      { name: 'Kiều Anh Thư', signal: 'NEVER_USED' },
      { lastActivity: '2026-06-18', name: 'Trương Gia Bảo', signal: 'INACTIVE' },
      { lastActivity: '2026-07-05', name: 'Hà Minh Tuấn', signal: 'INACTIVE' },
      { lastActivity: '2026-07-21', name: 'Cao Thùy Dung', signal: 'INACTIVE' },
      { lastActivity: '2026-08-01', name: 'Mạc Văn Khánh', signal: 'INACTIVE' },
      { lastActivity: '2026-08-09', name: 'Âu Ngọc Mai', signal: 'INACTIVE' }
    ],
    id: 'opt-12',
    kind: 'GHOST_SEAT',
    proposedMonthly: 9_690_000,
    seats: { active: 51, purchased: 60 },
    sentAt: '2026-10-11T15:00:00+07:00',
    status: 'SENT',
    timing: 'IMMEDIATE',
    vendor: 'Atlassian'
  },
  {
    app: 'Slack Enterprise Grid',
    code: 'OPT-2026-13',
    costCenter: 'CC-COMPANY',
    currentMonthly: 8_000_000,
    effectiveMonth: '2026-12',
    id: 'opt-13',
    kind: 'DOWNGRADE',
    plan: {
      current: 'Enterprise Grid',
      featuresLost: ['Enterprise Key Management', 'Chống thất thoát dữ liệu (DLP) nâng cao', 'Nhiều workspace'],
      premiumUsage: 0.04,
      proposed: 'Business+'
    },
    proposedMonthly: 5_400_000,
    renewalDate: '2026-11-15',
    seats: { active: 109, purchased: 120 },
    status: 'DRAFT',
    timing: 'NEXT_RENEWAL',
    vendor: 'Salesforce'
  },
  {
    app: 'Adobe Creative Cloud',
    code: 'OPT-2026-14',
    costCenter: 'CC-MKT',
    currentMonthly: 4_500_000,
    effectiveMonth: '2026-11',
    financeNote: 'Cả 3 người chỉ dùng Photoshop; chuyển sang gói một ứng dụng.',
    id: 'opt-14',
    kind: 'DOWNGRADE',
    plan: {
      current: 'All Apps',
      featuresLost: ['Illustrator', 'Premiere Pro', 'After Effects'],
      premiumUsage: 0.1,
      proposed: 'Photoshop (Single App)'
    },
    proposedMonthly: 1_800_000,
    seats: { active: 3, purchased: 3 },
    sentAt: '2026-10-10T10:30:00+07:00',
    status: 'SENT',
    timing: 'IMMEDIATE',
    vendor: 'Adobe'
  },
  {
    app: 'Zoom Business',
    code: 'OPT-2026-15',
    costCenter: 'CC-OPS',
    currentMonthly: 2_200_000,
    effectiveMonth: '2026-12',
    id: 'opt-15',
    kind: 'CANCEL',
    overlapWith: 'Google Meet (Google Workspace)',
    proposedMonthly: 0,
    renewalDate: '2026-12-01',
    seats: { active: 6, purchased: 20 },
    status: 'DRAFT',
    timing: 'NEXT_RENEWAL',
    vendor: 'Zoom'
  },
  {
    app: 'Miro Team',
    code: 'OPT-2026-09',
    costCenter: 'CC-OPS',
    currentMonthly: 3_750_000,
    decision: { at: '2026-10-06T11:00:00+07:00', by: optimizationApprover },
    effectiveMonth: '2026-10',
    financeNote: '5 suất không hoạt động trên 60 ngày.',
    ghostSeats: [
      { name: 'Lê Văn Phúc', signal: 'LEFT_COMPANY' },
      { lastActivity: '2026-06-30', name: 'Nguyễn Thanh Tâm', signal: 'INACTIVE' },
      { lastActivity: '2026-07-14', name: 'Bạch Thu Hà', signal: 'INACTIVE' },
      { lastActivity: '2026-07-25', name: 'Dương Quốc Huy', signal: 'INACTIVE' },
      { name: 'Tôn Nữ Mai Anh', signal: 'NEVER_USED' }
    ],
    id: 'opt-09',
    kind: 'GHOST_SEAT',
    proposedMonthly: 2_500_000,
    seats: { active: 10, purchased: 15 },
    sentAt: '2026-10-03T09:00:00+07:00',
    status: 'APPROVED',
    timing: 'IMMEDIATE',
    vendor: 'Miro'
  },
  {
    app: 'Postman Professional',
    code: 'OPT-2026-10',
    costCenter: 'CC-ENG',
    currentMonthly: 2_400_000,
    decision: {
      at: '2026-10-07T14:30:00+07:00',
      by: optimizationApprover,
      reason: 'Đội QA dùng giám sát API và môi trường riêng của gói Professional cho dự án ngân hàng.'
    },
    effectiveMonth: '2026-11',
    financeNote: 'Đề xuất hạ xuống gói Basic.',
    id: 'opt-10',
    kind: 'DOWNGRADE',
    plan: {
      current: 'Professional',
      featuresLost: ['Giám sát API', 'Môi trường riêng tư', 'Báo cáo nâng cao'],
      premiumUsage: 0.58,
      proposed: 'Basic'
    },
    proposedMonthly: 1_100_000,
    seats: { active: 12, purchased: 12 },
    sentAt: '2026-10-04T16:00:00+07:00',
    status: 'REJECTED',
    timing: 'IMMEDIATE',
    vendor: 'Postman'
  }
]
