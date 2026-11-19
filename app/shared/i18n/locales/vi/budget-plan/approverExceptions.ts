/** APV-07: the Spending Approver decides budget exceptions and changes to an approved budget that Finance submitted. */
export const approverExceptions = {
  adjustment: {
    after: 'Ngân sách đề xuất mới',
    before: 'Ngân sách đã duyệt hiện tại',
    changeTitle: 'Thay đổi đề xuất',
    costCenter: 'Trung tâm chi phí',
    demoNote:
      'Duyệt sẽ ghi nhận quyết định vào lịch sử. Con số đã duyệt trên màn hình phân bổ của Tài chính là dữ liệu minh họa và không thay đổi.',
    difference: 'Chênh lệch',
    kind: 'Điều chỉnh ngân sách đã duyệt',
    optionDecrease: 'Giảm ngân sách năm',
    optionIncrease: 'Tăng ngân sách năm',
    reason: 'Lý do của Tài chính',
    requestedAt: 'Yêu cầu lúc',
    requestedBy: 'Người yêu cầu',
    subtitle: '{{costCenter}} · Năm tài chính {{year}}',
    title: 'Điều chỉnh ngân sách {{costCenter}}'
  },
  approve: 'Chấp thuận',
  backToList: 'Quay lại danh sách',
  colKind: 'Loại',
  colOption: 'Phương án của Tài chính',
  colProposed: 'Bổ sung / ngân sách mới',
  colReference: 'Mã hồ sơ',
  colStatus: 'Trạng thái',
  colSubject: 'Phần mềm / trung tâm chi phí',
  confirmReject: 'Xác nhận từ chối',
  decisionHint: 'Chấp thuận để phương án của Tài chính có hiệu lực. Từ chối bắt buộc nhập lý do.',
  decisionTitle: 'Quyết định',
  empty: 'Không có hồ sơ nào khớp bộ lọc.',
  exception: {
    amount: 'Số tiền yêu cầu',
    checkAmount: 'Số tiền kiểm tra',
    checkTitle: 'Kết quả kiểm tra ngân sách',
    checkedAt: 'Kiểm tra lúc',
    costCenter: 'Trung tâm chi phí',
    financeTitle: 'Phương án xử lý của Tài chính',
    kind: 'Loại ngoại lệ',
    manager: 'Manager phụ trách',
    noCheck: 'Không tìm thấy kết quả kiểm tra tự động cho yêu cầu này.',
    noTopUp: 'Không đề xuất bổ sung',
    note: 'Ghi chú của Tài chính',
    option: 'Phương án',
    problemTitle: 'Hồ sơ ngoại lệ',
    proposedTopUp: 'Mức bổ sung đề xuất',
    raisedAt: 'Phát sinh lúc',
    remainingBefore: 'Còn lại trước yêu cầu',
    remainingUnknown: 'Không áp dụng',
    requestCode: 'Mã yêu cầu',
    resolvedAt: 'Tài chính xử lý lúc',
    shortfall: 'Còn thiếu',
    target: 'Trung tâm chi phí mới'
  },
  notice: {
    approved: 'Đã chấp thuận',
    by: '{{by}} · {{time}}',
    reason: 'Lý do: {{reason}}',
    rejected: 'Đã từ chối'
  },
  openDetail: 'Xem',
  openDetailFor: 'Xem hồ sơ {{reference}}',
  reasonLabel: 'Lý do từ chối',
  reasonRequired: 'Bắt buộc nhập lý do từ chối.',
  reject: 'Từ chối',
  state: {
    decided: 'Đã quyết định',
    pending: 'Chờ quyết định'
  },
  status: {
    approved: 'Đã chấp thuận',
    pending: 'Chờ quyết định',
    rejected: 'Đã từ chối'
  },
  subtitle:
    'Hồ sơ thiếu ngân sách hoặc SaaS ngoài danh mục mà Tài chính trình kèm phương án xử lý, và các yêu cầu điều chỉnh ngân sách đã duyệt.',
  title: 'Phê duyệt ngoại lệ',
  type: {
    adjustments: 'Điều chỉnh ngân sách',
    exceptions: 'Ngoại lệ ngân sách'
  },
  typeLabel: 'Loại hồ sơ'
} as const
