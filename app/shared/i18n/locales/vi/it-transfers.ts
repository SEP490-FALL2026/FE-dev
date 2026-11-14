export const itTransfers = {
  title: 'Điều chuyển phòng ban',
  hint: 'Quyền cũ được giữ trong ân hạn 5 ngày làm việc kể từ ngày hiệu lực. Hết ân hạn, hệ thống mở tác vụ thu hồi cho IT Admin phụ trách phòng mới và tự đóng điều chuyển.',
  back: 'Về danh sách điều chuyển',
  refresh: 'Làm mới điều chuyển',
  details: 'Xem điều chuyển',
  all: 'Tất cả trạng thái',
  status: 'Trạng thái',
  phase: 'Giai đoạn',
  employeeId: 'Mã định danh nhân viên',
  employeePlaceholder: 'UUID nhân viên chính thức (không bắt buộc)',
  from: 'Phòng ban cũ',
  to: 'Phòng ban mới',
  effectiveOn: 'Ngày hiệu lực',
  effectiveFrom: 'Hiệu lực từ ngày',
  effectiveTo: 'Hiệu lực đến ngày',
  graceEndsBefore: 'Ân hạn kết thúc trước',
  graceEndsBeforeHint: 'Điều chuyển có ân hạn kết thúc trước ngày này (không tính ngày đó).',
  graceEndsOn: 'Ngày cuối ân hạn',
  graceReminderOn: 'Ngày nhắc',
  graceUntil: 'Ân hạn tới {{date}}',
  commitmentsReleased: 'Đã trả về ngân sách phòng cũ',
  applyFilters: 'Áp dụng bộ lọc',
  closedAt: 'Đã đóng lúc {{at}}',
  closedBySystem: 'Hệ thống đã đóng lúc {{at}}',
  supersededAt: 'Hồ sơ nghỉ việc đã tiếp quản lúc {{at}}; hạn thu hồi của hồ sơ đó áp lên quyền cũ',
  unknown: 'Chưa có dữ liệu',
  oldRights: 'Quyền cũ',
  snapshotOn: 'Ảnh quyền ngày {{date}}',
  noOldRights: 'Không có quyền cũ cần thu hồi.',
  regranted: 'Đã cấp lại trên cùng thuê bao; không thu hồi',
  revocationTask: 'Tác vụ thu hồi: {{status}}',
  values: {
    PENDING: 'Đã lên lịch',
    EFFECTIVE: 'Đã có hiệu lực',
    CANCELLED: 'Đã hủy'
  },
  phases: {
    PENDING: 'Chờ tới ngày',
    IN_GRACE: 'Đang trong ân hạn',
    REVOKING: 'Đang thu hồi quyền cũ',
    CLOSED: 'Đã đóng',
    CANCELLED: 'Đã hủy',
    SUPERSEDED: 'Nghỉ việc đã tiếp quản'
  },
  phaseHints: {
    IN_GRACE: 'Người chuyển giữ quyền cũ tới hết ân hạn và có thể xin lại cùng phần mềm ở phòng mới.',
    REVOKING:
      'Tác vụ thu hồi đang nằm trong hàng đợi của IT Admin phụ trách phòng mới. Điều chuyển đóng khi tác vụ cuối hoàn tất.'
  },
  rightStates: {
    HELD: 'Còn giữ',
    REVOKING: 'Đang thu hồi',
    ENDED: 'Đã kết thúc'
  },
  outcomes: {
    REVOKED: 'Đã thu hồi',
    ENDED: 'Đã kết thúc',
    REGRANTED: 'Đã cấp lại',
    TAKEN_OVER: 'Quyền mới đã thay thế'
  },
  taskStates: {
    QUEUED: 'Đang chờ',
    IN_PROGRESS: 'Đang làm',
    RETRY_SCHEDULED: 'Đã hẹn thử lại',
    FAILED: 'Thất bại',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    CLOSED_FAILED: 'Đã đóng sau lỗi'
  }
} as const
