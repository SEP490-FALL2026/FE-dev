export type SoftwareStatus = 'active' | 'expiringSoon' | 'pending' | 'returned'

export type SoftwareTabType = 'all' | SoftwareStatus

export type SoftwareSortType = 'assignedDate' | 'name' | 'expiration'

export interface SoftwareLicenseItem {
  id: string
  name: string
  vendor: string
  logoUrl: string
  plan: string
  status: SoftwareStatus
  assignedDate: string
  expirationDate: string | null
  licenseKey?: string
}
