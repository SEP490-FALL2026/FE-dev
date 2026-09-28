export interface TemporaryRenewalFormData {
  newExpirationDate: string
  duration: string
  durationRange: string
  reason: string
  project: string
  costCenter: string
  additionalNotes: string
}

export interface RenewalSummaryData {
  softwareName: string
  planName: string
  status: 'active'
  currentExpiration: string
  newExpiration: string
  duration: string
  project: string
  costCenter: string
  requestedBy: string
  requestType: string
}
