export const finance = {
  nav: {
    title: 'Tài chính & Ngân sách',
    dashboard: 'Dashboard',
    softwareDirectory: 'Danh mục Chi phí Phần mềm',
    snapshot: 'Snapshot Ngân sách',
    renewals: 'Lịch Gia hạn & Hạn chót',
    commitments: 'Khoản Cam kết Ngân sách',
    shadowIt: 'Chi tiêu ngoài danh mục'
  },
  dashboard: {
    title: 'Bảng điều khiển Tổng quan Tài chính',
    subtitle: 'Theo dõi tổng hợp chi phí SaaS, ngân sách các đơn vị và hiệu quả tiết kiệm',
    yoyComparison: '+8.4% so với năm ngoái',
    mrrNote: 'Trung bình hàng tháng',
    activeSubNote: 'Gói phần mềm trả phí',
    savingsNote: 'Từ thu hồi seat & downsize',
    currentQuarter: 'Q3-2026',
    budgetPercentLabel: '{{percent}}% Ngân sách',
    spendPercentLabel: '{{percent}}% Chi phí',
    metrics: {
      arr: 'Chi phí năm (ARR)',
      mrr: 'Chi phí tháng (MRR)',
      activeSubscriptions: 'Số thuê bao đang chạy',
      realizedSavings: 'Tiết kiệm thật đã đạt được'
    },
    costCenterChartTitle: 'Phân bổ Ngân sách & Thực chi theo Đơn vị (Cost Center)',
    vendorBreakdownTitle: 'Top Chi phí theo Nhà cung cấp',
    savingsBreakdownTitle: 'Phân tích Tiết kiệm & Lãng phí',
    totalBudgetLabel: 'Ngân sách cấp',
    actualSpendLabel: 'Thực chi + Cam kết'
  },
  directory: {
    title: 'Danh mục & Quản lý Chi phí Thuê bao SaaS',
    subtitle: 'Chi tiết toàn bộ các gói thuê bao phần mềm đang trả phí trong doanh nghiệp',
    searchPlaceholder: 'Tìm kiếm theo tên phần mềm, nhà cung cấp, Cost Center...',
    table: {
      software: 'Phần mềm / Nhà cung cấp',
      pricingModel: 'Gói giá & Suất',
      annualCost: 'Chi phí hàng năm',
      costCenter: 'Đơn vị chịu chi phí',
      paymentMethod: 'Hình thức thanh toán',
      status: 'Trạng thái'
    },
    seatsFormat: '{{assigned}} / {{total}} seats sử dụng',
    invoiceMethod: 'Hóa đơn Doanh nghiệp',
    cardMethod: 'Thẻ tín dụng Cty (...{{last4}})'
  },
  shadowIt: {
    title: 'Xem xét & Hợp thức hóa Chi tiêu ngoài danh mục',
    subtitle: 'Phát hiện các khoản chi SaaS tự phát qua sao kê thẻ tín dụng hoặc hóa đơn',
    searchPlaceholder: 'Tìm kiếm giao dịch theo tên dịch vụ, người chi, số thẻ...',
    legalizeSuccessMsg: 'Đã hợp thức hóa khoản chi! Đã sinh yêu cầu tạo phần mềm trong danh mục chính thức.',
    inquireSuccessMsg: 'Đã gửi phiếu yêu cầu giải trình tới nhân viên và IT Admin.',
    rejectSuccessMsg: 'Đã đánh dấu từ chối khoản chi không tuân thủ.',
    legalizeModalTitle: 'Xác nhận Hợp thức hóa phần mềm ngoài danh mục',
    legalizeModalDesc:
      'Hệ thống sẽ thêm dịch vụ này vào Danh mục SaaS được ghi nhận và quy chi phí về Đơn vị tương ứng.',
    inquireModalTitle: 'Yêu cầu nhân viên giải trình khoản chi',
    inquireModalDesc: 'Gửi thông báo tới người chi tiền để cung cấp mục đích công việc và phê duyệt từ Quản lý.',
    cardLabelFormat: 'Thẻ ...{{last4}}',
    confirmLegalizeBtn: 'Xác nhận Hợp thức hóa',
    confirmInquireBtn: 'Gửi yêu cầu giải trình',
    table: {
      transaction: 'Giao dịch / Dịch vụ SaaS',
      spender: 'Người chi & Thẻ',
      amount: 'Số tiền',
      date: 'Ngày giao dịch',
      status: 'Trạng thái xử lý',
      actions: 'Thao tác'
    },
    statuses: {
      FLAGGED: 'Phát hiện ngoài danh mục',
      INQUIRED: 'Đang chờ giải trình',
      LEGALIZED: 'Đã hợp thức hóa',
      REJECTED: 'Đã từ chối'
    },
    actions: {
      legalize: 'Hợp thức hóa',
      inquire: 'Làm rõ',
      reject: 'Từ chối / Khấu trừ'
    }
  },
  snapshot: {
    title: 'Tài chính kiểm soát Ngân sách',
    subtitle: 'Quản lý snapshot ngân sách kỳ, thực chi và câu trả lời hạn mức cho Người duyệt chi',
    periodFormat: 'Kỳ {{period}}',
    actualSpendNote: 'Đã có hóa đơn thanh toán',
    heldNote: 'Giữ chỗ ngân sách',
    remainingNote: 'Khả dụng',
    pendingNote: 'Đang chờ CEO',
    usageLabel: 'Mức sử dụng ngân sách',
    modalTitle: 'Trả lời thông tin ngân sách ({{requestCode}})',
    selectStatusLabel: 'Chọn Trạng thái Hạn mức Ngân sách',
    ruleInfoTitle: 'Quy tắc Kiểm soát Ngân sách',
    ruleInfoDesc:
      'Câu trả lời của Tài chính nhằm cung cấp thông tin cho Người duyệt chi. Câu trả lời KHÔNG tự duyệt hay tự chặn quy trình; SLA bước duyệt chi tiếp tục chạy bình thường.',
    notePlaceholder: 'Nhập nhận xét của Tài chính để gửi cho Người duyệt chi tham khảo...',
    cancelBtn: 'Hủy',
    confirmSendBtn: 'Xác nhận Gửi câu trả lời',
    respondedMsg: 'Đã gửi câu trả lời trạng thái ngân sách cho Người duyệt chi! SLA bước duyệt KHÔNG dừng.',
    requesterText: 'Người yêu cầu: {{name}} | Đơn vị: {{costCenter}} | Số tiền: {{amount}}',
    respondedBadge: '(Đã trả lời)',
    metrics: {
      totalBudget: 'Ngân sách kỳ',
      actualSpend: 'Thực chi',
      heldCommitment: 'Cam kết đang giữ',
      remaining: 'Ngân sách còn lại',
      pendingApproval: 'Đang chờ duyệt'
    },
    inquiries: {
      title: 'Yêu cầu thông tin ngân sách từ Người duyệt chi',
      subtitle: 'Trả lời trạng thái ngân sách cho bước duyệt chi — SLA bước duyệt KHÔNG dừng',
      respond: 'Trả lời thông tin',
      statusOptions: {
        withinLimit: 'Trong hạn mức',
        exceedsLimit: 'Vượt hạn mức',
        noBudget: 'Chưa có ngân sách'
      },
      note: 'Ghi chú tài chính (không dừng quy trình duyệt, không tự động chặn)'
    }
  },
  renewals: {
    title: 'Lịch gia hạn & Hạn chót báo hủy',
    subtitle: 'Mốc mấu chốt là HẠN CHÓT BÁO HỦY, không phải ngày gia hạn hợp đồng',
    searchPlaceholder: 'Tìm kiếm thuê bao theo tên hoặc nhà cung cấp...',
    vendorText: 'Nhà cung cấp: {{vendor}} | {{seats}} seats ({{cost}}/năm)',
    landmarkText: 'Mốc chính',
    cancellationDeadlineFormat: 'HẠN CHÓT BÁO HỦY: {{date}}',
    unassignedText: '{{unassigned}} seats trống, {{inactive}} users không HĐ',
    incidentBadge: 'Sự cố Tự động gia hạn',
    pendingBadge: 'Chờ CEO quyết định',
    table: {
      subscription: 'Thuê bao / Gói SaaS',
      vendor: 'Nhà cung cấp',
      seats: 'Suất sử dụng',
      cancellationDeadline: 'Hạn chót báo hủy',
      renewalDate: 'Ngày gia hạn hợp đồng',
      wasteRecommendation: 'Khuyến nghị lãng phí',
      status: 'Trạng thái',
      action: 'Thao tác'
    },
    waste: {
      badge: 'Khuyến nghị lãng phí',
      unassignedSeats: '{{count}} seat chưa cấp phát',
      inactiveUsers: '{{count}} người dùng không hoạt động > 30 ngày',
      potentialSavings: 'Tiết kiệm tiềm năng: {{amount}}'
    },
    autoRenewalAlert: {
      title: 'Cảnh báo Tự động gia hạn',
      desc: 'Nếu không ai xử lý trước hạn chót báo hủy, hợp đồng sẽ tự động gia hạn và ghi nhận thành sự cố cần lưu ý.'
    }
  },
  commitments: {
    title: 'Khoản cam kết ngân sách Đang giữ',
    subtitle: 'Hệ thống tự động tạo khi duyệt chi để giữ chỗ ngân sách',
    totalHeldLabel: 'TỔNG NGÂN SÁCH ĐANG GIỮ CHỖ',
    subRuleText: 'Cam kết Giữ chỗ',
    subRuleDesc: 'Tự động giữ chỗ khi CEO duyệt chi',
    searchPlaceholder: 'Tìm kiếm mã cam kết, mã phiếu yêu cầu, SaaS...',
    reconcileInvoice: 'Đối soát hóa đơn',
    reconciledMsg: 'Đã ghi nhận đối soát hóa đơn thật! Số tiền chính thức chuyển từ Cam kết sang Thực chi.',
    table: {
      commitmentId: 'Mã cam kết',
      requestRef: 'Tham chiếu Yêu cầu',
      costCenter: 'Đơn vị chịu chi phí',
      amount: 'Số tiền cam kết',
      createdAt: 'Thời điểm tạo',
      status: 'Trạng thái ghi nhận',
      actions: 'Thao tác đối soát'
    },
    statuses: {
      HELD: 'Đang giữ (Cam kết)',
      RECONCILED: 'Đã có hóa đơn thật',
      RELEASED: 'Đã giải phóng (Từ chối/Hủy)'
    }
  }
} as const
