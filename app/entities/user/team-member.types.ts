export interface TeamMember {
  id: string
  name: string
  email: string
  initials: string
  department: string
  team: string
  costCenter: string
  costCenterName: string
  activeLicenses: number
  pendingRequests: number
  status: 'active' | 'inactive'
  lastActive: { value: number; unit: 'hour' | 'day' }
  avatar?: string
}
