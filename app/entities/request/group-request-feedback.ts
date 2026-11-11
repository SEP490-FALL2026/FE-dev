import axios from 'axios'
import { GroupCheckResponseDtoDataLinesItemReason } from '~/shared/api/generated/model/group-requests/groupCheckResponseDtoDataLinesItemReason'

export type GroupLineFailure = { employeeId: string; reason: string | null }

export function getGroupLineFailures(error: unknown): GroupLineFailure[] {
  const body = axios.isAxiosError(error) ? error.response?.data?.error : undefined
  if (body?.code !== 'GROUP_REQUEST.LINES_REFUSED' || !Array.isArray(body.details?.lines)) return []
  return body.details.lines.flatMap((line: unknown) => {
    if (!line || typeof line !== 'object' || !('employeeId' in line) || typeof line.employeeId !== 'string') return []
    return [
      { employeeId: line.employeeId, reason: 'reason' in line && typeof line.reason === 'string' ? line.reason : null }
    ]
  })
}

export function groupLineReasonKey(reason: string | null) {
  return reason && Object.values(GroupCheckResponseDtoDataLinesItemReason).some((value) => value === reason)
    ? (`eligibility.${reason}` as 'eligibility.HAS_ACCESS')
    : 'ineligible'
}
