/** FIN-47: read-only audit trail of Finance and Spending Approver budget decisions. */
export const history = {
  bufferRate: 'Tỷ lệ buffer {{rate}}',
  empty: 'Không có quyết định nào khớp bộ lọc.',
  kind: {
    ADJUSTMENT_APPROVAL: 'Duyệt điều chỉnh ngân sách',
    EXCEPTION_APPROVAL: 'Duyệt ngoại lệ',
    SPEND_APPROVAL: 'Duyệt khoản chi thường',
    ADJUSTMENT: 'Yêu cầu điều chỉnh',
    APPROVAL: 'Kết quả duyệt',
    BUDGET_CHANGE: 'Thay đổi ngân sách',
    BUFFER: 'Buffer',
    CUT: 'Cắt giảm',
    EXCEPTION: 'Xử lý ngoại lệ',
    REVIEW: 'Xem xét dự toán'
  },
  listHint: '{{count}} mục, mới nhất trước',
  listLabel: 'Nhật ký quyết định ngân sách',
  listTitle: 'Nhật ký quyết định',
  readOnly: 'Nhật ký kiểm toán chỉ đọc: các mục không thể sửa hoặc xóa.',
  subtitle:
    'Lưu các lần Tài chính điều chỉnh dự toán, lý do cắt giảm, buffer, kết quả duyệt và các lần thay đổi ngân sách.',
  title: 'Lịch sử quyết định ngân sách'
} as const
