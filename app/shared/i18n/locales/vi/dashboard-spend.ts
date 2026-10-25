import { budgetPlan } from './dashboard-budget-plan'

/** Finance (UF-11, UF-12, UF-19) and Spending Approver (UF-15) screens, plus shared budget wording. */
export const spendDashboard = {
  budgetPlan,
  ui: {
    all: 'Tất cả',
    cancel: 'Hủy',
    close: 'Đóng',
    save: 'Lưu'
  },
  budget: {
    actual: 'Thực chi',
    asOf: 'Số liệu ngày {{time}}',
    borneCost: 'Chi phí thực chịu',
    borneCostNote:
      'Mọi số tiền tính trên chi phí thực chịu; thuế GTGT được khấu trừ hiển thị ở cột riêng, không trừ vào ngân sách.',
    budget: 'Ngân sách',
    costCenter: 'Trung tâm chi phí',
    deductibleVat: 'Thuế GTGT được khấu trừ',
    deductibleVatSeparate: 'Thuế GTGT được khấu trừ (cột riêng)',
    estimateTitle: 'Chi phí ước tính',
    estimated: 'Ước tính',
    held: 'Cam kết đang giữ',
    noBudget: 'Chưa có ngân sách',
    nonDeductibleTax: 'Thuế không được khấu trừ',
    overCommitted: 'Đã cam kết vượt hạn mức',
    pending: 'Yêu cầu có chi phí đang chờ duyệt',
    preTax: 'Giá trước thuế',
    remaining: 'Còn lại',
    snapshotTitle: 'Bản chụp ngân sách',
    totalPayable: 'Tổng tiền phải trả',
    usedRatio: 'Tỷ lệ đã dùng và đã cam kết'
  },
  approvals: {
    nav: {
      annualBudget: 'Duyệt ngân sách năm',
      decisionHistory: 'Lịch sử quyết định',
      exceptionApproval: 'Duyệt ngoại lệ & điều chỉnh',
      optimization: 'Đề xuất tối ưu',
      overview: 'Tổng quan',
      queue: 'Hàng chờ duyệt',
      reports: 'Báo cáo'
    },
    backToQueue: 'Quay lại hàng chờ',
    reasonRequired: 'Bắt buộc nhập lý do.',
    kind: {
      CHARGE: 'Khoản chi chưa có căn cứ',
      FINDING: 'Hợp thức hóa',
      NEED_STEP: 'Bước nhu cầu',
      RENEWAL: 'Kỳ gia hạn',
      SPEND_STEP: 'Duyệt chi'
    },
    risk: {
      HIGH: 'Rủi ro cao',
      LOW: 'Rủi ro thấp',
      MEDIUM: 'Rủi ro trung bình'
    },
    sla: {
      left: 'Còn {{hours}} giờ',
      overdue: 'Quá hạn {{hours}} giờ',
      reminders: 'Đã nhắc {{count}} lần'
    },
    alerts: {
      budgetChanged: 'Tài chính sửa ngân sách giữa kỳ',
      deadlineSoon: 'Sắp tới hạn chót báo hủy',
      financeOver: 'Tài chính ghi nhận Vượt hạn mức sau khi duyệt chi',
      lateExecution: 'Gia hạn đã quyết nhưng chưa có kết quả thực hiện'
    },
    overview: {
      alertsTitle: 'Cảnh báo gửi tôi',
      subtitle: 'Việc đang chờ bạn quyết. Tài chính chỉ cung cấp ý kiến ngân sách để tham khảo.',
      title: 'Chào {{name}}',
      urgentHint:
        'Sắp xếp theo hạn xử lý — quá hạn thì hệ thống nhắc bạn và báo Quản trị hệ thống, không đổi người, không tự quyết.',
      urgentTitle: 'Cần quyết sớm nhất'
    },
    queue: {
      colAmount: 'Số tiền',
      colItem: 'Mục',
      colSla: 'Hạn xử lý',
      colType: 'Loại việc',
      filter: {
        charges: 'Khoản chi / hợp thức hóa',
        renewals: 'Gia hạn',
        requests: 'Yêu cầu'
      },
      filterLabel: 'Lọc theo loại việc',
      open: 'Mở',
      openItem: 'Mở {{reference}}',
      slaRule:
        'Mỗi việc có hạn xử lý riêng. Quá hạn hoặc việc tồn đọng vượt ngưỡng: hệ thống nhắc bạn và cảnh báo Quản trị hệ thống — không chuyển cho người khác, không ủy quyền, không bao giờ tự quyết.',
      subtitle:
        'Bốn loại việc: duyệt chi · bước nhu cầu khi trưởng phòng là người thụ hưởng · kỳ gia hạn · khoản chi chưa có căn cứ hoặc hợp thức hóa.',
      title: 'Hàng chờ phê duyệt'
    },
    request: {
      approve: 'Duyệt',
      askFinance: 'Hỏi Tài chính thông tin ngân sách',
      askDialogTitle: 'Hỏi Tài chính về ngân sách {{costCenter}}',
      budgetHint: 'Chi phí của yêu cầu này đặt cạnh bản chụp ngân sách của trung tâm chi phí trong kỳ.',
      budgetTitle: 'Chi phí và ngân sách',
      financeReplied: '{{name}} trả lời · {{time}}',
      financeTeam: 'Tài chính',
      financeWaiting: 'Đang chờ Tài chính trả lời — hạn xử lý của bạn vẫn chạy, bạn quyết được ngay.',
      notAsked: 'Bạn chưa hỏi Tài chính cho yêu cầu này.',
      questionRequired: 'Nhập câu hỏi cho Tài chính.',
      recordingNote:
        'Tài chính sẽ ghi ý kiến chính thức trên khoản cam kết; nếu Vượt hạn mức hoặc Chưa có ngân sách, bạn được báo — quyết định không bị hoàn tác.',
      rejectDialogTitle: 'Từ chối {{reference}}',
      rejectHint: 'Người yêu cầu được báo kèm lý do; không tạo khoản cam kết.',
      summaryCostCenter: 'Trung tâm chi phí · kỳ',
      summaryRegion: 'Tóm tắt yêu cầu',
      summaryRemainingAfter: 'Còn lại sau yêu cầu này',
      yourQuestion: 'Câu hỏi của bạn · {{time}}',
      beneficiary: 'Người thụ hưởng',
      branch: {
        b: 'Mua thêm hoặc nâng gói',
        c: 'Phần mềm mới'
      },
      confirmReject: 'Xác nhận từ chối',
      financeHint: 'Tùy chọn. Hạn xử lý không dừng khi hỏi; bạn quyết được cả khi Tài chính chưa trả lời.',
      financeTitle: 'Ý kiến ngân sách của Tài chính',
      itAssessment: 'Đánh giá của Quản trị CNTT',
      needApproved:
        'Đã duyệt bước nhu cầu. Yêu cầu đi tiếp tới bước duyệt chi — vẫn giao cho bạn, nhật ký đánh dấu cùng một người duyệt.',
      needDecisionTitle: 'Quyết định bước nhu cầu',
      needStepHint:
        'Trưởng phòng tự gửi yêu cầu nên bước nhu cầu do Người duyệt chi đảm nhận. Hai bước vẫn tách riêng.',
      needTitle: 'Nhu cầu và lý do',
      questionLabel: 'Câu hỏi cho Tài chính',
      referenceOnly: 'Ý kiến tham khảo — không phải phê duyệt, không chặn quyết định.',
      reject: 'Từ chối',
      rejectReason: 'Lý do từ chối (bắt buộc)',
      rejected: 'Đã từ chối. Người yêu cầu được báo kèm lý do; không tạo khoản cam kết.',
      requester: 'Người yêu cầu',
      samePerson: 'Cùng người với bước trước',
      sendQuestion: 'Gửi câu hỏi',
      snapshotCaptured:
        'Bản chụp ngân sách được lưu lại đúng lúc bạn quyết để làm bằng chứng. Không ai duyệt yêu cầu mà mình là người yêu cầu hoặc người thụ hưởng.',
      spendApproved:
        'Đã duyệt chi. Hệ thống tạo khoản cam kết (Tài chính ghi nhận sau) và việc cấp phát cho Quản trị CNTT.',
      spendDecisionTitle: 'Quyết định duyệt chi',
      spendStepHint: 'Duyệt hoặc từ chối dựa trên bản chụp ngân sách. Từ chối bắt buộc có lý do.',
      step: {
        created: 'Gửi yêu cầu',
        itReview: 'CNTT đánh giá danh mục, rủi ro, mức kiểm soát',
        needStep: 'Bước nhu cầu',
        spendStep: 'Bước duyệt chi'
      },
      trailTitle: 'Lịch sử phê duyệt',
      yourStep: '— bước của bạn'
    },
    renewal: {
      action: {
        CANCEL: 'Hủy thuê bao',
        REDUCE: 'Giảm số lượng',
        RENEW: 'Gia hạn giữ nguyên'
      },
      actionRequired: 'Chọn một quyết định.',
      annualCost: 'Chi phí kỳ tới (thực chịu)',
      annualSaving: 'Giảm khoảng {{amount}} mỗi kỳ',
      assigned: 'Suất đang gán',
      contractTitle: 'Thuê bao và hạn chót',
      daysLeft: 'Còn {{count}} ngày tới hạn báo hủy',
      deadline: 'Hạn chót báo hủy',
      decided:
        'Đã ghi quyết định: {{action}} ({{quantity}} suất). Quyết định được lưu vào nhật ký và chuyển Quản trị CNTT thực hiện, ghi kết quả.',
      decisionTitle: 'Quyết định của bạn',
      group: {
        DECIDED: 'Đã quyết thu hồi',
        G2: 'Đã nghỉ việc',
        G3: 'Không hoạt động',
        G4: 'Dùng ít',
        OLDEST: 'Hoạt động cuối cũ nhất'
      },
      handoffNote:
        'Quyết định ghi trước hay sau hạn chót báo hủy đều hợp lệ; quyết định muộn không bị hủy — Quản trị CNTT xử lý thời điểm thực hiện.',
      itPick: 'CNTT đề xuất',
      itProposal: 'Đề xuất của Quản trị CNTT',
      lateNote: 'Quyết định sau hạn chót báo hủy — Quản trị CNTT xử lý theo trường hợp thực hiện muộn.',
      newQuantity: 'Số lượng mới (đang mua {{purchased}})',
      noCommitment:
        'Quyết định gia hạn/giảm/hủy không tạo khoản cam kết; chi phí kỳ gia hạn nằm trong dự báo chi phí đã cam kết.',
      ownerOpinion: 'Ý kiến chủ sở hữu nghiệp vụ',
      pickInvalid: 'Chọn đúng {{count}} suất cần thu hồi.',
      purchased: 'Suất đã mua',
      quantityInvalid: 'Số lượng phải lớn hơn 0 và nhỏ hơn {{purchased}}.',
      reasonLabel: 'Lý do khác đề xuất của CNTT (bắt buộc)',
      reclaimHint:
        'Hệ thống xếp sẵn: đã quyết thu hồi → đã nghỉ việc → không hoạt động / dùng ít → hoạt động cuối cũ nhất.',
      reclaimTitle: 'Giảm dưới số suất đang gán — chọn {{count}} suất thu hồi',
      renewalDate: 'Ngày gia hạn',
      submit: 'Ghi quyết định',
      title: 'Kỳ gia hạn {{software}}',
      usage: {
        active: 'Đang hoạt động',
        inactive: 'Không hoạt động',
        noData: 'Không có dữ liệu',
        unmatched: 'Chưa khớp danh tính'
      },
      usageHint: 'Không có dữ liệu và chưa khớp danh tính không bị tính thành không hoạt động.',
      usageTitle: 'Bằng chứng sử dụng và lãng phí',
      waste: {
        g1: 'Chưa gán',
        g2: 'Đã nghỉ việc',
        g3: 'Không hoạt động',
        g4: 'Dùng ít'
      }
    },
    charge: {
      assessmentHint: 'Chỉ là đầu vào cho quyết định — CNTT không quyết hợp thức hóa.',
      assessmentTitle: 'Đánh giá của Quản trị CNTT',
      chargeSubtitle: 'Khoản chi không có căn cứ hợp lệ sau khi Tài chính và CNTT đã kiểm tra.',
      chargeTitle: 'Khoản chi trên sao kê',
      chargesTotal: 'Tổng {{count}} khoản chi',
      control: 'Mức kiểm soát',
      costCenterLabel: 'Trung tâm chi phí nhận khoản chi (bắt buộc khi chấp nhận)',
      costCenterRequired: 'Chọn trung tâm chi phí.',
      date: 'Ngày',
      decisionHint: 'Chỉ Người duyệt chi quyết; Tài chính và Quản trị hệ thống không tham gia bước này.',
      decisionTitle: 'Chọn kết quả',
      executionNote: 'Quyết định ghi vào từng khoản chi của hồ sơ và nhật ký; Quản trị CNTT thực hiện.',
      financeEvidence: 'Chứng từ của Tài chính',
      findingSubtitle:
        'Hồ sơ phát hiện nhà cung cấp chưa được duyệt — quyết định hợp thức hóa theo luồng phần mềm mới.',
      findingTitle: 'Hồ sơ phát hiện — {{vendor}}',
      headContext: 'Bối cảnh của trưởng phòng',
      headContextHint: 'Không chặn — bạn quyết được khi chưa có.',
      noHeadContext: 'Chưa có bối cảnh — trưởng phòng đã được nhắc.',
      outcome: {
        ACCEPT: 'Chấp nhận khoản chi',
        FALSE_POSITIVE: 'Báo nhầm',
        LEGITIMIZE: 'Duyệt hợp thức hóa',
        NOT_ACCEPT: 'Không chấp nhận',
        NOT_APPROVED: 'Không duyệt'
      },
      outcomeHint: {
        ACCEPT: 'Chọn trung tâm chi phí; khoản chi rời dòng chưa phân bổ.',
        FALSE_POSITIVE: 'Đóng có lý do; xuất hiện lại sẽ mở lại.',
        LEGITIMIZE: 'CNTT đưa vào danh mục và cấp quyền cho người đang dùng — không duyệt chi lần hai.',
        NOT_ACCEPT: 'Lý do bắt buộc; vẫn ở dòng chưa phân bổ, gắn nhãn không chấp nhận.',
        NOT_APPROVED: 'Lý do bắt buộc; CNTT hủy gói, thu hồi hoặc chuyển người dùng sang công cụ đã có.'
      },
      payer: 'Người trả',
      reasonLabel: 'Lý do (bắt buộc)',
      responsible: 'Người chịu trách nhiệm',
      result: {
        ACCEPT: 'Đã chấp nhận khoản chi; tính vào {{costCenter}}.',
        FALSE_POSITIVE: 'Đã đóng là báo nhầm.',
        LEGITIMIZE:
          'Đã duyệt hợp thức hóa. Quản trị CNTT đưa vào danh mục, ghi thuê bao và cấp quyền cho người đang dùng.',
        NOT_ACCEPT: 'Không chấp nhận — khoản chi ở dòng chưa phân bổ với nhãn không chấp nhận.',
        NOT_APPROVED: 'Không duyệt — Quản trị CNTT hủy gói, thu hồi hoặc chuyển người dùng.'
      },
      statementLine: 'Dòng sao kê',
      submit: 'Ghi quyết định',
      users: '{{count}} người đang dùng',
      vendor: 'Nhà cung cấp'
    },
    optimization: {
      annualPending: 'Tiết kiệm cả năm đang chờ quyết',
      approve: 'Duyệt đề xuất',
      approvedSaving: 'Tiết kiệm đã duyệt trong kỳ',
      backToList: 'Quay lại danh sách đề xuất',
      confirmReject: 'Xác nhận từ chối',
      decisionHint:
        'Duyệt thì Quản trị CNTT thu hồi suất hoặc đổi gói; từ chối bắt buộc có lý do và Tài chính được báo.',
      decisionTitle: 'Quyết định của bạn',
      filterLabel: 'Lọc đề xuất theo trạng thái',
      noNote: 'Tài chính không để lại ghi chú.',
      pending: 'Đề xuất chờ bạn quyết',
      pendingHint: 'Tiết kiệm {{amount}} trong kỳ nếu duyệt hết',
      reasonRequired: 'Bắt buộc nhập lý do.',
      reject: 'Từ chối',
      rejectReason: 'Lý do từ chối (bắt buộc)',
      sentBy: 'Tài chính gửi ngày {{time}}',
      subtitle:
        'Tài chính đề xuất giảm chi phí dự trù kỳ tới từ ghost seat, hạ gói hoặc hủy gói trùng. Bạn duyệt hoặc từ chối; Quản trị CNTT thực hiện sau khi duyệt.',
      summaryLabel: 'Tóm tắt đề xuất tối ưu',
      title: 'Đề xuất tối ưu chi phí'
    },
    reports: {
      branchATitle: 'Suất cấp thẳng không qua duyệt chi ({{count}} ứng dụng)',
      days: '{{value}} ngày',
      financeRecording: 'Tài chính ghi nhận sau khi duyệt (đo riêng)',
      financeResponse: 'Tài chính trả lời câu hỏi (đo riêng)',
      myOverdue: 'Tỷ lệ bước của tôi quá hạn xử lý',
      processHint: 'Thời gian xử lý tách theo từng bước; thời gian của Tài chính không cộng vào thời gian chờ.',
      processTitle: 'Thời gian xử lý',
      savingsLabel: 'Tiết kiệm',
      seats: '{{count}} suất',
      spendChartLabel: 'Biểu đồ cột ngân sách và chi phí theo trung tâm chi phí — {{period}}',
      spendHint:
        'Chi phí theo kỳ trên chi phí thực chịu, theo trung tâm chi phí. Rê chuột vào từng cột để xem chi tiết.',
      spendSeries: 'Chi phí theo kỳ',
      spendTitle: 'Tổng chi {{spend}} / ngân sách {{budget}}',
      step: {
        itReview: 'CNTT đánh giá',
        need: 'Bước nhu cầu',
        provisioning: 'Cấp phát',
        spend: 'Duyệt chi'
      },
      subtitle: '{{period}} — tổng chi, tiết kiệm và bản tóm tắt hiệu suất trong phạm vi xem của Người duyệt chi.',
      title: 'Báo cáo của Người duyệt chi',
      usage: {
        activeInEvaluated: 'Tỷ lệ hoạt động trong phần đánh giá được',
        coverage: 'Độ bao phủ bằng chứng',
        kpi3: 'Tỷ lệ suất có hoạt động (chỉ số chính thức)'
      },
      usageHint: 'Ba tỷ lệ, ba câu hỏi khác nhau — không gộp làm một.',
      usageNote: '{{purchased}} suất đã mua · {{evaluated}} suất đánh giá được · {{active}} suất có hoạt động.',
      usageTitle: 'Sử dụng license',
      ofBudget: 'Trên ngân sách {{budget}} · đã dùng {{share}}',
      reclaimedCount: '{{count}} suất đã thu hồi — chỉ là căn cứ, không tự cộng vào tiết kiệm',
      totalSpend: 'Tổng chi {{period}}'
    }
  },
  finance: {
    nav: {
      annualProposals: 'Đề xuất ngân sách năm',
      areas: {
        budget: 'Trung tâm chi phí & Ngân sách',
        close: 'Đóng kỳ & Báo cáo',
        overview: 'Tổng quan',
        planning: 'Lập kế hoạch & Dự trù',
        spend: 'Chi phí & Đối soát'
      },
      budgetAllocation: 'Phân bổ ngân sách',
      budgetCheck: 'Kiểm tra ngân sách',
      budgetExceptions: 'Ngoại lệ ngân sách',
      budgetNegotiation: 'Phân tích & thương lượng',
      budgetPeriods: 'Kỳ ngân sách',
      budgetQuestions: 'Yêu cầu ngân sách',
      budgets: 'Trung tâm chi phí',
      chargeExceptions: 'Xử lý ngoại lệ khoản chi',
      commitments: 'Cam kết chi',
      costAnalysis: 'Phân bổ & so sánh ngân sách',
      costForecast: 'Dự báo chi phí',
      costOptimization: 'Tối ưu chi phí',
      decisionHistory: 'Lịch sử quyết định',
      departmentBudget: 'Theo phòng ban',
      departmentSummary: 'Tổng hợp phòng ban',
      overview: 'Tổng quan',
      periodClose: 'Đóng kỳ',
      periodReport: 'Báo cáo kỳ',
      saasCost: 'Phần mềm & chi phí',
      spendImport: 'Nhập sao kê / hóa đơn'
    },
    opinion: {
      NO_BUDGET: 'Chưa có ngân sách',
      OVER: 'Vượt hạn mức',
      WITHIN: 'Trong hạn mức'
    },
    overview: {
      budgetTableHint: 'Còn lại = ngân sách − thực chi − cam kết đang giữ. Chưa có ngân sách thì không hiện 0.',
      budgetTableTitle: 'Ngân sách · thực chi · cam kết · còn lại — {{period}}',
      barHint:
        'Cột xám là ngân sách; cột cam là thực chi, phần nhạt phía trên là cam kết đang giữ. Rê chuột để xem chi tiết.',
      barTitle: 'Ngân sách và mức sử dụng theo trung tâm chi phí — {{period}}',
      closeHint: '{{count}} phần dư cam kết cần xem',
      donutEmpty: 'Chưa có thực chi trong kỳ này.',
      donutHint: 'Tỷ trọng thực chi của từng trung tâm chi phí. Rê chuột để xem chi tiết.',
      donutTitle: 'Cơ cấu thực chi — {{period}}',
      donutTotal: 'Tổng thực chi',
      closeStatus: 'Đang đóng',
      commitmentsToRecord: 'Cam kết chờ ghi nhận',
      exceptionsHint: 'Cần Tài chính và CNTT kiểm tra',
      formulaNote:
        'Tài chính không nằm trên đường duyệt chi: trả lời khi được hỏi và ghi nhận sau khi Người duyệt chi duyệt.',
      openAction: 'Mở →',
      openExceptions: 'Ngoại lệ khoản chi',
      openQuestions: 'Yêu cầu ngân sách đang mở',
      periodClose: 'Đóng kỳ {{period}}',
      questionsHint: 'Từ Người duyệt chi — tham khảo, không chặn',
      recordingHint: '{{count}} khoản đã tới hạn ghi nhận',
      subtitle: 'Việc ngân sách đang mở của {{period}}. Mỗi ô là điểm vào của một việc.',
      title: 'Bảng điều khiển Tài chính',
      totalWithBudget: 'Tổng (trung tâm chi phí đã có ngân sách)',
      usedShare: 'Đã dùng',
      withoutBudget: 'Trung tâm chi phí chưa có ngân sách',
      workRegion: 'Việc ngân sách đang mở'
    },
    questions: {
      answeredNotice:
        'Câu trả lời đã hiện trên màn hình quyết định của Người duyệt chi. SLA của bước duyệt chi không dừng.',
      backToList: 'Quay lại danh sách',
      cancelledNotice: 'Request mua đã bị hủy nên yêu cầu thông tin ngân sách đóng theo.',
      colRequest: 'Request',
      colSentBy: 'Người gửi',
      colStatus: 'Trạng thái',
      dossierBudget: '1. Ngân sách hiện tại',
      dossierCost: '2. Tổng chi phí của yêu cầu này',
      dossierHint: 'Số liệu theo Cost Center và kỳ của yêu cầu; mọi số tiền là chi phí thực chịu.',
      dossierTitle: 'Hồ sơ kèm theo',
      empty: 'Không có yêu cầu nào.',
      filterLabel: 'Lọc yêu cầu theo trạng thái',
      from: 'Từ {{name}} · Người duyệt chi',
      noteLabel: 'Ghi chú cho Người duyệt chi',
      notePlaceholder: 'Ví dụ: còn khoảng 50 triệu sau khi trừ cam kết đang giữ.',
      noteRequired: 'Bắt buộc nhập ghi chú.',
      openDetail: 'Xem chi tiết',
      openDetailFor: 'Xem chi tiết {{code}}',
      opinionLegend: 'Ý kiến ngân sách',
      opinionRequired: 'Chọn một ý kiến.',
      replyLegend: 'Trả lời',
      requestKicker: 'Yêu cầu thông tin ngân sách',
      requester: 'người yêu cầu {{name}}',
      ruleNotice:
        'Câu trả lời là ý kiến tham khảo — không phải phê duyệt, không chặn. Người duyệt chi quyết được bất cứ lúc nào, kể cả khi Tài chính chưa trả lời.',
      slaNote: 'Thời gian Tài chính phản hồi được đo riêng.',
      sodBlocked:
        'Bạn là Người duyệt chi của request này nên không được trả lời yêu cầu thông tin ngân sách của chính nó (SoD-8).',
      status: {
        ANSWERED: 'Đã trả lời',
        CLOSED_CANCELLED: 'Đóng — yêu cầu bị hủy',
        OPEN: 'Đang mở'
      },
      submit: 'Gửi câu trả lời',
      subtitle:
        'Người duyệt chi gửi yêu cầu kèm hồ sơ ngân sách của Cost Center và kỳ; Finance trả lời để tham khảo trước khi quyết.',
      suggested: 'Gợi ý theo snapshot: {{opinion}}',
      title: 'Yêu cầu thông tin ngân sách từ Người duyệt chi'
    },
    commitments: {
      approvedBy: 'duyệt bởi {{name}}',
      attached: 'Đã gắn ngân sách',
      awaitingBackfill: 'Chờ gắn ngược',
      backToList: 'Quay lại hàng đợi',
      colBudget: 'Ngân sách',
      colCommitment: 'Khoản cam kết',
      colDue: 'Hạn ghi nhận',
      colRequest: 'Yêu cầu',
      emptyQueue: 'Không còn khoản cam kết nào chờ ghi nhận.',
      dueAt: 'Hạn ghi nhận {{time}}',
      figuresTitle: 'Ngân sách và chi phí của khoản cam kết',
      noBudgetLocked: 'Chưa có ngân sách cho trung tâm chi phí và kỳ này — ý kiến chỉ có thể là Chưa có ngân sách.',
      noteLabel: 'Ghi chú (tùy chọn)',
      openDetail: 'Ghi nhận',
      openDetailFor: 'Ghi nhận {{code}}',
      notifies: 'Báo Người duyệt chi',
      opinionLegend: 'Ý kiến chính thức',
      overdue: 'Đã tới hạn',
      queueHint:
        'Hệ thống tạo khi Người duyệt chi duyệt yêu cầu có chi phí. Khoản đã giải phóng (yêu cầu hủy, cấp phát thất bại) không còn ở đây.',
      queueTitle: 'Hàng đợi ghi nhận',
      recordTitle: 'Ghi ý kiến chính thức — {{software}}',
      recordedNotified:
        'Đã ghi nhận {{code}} và thông báo Người duyệt chi. Quyết định và cấp phát giữ nguyên; khoản cam kết vẫn Đang giữ.',
      recordedTitle: 'Đã ghi nhận trong phiên này',
      recordedWithin: 'Đã ghi nhận {{code}}: Trong hạn mức. Không có thông báo thêm.',
      ruleNotice:
        'Ghi nhận diễn ra sau khi đã duyệt chi, có hạn xử lý riêng và không nằm trên đường chờ cấp phát. Ghi Vượt hạn mức hoặc Chưa có ngân sách chỉ thông báo — không hoàn tác quyết định, không dừng cấp phát.',
      sodNote: 'Người ghi nhận không được đồng thời là Người duyệt chi của cùng yêu cầu.',
      submit: 'Ghi nhận',
      subtitle: 'Mỗi khoản cam kết gắn đúng một yêu cầu đã duyệt chi.',
      title: 'Khoản cam kết chờ ghi nhận'
    },
    budgets: {
      addCenter: 'Thêm trung tâm chi phí',
      amountLabel: 'Hạn mức ngân sách (chi phí thực chịu, VND)',
      amountPlaceholder: 'Ví dụ: 20000000',
      amountRequired: 'Hạn mức phải lớn hơn 0 — không tạo ngân sách 0 để giữ chỗ.',
      backfillNote: 'Ngay khi lập, hệ thống tự gắn các khoản này vào ngân sách mới và lưu vào nhật ký.',
      backfillTitle: '{{count}} khoản cam kết sẽ được gắn ngược',
      budgetsHint: 'Mỗi trung tâm chi phí và kỳ có tối đa một ngân sách.',
      budgetsTitle: 'Ngân sách theo trung tâm chi phí — {{period}}',
      catalogHint: 'Loại Phòng ban gắn 1–1 với một phòng; loại Toàn công ty dùng cho chi phí chung của công ty.',
      catalogNote:
        'Tách hoặc gộp phòng ⟹ tạo trung tâm chi phí mới và ngừng dùng cái cũ; lịch sử giữ nguyên. Không tạo trung tâm chi phí giữ chỗ.',
      catalogTitle: 'Danh mục trung tâm chi phí',
      colAction: 'Thao tác',
      colDepartment: 'Phòng ban',
      colKind: 'Loại',
      colStatus: 'Trạng thái',
      colUsage: 'Mức sử dụng (thực chi + cam kết)',
      compactNote: 'Số tiền rút gọn — rê chuột để xem số đầy đủ.',
      create: 'Lập ngân sách',
      createHint:
        'Lập hạn mức trên chi phí thực chịu cho trung tâm chi phí và kỳ. Quý và năm được chia đều cho các tháng.',
      createTitle: 'Lập ngân sách {{costCenter}} · {{period}}',
      createdResult:
        'Ngân sách {{costCenter}} · {{period}} đã có hiệu lực; đã gắn ngược {{count}} khoản cam kết. Bản chụp và báo cáo dùng ngay ngân sách mới.',
      currentAmount: 'Ngân sách hiện tại: {{amount}}',
      edit: 'Sửa',
      editHint: 'Sửa số tiền giữa kỳ bắt buộc có lý do. Quý và năm được chia đều cho các tháng.',
      editNote: 'Lịch sử được giữ; bản chụp đã lưu lúc quyết không đổi; Người duyệt chi được báo.',
      editTitle: 'Sửa ngân sách {{costCenter}} · {{period}}',
      editedResult: 'Đã sửa ngân sách {{costCenter}} · {{period}} và thông báo Người duyệt chi.',
      granularityLabel: 'Xem theo',
      kind: {
        COMPANY: 'Toàn công ty',
        UNIT: 'Phòng ban'
      },
      negativeExplain:
        'Còn lại âm: cam kết tạo trước khi có ngân sách vượt hạn mức vừa lập. Số âm được hiển thị, không làm tròn về 0.',
      negativeResult:
        'Còn lại âm với nhãn Đã cam kết vượt hạn mức; báo cáo nêu phần vượt đến từ cam kết tạo trước khi có ngân sách.',
      newCode: 'Mã trung tâm chi phí',
      newCodePlaceholder: 'Ví dụ: CC-LEGAL',
      newDuplicate: 'Mã trung tâm chi phí đã tồn tại.',
      newName: 'Tên',
      newRequired: 'Nhập mã và tên trung tâm chi phí.',
      periodLabel: 'Kỳ',
      periodName: {
        MONTH: 'Tháng {{number}}/{{year}}',
        QUARTER: 'Quý {{number}}/{{year}}',
        YEAR: 'Năm {{year}}'
      },
      periodNote: 'Quý và năm là tổng của các tháng.',
      periodTypes: {
        MONTH: 'Tháng',
        QUARTER: 'Quý',
        YEAR: 'Năm'
      },
      previewRemaining: 'Còn lại sau khi lập',
      reasonLabel: 'Lý do sửa (bắt buộc)',
      reasonRequired: 'Bắt buộc nhập lý do.',
      replacedBy: 'thay bằng {{code}}',
      retire: 'Ngừng dùng',
      status: {
        ACTIVE: 'Đang dùng',
        RETIRED: 'Ngừng dùng'
      },
      submitCreate: 'Lập ngân sách',
      submitEdit: 'Lưu và thông báo',
      subtitle: 'Quản lý danh mục trung tâm chi phí và lập ngân sách theo trung tâm chi phí và kỳ.',
      summaryRegion: 'Tổng quan ngân sách của kỳ',
      tileActualHint: 'Tất cả trung tâm chi phí',
      tileBudget: 'Tổng ngân sách',
      tileBudgetHint: '{{count}}/{{total}} trung tâm chi phí đã có ngân sách',
      tileHeldHint: 'Đã duyệt, chưa thành chi phí',
      tileRemainingHint: 'Chỉ tính trung tâm chi phí đã có ngân sách',
      timing: {
        CURRENT: 'Kỳ hiện tại',
        FUTURE: 'Kỳ sắp tới',
        PAST: 'Kỳ đã qua'
      },
      title: 'Trung tâm chi phí và ngân sách',
      usageAria: 'Đã dùng {{percent}} ngân sách'
    },
    import: {
      cancelBatch: 'Hủy lô',
      cancelledResult: 'Đã hủy lô — không dòng nào được ghi.',
      colAmount: 'Số tiền',
      colDate: 'Ngày',
      colDescription: 'Mô tả',
      colLine: 'Dòng',
      colResult: 'Kết quả kiểm tra',
      confirm: 'Ghi {{count}} dòng hợp lệ',
      doneResult: 'Đã ghi {{count}} dòng. Hệ thống đã chuẩn hóa nhà cung cấp và đối soát với căn cứ phê duyệt.',
      duplicateRows: 'Dòng đã nhập trước đó',
      errorRows: 'Dòng lỗi',
      exception: 'Ngoại lệ cần kiểm tra',
      exceptionHint: 'Xử lý ở màn Ngoại lệ khoản chi',
      fileLabel: 'Tệp CSV',
      fileRejected: 'Chỉ nhận tệp CSV — tệp Excel, PDF hoặc mã hóa khác bị từ chối cả tệp.',
      formatNote: 'Tệp CSV theo mẫu chuẩn hoặc mẫu riêng của ngân hàng là nguồn bằng chứng duy nhất của đợt này.',
      newImport: 'Nhập tệp khác',
      noFollowUp: 'Không cần xử lý',
      noFollowUpHint: 'Khớp căn cứ, đã ghi nhận, hoàn tiền hoặc không phải phần mềm',
      previewHint: 'Bắt buộc xem trước. Lỗi một dòng không làm hỏng cả tệp.',
      previewSummary: 'Tóm tắt xem trước',
      problem: {
        DUPLICATE: 'Đã nhập trước đó',
        INVALID_DATE: 'Ngày không hợp lệ',
        MISSING_AMOUNT: 'Thiếu số tiền'
      },
      rowErrorNote: 'Chỉ dòng hợp lệ được ghi; dòng lỗi và dòng trùng bị bỏ qua kèm lý do.',
      rowValid: 'Hợp lệ',
      steps: {
        done: 'Kết quả',
        preview: 'Xem trước',
        upload: 'Tải tệp'
      },
      stepsLabel: 'Các bước nhập',
      subtitle: 'Nhập sao kê thẻ hoặc danh sách hóa đơn chi phí của kỳ để đối soát với căn cứ phê duyệt.',
      templateLabel: 'Mẫu tệp',
      title: 'Nhập sao kê và hóa đơn',
      toPreview: 'Xem trước',
      uploadHint: 'Chọn mẫu rồi tải tệp CSV.',
      uploadTitle: 'Tải tệp',
      useSample: 'Dùng tệp mẫu',
      validRows: 'Dòng hợp lệ',
      vendorQueue: 'Chuyển hàng đợi CNTT',
      vendorQueueHint: 'Nhà cung cấp chưa nhận diện hoặc chưa được duyệt — Quản trị CNTT xử lý'
    },
    exceptions: {
      amount: 'Số tiền',
      approvedAmount: 'Số tiền được duyệt',
      attach: 'Đính kèm chứng từ',
      basisTried: 'Căn cứ đã thử',
      backToList: 'Quay lại danh sách ngoại lệ',
      billingError: 'Nhà cung cấp tính sai',
      billingDialogHint: 'Đóng ngoại lệ vì nhà cung cấp tính sai. Điều chỉnh (nếu có) đến sau bằng chứng từ mới.',
      billingDialogTitle: 'Đóng {{code}} là lỗi tính tiền',
      billingNote: 'Ghi chú (bắt buộc)',
      billingNoteRequired: 'Bắt buộc nhập ghi chú.',
      card: 'thẻ ••{{last4}}',
      chargeTitle: 'Khoản chi',
      closeBillingError: 'Đóng là lỗi tính tiền',
      colCharge: 'Khoản chi',
      colDate: 'Ngày · thẻ',
      colStatus: 'Trạng thái',
      empty: 'Không có mục nào.',
      evidence: 'Chứng từ ({{count}})',
      excess: 'Phần vượt',
      filterLabel: 'Lọc ngoại lệ theo trạng thái',
      itNote: 'Quản trị CNTT',
      openDetail: 'Xem chi tiết',
      openDetailFor: 'Xem chi tiết {{code}}',
      linkedByIt:
        'Nếu CNTT liên kết được căn cứ, hệ thống đối soát lại dòng này; phần vượt số tiền được duyệt vẫn là ngoại lệ.',
      outcome: {
        BASIS_LINKED: 'CNTT đã liên kết căn cứ; dòng đã được đối soát lại.',
        BILLING_ERROR: 'Đã đóng là lỗi tính tiền của nhà cung cấp. Điều chỉnh (nếu có) đến sau bằng chứng từ mới.',
        CHECKING: '',
        SENT_TO_APPROVER: 'Đã chuyển Người duyệt chi. Chỉ Người duyệt chi chấp nhận hoặc không chấp nhận.'
      },
      reason: {
        MULTIPLE_BASES: 'Nhiều căn cứ cùng khớp',
        NO_BASIS: 'Không có căn cứ',
        OUT_OF_TERM: 'Ngoài thời hạn',
        OVER_APPROVED: 'Vượt số tiền được duyệt'
      },
      reasonLabel: 'Lý do ngoại lệ',
      resultTitle: 'Kết quả kiểm tra chung với CNTT',
      ruleNotice:
        'Ngoại lệ là việc cần kiểm tra, không phải vi phạm. Tài chính đính kèm chứng từ và kiểm tra cùng CNTT nhưng không quyết chấp nhận khoản chi.',
      sendToApprover: 'Không có căn cứ hợp lệ — chuyển Người duyệt chi',
      status: {
        BASIS_LINKED: 'Đã liên kết căn cứ',
        BILLING_ERROR: 'Lỗi tính tiền',
        CHECKING: 'Đang kiểm tra',
        SENT_TO_APPROVER: 'Chờ Người duyệt chi'
      },
      subtitle: 'Khoản chi chưa khớp căn cứ phê duyệt sau đối soát; mỗi ngoại lệ có đúng một lý do.',
      title: 'Ngoại lệ khoản chi',
      unallocatedNote: 'Phần chưa được giải thích vẫn tính vào thực chi của kỳ, ở dòng chưa phân bổ trung tâm chi phí.'
    },
    close: {
      addInternal: 'Ghi khoản',
      auditNote: 'Thao tác được lưu vào nhật ký.',
      backToList: 'Quay lại danh sách trung tâm chi phí',
      checkCarried: '{{count}} khoản còn chờ hóa đơn — phần dư tiếp tục giữ sang kỳ sau.',
      checkReleased: 'Không còn phần dư nào cần giải phóng.',
      checkReviewed: 'Tôi đã rà soát chi phí nội bộ và phân bổ của trung tâm chi phí này.',
      checkToRelease: 'Còn {{count}} phần dư không còn hóa đơn — cần giải phóng.',
      checklistHint: 'Chốt từng trung tâm chi phí khi đã xử lý phần dư và ghi đủ chi phí nội bộ.',
      checklistTitle: 'Chốt trung tâm chi phí',
      closeBlocked: 'Giải phóng phần dư không còn hóa đơn trước khi chốt.',
      closeCostCenter: 'Chốt {{code}}',
      closed:
        'Đã chốt bởi {{name}} ngày {{time}}. Khoản đến muộn sẽ hiện ở báo cáo kỳ sau dưới nhãn điều chỉnh kỳ trước.',
      closedCount: 'Trung tâm chi phí đã chốt',
      closedHint: 'Mỗi trung tâm chi phí được chốt riêng',
      colStatus: 'Trạng thái',
      confirmRelease: 'Giải phóng',
      convertedHint: 'Mỗi hóa đơn chuyển đúng số tiền của nó từ cam kết thành chi phí',
      convertedToCost: 'Đã chuyển thành chi phí',
      detailSubtitle: '{{name}} — giải phóng phần dư cam kết, ghi chi phí nội bộ rồi chốt trung tâm chi phí.',
      detailTitle: 'Đóng kỳ {{period}} · {{code}}',
      heldRemainder: 'Phần dư đang giữ',
      internalAmount: 'Số tiền (VND)',
      internalDescription: 'Mô tả khoản chi phí',
      internalHint:
        'Không cần hóa đơn hay nhà cung cấp. Khoản ghi ở đây thuộc trung tâm chi phí này; muốn chia thì ghi ở từng trung tâm chi phí — không áp tỷ lệ phân bổ.',
      internalRequired: 'Nhập mô tả và số tiền lớn hơn 0.',
      internalTitle: 'Chi phí phần mềm nội bộ',
      listHint:
        'Mở từng trung tâm chi phí để xử lý phần dư và chi phí nội bộ rồi chốt. Không khóa kỳ: khoản đến muộn hiện ở báo cáo kỳ sau.',
      listTitle: 'Trung tâm chi phí trong kỳ',
      moreExpected: 'Còn chờ hóa đơn',
      noInternal: 'Chưa có chi phí nội bộ trong kỳ.',
      noInvoice: 'Không còn hóa đơn',
      noLockNote: 'Chốt không khóa kỳ; khoản đến muộn được ghi là điều chỉnh kỳ trước ở báo cáo sau.',
      noMoreInvoices: 'Hết hóa đơn — lần cuối {{date}}',
      noRemainders: 'Trung tâm chi phí này không có khoản cam kết còn phần dư.',
      open: 'Mở',
      openFor: 'Đóng kỳ {{code}}',
      periodCost: 'Chi phí kỳ (đã phân bổ)',
      pickCostCenter: 'Chọn trung tâm chi phí',
      release: 'Giải phóng phần dư',
      releaseDisabled: 'Còn chờ hóa đơn — chưa giải phóng',
      releaseReason: 'Lý do giải phóng phần dư {{code}} (bắt buộc)',
      releaseReasonRequired: 'Bắt buộc nhập lý do.',
      released: 'Đã giải phóng',
      remainderFigures: 'Đã cam kết {{committed}} · đã có hóa đơn {{invoiced}}',
      remaindersHint: 'Chỉ giải phóng phần dư khi không còn hóa đơn nào sẽ đến.',
      remaindersTitle: 'Khoản cam kết còn phần dư',
      status: {
        BLOCKED: 'Cần giải phóng phần dư',
        CLOSED: 'Đã chốt',
        READY: 'Sẵn sàng chốt'
      },
      subtitle: 'Bước 1 của đóng kỳ {{period}}: đóng chi phí theo từng trung tâm chi phí.',
      summaryLabel: 'Tóm tắt đóng kỳ',
      title: 'Đóng kỳ {{period}} theo trung tâm chi phí',
      toAllocation: 'Phân bổ chi phí',
      toExceptions: 'Xem ngoại lệ',
      toReleaseCount: 'Phần dư cần giải phóng',
      unallocatedRow:
        'Chưa phân bổ trung tâm chi phí: {{amount}} — không chốt ở đây, chờ Người duyệt chi quyết {{count}} ngoại lệ.'
    },
    analysis: {
      allocationHint:
        'Gói dùng chung chia theo tỷ lệ Tài chính khai (tổng 100%); suất cá nhân tính cho phòng của người giữ, chia theo ngày khi điều chuyển; tài khoản dùng chung tính cho phòng ban hoặc toàn công ty.',
      allocationTitle: 'Phân bổ chi phí theo trung tâm chi phí',
      basis: {
        cash: 'Theo dòng tiền',
        period: 'Theo kỳ'
      },
      basisHint: {
        cash: 'Ghi nhận tại ngày hóa đơn — phục vụ đối soát thanh toán.',
        period: 'Phân bổ đều theo thời gian sử dụng — phục vụ theo dõi ngân sách.'
      },
      basisLabel: 'Cơ sở ghi nhận',
      bvaTitle: 'Ngân sách so với thực chi (chi phí thực chịu)',
      internal: 'Nội bộ',
      l1Hint: 'Tính trực tiếp từ hợp đồng — không dùng mô hình thống kê.',
      l1Title: 'Lớp 1 — Chi phí đã cam kết',
      l1Total: 'Tổng quý tới',
      l2Deferred: 'Lớp 2 — Dự báo theo mô hình chưa triển khai (cần ít nhất 12 tháng dữ liệu và kiểm chứng ngược).',
      l3Hint: 'Ba kịch bản từ giả định Tài chính nhập.',
      l3Note: 'Kịch bản = Lớp 1 + phần phụ thuộc quyết định × 0,5 / 1 / 1,5.',
      l3Title: 'Lớp 3 — Kịch bản',
      openExceptions: '{{count}} ngoại lệ đang mở',
      personalSeats: 'Suất cá nhân',
      priorAdjustment: 'Điều chỉnh kỳ trước ({{period}})',
      scenario: {
        base: 'Cơ sở',
        high: 'Cao',
        low: 'Thấp'
      },
      sharedAccounts: 'Tài khoản dùng chung',
      sharedByRatio: 'Gói dùng chung (theo tỷ lệ)',
      subtitle: 'Bước 2 của đóng kỳ {{period}}: xem phân bổ và so ngân sách với thực chi theo trung tâm chi phí.',
      title: 'Phân bổ và so sánh ngân sách {{period}}',
      toReport: 'Lập báo cáo kỳ',
      total: 'Tổng',
      unallocated: 'Chưa phân bổ trung tâm chi phí',
      unallocatedNote:
        'Dòng chưa phân bổ là dòng báo cáo, không phải một trung tâm chi phí; không gán vào trung tâm chi phí nào cho tới khi Người duyệt chi quyết.',
      upcomingRenewals: 'Gia hạn sắp tới',
      assumption: {
        costPerHire: 'Chi phí công cụ / người (VND)',
        newHires: 'Nhân sự mới',
        newProjects: 'Dự án mới (VND)'
      }
    },
    forecast: {
      approvedLine: 'Tiết kiệm đã được duyệt',
      baseAfterAll: 'Cơ sở nếu mọi đề xuất được duyệt',
      baseAfterApproved: 'Cơ sở sau tiết kiệm đã duyệt',
      optimizedHint: 'Kịch bản cơ sở trừ tiết kiệm trong kỳ của các đề xuất tối ưu chi phí.',
      optimizedTitle: 'Kịch bản cơ sở sau tối ưu',
      pendingLine: 'Đề xuất nháp và đang chờ duyệt',
      subtitle: 'Chi phí đã cam kết từ hợp đồng và kịch bản theo giả định — nền để tối ưu chi phí dự trù.',
      title: 'Dự báo chi phí {{period}}',
      toOptimization: 'Tối ưu chi phí dự trù'
    },
    optimization: {
      afterHint: 'Nếu mọi đề xuất chưa bị từ chối được duyệt',
      afterOptimization: 'Dự trù sau tối ưu',
      annualSaving: 'Tiết kiệm cả năm',
      approved: '{{name}} đã duyệt ngày {{time}}. Quản trị CNTT thực hiện; khoản tiết kiệm được trừ vào dự trù.',
      approvedHint: '{{count}} đề xuất đã duyệt',
      approvedSaving: 'Tiết kiệm đã duyệt',
      backToList: 'Quay lại danh sách đề xuất',
      basis: {
        CANCEL: '{{active}}/{{purchased}} suất còn hoạt động',
        DOWNGRADE: '{{current}} → {{proposed}}',
        GHOST_SEAT: '{{count}}/{{purchased}} suất không dùng'
      },
      budgetImpact: 'Ngân sách {{costCenter}} · {{period}}',
      colBasis: 'Loại và căn cứ',
      colMonthly: 'Tiết kiệm / tháng',
      colProposal: 'Đề xuất',
      colStatus: 'Trạng thái',
      colWindow: 'Tiết kiệm trong kỳ',
      colLastActivity: 'Hoạt động gần nhất',
      colSignal: 'Tín hiệu',
      colUser: 'Người giữ suất',
      currentMonthly: 'Chi phí hiện tại / tháng',
      currentPlan: 'Gói hiện tại',
      empty: 'Không có đề xuất phù hợp bộ lọc.',
      evidenceHint: {
        CANCEL: 'Ít người dùng và đã có công cụ khác trong danh mục đáp ứng cùng nhu cầu.',
        DOWNGRADE: 'Rất ít người dùng tính năng chỉ gói hiện tại mới có.',
        GHOST_SEAT: 'Suất đã mua nhưng người giữ không dùng trên 60 ngày, đã nghỉ việc hoặc chưa từng đăng nhập.'
      },
      evidenceTitle: 'Căn cứ sử dụng',
      featuresLost: 'Tính năng sẽ mất khi hạ gói',
      financeNote: 'Ghi chú của Tài chính',
      forecast: 'Chi phí dự trù đã cam kết',
      forecastHint: 'Lớp 1 — {{period}}',
      ghostTitle: 'Suất đề xuất thu hồi ({{count}})',
      kind: {
        CANCEL: 'Hủy gói trùng',
        DOWNGRADE: 'Hạ gói',
        GHOST_SEAT: 'Thu hồi ghost seat'
      },
      monthlySaving: 'Tiết kiệm / tháng',
      noteLabel: 'Ghi chú cho Người duyệt chi (không bắt buộc)',
      openDetail: 'Xem',
      openDetailFor: 'Xem chi tiết {{code}}',
      overlapWith: 'Trùng chức năng với',
      potential: 'Tiết kiệm tiềm năng trong kỳ',
      potentialHint: '{{count}} đề xuất chưa bị từ chối',
      premiumUsage: 'Người dùng tính năng của gói hiện tại (90 ngày)',
      proposedMonthly: 'Chi phí sau tối ưu / tháng',
      proposedPlan: 'Gói đề xuất',
      rejected: '{{name}} từ chối ngày {{time}}: {{reason}}',
      remainingAfter: 'Còn lại nếu áp dụng',
      remainingBefore: 'Còn lại hiện tại',
      savingsHint: 'Chi phí thực chịu mỗi tháng; tiết kiệm trong kỳ chỉ tính các tháng từ khi áp dụng.',
      savingsTitle: 'Tác động chi phí',
      seatsActive: 'Suất đang hoạt động',
      seatsPurchased: 'Suất đã mua',
      send: 'Gửi Người duyệt chi',
      sendHint: 'Tài chính chỉ đề xuất; Người duyệt chi quyết, Quản trị CNTT thu hồi suất hoặc đổi gói.',
      sendTitle: 'Gửi đề xuất',
      sent: 'Đã gửi ngày {{time}} — đang chờ Người duyệt chi quyết.',
      signal: {
        INACTIVE: 'Không hoạt động {{days}} ngày',
        LEFT_COMPANY: 'Đã nghỉ việc',
        NEVER_USED: 'Chưa từng đăng nhập'
      },
      status: {
        APPROVED: 'Đã duyệt',
        DRAFT: 'Nháp',
        REJECTED: 'Bị từ chối',
        SENT: 'Chờ Người duyệt chi'
      },
      subtitle:
        'Giảm chi phí cam kết kỳ tới bằng cách thu hồi ghost seat, hạ gói ít dùng tính năng hoặc hủy gói trùng chức năng. Tài chính đề xuất — Người duyệt chi quyết — Quản trị CNTT thực hiện.',
      summaryLabel: 'Tóm tắt tối ưu chi phí',
      timing: {
        IMMEDIATE: 'Áp dụng từ {{month}}',
        NEXT_RENEWAL: 'Tại kỳ gia hạn {{date}}'
      },
      timingLabel: 'Thời điểm áp dụng',
      title: 'Tối ưu chi phí dự trù {{period}}',
      usageNote:
        'Số ngày không hoạt động là tín hiệu sử dụng công cụ do Quản trị CNTT cung cấp, không phải đánh giá hiệu suất làm việc.',
      vendor: 'Nhà cung cấp',
      windowSaving: 'Tiết kiệm trong {{period}}'
    },
    report: {
      aiDraft: 'Chi phí phần mềm quý 3/2026 theo kỳ là 408,1 triệu đồng [1], thấp hơn tổng ngân sách 520 triệu đồng [2]. Phòng Vận hành dùng 93,6% ngân sách, cao nhất công ty [3]. Dòng chưa phân bổ trung tâm chi phí còn 6,62 triệu đồng với 3 ngoại lệ đang chờ Người duyệt chi [4]. Tiết kiệm thực hiện ngay 18,4 triệu đồng; tiết kiệm tại kỳ gia hạn kế tiếp 41,2 triệu đồng — hai con số tách riêng [5].',
      aiSource1: '[1] Ngân sách so với thực chi · cơ sở theo kỳ · tổng',
      aiSource2: '[2] Ngân sách quý 3/2026 · 6 trung tâm chi phí',
      aiSource3: '[3] CC-OPS · thực chi theo kỳ ÷ ngân sách',
      aiSource4: '[4] Phân bổ · dòng chưa phân bổ',
      aiSource5: '[5] Báo cáo tiết kiệm',
      colNarrative: 'Diễn giải',
      colRole: 'Vai trò',
      colSavings: 'Tiết kiệm',
      colSpend: 'Tổng chi',
      draftWarning:
        'Bản nháp do AI soạn từ số liệu hệ thống — không phải số liệu gốc. Xem và sửa trước khi dùng; mỗi con số truy được nguồn.',
      figuresLabel: 'Số liệu kỳ',
      generateDraft: 'Tạo bản nháp AI',
      hidden: 'Không xem',
      immutable:
        'Báo cáo đã phát hành là bản chụp không thay đổi — không phát hành lại; khoản đến muộn và sửa sai hiện ở báo cáo kỳ sau dưới nhãn điều chỉnh kỳ trước.',
      mode: {
        ai: 'Dùng bản nháp AI',
        manual: 'Tự viết'
      },
      modeHint: {
        ai: 'AI chỉ diễn giải, không tính tiền, không kết luận vi phạm.',
        manual: 'Dùng khi không cần AI, hoặc AI tắt/lỗi — quy trình vẫn chạy đủ.'
      },
      narrativeHint: 'Tùy chọn. Phần diễn giải chỉ có trong bản của Tài chính và Người duyệt chi.',
      narrativePlaceholder: 'Viết phần diễn giải cho báo cáo kỳ…',
      narrativeTitle: 'Phần diễn giải',
      ofBudget: 'trên ngân sách {{budget}}',
      ownDepartment: 'Phòng mình',
      publish: 'Phát hành báo cáo kỳ',
      published: 'Đã phát hành ngày {{time}}.',
      reviewFirst: 'Đánh dấu đã xem và sửa bản nháp trước khi phát hành.',
      reviewedCheck: 'Tôi đã xem và sửa bản nháp',
      roles: {
        approver: 'Người duyệt chi',
        finance: 'Tài chính',
        itAdmin: 'Quản trị CNTT',
        manager: 'Trưởng phòng'
      },
      savingsImmediate: 'Tiết kiệm thực hiện ngay',
      savingsNextRenewal: 'Tiết kiệm tại kỳ gia hạn kế tiếp',
      savingsSeparate: 'Hai con số tách riêng, không cộng lại',
      subtitle: 'Bước 3 của đóng kỳ: tùy chọn bản nháp AI, rồi phát hành báo cáo theo phạm vi xem của từng vai trò.',
      title: 'Báo cáo kỳ {{period}}',
      totalSpend: 'Tổng chi (theo kỳ)',
      visibilityHint:
        'Trưởng phòng chỉ thấy thực chi và cam kết của phòng mình — không thấy ngân sách hay tổng công ty.',
      visibilityTitle: 'Ai xem gì',
      visible: 'Được xem'
    }
  }
} as const
