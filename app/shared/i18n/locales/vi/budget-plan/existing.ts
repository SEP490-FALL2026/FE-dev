/** Annual budget additions to the existing Finance screens: overview, Cost Center budgets and commitments. */
export const existing = {
  departments: {
    colBase: 'Ngân sách cơ sở',
    colBuffer: 'Buffer',
    colDepartment: 'Phòng ban / Trung tâm chi phí',
    colManager: 'Quản lý',
    colStatus: 'Trạng thái',
    colTotal: 'Tổng năm',
    companyRow: 'Toàn công ty (tổng đã duyệt)',
    empty: 'Chưa có ngân sách cho năm tài chính này.',
    hint: 'Ngân sách năm của từng phòng ban theo năm tài chính, kèm trạng thái trong vòng đời ngân sách.',
    legend: 'Các trạng thái ngân sách',
    notApplicable: '—',
    title: 'Ngân sách năm theo phòng ban',
    total: 'Tổng cộng',
    yearLabel: 'Năm tài chính',
    yearOption: 'Năm {{year}}'
  },
  overview: {
    approved: 'Tổng ngân sách đã duyệt',
    approvedBadge: 'Đã duyệt',
    base: 'Ngân sách cơ sở',
    buffer: 'Buffer dự phòng',
    committed: 'Đã cam kết chi',
    committedHint: 'Đã duyệt chi, chưa thanh toán',
    formula: 'Còn lại = Tổng đã duyệt − Đã sử dụng − Đã cam kết chi.',
    hint: 'Chỉ gồm ngân sách đã được Người duyệt chi phê duyệt cho năm đang hiệu lực.',
    openSummary: 'Xem tổng hợp theo phòng ban',
    proposalCount: 'Số đề xuất',
    proposedBadge: 'Chưa duyệt',
    proposedHint: 'Ngân sách năm {{year}} đang lập; không tính vào số đã duyệt và số còn lại.',
    proposedTitle: 'Đang đề xuất — chưa duyệt',
    proposedTotal: 'Tổng đang đề xuất',
    region: 'Ngân sách năm',
    remaining: 'Còn lại',
    title: 'Ngân sách năm {{year}} đã duyệt',
    used: 'Đã sử dụng'
  },
  unpaid: {
    colAmount: 'Số tiền',
    colApproved: 'Ngày duyệt',
    colCode: 'Mã cam kết',
    colPayment: 'Dự kiến thanh toán',
    colSoftware: 'Phần mềm',
    colStage: 'Tình trạng',
    count: '{{count}} khoản',
    hint: 'Khoản chi đã được Người duyệt chi phê duyệt nhưng chưa ghi nhận hoặc chưa thanh toán.',
    note: 'Các khoản này được trừ khỏi ngân sách còn lại (Còn lại = Ngân sách − Đã sử dụng − Đã duyệt nhưng chưa thanh toán) để hệ thống không tính số còn lại quá cao.',
    overdue: 'Quá hạn',
    stage: {
      NOT_RECORDED: 'Chưa ghi nhận',
      RECORDED: 'Đã ghi nhận — chưa thanh toán'
    },
    title: 'Đã duyệt chi nhưng chưa thanh toán',
    total: 'Tổng chưa thanh toán'
  }
} as const
