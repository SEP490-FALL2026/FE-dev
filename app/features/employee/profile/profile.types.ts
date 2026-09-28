export interface PersonalInfoData {
  fullName: string
  employeeId: string
  email: string
  position: string
  phone: string
  department: string
  joinDate: string
}

export interface OrganizationData {
  company: string
  team: string
  department: string
  costCenter: string
}

export interface StoredDataCategory {
  id: string
  boldKey: string
  textKey: string
}

export interface PrivacyActionItem {
  id: string
  iconType: 'download' | 'clock' | 'shield-check'
  titleKey: string
  subtitleKey: string
}
