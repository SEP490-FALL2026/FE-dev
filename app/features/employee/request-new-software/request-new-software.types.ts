export type SoftwareLogoType = 'figma' | 'github' | 'jira'

export interface AvailableSoftwareItem {
  id: string
  name: string
  descriptionKey: string
  logoType: SoftwareLogoType
  isAvailable: boolean
}

export interface RequestFormData {
  selectedSoftwareId: string
  plan: string
  businessReason: string
  project: string
  costCenter: string
  requiredFrom: string
  requiredUntil: string
}
