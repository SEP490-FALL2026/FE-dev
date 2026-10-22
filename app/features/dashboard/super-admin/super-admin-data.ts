export interface AdminAccount {
  department: string
  directRoles: string[]
  effectiveRoles: string[]
  email: string
  employeeCode: string
  id: string
  invitedAt?: string
  isSelf?: boolean
  lastLoginAt?: string
  name: string
  position: string
  status: 'ACTIVE' | 'INVITED' | 'LOCKED'
}

export interface AvailableEmployee {
  department: string
  email: string
  employeeCode: string
  id: string
  name: string
  position: string
}

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

export interface BackgroundJobItem {
  id: string
  lastRunAt: string
  name: string
  nextRunAt: string
  processedRecords: number
  schedule: string
  status: 'SUCCESS' | 'RUNNING' | 'FAILED'
}

export const initialAdminAccounts: AdminAccount[] = [
  {
    department: 'Ban Điều Hành',
    directRoles: ['SUPER_ADMIN'],
    effectiveRoles: ['SUPER_ADMIN'],
    email: 'minh.anh@company.com',
    employeeCode: 'EMP-001',
    id: 'acc-01',
    isSelf: true,
    lastLoginAt: '2026-10-20 09:15',
    name: 'Minh Anh',
    position: 'Giám đốc Vận hành',
    status: 'ACTIVE'
  },
  {
    department: 'Khối CNTT',
    directRoles: ['IT_ADMIN'],
    effectiveRoles: ['IT_ADMIN'],
    email: 'quang.huy@company.com',
    employeeCode: 'EMP-014',
    id: 'acc-02',
    lastLoginAt: '2026-10-20 08:42',
    name: 'Quang Huy',
    position: 'Chuyên viên Hệ thống',
    status: 'ACTIVE'
  },
  {
    department: 'Phòng Tài Chính Kế Toán',
    directRoles: ['FINANCE'],
    effectiveRoles: ['FINANCE'],
    email: 'ngoc.lan@company.com',
    employeeCode: 'EMP-025',
    id: 'acc-03',
    lastLoginAt: '2026-10-19 17:30',
    name: 'Ngọc Lan',
    position: 'Kế toán trưởng',
    status: 'ACTIVE'
  },
  {
    department: 'Ban Điều Hành',
    directRoles: ['SPENDING_APPROVER'],
    effectiveRoles: ['SPENDING_APPROVER'],
    email: 'hoang.nam@company.com',
    employeeCode: 'EMP-005',
    id: 'acc-04',
    lastLoginAt: '2026-10-20 09:00',
    name: 'Hoàng Nam',
    position: 'Phó Tổng Giám Đốc',
    status: 'ACTIVE'
  },
  {
    department: 'Phòng Kỹ Thuật Phần Mềm',
    directRoles: ['MANAGER'],
    effectiveRoles: ['MANAGER'],
    email: 'thu.ha@company.com',
    employeeCode: 'EMP-032',
    id: 'acc-05',
    lastLoginAt: '2026-10-19 14:15',
    name: 'Thu Hà',
    position: 'Trưởng phòng Kỹ thuật',
    status: 'ACTIVE'
  },
  {
    department: 'Phòng Kỹ Thuật Phần Mềm',
    directRoles: [],
    effectiveRoles: ['EMPLOYEE'],
    email: 'duc.anh@company.com',
    employeeCode: 'EMP-088',
    id: 'acc-06',
    lastLoginAt: '2026-10-18 11:20',
    name: 'Đức Anh',
    position: 'Kỹ sư Phần mềm',
    status: 'ACTIVE'
  },
  {
    department: 'Phòng Marketing',
    directRoles: ['MANAGER'],
    effectiveRoles: ['MANAGER'],
    email: 'tien.dung@company.com',
    employeeCode: 'EMP-104',
    id: 'acc-07',
    invitedAt: '2026-10-15 10:00',
    name: 'Phạm Tiến Dũng',
    position: 'Trưởng nhóm Digital Marketing',
    status: 'INVITED'
  },
  {
    department: 'Phòng Nhân Sự',
    directRoles: [],
    effectiveRoles: ['EMPLOYEE'],
    email: 'van.kien@company.com',
    employeeCode: 'EMP-092',
    id: 'acc-08',
    lastLoginAt: '2026-09-30 16:45',
    name: 'Vũ Văn Kiên',
    position: 'Chuyên viên Tuyển dụng',
    status: 'LOCKED'
  }
]

export const availableEmployeesForAccount: AvailableEmployee[] = [
  {
    department: 'Khối CNTT',
    email: 'van.binh@company.com',
    employeeCode: 'EMP-112',
    id: 'emp-112',
    name: 'Nguyễn Văn Bình',
    position: 'Kỹ sư DevOps'
  },
  {
    department: 'Phòng Kiểm Thử Chất Lượng',
    email: 'thi.mai@company.com',
    employeeCode: 'EMP-115',
    id: 'emp-115',
    name: 'Trần Thị Mai',
    position: 'QA Lead'
  },
  {
    department: 'Phòng Nhân Sự',
    email: 'quoc.bao@company.com',
    employeeCode: 'EMP-120',
    id: 'emp-120',
    name: 'Lê Quốc Bảo',
    position: 'HR Business Partner'
  }
]

export const initialSystemSettings: SystemSettings = {
  alternateApproverId: 'EMP-007',
  alternateApproverName: 'Lê Hồng Minh (Phó GĐ Vận hành)',
  auditRetentionDays: 365,
  budgetPeriodType: 'QUARTERLY',
  fallbackApproverId: 'EMP-003',
  fallbackApproverName: 'Nguyễn Thị Mai (Trưởng Ban Kiểm Soát)',
  ghostSeatThresholdDays: 60,
  primaryApproverId: 'EMP-005',
  primaryApproverName: 'Hoàng Nam (Phó Tổng Giám Đốc)',
  seatWarningThresholdPercent: 85,
  slaHours: 48
}

export const successorCandidates: SuccessorCandidate[] = [
  {
    department: 'Ban Chiến Lược & Chuyển Đổi Số',
    email: 'tuan.tu@company.com',
    employeeCode: 'EMP-008',
    id: 'cand-01',
    isEligible: true,
    name: 'Đặng Tuấn Tú',
    position: 'Phó Ban Chiến Lược'
  },
  {
    department: 'Khối CNTT',
    email: 'quang.huy@company.com',
    employeeCode: 'EMP-014',
    id: 'cand-02',
    ineligibleReason: 'Vi phạm SoD-1: Đang giữ vai trò IT_ADMIN (không được kiêm Super Admin)',
    isEligible: false,
    name: 'Quang Huy',
    position: 'Chuyên viên Hệ thống'
  },
  {
    department: 'Phòng Tài Chính Kế Toán',
    email: 'ngoc.lan@company.com',
    employeeCode: 'EMP-025',
    id: 'cand-03',
    ineligibleReason: 'Vi phạm SoD-1: Đang giữ vai trò FINANCE (không được kiêm Super Admin)',
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

export const initialAuditLogs: AuditLogItem[] = [
  {
    action: 'Cập nhật cấu hình người duyệt chi thay thế',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'aud-01',
    ipAddress: '192.168.1.10',
    newValue: 'Lê Hồng Minh (EMP-007)',
    prevValue: 'Trần Văn Bình (EMP-004)',
    status: 'SUCCESS',
    target: 'SystemSettings.alternateApprover',
    timestamp: '2026-10-20 09:30:15'
  },
  {
    action: 'Gửi lại thư mời kích hoạt tài khoản',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'aud-02',
    ipAddress: '192.168.1.10',
    newValue: 'Token INV-2026-9921 generated',
    prevValue: 'Token INV-2026-8812 expired',
    status: 'SUCCESS',
    target: 'Account: tien.dung@company.com',
    timestamp: '2026-10-19 16:45:22'
  },
  {
    action: 'Cố gắng sửa vai trò tài khoản bản thân',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'aud-03',
    ipAddress: '192.168.1.10',
    newValue: 'REJECTED_BY_SYS_04',
    prevValue: 'SUPER_ADMIN',
    status: 'REJECTED',
    target: 'Account: minh.anh@company.com (Self)',
    timestamp: '2026-10-19 11:20:05'
  },
  {
    action: 'Khóa tài khoản nhân sự nghỉ việc',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'aud-04',
    ipAddress: '192.168.1.10',
    newValue: 'STATUS: LOCKED',
    prevValue: 'STATUS: ACTIVE',
    status: 'SUCCESS',
    target: 'Account: van.kien@company.com',
    timestamp: '2026-10-18 15:10:00'
  },
  {
    action: 'Tạo tài khoản từ hồ sơ nhân viên',
    actorName: 'Minh Anh',
    actorRole: 'SUPER_ADMIN',
    id: 'aud-05',
    ipAddress: '192.168.1.10',
    newValue: 'Account created with roles: MANAGER',
    prevValue: 'N/A',
    status: 'SUCCESS',
    target: 'Employee: EMP-104 (Phạm Tiến Dũng)',
    timestamp: '2026-10-15 10:00:12'
  }
]

export const initialBackgroundJobs: BackgroundJobItem[] = [
  {
    id: 'job-01',
    lastRunAt: '2026-10-20 09:00:00',
    name: 'Đồng bộ danh tính người dùng & HR',
    nextRunAt: '2026-10-20 10:00:00',
    processedRecords: 142,
    schedule: 'Mỗi 1 giờ (0 * * * *)',
    status: 'SUCCESS'
  },
  {
    id: 'job-02',
    lastRunAt: '2026-10-20 08:00:00',
    name: 'Quét phát hiện Ghost Seat & Tài khoản không hoạt động',
    nextRunAt: '2026-10-21 02:00:00',
    processedRecords: 48,
    schedule: 'Hàng ngày lúc 02:00 (0 2 * * *)',
    status: 'SUCCESS'
  },
  {
    id: 'job-03',
    lastRunAt: '2026-10-20 09:25:00',
    name: 'Đối soát hóa đơn & cam kết chi phí',
    nextRunAt: '2026-10-20 12:00:00',
    processedRecords: 18,
    schedule: 'Mỗi 3 giờ (0 */3 * * *)',
    status: 'RUNNING'
  },
  {
    id: 'job-04',
    lastRunAt: '2026-10-20 00:00:00',
    name: 'Dọn dẹp token lời mời và phiên đăng nhập hết hạn',
    nextRunAt: '2026-10-21 00:00:00',
    processedRecords: 5,
    schedule: 'Hàng ngày lúc 00:00 (0 0 * * *)',
    status: 'SUCCESS'
  }
]
