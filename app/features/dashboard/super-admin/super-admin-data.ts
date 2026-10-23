export type UserAccountRole =
  | 'EMPLOYEE'
  | 'MANAGER'
  | 'FINANCE'
  | 'SPENDING_APPROVER'
  | 'IT_ADMIN'
  | 'SUPER_ADMIN'

export type AccountStatus = 'ACTIVE' | 'INVITED' | 'LOCKED' | 'DEACTIVATED'

export interface UserAccount {
  departmentCode?: string
  departmentId?: string
  departmentName?: string
  email: string
  employeeCode: string
  id: string
  invitedAt?: string
  isSelf?: boolean
  lastLoginAt?: string
  name: string
  phone?: string
  position: string
  role: UserAccountRole // STRICT INVARIANT: Exactly 1 current role!
  status: AccountStatus
}

// Backward compatibility alias for any existing imports
export interface AdminAccount extends UserAccount {
  department: string
  directRoles: string[]
  effectiveRoles: string[]
}

export type DepartmentStatus = 'CONFIGURED' | 'INCOMPLETE' | 'DEPRECATED'

export interface Department {
  code: string
  createdAt: string
  description: string
  id: string
  managerEmail?: string
  managerId?: string
  managerName?: string
  memberCount: number
  name: string
  status: DepartmentStatus
}

export interface ReminderPolicy {
  effectiveFrom: string
  lastUpdated: string
  noticeDays: number // Default: 2 days (48 consecutive hours)
  recipientRole: 'MANAGER'
}

export interface PendingManagerRequestSample {
  departmentName: string
  employeeEmail: string
  employeeName: string
  id: string
  isOverdue: boolean
  managerEmail: string
  managerName: string
  requestedAt: string
  softwareName: string
  status: 'PENDING' | 'RESOLVED_EARLY' | 'ALERT_SENT' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'
  waitingHours: number
}

export interface RoleDefinition {
  colorTone: 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'danger'
  description: string
  isSingleton?: boolean
  key: UserAccountRole
  name: string
  responsibilities: string[]
}

export const roleDefinitions: Record<UserAccountRole, RoleDefinition> = {
  EMPLOYEE: {
    colorTone: 'neutral',
    description: 'Role mặc định khi tạo tài khoản. Gửi yêu cầu cấp phần mềm tới Manager khi đã xếp phòng.',
    key: 'EMPLOYEE',
    name: 'Nhân viên (Employee)',
    responsibilities: ['Gửi yêu cầu cấp phần mềm/license', 'Sử dụng tài khoản công ty cá nhân', 'Xem dữ liệu sử dụng bản thân']
  },
  MANAGER: {
    colorTone: 'info',
    description: 'Người quản lý một phòng ban cụ thể. Luôn gắn liền với một phòng ban và nhận yêu cầu từ phòng đó.',
    key: 'MANAGER',
    name: 'Quản lý phòng ban (Manager)',
    responsibilities: ['Duyệt yêu cầu cấp phần mềm từ thành viên phòng', 'Rà soát tài khoản không dùng (Ghost seat)', 'Nhận thông báo nhắc xử lý khi quá hạn SLA']
  },
  FINANCE: {
    colorTone: 'warning',
    description: 'Role kế toán / tài chính doanh nghiệp. Quản lý ngân sách công nghệ và kiểm soát chi phí.',
    key: 'FINANCE',
    name: 'Tài chính / Kế toán (Finance)',
    responsibilities: ['Theo dõi ngân sách trung tâm chi phí', 'Đính kèm chứng từ và hóa đơn mua', 'Kiểm tra ngân sách trước khi duyệt chi']
  },
  SPENDING_APPROVER: {
    colorTone: 'primary',
    description: 'Role duyệt chi cấp cao nhất của công ty (CEO/Ban điều hành). Quyết định gia hạn, giảm hoặc hủy hợp đồng.',
    isSingleton: true,
    key: 'SPENDING_APPROVER',
    name: 'Người duyệt chi (Spending Approver)',
    responsibilities: ['Phê duyệt các yêu cầu mua sắm/gia hạn vượt thẩm quyền', 'Quyết định hồ sơ hợp thức hóa tài khoản ngoài quy trình', 'Quyết định chu kỳ hợp đồng phần mềm']
  },
  IT_ADMIN: {
    colorTone: 'success',
    description: 'Role quản trị viên CNTT. Quản lý cấp phát, thu hồi tài khoản, license key và xử lý sai lệch.',
    key: 'IT_ADMIN',
    name: 'Quản trị viên CNTT (IT Admin)',
    responsibilities: ['Thực thi cấp phát/thu hồi tài khoản và mã bản quyền', 'Quản lý kho license key pool', 'Điều tra xử lý sai lệch số liệu và gia hạn hợp đồng']
  },
  SUPER_ADMIN: {
    colorTone: 'danger',
    description: 'Role quản trị hệ thống tối cao. Thiết lập cơ cấu tổ chức, phân quyền vai trò và chính sách nhắc việc.',
    isSingleton: true,
    key: 'SUPER_ADMIN',
    name: 'Quản trị hệ thống (Super Admin)',
    responsibilities: ['Khởi tạo và quản trị phòng ban', 'Quản trị danh mục tài khoản người dùng', 'Gán/đổi/thu hồi role đặc biệt', 'Cấu hình thời hạn nhắc Manager']
  }
}

export const initialDepartments: Department[] = [
  {
    code: 'ENG',
    createdAt: '2026-01-15',
    description: 'Phụ trách phát triển giải pháp phần mềm, hạ tầng kỹ thuật và DevOps của công ty.',
    id: 'dept-01',
    managerEmail: 'quang.huy@company.com',
    managerId: 'acc-02',
    managerName: 'Quang Huy',
    memberCount: 18,
    name: 'Khối CNTT & Kỹ thuật',
    status: 'CONFIGURED'
  },
  {
    code: 'FIN',
    createdAt: '2026-01-15',
    description: 'Quản lý tài chính, kiểm soát ngân sách chi tiêu và quyết toán hóa đơn doanh nghiệp.',
    id: 'dept-02',
    managerEmail: 'ngoc.lan@company.com',
    managerId: 'acc-03',
    managerName: 'Ngọc Lan',
    memberCount: 6,
    name: 'Phòng Tài chính Kế toán',
    status: 'CONFIGURED'
  },
  {
    code: 'DES',
    createdAt: '2026-02-01',
    description: 'Thiết kế giao diện sản phẩm UI/UX, Design System và trải nghiệm người dùng.',
    id: 'dept-03',
    managerEmail: 'thu.ha@company.com',
    managerId: 'acc-05',
    managerName: 'Thu Hà',
    memberCount: 8,
    name: 'Phòng Thiết kế & Trải nghiệm',
    status: 'CONFIGURED'
  },
  {
    code: 'MKT',
    createdAt: '2026-03-10',
    description: 'Truyền thông thương hiệu, tăng trưởng người dùng và tiếp thị số.',
    id: 'dept-04',
    memberCount: 5,
    name: 'Phòng Marketing & Tăng trưởng',
    status: 'INCOMPLETE' // Chưa có Manager!
  },
  {
    code: 'HR',
    createdAt: '2026-03-12',
    description: 'Tuyển dụng nhân sự, đào tạo, quản trị văn hóa và chính sách đãi ngộ nhân tài.',
    id: 'dept-05',
    memberCount: 4,
    name: 'Phòng Nhân sự & Đào tạo',
    status: 'INCOMPLETE' // Chưa có Manager!
  },
  {
    code: 'EXEC',
    createdAt: '2026-01-01',
    description: 'Ban điều hành, hoạch định chiến lược kinh doanh và ra quyết định chi tiêu trọng yếu.',
    id: 'dept-06',
    managerEmail: 'hoang.nam@company.com',
    managerId: 'acc-04',
    managerName: 'Hoàng Nam',
    memberCount: 3,
    name: 'Ban Điều Hành',
    status: 'CONFIGURED'
  }
]

export const initialUserAccounts: UserAccount[] = [
  {
    departmentCode: 'EXEC',
    departmentId: 'dept-06',
    departmentName: 'Ban Điều Hành',
    email: 'minh.anh@company.com',
    employeeCode: 'EMP-001',
    id: 'acc-01',
    isSelf: true,
    lastLoginAt: '2026-10-22 09:15',
    name: 'Minh Anh',
    phone: '0901 234 567',
    position: 'Quản trị viên Hệ thống',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE'
  },
  {
    departmentCode: 'ENG',
    departmentId: 'dept-01',
    departmentName: 'Khối CNTT & Kỹ thuật',
    email: 'quang.huy@company.com',
    employeeCode: 'EMP-014',
    id: 'acc-02',
    lastLoginAt: '2026-10-22 08:42',
    name: 'Quang Huy',
    phone: '0912 345 678',
    position: 'Chuyên viên Hệ thống & Quản trị CNTT',
    role: 'IT_ADMIN',
    status: 'ACTIVE'
  },
  {
    departmentCode: 'FIN',
    departmentId: 'dept-02',
    departmentName: 'Phòng Tài chính Kế toán',
    email: 'ngoc.lan@company.com',
    employeeCode: 'EMP-025',
    id: 'acc-03',
    lastLoginAt: '2026-10-21 17:30',
    name: 'Ngọc Lan',
    phone: '0923 456 789',
    position: 'Kế toán trưởng',
    role: 'FINANCE',
    status: 'ACTIVE'
  },
  {
    departmentCode: 'EXEC',
    departmentId: 'dept-06',
    departmentName: 'Ban Điều Hành',
    email: 'hoang.nam@company.com',
    employeeCode: 'EMP-005',
    id: 'acc-04',
    lastLoginAt: '2026-10-22 09:00',
    name: 'Hoàng Nam',
    phone: '0934 567 890',
    position: 'Phó Tổng Giám Đốc',
    role: 'SPENDING_APPROVER',
    status: 'ACTIVE'
  },
  {
    departmentCode: 'DES',
    departmentId: 'dept-03',
    departmentName: 'Phòng Thiết kế & Trải nghiệm',
    email: 'thu.ha@company.com',
    employeeCode: 'EMP-032',
    id: 'acc-05',
    lastLoginAt: '2026-10-21 14:15',
    name: 'Thu Hà',
    phone: '0945 678 901',
    position: 'Trưởng phòng Thiết kế UI/UX',
    role: 'MANAGER',
    status: 'ACTIVE'
  },
  {
    departmentCode: 'ENG',
    departmentId: 'dept-01',
    departmentName: 'Khối CNTT & Kỹ thuật',
    email: 'duc.anh@company.com',
    employeeCode: 'EMP-088',
    id: 'acc-06',
    lastLoginAt: '2026-10-20 11:20',
    name: 'Đức Anh',
    phone: '0956 789 012',
    position: 'Kỹ sư Phần mềm',
    role: 'EMPLOYEE',
    status: 'ACTIVE'
  },
  {
    departmentCode: 'MKT',
    departmentId: 'dept-04',
    departmentName: 'Phòng Marketing & Tăng trưởng',
    email: 'tien.dung@company.com',
    employeeCode: 'EMP-104',
    id: 'acc-07',
    invitedAt: '2026-10-18 10:00',
    name: 'Phạm Tiến Dũng',
    phone: '0967 890 123',
    position: 'Chuyên viên Digital Marketing',
    role: 'EMPLOYEE',
    status: 'INVITED'
  },
  {
    departmentCode: 'HR',
    departmentId: 'dept-05',
    departmentName: 'Phòng Nhân sự & Đào tạo',
    email: 'van.kien@company.com',
    employeeCode: 'EMP-092',
    id: 'acc-08',
    lastLoginAt: '2026-09-30 16:45',
    name: 'Vũ Văn Kiên',
    phone: '0978 901 234',
    position: 'Chuyên viên Tuyển dụng',
    role: 'EMPLOYEE',
    status: 'LOCKED'
  },
  {
    email: 'van.binh@company.com',
    employeeCode: 'EMP-112',
    id: 'acc-09',
    lastLoginAt: '2026-10-19 08:30',
    name: 'Nguyễn Văn Bình',
    phone: '0989 012 345',
    position: 'Kỹ sư DevOps',
    role: 'EMPLOYEE',
    status: 'ACTIVE' // Chưa có phòng ban!
  },
  {
    email: 'thi.mai@company.com',
    employeeCode: 'EMP-115',
    id: 'acc-10',
    lastLoginAt: '2026-10-20 10:15',
    name: 'Trần Thị Mai',
    phone: '0990 123 456',
    position: 'Chuyên viên QA/QC',
    role: 'EMPLOYEE',
    status: 'ACTIVE' // Chưa có phòng ban!
  },
  {
    email: 'quoc.bao@company.com',
    employeeCode: 'EMP-120',
    id: 'acc-11',
    invitedAt: '2026-10-21 16:00',
    name: 'Lê Quốc Bảo',
    phone: '0902 345 678',
    position: 'HR Business Partner',
    role: 'EMPLOYEE',
    status: 'INVITED' // Chưa có phòng ban!
  }
]

// Backward-compatible representation with directRoles/effectiveRoles for existing code
export const initialAdminAccounts: AdminAccount[] = initialUserAccounts.map((acc) => ({
  ...acc,
  department: acc.departmentName || 'Chưa xếp phòng',
  directRoles: [acc.role],
  effectiveRoles: [acc.role]
}))

export const initialReminderPolicy: ReminderPolicy = {
  effectiveFrom: '2026-10-01 00:00:00',
  lastUpdated: '2026-10-15 14:30:00',
  noticeDays: 2, // 2 days = 48 consecutive hours
  recipientRole: 'MANAGER'
}

export const initialPendingRequests: PendingManagerRequestSample[] = [
  {
    departmentName: 'Phòng Thiết kế & Trải nghiệm',
    employeeEmail: 'tran.tuan@company.com',
    employeeName: 'Trần Tuấn',
    id: 'REQ-2026-101',
    isOverdue: true, // 54h > 48h (2 days)
    managerEmail: 'thu.ha@company.com',
    managerName: 'Thu Hà',
    requestedAt: '20/10/2026 09:00',
    softwareName: 'Figma Organization (Editor)',
    status: 'ALERT_SENT',
    waitingHours: 54
  },
  {
    departmentName: 'Khối CNTT & Kỹ thuật',
    employeeEmail: 'duc.anh@company.com',
    employeeName: 'Đức Anh',
    id: 'REQ-2026-102',
    isOverdue: false, // 22h < 48h
    managerEmail: 'quang.huy@company.com',
    managerName: 'Quang Huy',
    requestedAt: '21/10/2026 15:30',
    softwareName: 'JetBrains All Products Pack',
    status: 'PENDING',
    waitingHours: 22
  },
  {
    departmentName: 'Phòng Marketing & Tăng trưởng',
    employeeEmail: 'tien.dung@company.com',
    employeeName: 'Phạm Tiến Dũng',
    id: 'REQ-2026-103',
    isOverdue: true, // 50h > 48h nhưng phòng chưa có Manager!
    managerEmail: 'Chưa có Manager',
    managerName: 'Chưa có Manager',
    requestedAt: '20/10/2026 13:00',
    softwareName: 'Adobe Creative Cloud',
    status: 'PENDING',
    waitingHours: 50
  }
]

export interface SystemSettings {
  alternateApproverId: string
  alternateApproverName: string
  auditRetentionDays: number
  budgetPeriodType: 'QUARTERLY' | 'YEARLY'
  fallbackApproverId: string
  fallbackApproverName: string
  ghostSeatThresholdDays: number
  primaryApproverId: string
  primaryApproverName: string
  seatWarningThresholdPercent: number
  slaHours: number
}

export const initialSystemSettings: SystemSettings = {
  alternateApproverId: 'EMP-007',
  alternateApproverName: 'Lê Hồng Minh (Phó GĐ Vận hành)',
  auditRetentionDays: 365,
  budgetPeriodType: 'QUARTERLY',
  fallbackApproverId: 'EMP-003',
  fallbackApproverName: 'Nguyễn Thị Mai (Ban Kiểm Soát)',
  ghostSeatThresholdDays: 60,
  primaryApproverId: 'EMP-005',
  primaryApproverName: 'Hoàng Nam (Phó Tổng Giám Đốc)',
  seatWarningThresholdPercent: 85,
  slaHours: 48
}

export interface SuccessorCandidate {
  department: string
  email: string
  employeeCode: string
  id: string
  ineligibleReason?: string
  isEligible: boolean
  name: string
  position: string
}

export const successorCandidates: SuccessorCandidate[] = [
  {
    department: 'Ban Điều Hành',
    email: 'tuan.tu@company.com',
    employeeCode: 'EMP-008',
    id: 'cand-01',
    isEligible: true,
    name: 'Đặng Tuấn Tú',
    position: 'Phó Ban Chiến Lược'
  },
  {
    department: 'Khối CNTT & Kỹ thuật',
    email: 'quang.huy@company.com',
    employeeCode: 'EMP-014',
    id: 'cand-02',
    ineligibleReason: 'Vi phạm SoD-1: Đang giữ vai trò IT_ADMIN (Không được kiêm Super Admin)',
    isEligible: false,
    name: 'Quang Huy',
    position: 'Chuyên viên Hệ thống'
  },
  {
    department: 'Phòng Tài chính Kế toán',
    email: 'ngoc.lan@company.com',
    employeeCode: 'EMP-025',
    id: 'cand-03',
    ineligibleReason: 'Vi phạm SoD-1: Đang giữ vai trò FINANCE (Không được kiêm Super Admin)',
    isEligible: false,
    name: 'Ngọc Lan',
    position: 'Kế toán trưởng'
  },
  {
    department: 'Ban Điều Hành',
    email: 'hoang.nam@company.com',
    employeeCode: 'EMP-005',
    id: 'cand-04',
    ineligibleReason: 'Vi phạm SoD-1: Đang giữ vai trò SPENDING_APPROVER (Người duyệt chi)',
    isEligible: false,
    name: 'Hoàng Nam',
    position: 'Phó Tổng Giám Đốc'
  }
]

export interface AuditLogItem {
  action: string
  actorName: string
  actorRole: string
  id: string
  ipAddress: string
  newValue?: string
  prevValue?: string
  status: 'SUCCESS' | 'REJECTED'
  target: string
  timestamp: string
}

export const initialAuditLogs: AuditLogItem[] = [
  {
    action: 'Cập nhật thời hạn nhắc Manager',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'log-01',
    ipAddress: '192.168.1.10',
    newValue: '2 ngày (48 giờ)',
    prevValue: '3 ngày (72 giờ)',
    status: 'SUCCESS',
    target: 'Chính sách SLA nhắc Manager',
    timestamp: '2026-10-22 14:30:15'
  },
  {
    action: 'Chỉ định Manager phòng ban',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'log-02',
    ipAddress: '192.168.1.10',
    newValue: 'Thu Hà (MANAGER)',
    prevValue: 'Chưa có Manager',
    status: 'SUCCESS',
    target: 'Phòng Thiết kế & Trải nghiệm',
    timestamp: '2026-10-21 16:45:00'
  },
  {
    action: 'Gán vai trò Người duyệt chi',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'log-03',
    ipAddress: '192.168.1.10',
    newValue: 'Hoàng Nam (SPENDING_APPROVER)',
    prevValue: 'EMPLOYEE',
    status: 'SUCCESS',
    target: 'Tài khoản EMP-005',
    timestamp: '2026-10-15 10:12:30'
  }
]

export interface BackgroundJobItem {
  id: string
  lastRunAt: string
  name: string
  nextRunAt: string
  processedRecords: number
  schedule: string
  status: 'SUCCESS' | 'RUNNING' | 'FAILED'
}

export const initialBackgroundJobs: BackgroundJobItem[] = [
  {
    id: 'job-01',
    lastRunAt: '2026-10-22 15:00',
    name: 'Quét hạn chót và gửi nhắc Manager (SLA Reminder Job)',
    nextRunAt: '2026-10-22 16:00',
    processedRecords: 3,
    schedule: 'Mỗi 1 giờ',
    status: 'SUCCESS'
  },
  {
    id: 'job-02',
    lastRunAt: '2026-10-22 00:00',
    name: 'Đồng bộ danh mục tài khoản IdP / Google Workspace',
    nextRunAt: '2026-10-23 00:00',
    processedRecords: 11,
    schedule: 'Hằng ngày lúc 00:00',
    status: 'SUCCESS'
  }
]

export interface AvailableEmployee {
  department: string
  email: string
  employeeCode: string
  id: string
  name: string
  position: string
}

export const availableEmployeesForAccount: AvailableEmployee[] = initialUserAccounts
  .filter((a) => a.role === 'EMPLOYEE' && a.status === 'ACTIVE')
  .map((a) => ({
    department: a.departmentName || 'Chưa xếp phòng',
    email: a.email,
    employeeCode: a.employeeCode,
    id: a.id,
    name: a.name,
    position: a.position
  }))
