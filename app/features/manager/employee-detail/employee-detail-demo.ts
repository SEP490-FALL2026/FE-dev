import { managerEmployeePreview } from '~/entities/user/manager-employee-preview'

export const employeeDetailDemo = {
  employeeId: managerEmployeePreview.id,
  employeeCode: managerEmployeePreview.code,
  jobTitle: managerEmployeePreview.jobTitle,
  phone: '+84 912 345 678',
  joined: '2024-01-12',
  location: 'Ho Chi Minh, Vietnam',
  manager: 'Nguyễn Minh An',
  totalRequests: 6,
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAD7vTVASh7QAlb2Rv5BKTQ2dSJkSpF0ESpnR4Q0-grhIPlo99PKHtZ9rHJUbnrGrrTe-Rk3FINk1mCCEIV_wIA43H7Wf3gy7FUDxoPtEArqFtfCbf9948jzF9QqpgyDdMcbbQmJ2_wQZO0ez0HpjXQSyjdzFhT2aOVtaoV8OOF_lrJSYNu8NpXIzFyBTh2msdsW-y2_DZZ0E58_VnTmkvUARbieEYO0ygndCLY0y5TM8lgzbX8AKsS',
  request: { software: 'Jira Software', plan: 'Standard', requested: '2026-05-18', slaHours: 18 },
  reviewDate: '2026-02-28'
} as const

export const activities = [
  {
    id: 'approved',
    key: 'approvedActivity',
    software: 'Figma Professional',
    date: '2026-04-28',
    actor: employeeDetailDemo.manager
  },
  { id: 'requested', key: 'requestedActivity', software: 'Jira Software', date: '2026-05-18' },
  { id: 'renewed', key: 'renewedActivity', software: 'Slack Pro', date: '2026-03-15' },
  { id: 'review', key: 'reviewActivity', date: employeeDetailDemo.reviewDate }
] as const

export const detailTabs = ['assigned', 'requests', 'usage', 'accessReview', 'history'] as const
export type DetailTab = (typeof detailTabs)[number]
