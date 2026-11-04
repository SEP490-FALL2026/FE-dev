export const common = {
  brand: 'SaaS-Sentry',
  notifications: {
    label: 'Thông báo',
    close: 'Đóng thông báo',
    markAllRead: 'Đọc tất cả',
    markRead: 'Đánh dấu đã đọc',
    unread: 'Chưa đọc',
    loadMore: 'Tải thêm',
    loading: 'Đang tải thông báo',
    retry: 'Thử lại',
    retryAfter: 'Thử lại sau {{seconds}} giây',
    empty: 'Chưa có thông báo',
    emptyHint: 'Các cập nhật liên quan đến công việc sẽ xuất hiện tại đây.',
    loadError: 'Không tải được thông báo. Vui lòng thử lại.',
    saved: 'Đã đánh dấu thông báo là đã đọc',
    saveError: 'Chưa đánh dấu được thông báo là đã đọc. Vui lòng thử lại.',
    uncertain: 'Chưa xác định được kết quả. Danh sách sẽ được tải lại trước khi bạn thử lại.',
    fallback: 'Cập nhật công việc mới',
    updateHint: 'Có cập nhật liên quan đến công việc của bạn.',
    requestReference: 'Mã yêu cầu: {{id}}',
    openRequest: 'Xem yêu cầu',
    countOverflow: '99+',
    codes: {
      REQUEST_SUBMITTED: 'Yêu cầu đã được gửi',
      REQUEST_GRANTED: 'Đã cấp quyền sử dụng',
      REQUEST_NEED_APPROVED: 'Nhu cầu đã được duyệt',
      REQUEST_NEED_REJECTED: 'Nhu cầu đã bị từ chối',
      REQUEST_SPEND_APPROVED: 'Đề nghị chi đã được duyệt',
      REQUEST_SPEND_REJECTED: 'Đề nghị chi đã bị từ chối',
      STEP_ASSIGNED: 'Có bước xử lý được giao cho bạn',
      REQUEST_WITHDRAWN: 'Yêu cầu đã được rút',
      HANDOVER_REQUIRED: 'Cần xác nhận bàn giao dữ liệu'
    }
  },
  language: {
    english: 'Tiếng Anh',
    englishShort: 'EN',
    selector: 'Ngôn ngữ',
    switchTo: 'Chuyển sang {{language}}',
    vietnamese: 'Tiếng Việt',
    vietnameseShort: 'VI'
  }
} as const
