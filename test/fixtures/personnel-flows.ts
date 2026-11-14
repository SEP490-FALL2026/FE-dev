import type { MyTransferResponseDtoData } from '~/shared/api/generated/model/me/myTransferResponseDtoData'
import type { MyDepartmentSoftwareListResponseDtoDataItemsItem } from '~/shared/api/generated/model/department-software-list/myDepartmentSoftwareListResponseDtoDataItemsItem'
import type { DepartmentSoftwareProposalListResponseDtoDataItemsItem } from '~/shared/api/generated/model/department-software-proposals/departmentSoftwareProposalListResponseDtoDataItemsItem'
import { assignmentId, employeeId, planId } from './employee-api'

export const transferNotice: NonNullable<MyTransferResponseDtoData> = {
  id: employeeId,
  from: { department: { id: employeeId, code: 'ENG', name: 'Engineering' } },
  to: { department: { id: planId, code: 'OPS', name: 'Operations' } },
  effectiveOn: '2026-11-16',
  grace: { endsOn: '2026-11-20', reminderOn: '2026-11-18' },
  rights: [
    {
      assignmentId,
      application: { id: planId, name: 'Test Software' },
      plan: { id: planId, name: 'Standard' },
      provisioningType: 'K2',
      state: 'HELD',
      revocation: null,
      regranted: false
    }
  ]
}

export const departmentSoftwareEntry: MyDepartmentSoftwareListResponseDtoDataItemsItem = {
  entryId: assignmentId,
  applicationId: planId,
  applicationName: 'Test Software',
  planId,
  planName: 'Standard',
  note: 'Team collaboration',
  addedAt: '2026-11-14'
}
export const softwareProposal: DepartmentSoftwareProposalListResponseDtoDataItemsItem = {
  proposalId: assignmentId,
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  applicationId: planId,
  applicationName: 'Test Software',
  planId,
  planName: 'Standard',
  reason: 'Design collaboration',
  state: 'REJECTED' as const,
  proposedBy: { employeeId, employeeCode: 'E1', fullName: 'Test Manager' },
  proposedAt: '2026-11-14',
  decidedAt: '2026-11-14',
  decisionReason: 'Use the existing team plan'
}
