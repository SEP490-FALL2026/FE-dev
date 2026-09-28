export interface RequestSummaryData {
  requestType: string
  requestedBy: string
  software: string
  department: string
  plan: string
  email: string
  vendor: string
  requestDate: string
}

export interface RequestDetailsData {
  businessReason: string
  project: string
  costCenter: string
  requiredFrom: string
  requiredUntil: string
}

export type ApprovalStepStatus = 'completed' | 'pending' | 'not_required' | 'upcoming'

export interface ApprovalStepItem {
  id: string
  stepNumber: number
  title: string
  subtitle: string
  status: ApprovalStepStatus
  statusText: string
}

export interface NextStepItem {
  id: string
  text: string
  color: 'purple' | 'orange' | 'green'
}
