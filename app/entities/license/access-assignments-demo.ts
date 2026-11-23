import { teamMembers } from '~/entities/user/team-members-demo'

export const reviewStatuses = ['pending', 'reviewed', 'exempt'] as const
export const riskLevels = ['high', 'medium', 'low'] as const

// Cycle-specific activity from the supplied design, independent of profile activity.
export const accessAssignments = [
  {
    id: 'AR-1',
    employeeId: '1',
    software: 'Figma',
    plan: 'Professional',
    assigned: '2026-01-12',
    days: 14,
    risk: 'low',
    status: 'pending',
    job: 'designer'
  },
  {
    id: 'AR-2',
    employeeId: '2',
    software: 'GitHub',
    plan: 'Enterprise',
    assigned: '2026-01-12',
    days: 62,
    risk: 'medium',
    status: 'pending',
    job: 'designer'
  },
  {
    id: 'AR-3',
    employeeId: '3',
    software: 'Jira',
    plan: 'Standard',
    assigned: '2026-02-05',
    days: 3,
    risk: 'low',
    status: 'pending',
    job: 'developer'
  }
] as const

export type AccessAssignment = (typeof accessAssignments)[number]
export function reviewMember(row: AccessAssignment) {
  return teamMembers.find((member) => member.id === row.employeeId)!
}
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replaceAll('đ', 'd')
    .replaceAll('Đ', 'D')
    .toLowerCase()

export function filterAccessAssignments(params: URLSearchParams) {
  const query = normalize(params.get('search') ?? '').trim()
  const status = params.get('status') ?? 'pending'
  return accessAssignments.filter((row) => {
    const member = reviewMember(row)
    return (
      row.status === status &&
      (!query || normalize(`${member.name} ${member.email} ${row.software} ${row.plan}`).includes(query)) &&
      (!params.get('software') || row.software === params.get('software')) &&
      (!params.get('team') || member.team === params.get('team')) &&
      (!params.get('risk') || row.risk === params.get('risk')) &&
      (!params.get('employee') || row.employeeId === params.get('employee'))
    )
  })
}
