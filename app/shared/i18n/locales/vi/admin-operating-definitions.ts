export const operatingDefinitions = {
  REQUEST_OPEN_NEW_LIMIT: {
    name: 'Giới hạn yêu cầu cấp mới mỗi tuần',
    description: 'Số yêu cầu cấp mới tối đa có thể nêu tên một người trong một tuần.'
  },
  RENEWAL_WINDOW_DAYS: {
    name: 'Thời gian mở gửi yêu cầu tiếp tục',
    description: 'Số ngày trước khi quyền kết thúc mà người dùng được gửi yêu cầu tiếp tục.'
  },
  FORECAST_ERROR_THRESHOLD_PERCENT: {
    name: 'Ngưỡng sai số dự báo chi phí',
    description: 'Không hiển thị dự báo có sai số lớn hơn tỷ lệ này.'
  },
  BUDGET_RESERVE_DEFAULT_PERCENT: {
    name: 'Tỷ lệ dự phòng ngân sách năm',
    description: 'Tỷ lệ dự phòng cho phiên bản ngân sách mới; chỉ bộ phận tài chính được sửa.'
  },
  BUDGET_ZBB_KPI3_BELOW_PERCENT: {
    name: 'Ngưỡng sử dụng cần giải trình ngân sách',
    description: 'Tham số ngân sách do bộ phận tài chính quản lý; hệ thống hiện chưa sử dụng.'
  },
  BUDGET_ZBB_PRICE_INCREASE_PERCENT: {
    name: 'Ngưỡng tăng đơn giá cần giải trình',
    description: 'Tham số ngân sách do bộ phận tài chính quản lý; hệ thống hiện chưa sử dụng.'
  },
  PERSONNEL_NOTICE_REVIEW_WORKING_DAYS: {
    name: 'Hạn xử lý thông báo nhân sự',
    description: 'Số ngày làm việc để kiểm tra và xử lý thông báo thay đổi nhân sự.'
  },
  DEPARTURE_REVOCATION_WORKING_DAYS: {
    name: 'Hạn thu hồi quyền khi nghỉ việc',
    description: 'Số ngày làm việc tính từ ngày sau ngày làm việc cuối để hoàn tất thu hồi quyền.'
  },
  TRANSFER_GRACE_WORKING_DAYS: {
    name: 'Thời gian ân hạn quyền sau điều chuyển',
    description: 'Số ngày làm việc được giữ quyền phòng cũ kể từ ngày điều chuyển có hiệu lực.'
  },
  TRANSFER_GRACE_REMINDER_WORKING_DAYS: {
    name: 'Thời điểm nhắc trước khi hết ân hạn',
    description: 'Nhắc nhân viên trước khi hết thời gian giữ quyền phòng cũ.'
  },
  PROVISIONING_RETRY_COUNT: {
    name: 'Số lần thử lại cấp hoặc thu hồi quyền',
    description: 'Số lần thử lại trước khi chuyển việc lỗi cho quản trị viên công nghệ thông tin.'
  },
  SAAS_ISSUE_RESPONSE_WORKING_DAYS: {
    name: 'Hạn tiếp nhận báo lỗi phần mềm',
    description: 'Số ngày làm việc trước khi nhắc người phụ trách về báo lỗi chưa tiếp nhận.'
  },
  SAAS_ISSUE_REOPEN_WORKING_DAYS: {
    name: 'Hạn mở lại báo lỗi phần mềm',
    description: 'Số ngày làm việc người báo được mở lại phiếu sau khi đã giải quyết.'
  },
  INVITATION_REMINDER_DAYS: {
    name: 'Thời gian nhắc lời mời chưa kích hoạt',
    description: 'Số ngày trước khi nhắc người chưa kích hoạt; phải ngắn hơn thời gian thu hồi lời mời.'
  },
  INVITATION_WITHDRAW_DAYS: {
    name: 'Thời gian thu hồi lời mời chưa kích hoạt',
    description: 'Số ngày trước khi thu hồi lời mời chưa kích hoạt; phải dài hơn thời gian nhắc.'
  },
  DOCUMENT_MAX_SIZE_MB: {
    name: 'Dung lượng tệp tài liệu tối đa',
    description: 'Dung lượng tối đa cho tệp chứng từ và tài liệu ngân sách, tính bằng mêgabyte.'
  },
  RENEWAL_ALERT_DAYS_BEFORE_DEADLINE: {
    name: 'Các mốc nhắc trước hạn hủy thuê bao',
    description: 'Nhập các mốc ngày nhắc theo thứ tự giảm dần, mỗi số tương ứng một lần nhắc.'
  },
  DETECTION_THRESHOLD_DAYS: {
    name: 'Ngưỡng phát hiện quyền không sử dụng',
    description: 'Ba ngưỡng ngày tăng dần để theo dõi, rà soát và đề nghị thu hồi.'
  },
  GHOST_SEAT_NEW_ASSIGNMENT_GRACE_DAYS: {
    name: 'Ân hạn cho quyền mới được cấp',
    description: 'Quyền được cấp trong khoảng này chưa bị đánh giá là không sử dụng.'
  },
  GHOST_SEAT_DECISION_WORKING_DAYS: {
    name: 'Hạn quyết định quyền không sử dụng',
    description: 'Số ngày làm việc để trưởng phòng quyết định; quá hạn chỉ nhắc, không tự quyết.'
  },
  GHOST_SEAT_REVOCATION_GRACE_DAYS: {
    name: 'Ân hạn trước thu hồi quyền không sử dụng',
    description: 'Số ngày lịch phải chờ trước khi hoàn tất thu hồi quyền.'
  },
  RULE_SCHEDULE_G1_G2: {
    name: 'Lịch kiểm tra lãng phí từ dữ liệu nội bộ',
    description: 'Chọn tần suất kiểm tra các dấu hiệu lãng phí từ dữ liệu nội bộ.'
  },
  RULE_SCHEDULE_G3_G4: {
    name: 'Lịch kiểm tra lãng phí từ dữ liệu sử dụng',
    description: 'Chọn tần suất kiểm tra các dấu hiệu lãng phí từ dữ liệu sử dụng phần mềm.'
  },
  AI_ENABLED: {
    name: 'Bật các tính năng trí tuệ nhân tạo',
    description: 'Tắt để dừng mọi lời gọi đến dịch vụ trí tuệ nhân tạo.'
  },
  AI_ACCESS_REQUEST_SUMMARY_ENABLED: {
    name: 'Tóm tắt hàng chờ duyệt bằng trí tuệ nhân tạo',
    description: 'Chỉ hoạt động khi công tắc trí tuệ nhân tạo toàn hệ thống đã bật.'
  }
} as const
