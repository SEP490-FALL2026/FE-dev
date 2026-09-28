export interface SuccessSummaryData {
  softwareName: string
  planName: string
  requestType: string
  requestedPeriod: string
  periodDuration: string
  project: string
  costCenter: string
  requestedBy: string
}

export interface TimelineStepItem {
  id: string
  title: string
  subtitle?: string
  badgeText?: string
  status: 'completed' | 'pending' | 'upcoming'
}
