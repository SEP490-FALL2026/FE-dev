import { superAdminAccounts } from './super-admin-accounts'
import { superAdminDepartments } from './super-admin-departments'
import { superAdminPersonnel } from './super-admin-personnel'
import { superAdminReminders } from './super-admin-reminders'
import { superAdminSystem } from './super-admin-system'

export const superAdmin = {
  navigation: {
    overview: 'Tổng quan thiết lập',
    departments: 'Phòng ban',
    accounts: 'Tài khoản & Phân quyền',
    personnel: 'Nhân sự phòng ban',
    reminders: 'Nhắc xử lý Manager'
  },
  departments: {
    ENG: 'Khối CNTT & Kỹ thuật',
    FIN: 'Phòng Tài chính Kế toán',
    DES: 'Phòng Thiết kế & Trải nghiệm',
    MKT: 'Phòng Marketing & Tăng trưởng',
    HR: 'Phòng Nhân sự & Đào tạo',
    EXEC: 'Ban Điều Hành'
  },
  positions: {
    SPENDING_APPROVER: 'Phó Tổng Giám Đốc',
    FINANCE: 'Kế toán trưởng',
    IT_ADMIN: 'Chuyên viên Hệ thống & Quản trị CNTT'
  },
  overview: {
    code: 'Quản trị hệ thống',
    title: 'Tổng quan Quản trị Hệ thống',
    subtitle: 'Tổng quan cơ cấu tổ chức doanh nghiệp, quản lý phòng ban, tài khoản người dùng và thiết lập phân quyền.',
    metricsLabel: 'Chỉ số cơ cấu tổ chức',
    departmentListAction: 'Xem danh sách phòng ban',
    configuredDepartments: '{{configured}} đã hoàn tất · {{incomplete}} chờ bổ nhiệm Quản lý',
    totalDepartments: 'Tổng số phòng ban',
    accountListAction: 'Xem danh sách tài khoản',
    activeAccounts: '{{count}} tài khoản đang hoạt động',
    totalAccounts: 'Tổng số tài khoản',
    roleAssignmentsAction: 'Xem phân quyền vai trò',
    approverAndFinance: 'Duyệt chi: {{approver}} · Kế toán: {{finance}}',
    unassigned: 'Chưa gán',
    unspecified: 'Chưa chỉ định',
    spendingApprover: 'Người duyệt chi ngân sách',
    reminderSettingsAction: 'Cấu hình thời hạn nhắc',
    reminderAfterHours: 'Tự động nhắc nhở sau {{hours}} giờ',
    managerReminderDeadline: 'Thời hạn nhắc Quản lý',
    days: '{{count}} ngày',
    viewAll: 'Xem tất cả',
    departmentsHint: 'Danh sách phòng ban trực thuộc và Quản lý phụ trách phê duyệt',
    departmentStructure: 'Cơ cấu phòng ban doanh nghiệp',
    departmentCodeAndName: 'Mã & Phòng ban',
    responsibleManager: 'Quản lý phụ trách',
    memberCount: 'Số thành viên',
    status: 'Trạng thái',
    noManager: 'Chưa có Quản lý',
    active: 'Đang hoạt động',
    details: 'Chi tiết',
    keyRolesHint: 'Phân quyền các vị trí quản trị và phê duyệt quan trọng',
    keyRoles: 'Phân nhiệm vai trò trọng yếu',
    onePersonOnly: 'Duy nhất 1 người',
    finance: 'Tài chính / Kế toán',
    expenseControl: 'Kiểm soát chi phí',
    itAdmin: 'Quản trị CNTT',
    provisioningAndLicenses: 'Cấp phát & Bản quyền',
    managerReminderPolicy: 'Chính sách thời hạn nhắc Quản lý',
    edit: 'Sửa đổi',
    reminderPolicyDescription: 'Tự động gửi thông báo tới Quản lý phòng ban khi yêu cầu chờ quá',
    reminderPolicyDuration: '{{days}} ngày ({{hours}} giờ)'
  },
  accounts: superAdminAccounts,
  departmentsModule: superAdminDepartments,
  personnel: superAdminPersonnel,
  reminders: superAdminReminders,
  ...superAdminSystem
} as const
