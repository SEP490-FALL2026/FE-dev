export interface AssignedSoftware {
  activeMinutes30d: number
  assignedDate: string
  id: string
  logo: string
  monthlyCost: number
  name: string
  plan: string
  status: 'ACTIVE' | 'LOW_USAGE' | 'INACTIVE'
}

export interface TeamMember {
  activeLicensesCount: number
  assignedSoftware: AssignedSoftware[]
  avatar: string
  code: string
  costCenter: string
  department: string
  email: string
  id: string
  jobTitle: string
  joined: string
  lastActive: string
  name: string
  pendingRequestsCount: number
  status: 'ACTIVE' | 'ON_LEAVE' | 'OFFBOARDING'
  team: string
}

export interface TeamSoftwareItem {
  activeRate: number
  category: string
  ghostCount: number
  id: string
  inUseSeats: number
  logo: string
  monthlyCost: number
  name: string
  plan: string
  status: string
  totalSeats: number
  vendor: string
}

export interface TeamRequestItem {
  code: string
  estimatedMonthlyCost: number
  id: string
  justification: string
  logo: string
  plan: string
  requesterEmail: string
  requesterId: string
  requesterJob: string
  requesterName: string
  saasName: string
  slaHours: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedDate: string
  type: 'NEW_ACCESS' | 'CHANGE_PLAN' | 'RENEWAL'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface GhostSeatItem {
  assignedDate: string
  costCenter: string
  employeeEmail: string
  employeeId: string
  employeeJob: string
  employeeName: string
  evidenceNote: string
  flagRule: 'G3' | 'G4'
  id: string
  inactiveDays: number
  logo: string
  monthlyCost: number
  plan: string
  softwareId: string
  softwareName: string
  status: 'FLAGGED' | 'REVOKED' | 'KEPT'
}

export interface AccessReviewItem {
  employeeId: string
  employeeName: string
  id: string
  jobTitle: string
  lastActiveDate: string
  logo: string
  plan: string
  softwareName: string
  status: 'PENDING' | 'RETAIN' | 'REVOKE'
}

export const managerMetrics = {
  activeSoftware: 8,
  ghostSeats: 4,
  monthlySpend: 54_800_000,
  pendingApprovals: 3,
  potentialSavings: 18_500_000,
  teamMembers: 12
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    activeLicensesCount: 5,
    assignedSoftware: [
      {
        activeMinutes30d: 1420,
        assignedDate: '2025-01-15',
        id: 's1',
        logo: '🎨',
        monthlyCost: 350_000,
        name: 'Figma',
        plan: 'Professional',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 980,
        assignedDate: '2025-02-10',
        id: 's2',
        logo: '💻',
        monthlyCost: 520_000,
        name: 'GitHub',
        plan: 'Enterprise',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 210,
        assignedDate: '2025-03-01',
        id: 's3',
        logo: '📋',
        monthlyCost: 200_000,
        name: 'Jira Software',
        plan: 'Standard',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 45,
        assignedDate: '2025-01-20',
        id: 's4',
        logo: '💬',
        monthlyCost: 180_000,
        name: 'Slack',
        plan: 'Business Pro',
        status: 'LOW_USAGE'
      },
      {
        activeMinutes30d: 0,
        assignedDate: '2025-02-01',
        id: 's5',
        logo: '📐',
        monthlyCost: 720_000,
        name: 'AutoCAD',
        plan: 'Commercial',
        status: 'INACTIVE'
      }
    ],
    avatar: '👩‍💻',
    code: 'EMP-1021',
    costCenter: 'CC-PRODUCT-01',
    department: 'Product & Design',
    email: 'lan.mai@saassentry.io',
    id: 'EMP-01',
    jobTitle: 'Senior UI/UX Designer',
    joined: '2024-03-15',
    lastActive: '2026-09-30',
    name: 'Mai Thị Lan',
    pendingRequestsCount: 1,
    status: 'ACTIVE',
    team: 'Product Core'
  },
  {
    activeLicensesCount: 4,
    assignedSoftware: [
      {
        activeMinutes30d: 1890,
        assignedDate: '2024-11-01',
        id: 's2',
        logo: '💻',
        monthlyCost: 520_000,
        name: 'GitHub',
        plan: 'Enterprise',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 820,
        assignedDate: '2024-11-01',
        id: 's3',
        logo: '📋',
        monthlyCost: 200_000,
        name: 'Jira Software',
        plan: 'Standard',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 420,
        assignedDate: '2025-01-10',
        id: 's6',
        logo: '⚡',
        monthlyCost: 450_000,
        name: 'JetBrains All Pack',
        plan: 'Team',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 0,
        assignedDate: '2025-01-20',
        id: 's7',
        logo: '📊',
        monthlyCost: 650_000,
        name: 'Tableau Desktop',
        plan: 'Creator',
        status: 'INACTIVE'
      }
    ],
    avatar: '👨‍💻',
    code: 'EMP-1022',
    costCenter: 'CC-PRODUCT-01',
    department: 'Product & Design',
    email: 'tuan.tran@saassentry.io',
    id: 'EMP-02',
    jobTitle: 'Frontend Engineer',
    joined: '2024-05-20',
    lastActive: '2026-09-29',
    name: 'Trần Văn Tuấn',
    pendingRequestsCount: 0,
    status: 'ACTIVE',
    team: 'Frontend Squad'
  },
  {
    activeLicensesCount: 3,
    assignedSoftware: [
      {
        activeMinutes30d: 1200,
        assignedDate: '2025-02-15',
        id: 's1',
        logo: '🎨',
        monthlyCost: 350_000,
        name: 'Figma',
        plan: 'Professional',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 650,
        assignedDate: '2025-02-15',
        id: 's8',
        logo: '📝',
        monthlyCost: 240_000,
        name: 'Notion',
        plan: 'Business',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 0,
        assignedDate: '2025-03-01',
        id: 's9',
        logo: '🎬',
        monthlyCost: 580_000,
        name: 'Adobe After Effects',
        plan: 'Individual',
        status: 'INACTIVE'
      }
    ],
    avatar: '👩‍🎨',
    code: 'EMP-1023',
    costCenter: 'CC-PRODUCT-01',
    department: 'Product & Design',
    email: 'hoa.le@saassentry.io',
    id: 'EMP-03',
    jobTitle: 'Motion Designer',
    joined: '2025-02-01',
    lastActive: '2026-09-30',
    name: 'Lê Thị Hoa',
    pendingRequestsCount: 1,
    status: 'ACTIVE',
    team: 'Design System'
  },
  {
    activeLicensesCount: 4,
    assignedSoftware: [
      {
        activeMinutes30d: 1100,
        assignedDate: '2024-08-10',
        id: 's3',
        logo: '📋',
        monthlyCost: 200_000,
        name: 'Jira Software',
        plan: 'Standard',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 900,
        assignedDate: '2024-08-10',
        id: 's8',
        logo: '📝',
        monthlyCost: 240_000,
        name: 'Notion',
        plan: 'Business',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 350,
        assignedDate: '2024-09-01',
        id: 's1',
        logo: '🎨',
        monthlyCost: 350_000,
        name: 'Figma',
        plan: 'Viewer-Restricted',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 0,
        assignedDate: '2025-01-15',
        id: 's10',
        logo: '📦',
        monthlyCost: 400_000,
        name: 'Miro Business',
        plan: 'Team',
        status: 'INACTIVE'
      }
    ],
    avatar: '👨‍💼',
    code: 'EMP-1024',
    costCenter: 'CC-PRODUCT-01',
    department: 'Product & Design',
    email: 'nam.hoang@saassentry.io',
    id: 'EMP-04',
    jobTitle: 'Product Owner',
    joined: '2024-08-01',
    lastActive: '2026-09-30',
    name: 'Hoàng Văn Nam',
    pendingRequestsCount: 1,
    status: 'ACTIVE',
    team: 'Product Core'
  },
  {
    activeLicensesCount: 2,
    assignedSoftware: [
      {
        activeMinutes30d: 1350,
        assignedDate: '2025-04-10',
        id: 's2',
        logo: '💻',
        monthlyCost: 520_000,
        name: 'GitHub',
        plan: 'Enterprise',
        status: 'ACTIVE'
      },
      {
        activeMinutes30d: 600,
        assignedDate: '2025-04-10',
        id: 's3',
        logo: '📋',
        monthlyCost: 200_000,
        name: 'Jira Software',
        plan: 'Standard',
        status: 'ACTIVE'
      }
    ],
    avatar: '👨‍💻',
    code: 'EMP-1025',
    costCenter: 'CC-PRODUCT-01',
    department: 'Product & Design',
    email: 'dung.pham@saassentry.io',
    id: 'EMP-05',
    jobTitle: 'Junior QA Engineer',
    joined: '2025-04-01',
    lastActive: '2026-09-28',
    name: 'Phạm Quang Dũng',
    pendingRequestsCount: 0,
    status: 'ON_LEAVE',
    team: 'QA Automation'
  }
]

export const MOCK_TEAM_SOFTWARE: TeamSoftwareItem[] = [
  {
    activeRate: 85,
    category: 'Design & UX',
    ghostCount: 1,
    id: 'figma',
    inUseSeats: 8,
    logo: '🎨',
    monthlyCost: 2_800_000,
    name: 'Figma',
    plan: 'Professional',
    status: 'ACTIVE',
    totalSeats: 10,
    vendor: 'Figma Inc.'
  },
  {
    activeRate: 92,
    category: 'Engineering',
    ghostCount: 0,
    id: 'github',
    inUseSeats: 12,
    logo: '💻',
    monthlyCost: 6_240_000,
    name: 'GitHub Enterprise',
    plan: 'Enterprise',
    status: 'ACTIVE',
    totalSeats: 15,
    vendor: 'GitHub / Microsoft'
  },
  {
    activeRate: 90,
    category: 'Project Management',
    ghostCount: 1,
    id: 'jira',
    inUseSeats: 11,
    logo: '📋',
    monthlyCost: 2_400_000,
    name: 'Jira Software',
    plan: 'Standard',
    status: 'ACTIVE',
    totalSeats: 12,
    vendor: 'Atlassian'
  },
  {
    activeRate: 75,
    category: 'Knowledge Base',
    ghostCount: 1,
    id: 'notion',
    inUseSeats: 7,
    logo: '📝',
    monthlyCost: 1_920_000,
    name: 'Notion',
    plan: 'Business',
    status: 'ACTIVE',
    totalSeats: 8,
    vendor: 'Notion Labs'
  },
  {
    activeRate: 80,
    category: 'Development IDE',
    ghostCount: 0,
    id: 'jetbrains',
    inUseSeats: 4,
    logo: '⚡',
    monthlyCost: 1_800_000,
    name: 'JetBrains All Pack',
    plan: 'Team Commercial',
    status: 'ACTIVE',
    totalSeats: 5,
    vendor: 'JetBrains'
  },
  {
    activeRate: 25,
    category: 'Analytics & BI',
    ghostCount: 1,
    id: 'tableau',
    inUseSeats: 1,
    logo: '📊',
    monthlyCost: 1_300_000,
    name: 'Tableau Desktop',
    plan: 'Creator',
    status: 'LOW_USAGE',
    totalSeats: 2,
    vendor: 'Salesforce'
  }
]

export const MOCK_TEAM_REQUESTS: TeamRequestItem[] = [
  {
    code: 'REQ-M01',
    estimatedMonthlyCost: 350_000,
    id: 'req-01',
    justification: 'Cần license chỉnh sửa trực tiếp thiết kế giao diện cho dự án Sprint 4.',
    logo: '🎨',
    plan: 'Professional Editor',
    requesterEmail: 'lan.mai@saassentry.io',
    requesterId: 'EMP-01',
    requesterJob: 'Senior UI/UX Designer',
    requesterName: 'Mai Thị Lan',
    saasName: 'Figma',
    slaHours: 12,
    status: 'PENDING',
    submittedDate: '2026-09-29',
    type: 'NEW_ACCESS',
    urgency: 'HIGH'
  },
  {
    code: 'REQ-M02',
    estimatedMonthlyCost: 450_000,
    id: 'req-02',
    justification: 'Nâng cấp lên gói Team để hỗ trợ đồng bộ plugin debug nội bộ.',
    logo: '⚡',
    plan: 'All Products Pack',
    requesterEmail: 'hoa.le@saassentry.io',
    requesterId: 'EMP-03',
    requesterJob: 'Motion Designer',
    requesterName: 'Lê Thị Hoa',
    saasName: 'JetBrains',
    slaHours: 28,
    status: 'PENDING',
    submittedDate: '2026-09-28',
    type: 'CHANGE_PLAN',
    urgency: 'MEDIUM'
  },
  {
    code: 'REQ-M03',
    estimatedMonthlyCost: 200_000,
    id: 'req-03',
    justification: 'Gia hạn gói Jira cho quý tiếp theo để tiếp tục quản lý backlog sản phẩm.',
    logo: '📋',
    plan: 'Standard Seat',
    requesterEmail: 'nam.hoang@saassentry.io',
    requesterId: 'EMP-04',
    requesterJob: 'Product Owner',
    requesterName: 'Hoàng Văn Nam',
    saasName: 'Jira Software',
    slaHours: 48,
    status: 'PENDING',
    submittedDate: '2026-09-27',
    type: 'RENEWAL',
    urgency: 'LOW'
  }
]

export const MOCK_GHOST_SEATS: GhostSeatItem[] = [
  {
    assignedDate: '2025-01-20',
    costCenter: 'CC-PRODUCT-01',
    employeeEmail: 'lan.mai@saassentry.io',
    employeeId: 'EMP-01',
    employeeJob: 'Senior UI/UX Designer',
    employeeName: 'Mai Thị Lan',
    evidenceNote: 'Được cấp 90 ngày trước nhưng ghi nhận 0 phút active trên hệ thống IdP & Desktop Collector.',
    flagRule: 'G3',
    id: 'ghost-01',
    inactiveDays: 78,
    logo: '📐',
    monthlyCost: 720_000,
    plan: 'Commercial License',
    softwareId: 'autocad',
    softwareName: 'AutoCAD Architecture',
    status: 'FLAGGED'
  },
  {
    assignedDate: '2025-01-10',
    costCenter: 'CC-PRODUCT-01',
    employeeEmail: 'tuan.tran@saassentry.io',
    employeeId: 'EMP-02',
    employeeJob: 'Frontend Engineer',
    employeeName: 'Trần Văn Tuấn',
    evidenceNote: 'Không phát sinh sự kiện đăng nhập hoặc đồng bộ dữ liệu trong 62 ngày liên tiếp.',
    flagRule: 'G4',
    id: 'ghost-02',
    inactiveDays: 62,
    logo: '📊',
    monthlyCost: 650_000,
    plan: 'Creator Standalone',
    softwareId: 'tableau',
    softwareName: 'Tableau Desktop',
    status: 'FLAGGED'
  },
  {
    assignedDate: '2025-02-15',
    costCenter: 'CC-PRODUCT-01',
    employeeEmail: 'hoa.le@saassentry.io',
    employeeId: 'EMP-03',
    employeeJob: 'Motion Designer',
    employeeName: 'Lê Thị Hoa',
    evidenceNote: 'License được cấp khi thử nghiệm dự án video cũ, hiện dự án đã bàn giao và không còn dùng.',
    flagRule: 'G4',
    id: 'ghost-03',
    inactiveDays: 85,
    logo: '🎬',
    monthlyCost: 580_000,
    plan: 'Creative Cloud App',
    softwareId: 'aftereffects',
    softwareName: 'Adobe After Effects',
    status: 'FLAGGED'
  },
  {
    assignedDate: '2025-01-15',
    costCenter: 'CC-PRODUCT-01',
    employeeEmail: 'nam.hoang@saassentry.io',
    employeeId: 'EMP-04',
    employeeJob: 'Product Owner',
    employeeName: 'Hoàng Văn Nam',
    evidenceNote: 'Tài khoản Miro Team cấp cho workshop Q1, không còn hoạt động kể từ ngày 28/06.',
    flagRule: 'G3',
    id: 'ghost-04',
    inactiveDays: 94,
    logo: '📦',
    monthlyCost: 400_000,
    plan: 'Team Workspace',
    softwareId: 'miro',
    softwareName: 'Miro Business',
    status: 'FLAGGED'
  }
]

export const MOCK_ACCESS_REVIEW: AccessReviewItem[] = [
  {
    employeeId: 'EMP-01',
    employeeName: 'Mai Thị Lan',
    id: 'ar-01',
    jobTitle: 'Senior UI/UX Designer',
    lastActiveDate: '2026-09-30',
    logo: '🎨',
    plan: 'Professional Editor',
    softwareName: 'Figma',
    status: 'RETAIN'
  },
  {
    employeeId: 'EMP-01',
    employeeName: 'Mai Thị Lan',
    id: 'ar-02',
    jobTitle: 'Senior UI/UX Designer',
    lastActiveDate: '2026-07-12',
    logo: '📐',
    plan: 'Commercial License',
    softwareName: 'AutoCAD',
    status: 'PENDING'
  },
  {
    employeeId: 'EMP-02',
    employeeName: 'Trần Văn Tuấn',
    id: 'ar-03',
    jobTitle: 'Frontend Engineer',
    lastActiveDate: '2026-09-29',
    logo: '💻',
    plan: 'Enterprise Member',
    softwareName: 'GitHub Enterprise',
    status: 'RETAIN'
  },
  {
    employeeId: 'EMP-02',
    employeeName: 'Trần Văn Tuấn',
    id: 'ar-04',
    jobTitle: 'Frontend Engineer',
    lastActiveDate: '2026-07-28',
    logo: '📊',
    plan: 'Creator Standalone',
    softwareName: 'Tableau Desktop',
    status: 'PENDING'
  },
  {
    employeeId: 'EMP-03',
    employeeName: 'Lê Thị Hoa',
    id: 'ar-05',
    jobTitle: 'Motion Designer',
    lastActiveDate: '2026-09-30',
    logo: '🎨',
    plan: 'Professional Editor',
    softwareName: 'Figma',
    status: 'RETAIN'
  },
  {
    employeeId: 'EMP-04',
    employeeName: 'Hoàng Văn Nam',
    id: 'ar-06',
    jobTitle: 'Product Owner',
    lastActiveDate: '2026-06-28',
    logo: '📦',
    plan: 'Team Workspace',
    softwareName: 'Miro Business',
    status: 'PENDING'
  }
]
