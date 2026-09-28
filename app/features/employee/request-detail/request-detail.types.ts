export interface RequestDetailData {
  id: string
  softwareName: string
  softwareLogoUrl: string
  plan: string
  requestTypeKey: string
  requestTypeBadge: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  statusBadgeKey: string
  submittedDate: string
  submittedTime: string
  currentStatusDescKey: string
  businessReason: string
  project: string
  costCenter: string
  requiredFrom: string
  requiredUntil: string
  submittedBy: {
    name: string
    avatarUrl: string
  }
  managerName: string
}

export interface ApprovalStepItem {
  id: number
  titleKey: string
  statusKey: string
  statusType: 'completed' | 'in_progress' | 'not_required' | 'pending'
  date?: string
  descriptionKey?: string
  noticeTitleKey?: string
  noticeDescKey?: string
}

export interface RequestHistoryItem {
  id: string
  timestamp: string
  titleKey: string
  descKey: string
  dotColor: 'orange' | 'green'
}
