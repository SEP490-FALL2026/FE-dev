export type ReturnReasonKey = 'project_completed' | 'no_longer_needed' | 'switching_tool' | 'other'

export interface ReturnLicenseFormData {
  reason: ReturnReasonKey
  additionalNotes: string
}

export interface ReturnSoftwareDetail {
  name: string
  plan: string
  status: 'active'
  assignedDate: string
  expirationDate: string
  assignedBy: string
  project: string
  costCenter: string
  requestedBy: string
}
