/** APV-05: the Spending Approver approves, rejects or returns department budgets Finance sent. */
export const approver = {
  actions: {
    ADJUSTMENT_REQUESTED: 'Yêu cầu Tài chính điều chỉnh',
    APPROVED: 'Duyệt ngân sách',
    REJECTED: 'Từ chối'
  },
  approvedTotal: 'Tổng đã duyệt',
  base: 'Chi phí cơ sở (SaaS sau rà soát)',
  buffer: 'Dự phòng ({{rate}})',
  colBuffer: 'Dự phòng',
  colDepartment: 'Phòng ban',
  colDifference: 'Chênh lệch',
  colFinance: 'Tài chính đề xuất',
  colFinanceTotal: 'Tổng Tài chính trình',
  colReason: 'Lý do cắt giảm',
  colRequested: 'Manager đề xuất',
  colSentAt: 'Gửi lúc',
  colSoftware: 'Phần mềm',
  colStage: 'Trạng thái',
  colVersion: 'Phiên bản',
  confirm: {
    ADJUSTMENT_REQUESTED: 'Gửi yêu cầu điều chỉnh',
    REJECTED: 'Xác nhận từ chối'
  },
  decisionHint:
    'Duyệt sẽ chốt ngân sách phòng ban cho năm mới. Yêu cầu điều chỉnh chuyển hồ sơ về Tài chính để gửi lại phiên bản mới. Từ chối kết thúc phiên bản này. Hai lựa chọn sau bắt buộc nhập lý do.',
  decisionTitle: 'Quyết định',
  history: {
    bufferRate: 'Tỷ lệ dự phòng {{rate}}',
    empty: 'Chưa có thay đổi nào được ghi nhận cho hồ sơ này.',
    hint: 'Cắt giảm, dự phòng, lần xem xét của Tài chính và các quyết định trước, mới nhất trước.',
    listLabel: 'Lịch sử thay đổi ngân sách {{department}}',
    title: 'Lịch sử thay đổi'
  },
  lineDetail: '{{plan}} · {{group}} · {{users}} người × {{months}} tháng',
  linesHint: 'Đề xuất của Manager so với số Tài chính phân tích và cắt giảm cho từng phần mềm.',
  linesTitle: 'Đề xuất của Manager và phân tích của Tài chính',
  managerNeed: 'Nhu cầu: {{need}}',
  noReason: 'Giữ nguyên đề xuất',
  notice: {
    by: '{{by}} · {{time}}',
    effect: {
      ADJUSTMENT_REQUESTED: 'Hồ sơ đã chuyển về Tài chính để điều chỉnh và gửi lại phiên bản mới.',
      APPROVED: 'Ngân sách năm {{year}} của {{department}} đã được chốt.',
      REJECTED: 'Phiên bản này đã kết thúc; Tài chính cần lập hồ sơ mới nếu muốn trình lại.'
    },
    reason: 'Lý do: {{reason}}',
    title: {
      ADJUSTMENT_REQUESTED: 'Đã yêu cầu Tài chính điều chỉnh phiên bản v{{version}}',
      APPROVED: 'Đã duyệt phiên bản v{{version}}',
      REJECTED: 'Đã từ chối phiên bản v{{version}}'
    }
  },
  openDetail: 'Xem',
  openDetailFor: 'Xem ngân sách {{department}}',
  other: 'Chi phí khác',
  otherRequested: 'Manager đề xuất {{amount}}',
  outcome: {
    ADJUSTMENT_REQUESTED: 'Yêu cầu điều chỉnh',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối'
  },
  pending: 'Hồ sơ chờ duyệt',
  pendingTotal: 'Tổng giá trị chờ duyệt',
  previousNone: 'Chưa có ngân sách năm trước',
  previousYear: 'Đã duyệt năm {{year}}',
  reasonLabel: {
    ADJUSTMENT_REQUESTED: 'Nội dung cần Tài chính điều chỉnh',
    REJECTED: 'Lý do từ chối'
  },
  reasonRequired: 'Bắt buộc nhập lý do.',
  requestedTotal: 'Tổng Manager đề xuất',
  sentBy: 'Tài chính gửi ngày {{time}}',
  subtitle:
    'Ngân sách năm {{year}} theo phòng ban do Tài chính trình. Duyệt để chốt, yêu cầu Tài chính điều chỉnh hoặc từ chối kèm lý do.',
  summaryLabel: 'Tóm tắt hồ sơ ngân sách',
  title: 'Duyệt ngân sách năm',
  total: 'Tổng ngân sách trình duyệt',
  totalsHint: 'Chi phí cơ sở + dự phòng + chi phí khác.',
  totalsTitle: 'Tổng ngân sách phòng ban',
  version: 'v{{version}}',
  versionLabel: 'Phiên bản v{{version}}',
  vsPrevious: 'So với năm trước'
} as const
