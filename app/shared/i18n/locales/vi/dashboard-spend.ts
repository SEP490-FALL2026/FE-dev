/** Finance (UF-11, UF-12, UF-19) and Spending Approver (UF-15) screens, plus shared budget wording. */
export const spendDashboard = {
  ui: {
    all: 'Tất cả',
    cancel: 'Hủy',
    close: 'Đóng',
    save: 'Lưu'
  },
  budget: {
    actual: 'Thực chi',
    asOf: 'Số liệu tại {{time}}',
    borneCost: 'Chi phí thực chịu',
    borneCostNote:
      'Mọi số tiền tính trên chi phí thực chịu; GTGT được khấu trừ hiển thị ở cột riêng, không trừ vào ngân sách.',
    budget: 'Ngân sách',
    costCenter: 'Cost Center',
    deductibleVat: 'GTGT được khấu trừ',
    deductibleVatSeparate: 'GTGT được khấu trừ (cột riêng)',
    estimateTitle: 'Chi phí ước tính',
    estimated: 'Ước tính',
    held: 'Cam kết đang giữ',
    noBudget: 'Chưa có ngân sách',
    nonDeductibleTax: 'Thuế không được khấu trừ',
    overCommitted: 'Đã cam kết vượt hạn mức',
    pending: 'Yêu cầu có chi phí đang chờ duyệt',
    preTax: 'Giá trước thuế',
    remaining: 'Còn lại',
    snapshotTitle: 'Snapshot ngân sách',
    totalPayable: 'Tổng tiền phải trả',
    usedRatio: 'Tỷ lệ đã dùng và đã cam kết'
  },
  approvals: {
    nav: {
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
      overdue: 'Quá SLA {{hours}} giờ',
      reminders: 'Đã nhắc {{count}} lần'
    },
    alerts: {
      budgetChanged: 'Finance sửa ngân sách giữa kỳ',
      deadlineSoon: 'Sắp tới hạn chót báo hủy',
      financeOver: 'Finance ghi nhận Vượt hạn mức sau duyệt chi',
      lateExecution: 'Gia hạn đã quyết nhưng chưa có kết quả thực hiện'
    },
    overview: {
      alertsTitle: 'Cảnh báo gửi tôi',
      charges: 'Khoản chi và hợp thức hóa',
      chargesHint: 'Khoản chi chưa có căn cứ và bản ghi phát hiện (BM-07)',
      nearestDeadline: 'Gần nhất: {{name}} — hạn báo hủy {{date}}',
      overdueHint: '{{count}} việc đã quá SLA',
      renewals: 'Đề xuất gia hạn / giảm / hủy',
      requests: 'Yêu cầu chờ duyệt chi',
      spendRegion: 'Tổng chi và tiết kiệm',
      subtitle: 'Việc đang chờ bạn quyết, tổng chi và tiết kiệm. Finance chỉ cung cấp ý kiến ngân sách để tham khảo.',
      title: 'Chào {{name}}',
      totalSpend: 'Tổng chi {{period}}',
      urgentHint:
        'Sắp xếp theo hạn SLA — quá hạn thì hệ thống nhắc bạn và báo Super Admin, không đổi người, không tự quyết.',
      urgentTitle: 'Cần quyết sớm nhất',
      workRegion: 'Việc chờ quyết'
    },
    queue: {
      colAmount: 'Số tiền',
      colItem: 'Mục',
      colSla: 'SLA',
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
        'Mỗi việc có đồng hồ SLA riêng. Quá hạn hoặc backlog vượt ngưỡng: hệ thống nhắc bạn và cảnh báo Super Admin — không chuyển cho người khác, không ủy quyền, không bao giờ tự quyết.',
      subtitle:
        'Bốn loại việc: duyệt chi · bước nhu cầu khi trưởng phòng là người thụ hưởng · kỳ gia hạn · khoản chi chưa có căn cứ hoặc hợp thức hóa.',
      title: 'Hàng chờ phê duyệt'
    },
    request: {
      askMore: 'Hỏi thêm Finance',
      costTitle: 'Chi phí và ngân sách',
      fact: {
        cost: 'Chi phí ước tính (thực chịu)',
        costCenter: 'Cost Center · kỳ',
        remainingAfter: 'Còn lại nếu duyệt'
      },
      financeName: 'Finance',
      financePending: 'Đang chờ Finance trả lời — SLA của bạn vẫn chạy.',
      questionPlaceholder:
        'Ví dụ: Nếu duyệt thêm khoản này, Cost Center còn đủ cho các yêu cầu đang chờ trong quý không?',
      questionRequired: 'Nhập câu hỏi hoặc ý kiến cho Finance.',
      questionLabel: 'Câu hỏi / ý kiến của bạn',
      slaNotPaused: 'Gửi câu hỏi không dừng đồng hồ SLA; bạn vẫn quyết được trước khi Finance trả lời.',
      summaryLabel: 'Tóm tắt yêu cầu',
      topic: {
        BUDGET_TIMING: 'Khi nào có ngân sách',
        ENOUGH_BUDGET: 'Còn đủ ngân sách?',
        PENDING_IMPACT: 'Ảnh hưởng yêu cầu đang chờ',
        SUGGESTION: 'Gợi ý số tiền / thời điểm'
      },
      topicLegend: 'Muốn Finance xem gì',
      urgency: { BEFORE_SLA: 'Trước hạn SLA của tôi', NOT_URGENT: 'Không gấp', TODAY: 'Trong hôm nay' },
      urgencyLabel: 'Cần trả lời',
      you: 'Bạn hỏi',
      approve: 'Duyệt',
      beneficiary: 'Người thụ hưởng',
      branch: {
        b: 'Nhánh (b) — mua thêm / nâng gói',
        c: 'Nhánh (c) — phần mềm mới'
      },
      confirmReject: 'Xác nhận từ chối',
      financeHint: 'Tùy chọn. Đồng hồ SLA không dừng khi hỏi; bạn quyết được cả khi Finance chưa trả lời.',
      financeTitle: 'Ý kiến ngân sách của Finance',
      itAssessment: 'Đánh giá của IT Admin',
      needApproved:
        'Đã duyệt bước nhu cầu. Yêu cầu đi tiếp tới bước duyệt chi — vẫn giao cho bạn, nhật ký gắn cờ cùng người.',
      needDecisionTitle: 'Quyết định bước nhu cầu',
      needStepHint:
        'Trưởng phòng tự gửi yêu cầu nên bước nhu cầu do Người duyệt chi giữ (QĐ-52c). Hai bước vẫn tách riêng.',
      needTitle: 'Nhu cầu và lý do',
      referenceOnly: 'Ý kiến tham khảo — không phải phê duyệt, không chặn quyết định.',
      reject: 'Từ chối',
      rejectReason: 'Lý do từ chối (bắt buộc)',
      rejected: 'Đã từ chối. Người yêu cầu được báo kèm lý do; không tạo khoản cam kết.',
      requester: 'Người yêu cầu',
      samePerson: 'Cùng người với bước trước',
      sendQuestion: 'Gửi câu hỏi',
      snapshotCaptured:
        'Snapshot ngân sách được chụp lại tại lúc bạn quyết và lưu làm bằng chứng. Không ai duyệt yêu cầu mà mình là người yêu cầu hoặc người thụ hưởng.',
      spendApproved: 'Đã duyệt chi. Hệ thống tạo khoản cam kết (Finance ghi nhận sau) và tác vụ cấp phát cho IT Admin.',
      spendDecisionTitle: 'Quyết định duyệt chi',
      spendStepHint: 'Duyệt hoặc từ chối trên snapshot ngân sách. Từ chối bắt buộc có lý do.',
      step: {
        created: 'Gửi yêu cầu',
        itReview: 'IT đánh giá danh mục, rủi ro, mức kiểm soát',
        needStep: 'Bước nhu cầu',
        spendStep: 'Bước duyệt chi'
      },
      trailTitle: 'Lịch sử phê duyệt'
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
      assigned: 'Seat đang gán',
      contractTitle: 'Thuê bao và hạn chót',
      daysLeft: 'Còn {{count}} ngày tới hạn báo hủy',
      deadline: 'Hạn chót báo hủy',
      decided:
        'Đã ghi quyết định: {{action}} ({{quantity}} seat). Quyết định ghi Audit Trail và chuyển IT Admin thực hiện, ghi kết quả (UF-20).',
      decisionTitle: 'Quyết định của bạn',
      group: {
        DECIDED: 'Đã quyết thu hồi',
        G2: 'G2 — đã nghỉ việc',
        G3: 'G3 — không hoạt động',
        G4: 'G4 — dùng ít',
        OLDEST: 'Hoạt động cuối cũ nhất'
      },
      handoffNote:
        'Quyết được ghi trước hoặc sau hạn chót báo hủy; quyết định muộn không bị hủy — thời điểm thực hiện hợp lệ do WF-15/UF-20 xử lý.',
      itPick: 'IT đề xuất',
      itProposal: 'Đề xuất của IT Admin',
      lateNote: 'Quyết định sau hạn chót báo hủy — IT xử lý theo ca thực hiện muộn.',
      newQuantity: 'Số lượng mới (đang mua {{purchased}})',
      noCommitment: 'Quyết định gia hạn/giảm/hủy không tạo khoản cam kết; chi phí kỳ gia hạn hiện ở dự báo L1.',
      ownerOpinion: 'Ý kiến Business Owner',
      pickInvalid: 'Chọn đúng {{count}} seat cần thu hồi.',
      purchased: 'Seat đã mua',
      quantityInvalid: 'Số lượng mới phải từ {{min}} đến {{max}} seat.',
      reasonLabel: 'Lý do khác đề xuất của IT (bắt buộc)',
      reclaimHint: 'Hệ thống xếp sẵn: đã quyết thu hồi → G2 → G3/G4 → hoạt động cuối cũ nhất.',
      reclaimTitle: 'Giảm dưới số seat đang gán — chọn {{count}} seat thu hồi',
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
      assessmentHint: 'Chỉ là đầu vào cho quyết định — IT không quyết hợp thức hóa.',
      assessmentTitle: 'Đánh giá của IT Admin',
      chargeSubtitle: 'Khoản chi không có căn cứ hợp lệ sau khi Finance và IT đã kiểm tra.',
      chargeTitle: 'Khoản chi trên sao kê',
      chargesTotal: 'Tổng {{count}} khoản chi',
      control: 'Mức kiểm soát',
      costCenterLabel: 'Cost Center nhận khoản chi (bắt buộc khi chấp nhận)',
      costCenterRequired: 'Chọn Cost Center.',
      date: 'Ngày',
      decisionHint: 'Chỉ Người duyệt chi quyết; Finance và Super Admin không nằm trên đường này.',
      decisionTitle: 'Chọn kết quả',
      executionNote: 'Quyết định ghi vào từng khoản chi của bản ghi và Audit Trail; IT Admin thực thi ở UF-12.',
      financeEvidence: 'Chứng từ của Finance',
      findingSubtitle: 'Hồ sơ BM-07 cho nhà cung cấp chưa được duyệt — quyết định hợp thức hóa thuộc nhánh (c).',
      findingTitle: 'Bản ghi phát hiện — {{vendor}}',
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
        ACCEPT: 'Chọn Cost Center; khoản chi rời dòng Chưa phân bổ.',
        FALSE_POSITIVE: 'Đóng có lý do; xuất hiện lại sẽ mở lại.',
        LEGITIMIZE: 'IT đưa vào danh mục và cấp quyền cho người đang dùng — không duyệt chi lần hai.',
        NOT_ACCEPT: 'Lý do bắt buộc; vẫn ở dòng Chưa phân bổ, nhãn không chấp nhận.',
        NOT_APPROVED: 'Lý do bắt buộc; IT hủy gói, thu hồi hoặc chuyển người dùng sang công cụ đã có.'
      },
      payer: 'Người trả',
      reasonLabel: 'Lý do (bắt buộc)',
      responsible: 'Người chịu trách nhiệm',
      result: {
        ACCEPT: 'Đã chấp nhận khoản chi; tính vào {{costCenter}}.',
        FALSE_POSITIVE: 'Đã đóng là báo nhầm.',
        LEGITIMIZE: 'Đã duyệt hợp thức hóa. IT Admin đưa vào danh mục, ghi thuê bao và cấp quyền cho người đang dùng.',
        NOT_ACCEPT: 'Không chấp nhận — khoản chi ở dòng Chưa phân bổ với nhãn không chấp nhận.',
        NOT_APPROVED: 'Không duyệt — IT Admin hủy gói, thu hồi hoặc chuyển người dùng.'
      },
      statementLine: 'Dòng sao kê',
      submit: 'Ghi quyết định',
      users: '{{count}} người đang dùng',
      vendor: 'Nhà cung cấp'
    },
    reports: {
      branchATitle: 'Seat cấp theo nhánh (a) trong kỳ — tóm tắt',
      days: '{{value}} ngày',
      financeRecording: 'Finance ghi nhận sau duyệt (đo riêng)',
      financeResponse: 'Finance trả lời câu hỏi (đo riêng)',
      myOverdue: 'Tỷ lệ bước của tôi quá SLA',
      processHint: 'KPI-2 tách theo từng bước; thời gian của Finance không cộng vào đường chờ.',
      processTitle: 'Hiệu suất quy trình — tóm tắt',
      reclaimedHint: 'Chỉ là căn cứ — thu hồi không tự cộng vào tiết kiệm.',
      reclaimedSeats: 'Seat đã thu hồi',
      savingsLabel: 'Tiết kiệm',
      seats: '{{count}} seat',
      spendHint: 'Chi phí theo kỳ trên chi phí thực chịu, theo Cost Center.',
      spendTitle: 'Tổng chi {{spend}} / ngân sách {{budget}}',
      step: {
        itReview: 'IT đánh giá',
        need: 'Bước nhu cầu',
        provisioning: 'Cấp phát',
        spend: 'Duyệt chi'
      },
      subtitle: 'Kỳ {{period}} — tổng chi, tiết kiệm và bản tóm tắt hiệu suất theo phạm vi xem của Người duyệt chi.',
      title: 'Báo cáo của Người duyệt chi',
      usage: {
        activeInEvaluated: 'Tỷ lệ hoạt động trong phần đánh giá được',
        coverage: 'Độ bao phủ bằng chứng',
        kpi3: 'KPI-3 (chỉ số chính thức)'
      },
      usageHint: 'Ba tỷ lệ, ba câu hỏi khác nhau — không gộp làm một.',
      usageNote: '{{purchased}} seat đã mua · {{evaluated}} seat đánh giá được · {{active}} seat có hoạt động.',
      usageTitle: 'Hiệu suất sử dụng — tóm tắt'
    }
  },
  finance: {
    charts: {
      bva: {
        hint: 'Từng Cost Center: cột xám là ngân sách, cột xanh là thực chi (chi phí thực chịu).',
        title: 'Ngân sách và thực chi {{period}}'
      },
      filter: {
        granularityLabel: 'Xem biểu đồ theo',
        month: 'Tháng',
        note: {
          month: 'Ngân sách tháng = ngân sách quý ÷ 3, chỉ để tham chiếu (kỳ ngân sách của tổ chức là quý).',
          year: 'Lũy kế từ đầu năm tới tháng hiện tại; ngân sách năm = tổng ngân sách các quý.'
        },
        periodLabel: 'Chọn kỳ',
        quarter: 'Quý',
        title: 'Xem theo',
        year: 'Năm',
        yearValue: 'Năm {{year}}'
      },
      regionLabel: 'Biểu đồ tài chính',
      share: {
        hint: 'Tỷ trọng thực chi của từng Cost Center; dòng Chưa phân bổ hiện riêng màu xám.',
        title: 'Cơ cấu thực chi {{period}} theo Cost Center'
      },
      shareColumn: 'Tỷ trọng',
      structure: {
        basis: 'Cách phân bổ',
        hint: 'Chi phí của kỳ chia theo quy tắc phân bổ đã áp dụng.',
        title: 'Cơ cấu chi phí {{period}} theo cách phân bổ'
      },
      usage: {
        hint: 'Mỗi thanh là ngân sách của một Cost Center: thực chi + cam kết đang giữ + phần còn lại. Cost Center chưa có ngân sách chỉ có phần đã chi và đã cam kết.',
        title: 'Ngân sách {{period}} đang được dùng thế nào'
      }
    },
    nav: {
      budgetQuestions: 'Câu hỏi ngân sách',
      budgets: 'Cost Center & ngân sách',
      chargeExceptions: 'Ngoại lệ khoản chi',
      commitments: 'Cam kết chờ ghi nhận',
      costAnalysis: 'Phân bổ & Budget vs Actual',
      overview: 'Tổng quan',
      periodClose: 'Đóng kỳ',
      periodReport: 'Báo cáo kỳ',
      sections: {
        budget: 'Ngân sách',
        periodClose: 'Đóng kỳ',
        reconciliation: 'Đối soát khoản chi'
      },
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
      closeHint: '{{count}} phần dư cam kết cần xem',
      closeStatus: 'Đang đóng',
      commitmentsToRecord: 'Cam kết chờ ghi nhận',
      exceptionsHint: 'Cần Finance và IT kiểm tra',
      formulaNote:
        'Finance không nằm trên đường duyệt chi: trả lời khi được hỏi và ghi nhận sau khi Người duyệt chi duyệt.',
      openAction: 'Mở →',
      openExceptions: 'Ngoại lệ khoản chi',
      openQuestions: 'Câu hỏi ngân sách đang mở',
      periodClose: 'Đóng kỳ {{period}}',
      questionsHint: 'Từ Người duyệt chi — tham khảo, không chặn',
      recordingHint: '{{count}} khoản đã tới hạn ghi nhận',
      subtitle: 'Việc ngân sách đang mở của kỳ {{period}}. Mỗi ô là điểm vào của một việc.',
      title: 'Bảng điều khiển Tài chính',
      totalWithBudget: 'Tổng (Cost Center đã có ngân sách)',
      withoutBudget: 'Cost Center chưa có ngân sách',
      workRegion: 'Việc ngân sách đang mở'
    },
    questions: {
      answerTitle: 'Câu trả lời đã gửi',
      backToList: 'Quay lại danh sách câu hỏi',
      colAsked: 'Người hỏi · thời gian',
      colRequest: 'Yêu cầu',
      colStatus: 'Trạng thái',
      contextTitle: 'Số liệu để trả lời',
      factCostCenter: 'Cost Center · kỳ',
      factRemainingAfter: 'Còn lại nếu duyệt',
      factRemainingNow: 'Còn lại hiện tại',
      questionTitle: 'Câu hỏi của Người duyệt chi',
      replyTitle: 'Trả lời của bạn',
      suggestedTag: 'Gợi ý',
      summaryLabel: 'Tóm tắt câu hỏi',
      answeredNotice:
        'Câu trả lời đã hiện trên màn hình quyết định của Người duyệt chi. SLA của bước duyệt chi không dừng.',
      askedBy: '{{name}} hỏi lúc {{time}}',
      cancelledNotice: 'Yêu cầu đã bị hủy nên câu hỏi đóng theo.',
      empty: 'Không có câu hỏi nào.',
      filterLabel: 'Lọc câu hỏi theo trạng thái',
      noteLabel: 'Ghi chú cho Người duyệt chi',
      notePlaceholder: 'Ví dụ: còn khoảng 50 triệu sau khi trừ cam kết đang giữ.',
      noteRequired: 'Bắt buộc nhập ghi chú.',
      opinionRequired: 'Chọn một ý kiến.',
      replyLegend: 'Trả lời',
      requester: 'người yêu cầu {{name}}',
      ruleNotice:
        'Câu trả lời là ý kiến tham khảo — không phải phê duyệt, không chặn. Người duyệt chi quyết được bất cứ lúc nào, kể cả khi Finance chưa trả lời.',
      slaNote: 'Thời gian Finance phản hồi được đo riêng.',
      sodBlocked:
        'Bạn là Người duyệt chi (thay thế) của yêu cầu này nên không được trả lời câu hỏi ngân sách của chính nó (SoD-8).',
      status: {
        ANSWERED: 'Đã trả lời',
        CLOSED_CANCELLED: 'Đóng — yêu cầu bị hủy',
        OPEN: 'Đang mở'
      },
      submit: 'Gửi câu trả lời',
      subtitle: 'Người duyệt chi hỏi thông tin ngân sách của Cost Center và kỳ trước khi quyết.',
      suggested: 'Gợi ý theo snapshot: {{opinion}}',
      title: 'Câu hỏi ngân sách từ Người duyệt chi'
    },
    commitments: {
      approvedBy: 'duyệt bởi {{name}}',
      attached: 'Đã gắn ngân sách',
      awaitingBackfill: 'Chờ gắn ngược',
      colBudget: 'Ngân sách',
      colCommitment: 'Khoản cam kết',
      colDue: 'Hạn ghi nhận',
      colRequest: 'Yêu cầu',
      emptyQueue: 'Không còn khoản cam kết nào chờ ghi nhận.',
      noBudgetLocked: 'Chưa có ngân sách cho Cost Center và kỳ này — ý kiến chỉ có thể là Chưa có ngân sách.',
      noteLabel: 'Ghi chú (tùy chọn)',
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
        'Ghi nhận diễn ra sau khi đã duyệt chi, có SLA riêng và không nằm trên đường chờ cấp phát. Ghi Vượt hạn mức hoặc Chưa có ngân sách chỉ thông báo — không hoàn tác quyết định, không dừng cấp phát.',
      sodNote: 'Người ghi nhận không được là Người duyệt chi của cùng yêu cầu (SoD-8).',
      submit: 'Ghi nhận',
      subtitle: 'Mỗi khoản cam kết gắn đúng một yêu cầu đã duyệt chi.',
      title: 'Khoản cam kết chờ ghi nhận'
    },
    budgets: {
      addCenter: 'Thêm Cost Center',
      amountLabel: 'Hạn mức ngân sách (chi phí thực chịu, VND)',
      amountPlaceholder: 'Ví dụ: 20000000',
      amountRequired: 'Hạn mức phải lớn hơn 0 — không tạo ngân sách 0 để giữ chỗ.',
      backfillNote: 'Ngay khi lập, hệ thống tự gắn các khoản này vào ngân sách mới và ghi Audit Trail.',
      backfillTitle: '{{count}} khoản cam kết sẽ được gắn ngược',
      budgetsHint: 'Mỗi Cost Center và kỳ có tối đa một ngân sách.',
      budgetsTitle: 'Ngân sách kỳ {{period}}',
      catalogHint: 'Unit gắn 1–1 với phòng ban; Company dùng cho chi phí toàn công ty.',
      catalogNote:
        'Tách hoặc gộp phòng ⟹ tạo Cost Center mới và ngừng dùng cái cũ; lịch sử giữ nguyên. Không tạo Cost Center giữ chỗ.',
      catalogTitle: 'Danh mục Cost Center',
      colAction: 'Thao tác',
      colDepartment: 'Phòng ban',
      colKind: 'Loại',
      colStatus: 'Trạng thái',
      create: 'Lập ngân sách',
      createHint: 'Lập hạn mức trên chi phí thực chịu cho Cost Center và kỳ.',
      createTitle: 'Lập ngân sách {{costCenter}} · {{period}}',
      createdResult:
        'Ngân sách {{costCenter}} đã có hiệu lực; đã gắn ngược {{count}} khoản cam kết. Snapshot và báo cáo dùng ngay ngân sách mới.',
      edit: 'Sửa giữa kỳ',
      editHint: 'Sửa số tiền giữa kỳ bắt buộc có lý do.',
      editNote: 'Lịch sử được giữ; snapshot đã chụp lúc quyết không đổi; Người duyệt chi được báo.',
      editTitle: 'Sửa ngân sách {{costCenter}} · {{period}}',
      editedResult: 'Đã sửa ngân sách {{costCenter}} và thông báo Người duyệt chi.',
      kind: {
        COMPANY: 'Company',
        UNIT: 'Unit'
      },
      negativeExplain:
        'Còn lại âm: cam kết tạo trước khi có ngân sách vượt hạn mức vừa lập. Số âm được hiển thị, không làm tròn về 0.',
      negativeResult:
        'Còn lại âm với nhãn Đã cam kết vượt hạn mức; báo cáo nêu phần vượt đến từ cam kết tạo trước khi có ngân sách.',
      newCode: 'Mã Cost Center',
      newName: 'Tên',
      periodType: 'Loại kỳ: {{type}} (Super Admin đặt một lần)',
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
      subtitle: 'Quản lý danh mục Cost Center và lập ngân sách theo Cost Center và kỳ.',
      title: 'Cost Center & ngân sách'
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
      duplicateRows: 'Dòng đã import trước đó',
      errorRows: 'Dòng lỗi',
      exception: 'Ngoại lệ cần kiểm tra',
      exceptionHint: 'Mở ở FIN-07',
      fileLabel: 'Tệp CSV',
      fileRejected: 'Chỉ nhận CSV — XLSX, PDF hoặc mã hóa khác bị từ chối cả tệp.',
      formatNote: 'CSV theo mẫu chuẩn hoặc mẫu cấu hình theo ngân hàng là nguồn bằng chứng duy nhất của đợt này.',
      newImport: 'Nhập tệp khác',
      noFollowUp: 'Không cần xử lý',
      noFollowUpHint: 'Khớp căn cứ, đã ghi nhận, hoàn tiền hoặc không phải phần mềm',
      previewHint: 'Xem trước bắt buộc. Lỗi một dòng không làm hỏng cả tệp.',
      previewSummary: 'Tóm tắt xem trước',
      problem: {
        DUPLICATE: 'Đã import trước đó',
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
      vendorQueue: 'Chuyển hàng đợi IT',
      vendorQueueHint: 'Nhà cung cấp chưa nhận diện hoặc chưa được duyệt (ITA-15)'
    },
    exceptions: {
      amount: 'Số tiền',
      approvedAmount: 'Số tiền được duyệt',
      attach: 'Đính kèm chứng từ',
      basisTried: 'Căn cứ đã thử',
      billingError: 'Nhà cung cấp tính sai',
      billingNote: 'Ghi chú (bắt buộc)',
      billingNoteRequired: 'Bắt buộc nhập ghi chú.',
      card: 'thẻ ••{{last4}}',
      chargeTitle: 'Khoản chi',
      closeBillingError: 'Đóng là lỗi tính tiền',
      empty: 'Không có mục nào.',
      evidence: 'Chứng từ ({{count}})',
      excess: 'Phần vượt',
      filterLabel: 'Lọc ngoại lệ theo trạng thái',
      itNote: 'IT Admin',
      linkedByIt:
        'Nếu IT liên kết được căn cứ, hệ thống đối soát lại dòng này; phần vượt số tiền được duyệt vẫn là ngoại lệ.',
      outcome: {
        BASIS_LINKED: 'IT đã liên kết căn cứ; dòng đã được đối soát lại.',
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
      resultTitle: 'Kết quả kiểm tra chung với IT',
      ruleNotice:
        'Ngoại lệ là cần kiểm tra, không phải vi phạm. Finance đính kèm chứng từ và kiểm tra cùng IT nhưng không quyết chấp nhận khoản chi (SoD-3).',
      sendToApprover: 'Không có căn cứ hợp lệ — chuyển Người duyệt chi',
      status: {
        BASIS_LINKED: 'Đã liên kết căn cứ',
        BILLING_ERROR: 'Lỗi tính tiền',
        CHECKING: 'Đang kiểm tra',
        SENT_TO_APPROVER: 'Chờ Người duyệt chi'
      },
      subtitle: 'Khoản chi chưa khớp căn cứ phê duyệt sau đối soát; mỗi ngoại lệ có đúng một lý do.',
      title: 'Ngoại lệ khoản chi',
      unallocatedNote: 'Phần chưa được giải thích vẫn tính vào thực chi của kỳ, ở dòng Chưa phân bổ Cost Center.'
    },
    close: {
      addInternal: 'Ghi khoản',
      auditNote: 'Thao tác ghi Audit Trail.',
      committed: 'Đã cam kết',
      confirmRelease: 'Giải phóng',
      convertedHint: 'Mỗi hóa đơn chuyển đúng số tiền của nó từ cam kết thành chi phí',
      convertedToCost: 'Đã chuyển thành chi phí',
      heldRemainder: 'Phần dư đang giữ',
      internalAmount: 'Số tiền (VND)',
      internalDescription: 'Mô tả khoản chi phí',
      internalHint:
        'Không cần hóa đơn hay nhà cung cấp. Mỗi khoản gán đúng một Cost Center; muốn chia thì ghi nhiều khoản — không áp tỷ lệ phân bổ.',
      internalRequired: 'Nhập mô tả, số tiền lớn hơn 0 và chọn một Cost Center.',
      internalTitle: 'Chi phí phần mềm nội bộ (FIN-31)',
      invoiceOutlook: 'Hóa đơn',
      invoiced: 'Đã có hóa đơn',
      matchedInvoices: 'Hóa đơn đã khớp',
      moreExpected: 'Còn chờ hóa đơn',
      noInvoice: 'Không còn hóa đơn',
      noMoreInvoices: 'Hết hóa đơn — lần cuối {{date}}',
      pickCostCenter: 'Chọn Cost Center',
      release: 'Giải phóng phần dư',
      releaseDisabled: 'Còn chờ hóa đơn — chưa giải phóng',
      releaseReason: 'Lý do giải phóng phần dư {{code}} (bắt buộc)',
      releaseReasonRequired: 'Bắt buộc nhập lý do.',
      released: 'Đã giải phóng',
      remainders: 'Phần dư còn giữ',
      remaindersHint: 'Giải phóng phần dư chỉ khi không còn hóa đơn nào sẽ đến.',
      remaindersTitle: 'Khoản cam kết còn phần dư',
      subtitle:
        'Bước 1 của đóng kỳ {{period}}: chuyển cam kết thành chi phí theo hóa đơn đã khớp và ghi chi phí nội bộ.',
      summaryLabel: 'Tóm tắt đóng kỳ',
      title: 'Đóng kỳ {{period}}',
      toAllocation: 'Phân bổ chi phí'
    },
    analysis: {
      allocationHint:
        'Gói dùng chung theo tỷ lệ Finance khai (tổng 100%); seat cá nhân theo phòng của người giữ, chia theo ngày khi điều chuyển; tài khoản dùng chung về Unit của phòng hoặc Company.',
      allocationTitle: 'Phân bổ chi phí theo Cost Center (FIN-32)',
      basis: {
        cash: 'Theo dòng tiền',
        period: 'Theo kỳ'
      },
      basisHint: {
        cash: 'Ghi nhận tại ngày hóa đơn — phục vụ đối soát thanh toán.',
        period: 'Phân bổ đều theo thời gian sử dụng — phục vụ theo dõi ngân sách.'
      },
      basisLabel: 'Cơ sở ghi nhận',
      bvaTitle: 'Budget vs Actual trên chi phí thực chịu (FIN-33)',
      internal: 'Nội bộ',
      l1Hint: 'Tính xác định từ hợp đồng — không dùng mô hình thống kê.',
      l1Title: 'L1 — Chi phí đã cam kết',
      l1Total: 'Tổng quý tới',
      l2Deferred: 'L2 — Dự báo theo mô hình chưa được hiện thực (cần ≥ 12 tháng dữ liệu và kiểm chứng lùi).',
      l3Hint: 'Ba kịch bản từ giả định Finance nhập.',
      l3Note: 'Kịch bản = L1 + phần phụ thuộc quyết định × 0,5 / 1 / 1,5.',
      l3Title: 'L3 — Kịch bản',
      openExceptions: '{{count}} ngoại lệ đang mở',
      personalSeats: 'Seat cá nhân',
      priorAdjustment: 'Điều chỉnh kỳ trước ({{period}})',
      scenario: {
        base: 'Cơ sở',
        high: 'Cao',
        low: 'Thấp'
      },
      sharedAccounts: 'Tài khoản dùng chung',
      sharedByRatio: 'Gói dùng chung (tỷ lệ)',
      subtitle: 'Bước 2 của đóng kỳ {{period}}: xem phân bổ, so ngân sách với thực chi và dự báo.',
      title: 'Phân bổ và Budget vs Actual {{period}}',
      toReport: 'Lập báo cáo kỳ',
      total: 'Tổng',
      unallocated: 'Chưa phân bổ Cost Center',
      unallocatedNote:
        'Dòng Chưa phân bổ là dòng báo cáo, không phải Cost Center; không ép vào Cost Center nào cho tới khi Người duyệt chi quyết.',
      upcomingRenewals: 'Gia hạn sắp tới',
      assumption: {
        costPerHire: 'Chi phí công cụ / người (VND)',
        newHires: 'Nhân sự mới',
        newProjects: 'Dự án mới (VND)'
      }
    },
    report: {
      colNarrative: 'Diễn giải',
      colRole: 'Vai trò',
      colSavings: 'Tiết kiệm',
      colSpend: 'Tổng chi',
      draftWarning:
        'Bản nháp do AI soạn từ số liệu backend — không phải số liệu. Xem và sửa trước khi dùng; mỗi con số truy được nguồn.',
      figuresLabel: 'Số liệu kỳ',
      generateDraft: 'Tạo bản nháp AI',
      hidden: 'Không xem',
      immutable:
        'Báo cáo đã phát hành là bản chụp bất biến — không phát hành lại; khoản đến muộn và sửa sai hiện ở báo cáo kỳ sau dưới nhãn điều chỉnh kỳ trước.',
      mode: {
        ai: 'Dùng bản nháp AI',
        manual: 'Tự viết'
      },
      modeHint: {
        ai: 'AI chỉ diễn giải, không tính tiền, không kết luận vi phạm.',
        manual: 'Dùng khi không cần AI, hoặc AI tắt/lỗi — quy trình vẫn chạy đủ.'
      },
      narrativeHint: 'Tùy chọn. Diễn giải chỉ nằm trong bản của Finance và Người duyệt chi.',
      narrativePlaceholder: 'Viết phần diễn giải cho báo cáo kỳ…',
      narrativeTitle: 'Phần diễn giải',
      ofBudget: 'trên ngân sách {{budget}}',
      ownDepartment: 'Phòng mình',
      publish: 'Phát hành báo cáo kỳ',
      published: 'Đã phát hành lúc {{time}}.',
      reviewFirst: 'Đánh dấu đã xem và sửa bản nháp trước khi phát hành.',
      reviewedCheck: 'Tôi đã xem và sửa bản nháp',
      roles: {
        approver: 'Người duyệt chi',
        finance: 'Finance',
        itAdmin: 'IT Admin',
        manager: 'Trưởng phòng'
      },
      savingsImmediate: 'Tiết kiệm thực hiện ngay',
      savingsNextRenewal: 'Tiết kiệm tại kỳ gia hạn kế tiếp',
      savingsSeparate: 'Hai con số tách riêng, không cộng lại',
      subtitle: 'Bước 3 của đóng kỳ: tùy chọn bản nháp AI, rồi phát hành báo cáo theo phạm vi xem của từng vai.',
      title: 'Báo cáo kỳ {{period}}',
      totalSpend: 'Tổng chi (theo kỳ)',
      visibilityHint:
        'Trưởng phòng chỉ thấy thực chi và cam kết của phòng mình — không thấy ngân sách hay tổng công ty.',
      visibilityTitle: 'Ai xem gì',
      visible: 'Được xem'
    }
  }
} as const
