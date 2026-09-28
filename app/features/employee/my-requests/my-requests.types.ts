export type RequestStatus = 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled'

export type RequestType = 'newSoftware' | 'changePlan' | 'renewal'

export interface RequestStep {
  nameKey: string
  descriptionKey: string
  iconType: 'user' | 'gear' | 'check' | 'xmark'
  status: RequestStatus
}

export interface SoftwareRequestItem {
  id: string
  softwareName: string
  softwareLogoUrl: string
  requestType: RequestType
  submittedDate: string
  submittedTime: string
  currentStep: RequestStep
  status: RequestStatus
  highlight?: boolean
}
