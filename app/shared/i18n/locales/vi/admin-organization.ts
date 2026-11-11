import { adminDepartmentEditor } from './admin-department-editor'

export const adminOrganization = {
  ...adminDepartmentEditor,
  title: 'Cơ cấu tổ chức',
  subtitle: 'Quản lý phòng ban và trưởng phòng.',
  departments: 'Phòng ban',
  createDepartment: 'Tạo phòng ban',
  editDepartment: 'Sửa phòng ban',
  departmentDetails: 'Thông tin phòng ban',
  code: 'Mã phòng ban',
  name: 'Tên',
  function: 'Chức năng',
  description: 'Mô tả',
  status: 'Trạng thái',
  search: 'Tìm phòng ban',
  searchPlaceholder: 'Nhập tên hoặc mã phòng ban',
  allStatuses: 'Tất cả trạng thái',
  head: 'Trưởng phòng',
  successor: 'Người kế nhiệm',
  itAdmin: 'IT Admin phụ trách',
  itAdminId: 'IT Admin phụ trách',
  employeeId: 'Nhân viên',
  candidateIdPlaceholder: 'Chọn nhân viên bên dưới',
  costCenter: 'Trung tâm chi phí',
  members: 'Thành viên',
  addEmployee: 'Thêm nhân viên',
  addEmployeeHelp: 'Chọn nhân viên chưa xếp phòng. Nhân viên đã có phòng cần được điều chuyển theo quy trình.',
  chooseEmployee: 'Chọn nhân viên',
  unassigned: 'Chưa chỉ định',
  unknown: 'Trạng thái chưa xác định',
  back: 'Về danh sách phòng ban',
  viewDepartment: 'Xem {{name}}',
  viewDetails: 'Chi tiết',
  responsibilities: 'Người phụ trách',
  needsAttention: 'Cần bổ sung',
  noFunction: 'Chưa có mô tả chức năng.',
  memberSince: 'Tham gia từ',
  actionsLabel: 'Thao tác',
  effectiveFrom: 'Có hiệu lực từ',
  hrBasis: 'Căn cứ nhân sự',
  basis: { type: 'Loại văn bản', reference: 'Số tham chiếu', issuer: 'Người ban hành', issuedOn: 'Ngày ban hành' },
  departmentStatus: { ACTIVE: 'Đang hoạt động', INACTIVE: 'Đã ngừng dùng' },
  memberStatus: { ACTIVE: 'Đang làm việc', TERMINATED: 'Đã chấm dứt' },
  workState: {
    WORKING: 'Đang làm việc',
    ON_LONG_LEAVE: 'Nghỉ dài hạn',
    HANDING_OVER: 'Đang bàn giao',
    LEFT: 'Đã nghỉ việc'
  },
  warnings: {
    MISSING_HEAD: 'Chưa có trưởng phòng',
    MISSING_IT_ADMIN: 'Chưa có IT Admin dùng được',
    MISSING_COST_CENTER: 'Chưa có trung tâm chi phí'
  },
  actions: {
    deactivate: 'Ngừng dùng phòng ban',
    assignHead: 'Chỉ định trưởng phòng',
    vacateHead: 'Để trống trưởng phòng',
    designateSuccessor: 'Chỉ định người kế nhiệm',
    clearSuccessor: 'Rút người kế nhiệm'
  },
  actionHelp: {
    deactivate:
      'Phòng ngừng dùng không nhận thành viên hoặc trưởng phòng mới. Hệ thống kiểm tra nhân sự, việc đang mở và nghĩa vụ thanh toán.',
    assignHead:
      'Chọn người là thành viên vào ngày hiệu lực, từ hôm nay trở đi. Trưởng phòng cũ kết thúc vào ngày trước đó. Hệ thống kiểm tra điều kiện khi lưu.',
    vacateHead:
      'Phòng không có trưởng phòng từ ngày đã chọn, từ hôm nay trở đi. Yêu cầu của phòng chờ có kiểm soát tới khi có trưởng phòng mới.',
    designateSuccessor:
      'Người kế nhiệm phải bắt đầu sau hôm nay và là thành viên vào ngày đó. Phòng phải có trưởng phòng hiện tại.',
    clearSuccessor:
      'Rút người kế nhiệm trong tương lai. Trưởng phòng hiện tại tiếp tục mà không có ngày kết thúc dự kiến.'
  },
  candidateHelp:
    'Duyệt tài khoản hoạt động hoặc tìm nhân viên chưa có tài khoản theo tên hay mã. Không chọn Super Admin. Hệ thống kiểm tra thành viên vào ngày hiệu lực khi lưu.',
  itAdminHelp:
    'Duyệt tất cả trang tài khoản IT Admin đang hoạt động và đã kích hoạt. Hệ thống kiểm tra điều kiện khi lưu. Chọn Chưa chỉ định để bỏ chỉ định.',
  headHistory: 'Lịch sử trưởng phòng',
  viewHeadHistory: 'Xem lịch sử trưởng phòng',
  openingHeadHistory: 'Đang mở lịch sử…',
  noHistory: 'Chưa có lịch sử trưởng phòng',
  historyLimited: 'API chỉ trả lịch sử trưởng phòng gần đây; không thể xem các mục cũ hơn tại đây.',
  ongoing: 'Đang hiệu lực',
  membersHelp: 'Thành viên được đọc từ hồ sơ nhân sự. Ghi nhận sự kiện nhân sự để thay đổi phòng ban.',
  hasEmail: 'Đã có email công việc',
  noEmail: 'Chưa có email công việc'
}
