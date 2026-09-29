export const approvals = {
  nav: {
    dashboard: 'Dashboard',
    queue: 'Hàng đợi duyệt chi',
    reports: 'Báo cáo Tài chính',
    title: 'Phê duyệt & Quyết định'
  },
  reportsPage: {
    title: 'Báo cáo Tài chính & Phân tích Chi phí SaaS',
    subtitle:
      'Báo cáo chuyên sâu dành cho Người duyệt chi (CEO) — Theo dõi biến động ngân sách, lãng phí và hiệu quả đầu tư công nghệ',
    exportPdf: 'Xuất Báo cáo PDF',
    exportCsv: 'Xuất Dữ liệu Excel/CSV',
    tabs: {
      budgetUtilization: 'Ngân sách theo Đơn vị',
      vendorBreakdown: 'Chi phí theo Phần mềm',
      wasteOptimization: 'Phân tích Lãng phí',
      commitmentsForecast: 'Cam kết & Dự báo'
    },
    filters: {
      categoryLabel: 'Danh mục SaaS',
      allCategories: 'Tất cả danh mục',
      devTools: 'Developer Tools & Cloud',
      collaboration: 'Collaboration & Workplace',
      design: 'Product Design & UX',
      security: 'Security & Compliance',
      statusLabel: 'Trạng thái Tối ưu',
      allStatuses: 'Tất cả trạng thái',
      highWaste: 'Cần tối ưu (Lãng phí cao)',
      optimized: 'Đã tối ưu (Hiệu quả)'
    },
    tables: {
      softwareName: 'Tên Phần mềm / Nhà cung cấp',
      category: 'Danh mục',
      seatsCount: 'Số Seat (Cấp / Tổng)',
      activeUsers: 'Active / Inactive',
      arrSpend: 'Chi phí ARR',
      wasteRisk: 'Lãng phí ước tính',
      actions: 'Thao tác'
    },
    forecast: {
      title: 'Dự báo Dòng tiền Chi phí SaaS 3 Tháng Tới',
      nextMonth: 'Tháng 10/2026 (Dự kiến)',
      followingMonth: 'Tháng 11/2026 (Dự kiến)',
      thirdMonth: 'Tháng 12/2026 (Dự kiến)'
    },
    highWasteTitle: 'Danh sách các SaaS lãng phí chi phí cao',
    tableHeaders: {
      unassignedSeats: 'Seats thừa chưa cấp phát',
      inactiveUsers: 'User không hoạt động (>30 ngày)',
      annualWaste: 'Ước tính lãng phí / năm',
      status: 'Trạng thái'
    },
    forecastNotes: {
      nextMonth: 'Gia hạn Jira Enterprise & GitHub seats',
      followingMonth: 'Thanh toán Slack Grid H2-2026',
      thirdMonth: 'Gia hạn Figma & Notion AI'
    },
    softwareCount: '{{count}} phần mềm',
    seatsFormat: '{{count}} seats',
    usersFormat: '{{count}} người dùng',
    empty: 'Không có dữ liệu báo cáo khớp với bộ lọc'
  },
  dashboard: {
    title: 'Dashboard Điều hành & Báo cáo Tài chính',
    subtitle:
      'Tổng quan dành cho Người duyệt chi (CEO) · Theo dõi hàng đợi duyệt, báo cáo ngân sách và hiệu quả tiết kiệm',
    metrics: {
      pendingValue: 'Giá trị đang chờ duyệt',
      urgentSla: 'Cần duyệt khẩn (< 24h)',
      totalArr: 'Tổng chi phí SaaS (ARR)',
      realizedSavings: 'Tiết kiệm thật đã duyệt',
      savingsNote: 'Tối ưu từ downsize & hủy dịch vụ',
      yoyComparison: '+8.4% so với năm trước'
    },
    filters: {
      title: 'Bộ lọc Báo cáo Tài chính',
      periodLabel: 'Kỳ ngân sách',
      costCenterLabel: 'Đơn vị chịu chi phí (Cost Center)',
      allCostCenters: 'Tất cả đơn vị (Cost Center)',
      allPeriods: 'Tất cả các kỳ',
      periodQ1: 'Kỳ Q1-2026',
      periodQ2: 'Kỳ Q2-2026',
      periodQ3: 'Kỳ Q3-2026',
      ccEngineering: 'Engineering & Core Backend (CC-ENG-02)',
      ccDesign: 'Product Design & UX (CC-DESIGN-01)',
      ccOps: 'Operations & IT Infrastructure (CC-OPS-03)',
      ccMkt: 'Marketing & Growth Tech (CC-MKT-04)'
    },
    reports: {
      budgetUtilizationTitle: 'Báo cáo Sử dụng Ngân sách theo Đơn vị (Cost Center)',
      vendorSpendTitle: 'Báo cáo Chi phí theo Nhà cung cấp SaaS',
      financialSummaryTitle: 'Tóm tắt Báo cáo Tài chính & Lãng phí',
      pendingQueueTitle: 'Hàng đợi Duyệt chi Khẩn cấp',
      tableCostCenter: 'Đơn vị (Cost Center)',
      tableBudget: 'Ngân sách',
      tableSpent: 'Thực chi + Cam kết',
      tableRemaining: 'Còn lại',
      tableUtilization: 'Tỉ lệ dùng',
      viewQueueBtn: 'Vào Hàng đợi duyệt chi',
      urgentItemsCount: '{{count}} yêu cầu khẩn',
      wasteHighlight: 'Phát hiện 18 seat thừa và 12 tài khoản không hoạt động. Tiết kiệm dự kiến 45.000.000 ₫.',
      viewDetails: 'Xem xét & Duyệt',
      filterReset: 'Xóa bộ lọc',
      statusNormal: 'An toàn',
      statusWarning: 'Gần ngưỡng',
      statusDanger: 'Vượt ngân sách',
      viewAllQueue: 'Xem tất cả (4)',
      requestedAmountLabel: 'Giá trị yêu cầu',
      urgentSlaFormat: 'Còn {{hours}}h (Khẩn cấp)',
      countUnits: '{{count}} đơn vị',
      arrPercentage: '{{percent}}% ARR'
    }
  },
  queue: {
    title: 'Hàng đợi duyệt chi và quyết định gia hạn',
    subtitle: 'Danh sách các khoản chi và kỳ gia hạn cần xem xét theo thời hạn SLA',
    pendingDesc: 'Đang trong thời hạn SLA duyệt',
    urgentDesc: 'Cần quyết định trong ngày',
    overdueDesc: 'Nhắc SLA (Không đổi người)',
    sodDesc: 'Chờ Người thay thế xử lý (Phân tách nhiệm vụ)',
    deadlineFormat: 'Hạn báo hủy: {{date}}',
    paidSeatsFormat: '{{count}} seats trả phí',
    overdueSlaFormat: 'Quá hạn SLA ({{hours}}h)',
    urgentSlaFormat: 'Còn {{hours}}h (Khẩn)',
    remainingSlaFormat: 'Còn {{hours}}h',
    stats: {
      pending: 'Đang chờ duyệt',
      urgent: 'Khẩn cấp (< 24h)',
      overdue: 'Quá hạn SLA',
      sodConflict: 'Xung đột Phân tách nhiệm vụ'
    },
    filters: {
      searchPlaceholder: 'Tìm kiếm theo tên SaaS, người xin, mã yêu cầu...',
      allTypes: 'Tất cả loại việc',
      expense: 'Duyệt khoản chi mới',
      renewal: 'Quyết định kỳ gia hạn',
      newSaas: 'Phần mềm SaaS mới',
      allUrgency: 'Tất cả mức ưu tiên',
      urgentOnly: 'Khẩn cấp SLA',
      sodOnly: 'Cần người thay thế (Phân tách nhiệm vụ)'
    },
    table: {
      requestInfo: 'Yêu cầu / Phần mềm',
      requester: 'Người yêu cầu & Đơn vị',
      type: 'Loại việc',
      amount: 'Giá trị / Suất',
      sla: 'Thời hạn SLA',
      status: 'Trạng thái',
      actions: 'Thao tác'
    },
    types: {
      EXPENSE: 'Duyệt chi',
      RENEWAL: 'Kỳ gia hạn',
      NEW_SAAS: 'SaaS mới'
    },
    badges: {
      sodAlert: 'Xung đột Phân tách nhiệm vụ (Người thụ hưởng)',
      overdueAlert: 'Quá hạn SLA - Không chuyển người',
      managerApproved: 'Manager đã xác nhận',
      itAssessed: 'IT đã đánh giá rủi ro'
    },
    actions: {
      review: 'Xem xét & Quyết định',
      details: 'Xem chi tiết'
    },
    empty: 'Không có yêu cầu nào trong hàng đợi duyệt'
  },
  panel: {
    expenseTitle: 'Panel quyết định duyệt chi',
    expenseSubtitle: 'Xem xét yêu cầu chi phí và snapshot ngân sách',
    renewalTitle: 'Quyết định kỳ gia hạn thuê bao',
    renewalSubtitle: 'Đưa ra lựa chọn trước hạn chót báo hủy',
    sodWarningTitle: 'Cảnh báo Phân tách Nhiệm vụ',
    sodWarningDesc: 'Bạn là người yêu cầu hoặc người thụ hưởng của yêu cầu này. Hệ thống không cho phép tự duyệt chi.',
    delegateInfo:
      'Bước duyệt này thuộc về Người thay thế được Quản trị hệ thống cấu hình trước. Nếu chưa cấu hình, bước sẽ ở trạng thái chờ có kiểm soát.',
    managerStatus: 'Xác nhận của Quản lý trực tiếp',
    itRiskAssessment: 'Đánh giá rủi ro từ IT Admin',
    itRiskLow: 'Rủi ro thấp (Đã xác minh bảo mật)',
    itRiskMedium: 'Rủi ro trung bình (Cần lưu ý bảo mật)',
    itRiskHigh: 'Rủi ro cao (Chưa duyệt an toàn thông tin)',
    approveSuccessMsg:
      'Đã duyệt chi thành công! Hệ thống tự động tạo khoản cam kết ĐANG GIỮ và gửi tới IT Admin cấp phát.',
    rejectSuccessMsg: 'Đã từ chối khoản chi. Lý do từ chối đã được lưu và gửi tới người yêu cầu.',
    askFinanceSuccessMsg: 'Đã gửi câu hỏi tới bộ phận Tài chính. Đồng hồ SLA tiếp tục đếm ngược.',
    renewAsIsSuccessMsg: 'Đã quyết định gia hạn nguyên trạng! Bản ghi thuê bao kỳ mới đã được tạo tự động.',
    downsizeSuccessMsg:
      'Đã quyết định giảm số lượng xuống {{seats}} seats! Hệ thống ghi nhận khoản tiết kiệm thật {{amount}}.',
    cancelSuccessMsg: 'Đã xác nhận HỦY DỊCH VỤ trước hạn chót báo hủy. Hệ thống sẽ chấm dứt thuê bao khi hết kỳ.',
    slaFormat: 'SLA: {{status}}',
    slaRemaining: 'Còn {{hours}}h',
    slaOverdue: 'Quá hạn',
    softwareLabel: 'Phần mềm: {{name}}',
    requesterLabel: 'Người yêu cầu',
    costCenterLabel: 'Đơn vị chịu chi phí (Cost Center)',
    requestedAmountLabel: 'Số tiền yêu cầu',
    requestDateLabel: 'Ngày tạo phiếu',
    verificationHeader: 'Trạng thái xác minh & Đánh giá',
    managerVerifiedNote: 'Xác nhận nhu cầu',
    snapshotTitle: 'SNAPSHOT NGÂN SÁCH',
    periodBudgetLabel: 'Ngân sách kỳ:',
    actualSpendLabel: 'Thực chi:',
    heldCommitmentLabel: 'Cam kết đang giữ:',
    remainingBudgetLabel: 'Ngân sách còn lại:',
    pendingApprovalLabel: 'Khoản đang chờ duyệt:',
    budgetUsageLabel: 'Mức sử dụng ngân sách',
    actionsHeader: 'Hành động quyết định',
    sodLockedTitle: 'Nút bị khóa theo Phân tách Nhiệm vụ',
    sodLockedDesc: 'Chỉ người thay thế được ủy quyền mới có thể thực hiện thao tác duyệt chi.',
    cancellationLandmark: 'HẠN CHÓT BÁO HỦY: {{date}}',
    wasteBannerTitle: 'KHUYẾN NGHỊ LÃNG PHÍ ĐANG MỞ',
    wasteRecommendationsCount: '{{count}} Khuyến nghị',
    wasteBannerDesc:
      'Hệ thống phát hiện {{unassigned}} seat chưa cấp phát và {{inactive}} người dùng không hoạt động > 30 ngày. Khuyến nghị giảm số lượng seat khi gia hạn để tối ưu chi phí!',
    currentSeatsLabel: 'Số seat hiện tại',
    currentSeatsValue: '{{count}} Seats',
    renewalValueLabel: 'Giá trị gia hạn kỳ mới',
    deadlineLabel: 'Hạn chót báo hủy',
    usageEvidenceHeader: 'Số liệu sử dụng thực tế (Bằng chứng)',
    assignedLabel: 'Đã cấp phát',
    unassignedLabel: 'Chưa cấp phát',
    inactiveLabel: 'Không hoạt động',
    renewAsIsDesc: 'Gia hạn giữ nguyên {{seats}} seats. Sinh bản ghi thuê bao kỳ mới.',
    downsizeDesc: 'Cắt giảm bớt các seat thừa. Ghi nhận khoản tiết kiệm thật.',
    cancelDesc: 'Không gia hạn tiếp. Chấm dứt dịch vụ trước hạn báo hủy.',
    downsizeSeatsLabel: 'Số seat kỳ mới (Hiện tại: {{count}} seats)',
    reducedSeatsNote: 'Giảm {{count}} seats so với kỳ cũ',
    confirmCancelBtn: 'Xác nhận Hủy dịch vụ',
    usersCount: 'Người dùng',
    actions: {
      approve: 'Duyệt chi',
      reject: 'Từ chối khoản chi',
      askFinance: 'Hỏi thông tin Tài chính',
      renewAsIs: 'Gia hạn nguyên trạng',
      downsize: 'Giảm số lượng (Tiết kiệm)',
      cancel: 'Hủy dịch vụ'
    },
    rejectModal: {
      title: 'Xác nhận từ chối khoản chi',
      reasonLabel: 'Lý do từ chối (Bắt buộc)',
      reasonPlaceholder: 'Nhập lý do chi tiết để thông báo cho người yêu cầu...',
      cancelBtn: 'Hủy bỏ',
      confirmBtn: 'Xác nhận từ chối'
    },
    askFinanceModal: {
      title: 'Gửi câu hỏi tới bộ phận Tài chính',
      desc: 'Hệ thống sẽ gửi yêu cầu đối soát ngân sách tới Tài chính. Bước duyệt chi VẪN thuộc về bạn, đồng hồ SLA KHÔNG dừng.',
      notePlaceholder: 'Ghi chú câu hỏi cho Tài chính (tùy chọn)...',
      sendBtn: 'Gửi câu hỏi'
    },
    renewalModal: {
      downsizeTitle: 'Xác nhận giảm số lượng seat',
      seatsCount: 'Số seat kỳ mới',
      currentSeats: 'Số seat hiện tại',
      savingsCalculated: 'Ước tính tiết kiệm thật',
      cancelTitle: 'Xác nhận Hủy dịch vụ SaaS',
      cancelWarning:
        'Cảnh báo: Dịch vụ sẽ bị chấm dứt vào hạn chót báo hủy. Các người dùng active sẽ mất quyền truy cập.',
      activeUsersCount: 'Số người dùng đang hoạt động',
      confirmDecision: 'Xác nhận quyết định'
    }
  }
} as const
