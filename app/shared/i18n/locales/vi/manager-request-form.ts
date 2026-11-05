export const managerRequestForm = {
  commonDecision: 'Quyết định cho cả nhóm',
  individualDecisions: 'Quyết định riêng từng người',
  personDecision: 'Quyết định cho {{name}}',
  rejectionReason: 'Lý do từ chối',
  inPlan: 'Trong kế hoạch',
  budgetLine: 'Dòng kế hoạch ngân sách',
  chooseBudgetLine: 'Chọn dòng kế hoạch',
  budgetWindow: 'Dự kiến mua: {{from}} – {{to}}',
  suggested: 'Phù hợp với gói đang yêu cầu',
  overdue: 'Đã quá thời gian dự kiến mua',
  endDates: 'Ngày kết thúc quyền của từng người',
  endDateFor: 'Ngày kết thúc quyền của {{name}}',
  commonEndDate: 'Ngày kết thúc dùng chung',
  applyEndDate: 'Áp dụng cho tất cả',
  endDateHint:
    'Bắt buộc với nhà thầu, freelancer và thực tập sinh. Kiểm tra nhóm sẽ xác nhận điều kiện của từng người.',
  editEndDates: 'Sửa ngày kết thúc',
  termConfirmation: 'Lý do xác nhận thời hạn trên 12 tháng',
  decisionsSummary: '{{approved}} người được duyệt, {{rejected}} người bị từ chối',
  requirementsUnavailable: 'Không tìm thấy bước nhu cầu đang được giao cho bạn. Tải lại hàng đợi để kiểm tra.'
} as const
