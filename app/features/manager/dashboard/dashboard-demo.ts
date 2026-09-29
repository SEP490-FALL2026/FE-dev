// Presentation fixtures from the supplied HTML; no authoritative business data.
export const usage = [
  { name: 'Microsoft 365', total: 150, active: 124, inactive: 96 },
  { name: 'Google Workspace', total: 112, active: 76, inactive: 58 },
  { name: 'Figma', total: 110, active: 84, inactive: 60 },
  { name: 'Slack', total: 132, active: 112, inactive: 84 },
  { name: 'Jira', total: 104, active: 78, inactive: 58 },
  { name: 'Notion', total: 108, active: 74, inactive: 52 }
] as const

export const statuses = [
  { key: 'pending', count: 8, color: '#FCB978' },
  { key: 'approved', count: 12, color: '#3DB87F' },
  { key: 'rejected', count: 2, color: '#EF6B5B' },
  { key: 'cancelled', count: 1, color: '#9CA3AF' },
  { key: 'completed', count: 1, color: '#FC7523' }
] as const

export const requests = [
  {
    id: '1',
    type: 'newAccess',
    software: 'Figma',
    person: 'Le Thi Mai',
    date: '2025-05-20T08:00:00+07:00',
    status: 'pending'
  },
  {
    id: '2',
    type: 'changePlan',
    software: 'Microsoft 365',
    person: 'Tran Van Nam',
    date: '2025-05-20T06:00:00+07:00',
    status: 'approved'
  },
  {
    id: '3',
    type: 'renewal',
    software: 'Jira',
    person: 'Pham Thi Hoa',
    date: '2025-05-19T10:00:00+07:00',
    status: 'approved'
  },
  {
    id: '4',
    type: 'returnLicense',
    software: 'Slack',
    person: 'Nguyen Minh Anh',
    date: '2025-05-19T09:00:00+07:00',
    status: 'completed'
  }
] as const

export const costs = [
  { name: 'Microsoft 365', amount: 12480, share: 28 },
  { name: 'Google Workspace', amount: 9230, share: 21 },
  { name: 'Adobe Creative Cloud', amount: 7850, share: 18 },
  { name: 'Figma', amount: 5420, share: 12 },
  { name: 'Jira', amount: 3210, share: 7 }
] as const
