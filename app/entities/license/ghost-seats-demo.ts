export type GhostSeat = {
  id: string
  application: string
  category: 'devops' | 'design' | 'product' | 'communication' | 'collaboration' | 'productivity' | 'crm'
  employee: string
  email: string
  lastActivity: string
  inactiveDays: number
  recommendation: 'reclaim' | 'keep' | 'exempt'
  confidence: number
}

// Supplied design snapshot: days and recommendations are source values, not current policy decisions.
export const ghostSeats: readonly GhostSeat[] = [
  {
    id: 'github',
    application: 'GitHub',
    category: 'devops',
    employee: 'Nguyen Minh Anh',
    email: 'minh.anh@company.com',
    lastActivity: '2025-01-12',
    inactiveDays: 98,
    recommendation: 'reclaim',
    confidence: 0.92
  },
  {
    id: 'figma',
    application: 'Figma',
    category: 'design',
    employee: 'Tran Thi Bich',
    email: 'bich.tran@company.com',
    lastActivity: '2025-01-20',
    inactiveDays: 90,
    recommendation: 'reclaim',
    confidence: 0.88
  },
  {
    id: 'jira',
    application: 'Jira',
    category: 'product',
    employee: 'Le Van Nam',
    email: 'nam.lev@company.com',
    lastActivity: '2025-02-05',
    inactiveDays: 74,
    recommendation: 'keep',
    confidence: 0.76
  },
  {
    id: 'slack',
    application: 'Slack',
    category: 'communication',
    employee: 'Pham Thi Hoa',
    email: 'hoa.pham@company.com',
    lastActivity: '2025-02-10',
    inactiveDays: 69,
    recommendation: 'keep',
    confidence: 0.71
  },
  {
    id: 'notion',
    application: 'Notion',
    category: 'collaboration',
    employee: 'Dang Quang Huy',
    email: 'huy.dang@company.com',
    lastActivity: '2025-02-18',
    inactiveDays: 61,
    recommendation: 'keep',
    confidence: 0.68
  },
  {
    id: 'adobe',
    application: 'Adobe Creative Cloud',
    category: 'design',
    employee: 'Hoang Minh Trang',
    email: 'trang.hoang@company.com',
    lastActivity: '2025-03-01',
    inactiveDays: 49,
    recommendation: 'exempt',
    confidence: 0.65
  },
  {
    id: 'microsoft',
    application: 'Microsoft 365',
    category: 'productivity',
    employee: 'Nguyen Van Long',
    email: 'long.nguyen@company.com',
    lastActivity: '2025-03-08',
    inactiveDays: 42,
    recommendation: 'keep',
    confidence: 0.62
  },
  {
    id: 'zoom',
    application: 'Zoom',
    category: 'communication',
    employee: 'Bui Thi Mai',
    email: 'mai.bui@company.com',
    lastActivity: '2025-03-12',
    inactiveDays: 38,
    recommendation: 'keep',
    confidence: 0.58
  },
  {
    id: 'salesforce',
    application: 'Salesforce',
    category: 'crm',
    employee: 'To Minh Duc',
    email: 'duc.to@company.com',
    lastActivity: '2025-03-15',
    inactiveDays: 38,
    recommendation: 'keep',
    confidence: 0.55
  },
  {
    id: 'google',
    application: 'Google Workspace',
    category: 'productivity',
    employee: 'Nguyen Phuong Anh',
    email: 'anh.nguyen@company.com',
    lastActivity: '2025-03-18',
    inactiveDays: 32,
    recommendation: 'keep',
    confidence: 0.52
  }
]

export function seatTier(seat: GhostSeat): 'critical' | 'medium' | 'low' {
  return seat.inactiveDays >= 90 ? 'critical' : seat.inactiveDays >= 60 ? 'medium' : 'low'
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
}

export function filterGhostSeats(params: URLSearchParams) {
  const search = normalize(params.get('search') ?? '')
  const tier = params.get('tier') ?? ''
  const recommendation = params.get('recommendation') ?? ''
  const application = params.get('application') ?? ''
  const sort = params.get('sort')
  return ghostSeats
    .filter(
      (seat) =>
        normalize(`${seat.application} ${seat.employee} ${seat.email}`).includes(search) &&
        (params.get('tab') !== 'critical' || seatTier(seat) === 'critical') &&
        (!['critical', 'medium', 'low'].includes(tier) || seatTier(seat) === tier) &&
        (!['reclaim', 'keep', 'exempt'].includes(recommendation) || seat.recommendation === recommendation) &&
        (!ghostSeats.some((item) => item.id === application) || seat.id === application)
    )
    .sort((a, b) => {
      if (sort === 'activity') return a.lastActivity.localeCompare(b.lastActivity)
      if (sort === 'activityDesc') return b.lastActivity.localeCompare(a.lastActivity)
      if (sort === 'confidence') return b.confidence - a.confidence
      if (sort === 'confidenceAsc') return a.confidence - b.confidence
      return 0
    })
}
