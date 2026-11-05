/** Spending Approver: decisions on subscription renewals (subscription-renewals API). */
export const approvalsRenewal = {
  title: 'Gia hạn thuê bao',
  detailTitle: 'Quyết định gia hạn',
  back: 'Quay lại danh sách',
  invalidId: 'Mã ca gia hạn không hợp lệ.',
  unknown: 'Chưa xác định',
  notProvided: 'Chưa có',
  yes: 'Có',
  no: 'Không',
  seats: '{{value}} ghế',
  filters: {
    state: 'Trạng thái',
    late: 'Cờ trễ',
    allStates: 'Tất cả trạng thái',
    lateAll: 'Tất cả',
    lateTrue: 'Đã quá mốc chưa ghi kết quả',
    lateFalse: 'Không trễ'
  },
  columns: {
    software: 'Phần mềm',
    milestone: 'Mốc',
    proposal: 'Đề xuất',
    state: 'Trạng thái',
    late: 'Cờ trễ',
    proposedAt: 'Ngày đề xuất'
  },
  emptyQueue: 'Không có ca gia hạn nào đang chờ bạn quyết định.',
  emptyFiltered: 'Không có ca gia hạn khớp bộ lọc.',
  lateBadge: 'Trễ',
  waitingNoApprover: 'Đang chờ cấu hình Người duyệt chi',
  stats: {
    purchased: 'Ghế đã mua',
    inUse: 'Ghế đang giữ',
    milestone: 'Mốc tính hạn'
  },
  period: {
    title: 'Kỳ thuê bao',
    startDate: 'Bắt đầu',
    endDate: 'Kết thúc',
    renewalDate: 'Ngày gia hạn',
    billingCycle: 'Chu kỳ thanh toán',
    autoRenew: 'Tự gia hạn',
    midTerm: 'Cho giảm giữa kỳ',
    basis: 'Căn cứ mốc'
  },
  usage: {
    title: 'Mức sử dụng',
    AVAILABLE: 'Có nguồn bằng chứng sử dụng.',
    NOT_AVAILABLE: 'Chưa đánh giá được mức sử dụng. Đây không phải là 0 người dùng.',
    seatsHint: 'Ghế đang giữ là số quyền đã cấp, không phải bằng chứng có sử dụng.'
  },
  proposal: {
    title: 'Đề xuất của IT Admin',
    choice: 'Lựa chọn',
    note: 'Ghi chú',
    opinion: 'Ý kiến Business Owner',
    opinionHint: 'Ý kiến tham khảo, không phải một bước duyệt.',
    proposedAt: 'Thời điểm đề xuất'
  },
  ranking: {
    title: 'Xếp hạng ghế đang dùng',
    hint: 'Thứ tự gợi ý khi giảm dưới số ghế đang giữ. Bạn tự chọn ghế thu hồi.',
    orderOnly: 'Chưa có dữ liệu sử dụng: danh sách xếp theo ghế cũ nhất, không phải đánh giá mức dùng.',
    validFrom: 'Hiệu lực từ',
    lastActivity: 'Hoạt động cuối',
    noActivity: 'Chưa có dữ liệu',
    select: 'Thu hồi ghế của {{name}}',
    empty: 'Kỳ này không có ghế cá nhân đang dùng.'
  },
  decision: {
    title: 'Quyết định của bạn',
    choice: 'Quyết định',
    choiceHint: 'Quyết định không giữ khoản cam kết ngân sách và không tự tạo kỳ mới.',
    choiceRequired: 'Chọn một quyết định.',
    quantity: 'Số ghế còn lại sau khi giảm',
    quantityPlaceholder: 'Ví dụ: 8',
    quantityHint: 'Phải nhỏ hơn {{purchased}} ghế đang mua.',
    quantityHintUnknown: 'Phải nhỏ hơn số ghế đang mua.',
    quantityInvalid: 'Nhập số nguyên từ 0 và nhỏ hơn {{purchased}}.',
    quantityInvalidUnknown: 'Nhập số nguyên từ 0.',
    itSuggests: 'IT đề xuất {{count}} ghế.',
    withinTerm: 'Giảm ngay trong kỳ đã trả',
    withinTermHint: 'Chỉ áp dụng khi thuê bao cho giảm giữa kỳ.',
    release: 'Ghế cần thu hồi',
    releaseHint: 'Chọn đúng {{required}} ghế trong danh sách xếp hạng. Đã chọn {{selected}}.',
    releaseInvalid: 'Cần chọn đúng {{required}} ghế, hiện chọn {{selected}}.',
    acknowledge: 'Tôi xác nhận hủy dù còn {{count}} ghế đang được giữ',
    acknowledgeRequired: 'Xác nhận hủy khi vẫn còn người dùng.',
    reason: 'Lý do',
    reasonPlaceholder: 'Ví dụ: Hai nhóm đã chuyển sang công cụ khác, giảm còn 8 ghế',
    reasonHint: 'Không bắt buộc, tối đa 2.000 ký tự.',
    reasonTooLong: 'Lý do tối đa 2.000 ký tự.',
    submit: 'Ghi quyết định',
    submitting: 'Đang ghi quyết định',
    decided: 'Đã ghi quyết định gia hạn.',
    blocked: 'Bạn không thể quyết ca gia hạn này.'
  },
  record: {
    title: 'Quyết định đã ghi',
    choice: 'Quyết định',
    quantity: 'Số ghế còn lại',
    reason: 'Lý do',
    decidedAt: 'Thời điểm quyết định',
    deciderRole: 'Vai người quyết',
    executionPoint: 'Thời điểm thực hiện',
    afterDeadline: 'Quyết định sau mốc. Quyết định vẫn hiệu lực và được thực hiện theo thời điểm trên.',
    seatsAtDecision: 'Ghế đang giữ lúc quyết',
    releasedSeats: 'Ghế chọn thu hồi',
    snapshot: 'Số liệu tài chính lúc quyết',
    notConnected: 'Chưa nối số liệu tài chính. Ghi nhận lúc {{time}}.',
    budget: 'Ngân sách',
    spent: 'Đã chi',
    committed: 'Đã cam kết',
    remaining: 'Còn lại',
    pendingRequests: 'Yêu cầu đang chờ',
    periodCost: 'Chi phí kỳ tới',
    periodTax: 'Thuế được khấu trừ',
    fiscalYear: 'Năm tài chính',
    asOf: 'Số liệu ngày {{date}}',
    financialStatus: 'Tình trạng ngân sách',
    awaitingOutcome: 'IT Admin đang làm việc với nhà cung cấp để ghi kết quả.',
    lateFlaggedAt: 'Bị gắn cờ trễ lúc {{time}}.'
  },
  outcome: {
    title: 'Kết quả với nhà cung cấp',
    kind: 'Kết quả',
    note: 'Ghi chú',
    recordedAt: 'Thời điểm ghi',
    followUp: 'Còn việc theo dõi với nhà cung cấp.',
    savings: 'Tiết kiệm khi gia hạn',
    nextPeriod: 'Đã có kỳ thuê bao nối tiếp.'
  },
  deadline: {
    title: 'Mốc đã qua chưa có quyết định',
    kind: 'Loại sự kiện',
    allKinds: 'Tất cả loại',
    milestoneDate: 'Ngày mốc',
    autoRenew: 'Tự gia hạn lúc qua mốc',
    recordedOn: 'Ngày ghi nhận',
    empty: 'Chưa có mốc nào bị lỡ.'
  },
  values: {
    state: {
      PROPOSED: 'Chờ quyết định',
      DECIDED: 'Đã quyết, chờ ghi kết quả',
      OUTCOME_RECORDED: 'Đã ghi kết quả'
    },
    choice: {
      RENEW: 'Gia hạn nguyên trạng',
      REDUCE: 'Giảm số ghế',
      CANCEL: 'Hủy thuê bao'
    },
    basis: {
      DECLARED: 'Hạn báo hủy đã khai',
      INFERRED_UNCONFIRMED: 'Hạn suy ra, chưa xác nhận',
      BY_END_DATE: 'Theo ngày kết thúc kỳ'
    },
    executionPoint: {
      AS_PLANNED: 'Thực hiện ở lần gia hạn này',
      MID_TERM: 'Thực hiện giữa kỳ',
      NEXT_RENEWAL: 'Thực hiện ở lần gia hạn sau'
    },
    outcome: {
      AS_DECIDED: 'Nhà cung cấp làm đúng quyết định',
      VENDOR_REFUSED: 'Nhà cung cấp từ chối',
      DIFFERENT: 'Nhà cung cấp làm khác quyết định',
      UNCONFIRMED: 'Nhà cung cấp chưa xác nhận'
    },
    group: {
      REVOCATION_DECIDED: 'Đã có quyết định thu hồi',
      HOLDER_LEFT: 'Người giữ đã nghỉ việc',
      USAGE_FLAGGED: 'Bị gắn cờ lãng phí',
      OTHER: 'Ghế còn lại'
    },
    kind: {
      AUTO_RENEWAL_INCIDENT: 'Tự gia hạn ngoài ý muốn',
      EXPIRY_MARKED: 'Đánh dấu sẽ kết thúc'
    },
    deciderRole: {
      SPENDING_APPROVER: 'Người duyệt chi',
      CONFLICT_SUBSTITUTE: 'Người duyệt chi thay thế'
    },
    financialStatus: {
      BUDGET: 'Có ngân sách năm',
      NO_BUDGET: 'Chưa có ngân sách cho năm này',
      NO_COST_CENTER: 'Phòng sở hữu chưa có Cost Center'
    }
  },
  errors: {
    readForbidden: 'Bạn không có quyền xem ca gia hạn này.',
    notFound: 'Không tìm thấy ca gia hạn. Danh sách đã được tải lại.',
    notDecider: 'Bạn không phải người quyết ca gia hạn này.',
    notAwaiting: 'Ca gia hạn không còn chờ quyết định. Dữ liệu đã được tải lại.',
    activeUsers: 'Vẫn còn {{count}} ghế đang được giữ. Xác nhận hủy rồi gửi lại.',
    activeUsersUnknown: 'Vẫn còn ghế đang được giữ. Xác nhận hủy rồi gửi lại.',
    financeSetup: 'Phòng sở hữu chưa có Cost Center đang dùng nên chưa ghi được quyết định này.',
    revocationType: 'Có ghế được chọn không thu hồi được qua hàng tác vụ. Chọn ghế khác.',
    quantityInvalid: 'Số ghế không phù hợp với quyết định. Giảm số ghế phải nhỏ hơn số đang mua.',
    excessSelection: 'Cần chọn đúng {{required}} ghế để thu hồi, hiện chọn {{selected}}.',
    excessSelectionUnknown: 'Số ghế chọn thu hồi chưa đúng phần dư của kỳ này.',
    midTerm: 'Thuê bao này không cho giảm giữa kỳ.',
    forbidden: 'Bạn không có quyền xem các mốc đã qua.'
  }
}
