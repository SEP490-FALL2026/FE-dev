export const requestProgress = {
  title: 'Tiến trình xử lý',
  step: 'Bước {{number}}',
  sentAt: 'Thời điểm gửi',
  startedAt: 'Bắt đầu',
  endedAt: 'Kết thúc',
  stages: {
    SUBMITTED: 'Gửi yêu cầu',
    NEED: 'Duyệt nhu cầu',
    IT_ASSESSMENT: 'IT thẩm định',
    QUEUE_WAIT: 'Chờ gửi đề nghị chi',
    SPEND_DECISION: 'Duyệt chi',
    GRANT: 'Cấp quyền sử dụng'
  },
  phases: {
    closed: 'Đã xử lý',
    active: 'Đang xử lý',
    recorded: 'Đã ghi nhận',
    rejected: 'Đã từ chối',
    failed: 'Xử lý thất bại',
    stopped: 'Đã dừng',
    revision: 'Chờ người gửi chỉnh sửa',
    closing: 'Chờ IT đóng yêu cầu'
  }
} as const
