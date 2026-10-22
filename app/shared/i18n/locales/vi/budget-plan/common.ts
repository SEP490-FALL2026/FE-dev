/** Wording shared by the annual budget planning screens (Finance FIN-40 → FIN-47, Spending Approver APV-05). */
export const common = {
  backToList: 'Quay lại danh sách',
  filters: {
    apply: 'Áp dụng bộ lọc',
    reset: 'Đặt lại',
    title: 'Bộ lọc'
  },
  fiscalYear: 'Năm tài chính {{year}}',
  group: {
    AI: 'Trợ lý AI',
    COLLABORATION: 'Cộng tác',
    DESIGN: 'Thiết kế',
    DEV_TOOLS: 'Công cụ phát triển',
    MARKETING: 'Marketing & bán hàng',
    OTHER: 'Khác'
  },
  stage: {
    APPROVED: 'Đã duyệt',
    IN_ANALYSIS: 'Đang phân tích',
    NEEDS_INFO: 'Chờ Manager bổ sung',
    NEGOTIATED: 'Đã phân tích xong',
    REJECTED: 'Bị từ chối',
    RETURNED: 'Bị trả lại',
    SENT: 'Đã gửi Người duyệt chi',
    SUBMITTED: 'Mới gửi'
  },
  status: {
    ACTIVE: 'Đang hiệu lực',
    APPROVED: 'Đã duyệt',
    DRAFT: 'Nháp',
    EXPIRED: 'Hết hiệu lực',
    PENDING_APPROVAL: 'Chờ phê duyệt',
    UNDER_FINANCE_REVIEW: 'Tài chính đang xem xét'
  }
} as const
