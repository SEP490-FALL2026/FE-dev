import type { TeamMember } from '~/entities/user/team-member.types'
import { csvCell } from '~/shared/lib/csv'

export function buildTeamCsv(
  members: TeamMember[],
  headers: string[],
  formatStatus: (member: TeamMember) => string,
  formatLastActive: (member: TeamMember) => string
) {
  const rows = members.map((member) => [
    member.name,
    member.email,
    member.department,
    member.team,
    member.costCenter,
    String(member.activeLicenses),
    String(member.pendingRequests),
    formatStatus(member),
    formatLastActive(member)
  ])
  return '\uFEFF' + [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
}
