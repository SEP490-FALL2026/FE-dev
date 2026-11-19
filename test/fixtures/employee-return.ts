import type { ReturnResponseDtoDataReturnRequest } from '~/shared/api/generated/model/return-requests/returnResponseDtoDataReturnRequest'
import { assignmentId, employeeId, person, plan, requestId } from './employee-api'

export const employeeReturn: ReturnResponseDtoDataReturnRequest = {
  id: requestId,
  state: 'AWAITING_REVOCATION',
  source: 'EMPLOYEE_RETURN',
  assignmentId,
  plan,
  holder: person,
  requestedBy: person,
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  requestedOn: '2026-11-02',
  handover: { required: true, dueOn: '2026-11-05', confirmed: false, flagged: false },
  createdAt: '2026-11-02T03:00:00Z',
  completedAt: null,
  failedAt: null,
  reason: 'No longer needed',
  revocationNote: 'Export the project files',
  originRequestId: null,
  handoverConfirmedBy: null,
  handoverConfirmedAt: null,
  failureReason: null
}
