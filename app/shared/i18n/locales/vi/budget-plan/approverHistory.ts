/** APV-06: read-only audit trail of the Spending Approver's decisions. */
export const approverHistory = {
  amountChange: 'Số tiền trước và sau điều chỉnh',
  empty: 'Không có quyết định nào khớp bộ lọc.',
  group: {
    annual: 'Ngân sách năm',
    exception: 'Ngoại lệ & điều chỉnh',
    spend: 'Khoản chi thường'
  },
  listHint: '{{count}} quyết định, mới nhất trước',
  listLabel: 'Nhật ký quyết định của Người duyệt chi',
  listTitle: 'Nhật ký quyết định',
  note: 'Ghi chú',
  outcome: {
    ADJUSTMENT_REQUESTED: 'Yêu cầu điều chỉnh',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối'
  },
  readOnly: 'Nhật ký kiểm toán chỉ đọc: các quyết định đã ghi không thể sửa hoặc xóa.',
  reason: 'Lý do',
  subtitle:
    'Lưu quyết định duyệt ngân sách năm, phiên bản được duyệt, người duyệt, thời gian và lý do từ chối hoặc điều chỉnh; tách riêng khoản chi thường với ngoại lệ và điều chỉnh ngân sách.',
  summaryLabel: 'Tóm tắt quyết định',
  tiles: {
    adjustment: 'Yêu cầu điều chỉnh',
    approved: 'Đã duyệt',
    decisions: 'Tổng quyết định',
    rejected: 'Từ chối'
  },
  title: 'Lịch sử quyết định',
  version: 'Phiên bản v{{version}}'
} as const
