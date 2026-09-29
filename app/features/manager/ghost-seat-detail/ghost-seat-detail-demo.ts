export const ghostDetailTabs = ['overview', 'evidence', 'requests', 'audit'] as const
export type GhostDetailTab = (typeof ghostDetailTabs)[number]

// Additional information exists only for the supplied Figma design. Core identity comes from the review row.
export const figmaDetail = {
  seatId: 'figma',
  plan: 'Professional',
  department: 'Product & Technology',
  costCenter: 'CC-0012',
  monthlyCost: 720,
  savings: 720,
  coverage: 120,
  source: 'Figma API',
  rule: 'G3',
  relatedRequest: 'REQ-1024',
  timeline: [
    { key: 'active', date: '2025-01-20', time: '14:32' },
    { key: 'detected', date: '2025-04-28', time: '09:15' },
    { key: 'recommended', date: '2025-04-28', time: '10:02' },
    { key: 'pending', date: '2025-04-28', time: '10:30' }
  ],
  notes: [
    { key: 'manager', name: 'Nguyen Van Tuan', initials: 'NT', date: '2025-04-28', time: '10:20' },
    { key: 'admin', name: 'Le Thi Mai', initials: 'LT', date: '2025-04-28', time: '11:05' }
  ]
} as const
