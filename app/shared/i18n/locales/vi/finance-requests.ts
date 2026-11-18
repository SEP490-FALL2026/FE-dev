export const financeRequests = {
  all: 'Tất cả',
  back: 'Quay lại',
  none: '—',
  yes: 'Có',
  no: 'Không',
  ui: {
    listSection: 'Yêu cầu đã duyệt chi',
    resultCount: '{{count}} kết quả',
    fromPlaceholder: 'Chọn ngày bắt đầu, ví dụ 01/11/2026',
    toPlaceholder: 'Chọn ngày kết thúc, ví dụ 30/11/2026',
    departmentPlaceholder: 'Chọn phòng ban (gõ tên để tìm)',
    empty: 'Chưa có yêu cầu đã duyệt chi khớp bộ lọc này.'
  },
  title: 'Theo dõi yêu cầu',
  description: 'Các yêu cầu đã được duyệt chi, tức đã có khoản cam kết (chỉ đọc).',
  software: 'Phần mềm',
  plan: 'Gói',
  department: 'Phòng ban',
  costCenter: 'Trung tâm chi phí',
  requester: 'Người gửi',
  beneficiary: 'Người thụ hưởng',
  termMonths: 'Thời gian dùng (tháng)',
  budgetYear: 'Năm ngân sách',
  submittedAt: 'Ngày gửi',
  reserveUsed: 'Dùng dự phòng',
  stateLabel: 'Trạng thái',
  from: 'Gửi từ ngày',
  to: 'Đến ngày',
  dateRangeInvalid: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.',
  groupLines: '{{count}} người (yêu cầu nhóm)',
  longTerm: 'Dùng lâu dài',
  oneTime: 'Mua một lần (license vĩnh viễn)',
  view: {
    label: 'Tiến độ',
    open: 'Đang xử lý',
    ended: 'Đã kết thúc'
  },
  type: {
    label: 'Loại',
    GRANT: 'Cấp quyền',
    SERVICE_ACCOUNT: 'Tài khoản dịch vụ',
    RENEWAL: 'Gia hạn',
    GROUP_GRANT: 'Cấp quyền theo nhóm'
  },
  state: {
    PENDING: 'Đang chờ',
    WAITING_CONTROLLED: 'Chờ có kiểm soát',
    AWAITING_EXECUTION: 'Đã duyệt, chờ cấp quyền',
    AWAITING_IT_ASSESSMENT: 'Chờ IT thẩm định',
    AWAITING_SPEND_SUBMISSION: 'Chờ trình duyệt chi',
    AWAITING_SPEND_DECISION: 'Chờ duyệt chi',
    AWAITING_REQUESTER_REVISION: 'Chờ người gửi sửa',
    REJECTED: 'Bị từ chối',
    IT_REJECTED: 'IT từ chối',
    EXECUTING: 'Đang cấp quyền',
    COMPLETED: 'Hoàn tất',
    FAILED: 'Thất bại',
    AWAITING_IT_CLOSE: 'Chờ IT đóng',
    WITHDRAWN: 'Đã rút',
    CANCELLED: 'Đã hủy'
  },
  detail: {
    title: 'Yêu cầu',
    summary: 'Tóm tắt',
    info: 'Thông tin yêu cầu',
    reason: 'Lý do của người gửi',
    term: 'Thời gian dùng',
    months: '{{count}} tháng'
  },
  check: {
    title: 'Kiểm ngân sách',
    none: 'Yêu cầu này chưa có kết quả kiểm ngân sách.',
    notReviewed: 'Yêu cầu chưa được kiểm tra ngân sách (chưa trình lô).',
    outcome: 'Kết quả',
    bindingTotal: 'Số tiền được kiểm',
    overBy: 'Phần vượt',
    notOver: 'Không vượt',
    nextYear: 'Năm {{year}}: còn {{remaining}}, sau yêu cầu này còn {{after}}.',
    year: 'Năm',
    cost: 'Chi phí',
    effectiveBudget: 'Ngân sách hiệu lực',
    held: 'Đã giữ',
    remaining: 'Còn lại',
    code: 'Mã kết quả',
    outcomes: {
      WITHIN_BASE: 'Trong ngân sách cơ sở',
      USES_RESERVE: 'Dùng dự phòng',
      BLOCKED: 'Bị chặn'
    },
    reasons: {
      PRICE_EXPIRED: 'Bằng chứng về giá đã quá hạn.',
      NO_APPROVED_BUDGET: 'Chưa có ngân sách được duyệt.',
      OVER_RESERVE: 'Chi phí vượt cả ngân sách cơ sở và dự phòng.'
    },
    codes: {
      BUDGET_OK: 'Đủ ngân sách',
      HIGH_VALUE: 'Giá trị cao',
      INSUFFICIENT_BUDGET: 'Không đủ ngân sách',
      NO_ACTIVE_BUDGET: 'Chưa có ngân sách hiệu lực',
      CLOSED_OR_EXPIRED_BUDGET_PERIOD: 'Kỳ ngân sách đã đóng hoặc hết hạn',
      STALE_COST_EVIDENCE: 'Bằng chứng chi phí đã quá hạn'
    }
  }
} as const
