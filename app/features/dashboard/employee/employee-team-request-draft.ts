import { teamMembers } from '~/entities/user/team-members-demo'

import { employeeProfileData } from './employee-data'

export const eligibleTeamMembers = teamMembers.filter(
  (member) =>
    member.status === 'active' &&
    member.department === employeeProfileData.personal.department &&
    member.email.toLowerCase() !== employeeProfileData.personal.email.toLowerCase()
)

export function parseTeamMemberIds(value?: string): string[] {
  const requestedIds = new Set((value || '').split(',').filter(Boolean))
  return eligibleTeamMembers.filter((member) => requestedIds.has(member.id)).map((member) => member.id)
}
