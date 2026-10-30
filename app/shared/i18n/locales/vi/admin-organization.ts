export const adminOrganization = {
  title: 'Cơ cấu tổ chức',
  subtitle: 'Quản lý phòng ban, trưởng phòng và dự án của phòng.',
  departments: 'Phòng ban',
  projects: 'Dự án',
  createDepartment: 'Tạo phòng ban',
  editDepartment: 'Sửa phòng ban',
  createProject: 'Tạo dự án',
  editProject: 'Sửa dự án',
  departmentDetails: 'Thông tin phòng ban',
  projectDetails: 'Thông tin dự án',
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
  itAdminId: 'ID nhân viên IT Admin',
  employeeId: 'ID nhân viên',
  candidateIdPlaceholder: 'Chọn nhân viên bên dưới hoặc nhập mã định danh',
  costCenter: 'Trung tâm chi phí',
  members: 'Thành viên',
  unassigned: 'Chưa chỉ định',
  unknown: 'Trạng thái chưa xác định',
  back: 'Về danh sách phòng ban',
  viewDepartment: 'Xem {{name}}',
  actionsLabel: 'Thao tác',
  effectiveFrom: 'Có hiệu lực từ',
  hrBasis: 'Căn cứ nhân sự',
  basis: { type: 'Loại văn bản', reference: 'Số tham chiếu', issuer: 'Người ban hành', issuedOn: 'Ngày ban hành' },
  departmentStatus: { ACTIVE: 'Đang hoạt động', INACTIVE: 'Đã ngừng dùng' },
  projectStatus: { RUNNING: 'Đang triển khai', FINISHED: 'Đã hoàn thành' },
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
      'Phòng không có trưởng phòng từ ngày đã chọn, từ hôm nay trở đi. Yêu cầu chuyển tới người duyệt dự phòng đã cấu hình.',
    designateSuccessor:
      'Người kế nhiệm phải bắt đầu sau hôm nay và là thành viên vào ngày đó. Phòng phải có trưởng phòng hiện tại.',
    clearSuccessor:
      'Rút người kế nhiệm trong tương lai. Trưởng phòng hiện tại tiếp tục mà không có ngày kết thúc dự kiến.'
  },
  candidateHelp:
    'Duyệt tất cả trang tài khoản đang hoạt động và đã kích hoạt. Super Admin không được chọn. Chọn ID nhân viên, không phải ID đăng nhập. Hệ thống kiểm tra thành viên vào ngày hiệu lực khi lưu. Nếu nhân viên không có tài khoản trong danh sách, nhập UUID hồ sơ chính thức; API chưa có danh bạ nhân viên không giới hạn.',
  itAdminHelp:
    'Duyệt tất cả trang tài khoản IT Admin đang hoạt động và đã kích hoạt, hoặc nhập UUID nhân viên chính thức. Hệ thống kiểm tra tài khoản IT Admin dùng được. Để trống để bỏ chỉ định.',
  participatingDepartments: 'Phòng tham gia (đã chọn {{count}})',
  departmentSelectionHelp: 'Duyệt tất cả trang phòng đang hoạt động. Giữ lựa chọn khi chuyển trang, tối đa 100 phòng.',
  removeDepartment: 'Bỏ {{name}}',
  headHistory: 'Lịch sử trưởng phòng',
  noHistory: 'Chưa có lịch sử trưởng phòng',
  historyLimited: 'API chỉ trả lịch sử trưởng phòng gần đây; không thể xem các mục cũ hơn tại đây.',
  ongoing: 'Đang hiệu lực',
  membersHelp: 'Thành viên được đọc từ hồ sơ nhân sự. Ghi nhận sự kiện nhân sự để thay đổi phòng ban.',
  hasEmail: 'Đã có email công việc',
  noEmail: 'Chưa có email công việc'
}
