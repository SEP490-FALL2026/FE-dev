import type { TeamMember } from './team-member.types'

// The supplied HTML contains eight profiles; overview totals describe eighteen.
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'van.a@company.com',
    initials: 'NA',
    department: 'Product Design',
    team: 'Product',
    costCenter: 'CC-001',
    costCenterName: 'Product Development',
    activeLicenses: 4,
    pendingRequests: 1,
    status: 'active',
    lastActive: { value: -2, unit: 'hour' }
  },
  {
    id: '2',
    name: 'Trần Bảo',
    email: 'bao.tran@company.com',
    initials: 'TB',
    department: 'Product Design',
    team: 'Product',
    costCenter: 'CC-001',
    costCenterName: 'Product Development',
    activeLicenses: 3,
    pendingRequests: 1,
    status: 'active',
    lastActive: { value: -1, unit: 'day' }
  },
  {
    id: '3',
    name: 'Lê Cường',
    email: 'cuong.le@company.com',
    initials: 'LC',
    department: 'Engineering',
    team: 'Platform',
    costCenter: 'CC-002',
    costCenterName: 'Engineering',
    activeLicenses: 5,
    pendingRequests: 0,
    status: 'active',
    lastActive: { value: -3, unit: 'hour' },
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VA1lOZ6HUvWXve95hcFcN63PU4z2BoZ1MiCQdvfc_ZHy34SL6ebsC_ZqBXC0_LSWdk1d-ooOuQcMNKOpqKEsakZn3EiGzpOa4ee6QW1-77X0cLa3dRhC8IV0ecVc0zn-r6m97j9tt1-C7Homc8073Ehm-nHJ311arpSF2l-S25AjuP4MXaO4XhIIJdPKROPqD34xPj1Vk50_6s19xYlSy4Qo4-Y5zvpPe4snuxVGjCg17qf3O1D_'
  },
  {
    id: '4',
    name: 'Nguyễn Duy',
    email: 'duy.nguyen@company.com',
    initials: 'ND',
    department: 'Marketing',
    team: 'Growth',
    costCenter: 'CC-003',
    costCenterName: 'Marketing',
    activeLicenses: 2,
    pendingRequests: 1,
    status: 'active',
    lastActive: { value: -5, unit: 'hour' }
  },
  {
    id: '5',
    name: 'Phạm Minh Hoàng',
    email: 'hoang.pham@company.com',
    initials: 'PH',
    department: 'Engineering',
    team: 'Platform',
    costCenter: 'CC-002',
    costCenterName: 'Engineering',
    activeLicenses: 4,
    pendingRequests: 0,
    status: 'active',
    lastActive: { value: -1, unit: 'day' },
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgabnkVlm7-3AwU9XhM3OHcfqlzMoFyYfX_MPH9ADi43NmX6JChxvQGjycT0NkQlcUZSgl6mHNl4rpIEUMhlsQ9QUTf0YjBImzJnK3lalmClJx_ayeRTXLSwQ2afXX0M47RM5J2YrF1B3XPLXzx4GvLvNh6ZBoAmcQrKbAwoHVSDMFbpifC3suhnEyGcHm9Is6rF9RJJ-DFxiCF2CWCzPSXsLMJBSnN19qvF_MfGjPl8uK1ryePJEJ'
  },
  {
    id: '6',
    name: 'Vũ Hải',
    email: 'hai.vu@company.com',
    initials: 'VH',
    department: 'Product Design',
    team: 'Product',
    costCenter: 'CC-001',
    costCenterName: 'Product Development',
    activeLicenses: 3,
    pendingRequests: 0,
    status: 'inactive',
    lastActive: { value: -15, unit: 'day' }
  },
  {
    id: '7',
    name: 'Lê Thảo',
    email: 'thao.le@company.com',
    initials: 'LT',
    department: 'Marketing',
    team: 'Growth',
    costCenter: 'CC-003',
    costCenterName: 'Marketing',
    activeLicenses: 1,
    pendingRequests: 1,
    status: 'inactive',
    lastActive: { value: -21, unit: 'day' }
  },
  {
    id: '8',
    name: 'Ngô Minh',
    email: 'minh.ngo@company.com',
    initials: 'NM',
    department: 'Sales',
    team: 'Sales',
    costCenter: 'CC-004',
    costCenterName: 'Sales',
    activeLicenses: 2,
    pendingRequests: 0,
    status: 'inactive',
    lastActive: { value: -30, unit: 'day' }
  }
]
