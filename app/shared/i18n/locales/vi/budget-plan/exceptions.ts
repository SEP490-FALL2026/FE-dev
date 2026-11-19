/** FIN-44: requests that failed the automatic budget check and need a Finance decision. */
export const exceptions = {
  title: 'Ngoại lệ ngân sách',
  subtitle: 'Yêu cầu thiếu ngân sách, SaaS ngoài danh mục hoặc trung tâm chi phí hết hiệu lực.',
  notice:
    'Với mỗi ngoại lệ, Tài chính chọn một hướng: đề xuất bổ sung ngân sách, chuyển trung tâm chi phí, yêu cầu Manager bổ sung hồ sơ hoặc trình Người duyệt chi phê duyệt ngoại lệ.',
  filterLabel: 'Lọc theo trạng thái ngoại lệ',
  state: {
    open: 'Đang mở',
    resolved: 'Đã xử lý'
  },
  colRequest: 'Yêu cầu',
  colKind: 'Loại ngoại lệ',
  colRaisedAt: 'Phát sinh lúc',
  colManager: 'Manager',
  colStatus: 'Trạng thái',
  openDetail: 'Xem chi tiết',
  openDetailFor: 'Xem chi tiết ngoại lệ {{code}}',
  empty: 'Không có ngoại lệ nào khớp bộ lọc.',
  action: {
    PROPOSE_TOPUP: 'Đề xuất bổ sung ngân sách',
    REQUEST_INFO: 'Yêu cầu Manager bổ sung hồ sơ',
    SUBMIT_TO_APPROVER: 'Trình phê duyệt ngoại lệ',
    TRANSFER_COST_CENTER: 'Chuyển trung tâm chi phí'
  },
  actionHint: {
    PROPOSE_TOPUP: 'Gửi Người duyệt chi đề xuất tăng ngân sách; yêu cầu chờ đến khi được bổ sung.',
    REQUEST_INFO: 'Trả yêu cầu về Manager để bổ sung hồ sơ rồi kiểm tra lại.',
    SUBMIT_TO_APPROVER: 'Chuyển Người duyệt chi quyết định ngoại lệ, kèm ghi chú của Tài chính.',
    TRANSFER_COST_CENTER: 'Gắn yêu cầu sang trung tâm chi phí đang hiệu lực rồi kiểm tra lại.'
  },
  factsTitle: 'Thông tin ngoại lệ',
  amount: 'Số tiền yêu cầu',
  manager: 'Manager phụ trách',
  raisedAt: 'Phát sinh lúc',
  checkTitle: 'Kết quả kiểm tra tự động',
  checkedAt: 'Kiểm tra lúc',
  remainingBefore: 'Còn lại trước yêu cầu',
  retired: 'Đã ngừng hiệu lực',
  replacedBy: 'Thay bằng {{code}}',
  decisionTitle: 'Hướng xử lý',
  decisionHint: 'Chọn một hướng và ghi rõ lý do; quyết định được lưu vào lịch sử ngân sách.',
  topUpLabel: 'Số tiền đề xuất bổ sung',
  topUpRequired: 'Nhập số tiền bổ sung lớn hơn 0.',
  targetLabel: 'Trung tâm chi phí mới',
  targetPlaceholder: 'Chọn trung tâm chi phí',
  targetRequired: 'Chọn một trung tâm chi phí đang hiệu lực khác trung tâm hiện tại.',
  noteLabel: 'Ghi chú xử lý',
  noteRequired: 'Bắt buộc nhập ghi chú xử lý.',
  submit: 'Ghi nhận xử lý',
  success: 'Đã ghi nhận xử lý ngoại lệ {{code}}.',
  resolvedTitle: 'Đã xử lý: {{action}}',
  resolvedAt: 'Ngày {{time}}',
  resolvedTarget: 'Chuyển sang {{code}}',
  resolvedTopUp: 'Đề xuất bổ sung {{amount}}'
} as const
