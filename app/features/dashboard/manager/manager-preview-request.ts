export interface ManagerPreviewRequest {
  id: string
  createdAt: string
  scope: 'team' | 'individual'
  recipientNames: string[]
  softwareName: string
  desiredPlan: string
  usageStartDate: string
  usageEndDate: string
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  justification: string
}

export type ManagerPreviewRequestInput = Omit<ManagerPreviewRequest, 'id' | 'createdAt'>
