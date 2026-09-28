export interface SoftwareDetailData {
  id: string
  name: string
  tagline: string
  status: 'active' | 'expiringSoon' | 'pending' | 'returned'
  tags: string[]
  assignedDate: string
  expirationDate: string
  category: string
  provider: string
  autoRenewal: boolean
  plan: string
  licenseType: string
  costCenter: string
  owner: string
  project: string
  description: string
  businessOwner: {
    name: string
    title: string
    initials: string
  }
  team: string
  department: string
  totalLicenses: number
  assignedLicenses: number
  availableLicenses: number
  monthlyCost: number
  annualCost: number
  usagePercentage: number
  activeCount: number
  inactiveCount: number
  lastActivityDate: string
}
