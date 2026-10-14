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
    snapshotTitle: 'Ảnh chụp ngân sách',
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
      charges: 'Khoản chi và hợp thức hóa',
      chargesHint: 'Khoản chi chưa có căn cứ và hồ sơ phần mềm cần hợp thức hóa',
      nearestDeadline: 'Gần nhất: {{name}} — hạn báo hủy {{date}}',
      overdueHint: '{{count}} việc đã quá thời hạn xử lý',
      renewals: 'Đề xuất gia hạn / giảm / hủy',
      requests: 'Yêu cầu chờ duyệt chi',
      spendRegion: 'Tổng chi và tiết kiệm',
      subtitle:
        'Việc đang chờ bạn quyết, tổng chi và tiết kiệm. Bộ phận Tài chính chỉ cung cấp ý kiến ngân sách để tham khảo.',
      title: 'Chào {{name}}',
      totalSpend: 'Tổng chi {{period}}',
      urgentHint:
        'Sắp xếp theo thời hạn xử lý — quá hạn thì hệ thống nhắc bạn và báo Quản trị hệ thống, không đổi người, không tự quyết.',
      urgentTitle: 'Cần quyết sớm nhất',
      workRegion: 'Việc chờ quyết'
    },
    queue: {
      colAmount: 'Số tiền',
      colItem: 'Mục',
      colSla: 'Thời hạn xử lý',
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
        'Mỗi việc có thời hạn xử lý riêng. Quá hạn hoặc số việc tồn vượt ngưỡng: hệ thống nhắc bạn và cảnh báo Quản trị hệ thống — không chuyển cho người khác, không ủy quyền, không bao giờ tự quyết.',
      subtitle:
        'Bốn loại việc: duyệt chi · bước nhu cầu khi trưởng phòng là người thụ hưởng · kỳ gia hạn · khoản chi chưa có căn cứ hoặc hợp thức hóa.',
      title: 'Hàng chờ phê duyệt'
    },
    request: {
      askMore: 'Hỏi thêm bộ phận Tài chính',
      costTitle: 'Chi phí và ngân sách',
      fact: {
        cost: 'Chi phí ước tính (thực chịu)',
        costCenter: 'Trung tâm chi phí · kỳ',
        remainingAfter: 'Còn lại nếu duyệt'
      },
      financeName: 'Tài chính',
      financePending: 'Đang chờ bộ phận Tài chính trả lời — thời hạn xử lý của bạn vẫn chạy.',
      questionPlaceholder:
        'Ví dụ: Nếu duyệt thêm khoản này, trung tâm chi phí còn đủ cho các yêu cầu đang chờ trong quý không?',
      questionRequired: 'Nhập câu hỏi hoặc ý kiến cho bộ phận Tài chính.',
      questionLabel: 'Câu hỏi / ý kiến của bạn',
      slaNotPaused:
        'Gửi câu hỏi không làm dừng thời hạn xử lý; bạn vẫn quyết được trước khi bộ phận Tài chính trả lời.',
      summaryLabel: 'Tóm tắt yêu cầu',
      topic: {
        BUDGET_TIMING: 'Khi nào có ngân sách',
        ENOUGH_BUDGET: 'Còn đủ ngân sách?',
        PENDING_IMPACT: 'Ảnh hưởng yêu cầu đang chờ',
        SUGGESTION: 'Gợi ý số tiền / thời điểm'
      },
      topicLegend: 'Muốn bộ phận Tài chính xem gì',
      urgency: { BEFORE_SLA: 'Trước hạn xử lý của tôi', NOT_URGENT: 'Không gấp', TODAY: 'Trong hôm nay' },
      urgencyLabel: 'Cần trả lời',
      you: 'Bạn hỏi',
      approve: 'Duyệt',
      beneficiary: 'Người thụ hưởng',
      branch: {
        b: 'Mua thêm / nâng gói',
        c: 'Phần mềm mới, chưa có trong danh mục'
      },
      confirmReject: 'Xác nhận từ chối',
      financeHint: 'Tùy chọn. Thời hạn xử lý không dừng khi hỏi; bạn quyết được cả khi bộ phận Tài chính chưa trả lời.',
      financeTitle: 'Ý kiến ngân sách của bộ phận Tài chính',
      itAssessment: 'Đánh giá của Quản trị viên CNTT',
      needApproved:
        'Đã duyệt bước nhu cầu. Yêu cầu đi tiếp tới bước duyệt chi — vẫn giao cho bạn, nhật ký ghi rõ là cùng người.',
      needDecisionTitle: 'Quyết định bước nhu cầu',
      needStepHint:
        'Trưởng phòng tự gửi yêu cầu nên bước nhu cầu do Người duyệt chi đảm nhận. Hai bước vẫn được tách riêng.',
      needTitle: 'Nhu cầu và lý do',
      referenceOnly: 'Ý kiến tham khảo — không phải phê duyệt, không chặn quyết định.',
      reject: 'Từ chối',
      rejectReason: 'Lý do từ chối (bắt buộc)',
      rejected: 'Đã từ chối. Người yêu cầu được báo kèm lý do; không tạo khoản cam kết.',
      requester: 'Người yêu cầu',
      samePerson: 'Cùng người với bước trước',
      sendQuestion: 'Gửi câu hỏi',
      snapshotCaptured:
        'Ảnh chụp ngân sách được lưu lại tại lúc bạn quyết để làm bằng chứng. Không ai được duyệt yêu cầu mà mình là người yêu cầu hoặc người thụ hưởng.',
      spendApproved:
        'Đã duyệt chi. Hệ thống tạo khoản cam kết (bộ phận Tài chính ghi nhận sau) và tác vụ cấp phát cho Quản trị viên CNTT.',
      spendDecisionTitle: 'Quyết định duyệt chi',
      spendStepHint: 'Duyệt hoặc từ chối dựa trên ảnh chụp ngân sách. Từ chối bắt buộc có lý do.',
      step: {
        created: 'Gửi yêu cầu',
        itReview: 'CNTT đánh giá danh mục, rủi ro, mức kiểm soát',
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
      assigned: 'Giấy phép đang cấp',
      contractTitle: 'Thuê bao và hạn chót',
      daysLeft: 'Còn {{count}} ngày tới hạn báo hủy',
      deadline: 'Hạn chót báo hủy',
      decided:
        'Đã ghi quyết định: {{action}} ({{quantity}} giấy phép). Quyết định được lưu vào nhật ký kiểm toán và chuyển Quản trị viên CNTT thực hiện, ghi kết quả.',
      decisionTitle: 'Quyết định của bạn',
      group: {
        DECIDED: 'Đã quyết thu hồi',
        G2: 'Đã nghỉ việc',
        G3: 'Không hoạt động',
        G4: 'Dùng ít',
        OLDEST: 'Hoạt động cuối cũ nhất'
      },
      handoffNote:
        'Quyết định ghi được trước hoặc sau hạn chót báo hủy; quyết định muộn không bị hủy — Quản trị viên CNTT xử lý thời điểm thực hiện hợp lệ.',
      itPick: 'CNTT đề xuất',
      itProposal: 'Đề xuất của Quản trị viên CNTT',
      lateNote: 'Quyết định sau hạn chót báo hủy — bộ phận CNTT xử lý theo trường hợp thực hiện muộn.',
      newQuantity: 'Số lượng mới (đang mua {{purchased}})',
      noCommitment:
        'Quyết định gia hạn/giảm/hủy không tạo khoản cam kết; chi phí kỳ gia hạn hiện ở dự báo chi phí đã cam kết.',
      ownerOpinion: 'Ý kiến người phụ trách nghiệp vụ',
      pickInvalid: 'Chọn đúng {{count}} giấy phép cần thu hồi.',
      purchased: 'Giấy phép đã mua',
      quantityInvalid: 'Số lượng mới phải từ {{min}} đến {{max}} giấy phép.',
      reasonLabel: 'Lý do khác đề xuất của CNTT (bắt buộc)',
      reclaimHint:
        'Hệ thống xếp sẵn: đã quyết thu hồi → đã nghỉ việc → không hoạt động / dùng ít → hoạt động cuối cũ nhất.',
      reclaimTitle: 'Giảm dưới số giấy phép đang cấp — chọn {{count}} giấy phép thu hồi',
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
        g1: 'Chưa cấp',
        g2: 'Đã nghỉ việc',
        g3: 'Không hoạt động',
        g4: 'Dùng ít'
      }
    },
    charge: {
      assessmentHint: 'Chỉ là đầu vào cho quyết định — bộ phận CNTT không quyết hợp thức hóa.',
      assessmentTitle: 'Đánh giá của Quản trị viên CNTT',
      chargeSubtitle: 'Khoản chi không có căn cứ hợp lệ sau khi bộ phận Tài chính và CNTT đã kiểm tra.',
      chargeTitle: 'Khoản chi trên sao kê',
      chargesTotal: 'Tổng {{count}} khoản chi',
      control: 'Mức kiểm soát',
      costCenterLabel: 'Trung tâm chi phí nhận khoản chi (bắt buộc khi chấp nhận)',
      costCenterRequired: 'Chọn trung tâm chi phí.',
      date: 'Ngày',
      decisionHint: 'Chỉ Người duyệt chi quyết; bộ phận Tài chính và Quản trị hệ thống không nằm trên luồng này.',
      decisionTitle: 'Chọn kết quả',
      executionNote:
        'Quyết định được ghi vào từng khoản chi của hồ sơ và nhật ký kiểm toán; Quản trị viên CNTT thực hiện sau đó.',
      financeEvidence: 'Chứng từ của bộ phận Tài chính',
      findingSubtitle:
        'Hồ sơ hợp thức hóa cho nhà cung cấp chưa được duyệt — quyết định này tương đương duyệt phần mềm mới.',
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
        ACCEPT: 'Chọn trung tâm chi phí; khoản chi rời dòng Chưa phân bổ.',
        FALSE_POSITIVE: 'Đóng có lý do; nếu xuất hiện lại sẽ mở lại.',
        LEGITIMIZE: 'CNTT đưa vào danh mục và cấp quyền cho người đang dùng — không duyệt chi lần hai.',
        NOT_ACCEPT: 'Bắt buộc có lý do; khoản chi vẫn ở dòng Chưa phân bổ với nhãn không chấp nhận.',
        NOT_APPROVED: 'Bắt buộc có lý do; CNTT hủy gói, thu hồi hoặc chuyển người dùng sang công cụ đã có.'
      },
      payer: 'Người trả',
      reasonLabel: 'Lý do (bắt buộc)',
      responsible: 'Người chịu trách nhiệm',
      result: {
        ACCEPT: 'Đã chấp nhận khoản chi; tính vào {{costCenter}}.',
        FALSE_POSITIVE: 'Đã đóng là báo nhầm.',
        LEGITIMIZE:
          'Đã duyệt hợp thức hóa. Quản trị viên CNTT đưa vào danh mục, ghi thuê bao và cấp quyền cho người đang dùng.',
        NOT_ACCEPT: 'Không chấp nhận — khoản chi ở dòng Chưa phân bổ với nhãn không chấp nhận.',
        NOT_APPROVED: 'Không duyệt — Quản trị viên CNTT hủy gói, thu hồi hoặc chuyển người dùng.'
      },
      statementLine: 'Dòng sao kê',
      submit: 'Ghi quyết định',
      users: '{{count}} người đang dùng',
      vendor: 'Nhà cung cấp'
    },
    reports: {
      branchATitle: 'Giấy phép cấp từ số đã mua trong kỳ — tóm tắt',
      days: '{{value}} ngày',
      financeRecording: 'Tài chính ghi nhận sau khi duyệt (đo riêng)',
      financeResponse: 'Tài chính trả lời câu hỏi (đo riêng)',
      myOverdue: 'Tỷ lệ bước của tôi quá thời hạn xử lý',
      processHint: 'Thời gian xử lý tách theo từng bước; thời gian của bộ phận Tài chính không cộng vào thời gian chờ.',
      processTitle: 'Hiệu suất quy trình — tóm tắt',
      reclaimedHint: 'Chỉ là căn cứ — thu hồi không tự cộng vào tiết kiệm.',
      reclaimedSeats: 'Giấy phép đã thu hồi',
      savingsLabel: 'Tiết kiệm',
      seats: '{{count}} giấy phép',
      spendHint: 'Chi phí theo kỳ trên chi phí thực chịu, theo trung tâm chi phí.',
      spendTitle: 'Tổng chi {{spend}} / ngân sách {{budget}}',
      spendChart: {
        nearLimit: 'Đã dùng trên 90% ngân sách',
        noBudget: 'Không thuộc ngân sách nào',
        usedShare: 'Đã dùng'
      },
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
        kpi3: 'Tỷ lệ sử dụng (chỉ số chính thức)'
      },
      usageHint: 'Ba tỷ lệ, ba câu hỏi khác nhau — không gộp làm một.',
      usageNote:
        '{{purchased}} giấy phép đã mua · {{evaluated}} giấy phép đánh giá được · {{active}} giấy phép có hoạt động.',
      usageTitle: 'Hiệu suất sử dụng — tóm tắt'
    }
  },
  finance: {
    charts: {
      bva: {
        hint: 'Từng trung tâm chi phí: cột xám là ngân sách, cột xanh là thực chi (chi phí thực chịu).',
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
        hint: 'Tỷ trọng thực chi của từng trung tâm chi phí; dòng Chưa phân bổ hiện riêng màu xám.',
        title: 'Cơ cấu thực chi {{period}} theo trung tâm chi phí'
      },
      shareColumn: 'Tỷ trọng',
      structure: {
        basis: 'Cách phân bổ',
        hint: 'Chi phí của kỳ chia theo quy tắc phân bổ đã áp dụng.',
        title: 'Cơ cấu chi phí {{period}} theo cách phân bổ'
      },
      usage: {
        hint: 'Mỗi thanh là ngân sách của một trung tâm chi phí: thực chi + cam kết đang giữ + phần còn lại. Trung tâm chi phí chưa có ngân sách chỉ có phần đã chi và đã cam kết.',
        title: 'Ngân sách {{period}} đang được dùng thế nào'
      }
    },
    nav: {
      budgetQuestions: 'Câu hỏi ngân sách',
      budgets: 'Trung tâm chi phí & ngân sách',
      chargeExceptions: 'Ngoại lệ khoản chi',
      commitments: 'Cam kết chờ ghi nhận',
      costAnalysis: 'Phân bổ & so sánh ngân sách',
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
      exceptionsHint: 'Cần bộ phận Tài chính và CNTT kiểm tra',
      formulaNote:
        'Bộ phận Tài chính không nằm trên luồng duyệt chi: chỉ trả lời khi được hỏi và ghi nhận sau khi Người duyệt chi duyệt.',
      openAction: 'Mở →',
      openExceptions: 'Ngoại lệ khoản chi',
      openQuestions: 'Câu hỏi ngân sách đang mở',
      periodClose: 'Đóng {{period}}',
      questionsHint: 'Từ Người duyệt chi — tham khảo, không chặn',
      recordingHint: '{{count}} khoản đã tới hạn ghi nhận',
      subtitle: 'Việc ngân sách đang mở của {{period}}. Mỗi ô là điểm vào của một việc.',
      title: 'Bảng điều khiển Tài chính',
      totalWithBudget: 'Tổng (trung tâm chi phí đã có ngân sách)',
      withoutBudget: 'Trung tâm chi phí chưa có ngân sách',
      workRegion: 'Việc ngân sách đang mở'
    },
    questions: {
      answerTitle: 'Câu trả lời đã gửi',
      backToList: 'Quay lại danh sách câu hỏi',
      colAsked: 'Người hỏi · thời gian',
      colRequest: 'Yêu cầu',
      colStatus: 'Trạng thái',
      contextTitle: 'Số liệu để trả lời',
      factCostCenter: 'Trung tâm chi phí · kỳ',
      factRemainingAfter: 'Còn lại nếu duyệt',
      factRemainingNow: 'Còn lại hiện tại',
      questionTitle: 'Câu hỏi của Người duyệt chi',
      replyTitle: 'Trả lời của bạn',
      suggestedTag: 'Gợi ý',
      summaryLabel: 'Tóm tắt câu hỏi',
      answeredNotice:
        'Câu trả lời đã hiện trên màn hình quyết định của Người duyệt chi. Thời hạn xử lý của bước duyệt chi không dừng.',
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
        'Câu trả lời là ý kiến tham khảo — không phải phê duyệt, không chặn. Người duyệt chi quyết được bất cứ lúc nào, kể cả khi bạn chưa trả lời.',
      slaNote: 'Thời gian phản hồi của bộ phận Tài chính được đo riêng.',
      sodBlocked:
        'Bạn là Người duyệt chi (thay thế) của yêu cầu này nên không được trả lời câu hỏi ngân sách của chính yêu cầu đó.',
      status: {
        ANSWERED: 'Đã trả lời',
        CLOSED_CANCELLED: 'Đóng — yêu cầu bị hủy',
        OPEN: 'Đang mở'
      },
      submit: 'Gửi câu trả lời',
      subtitle: 'Người duyệt chi hỏi thông tin ngân sách của trung tâm chi phí và kỳ trước khi quyết.',
      suggested: 'Gợi ý theo ảnh chụp ngân sách: {{opinion}}',
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
      noBudgetLocked: 'Chưa có ngân sách cho trung tâm chi phí và kỳ này — ý kiến chỉ có thể là Chưa có ngân sách.',
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
        'Ghi nhận diễn ra sau khi đã duyệt chi, có thời hạn xử lý riêng và không nằm trên luồng chờ cấp phát. Ghi Vượt hạn mức hoặc Chưa có ngân sách chỉ thông báo — không hoàn tác quyết định, không dừng cấp phát.',
      sodNote: 'Người ghi nhận không được là Người duyệt chi của cùng yêu cầu.',
      submit: 'Ghi nhận',
      subtitle: 'Mỗi khoản cam kết gắn đúng một yêu cầu đã được duyệt chi.',
      title: 'Khoản cam kết chờ ghi nhận'
    },
    budgets: {
      breakdown: 'Thực chi {{actual}} · Cam kết {{held}}',
      centerRequired: 'Nhập mã và tên trung tâm chi phí.',
      currentBudget: 'Ngân sách hiện tại: {{budget}}',
      monthLabel: 'Xem theo tháng',
      newCodePlaceholder: 'Ví dụ: CC-HR',
      ofBudget: 'trên {{budget}}',
      periodInfo: 'Kỳ ngân sách {{quarter}} · số liệu lũy kế đến {{month}}',
      readOnly: 'Kỳ đã qua — chỉ xem',
      retireBody:
        'Trung tâm chi phí sẽ chuyển sang Ngừng dùng và không nhận chi phí mới; lịch sử và báo cáo cũ giữ nguyên. Tách hoặc gộp phòng thì tạo trung tâm chi phí mới thay thế.',
      retireTitle: 'Ngừng dùng {{code}}?',
      summary: {
        total: 'Tổng ngân sách {{quarter}}',
        totalHint: '{{count}} trung tâm chi phí đã có ngân sách',
        used: 'Đã chi và đã cam kết'
      },
      summaryLabel: 'Tổng hợp ngân sách',
      unbudgetedExposure: 'đã phát sinh {{amount}} thực chi và cam kết',
      usedPercent: 'Đã dùng {{percent}}',
      addCenter: 'Thêm trung tâm chi phí',
      amountLabel: 'Hạn mức ngân sách (chi phí thực chịu, đồng)',
      amountPlaceholder: 'Ví dụ: 20000000',
      amountRequired: 'Hạn mức phải lớn hơn 0 — không tạo ngân sách 0 để giữ chỗ.',
      backfillNote: 'Ngay khi lập, hệ thống tự gắn các khoản này vào ngân sách mới và ghi vào nhật ký kiểm toán.',
      backfillTitle: '{{count}} khoản cam kết sẽ được gắn ngược',
      budgetsHint: 'Mỗi trung tâm chi phí trong một kỳ có tối đa một ngân sách.',
      budgetsTitle: 'Ngân sách {{period}}',
      catalogHint: 'Loại Phòng ban gắn 1–1 với một phòng; loại Toàn công ty dùng cho chi phí chung.',
      catalogNote:
        'Tách hoặc gộp phòng ⟹ tạo trung tâm chi phí mới và ngừng dùng cái cũ; lịch sử giữ nguyên. Không tạo trung tâm chi phí giữ chỗ.',
      catalogTitle: 'Danh mục trung tâm chi phí',
      colAction: 'Thao tác',
      colDepartment: 'Phòng ban',
      colKind: 'Loại',
      colStatus: 'Trạng thái',
      create: 'Lập ngân sách',
      createHint: 'Lập hạn mức trên chi phí thực chịu cho trung tâm chi phí và kỳ.',
      createTitle: 'Lập ngân sách {{costCenter}} · {{period}}',
      createdResult:
        'Ngân sách {{costCenter}} đã có hiệu lực; đã gắn ngược {{count}} khoản cam kết. Ảnh chụp ngân sách và báo cáo dùng ngay ngân sách mới.',
      edit: 'Sửa giữa kỳ',
      editHint: 'Sửa số tiền giữa kỳ bắt buộc có lý do.',
      editNote: 'Lịch sử được giữ; ảnh chụp ngân sách đã lưu lúc quyết không đổi; Người duyệt chi được báo.',
      editTitle: 'Sửa ngân sách {{costCenter}} · {{period}}',
      editedResult: 'Đã sửa ngân sách {{costCenter}} và thông báo Người duyệt chi.',
      kind: {
        COMPANY: 'Toàn công ty',
        UNIT: 'Phòng ban'
      },
      negativeExplain:
        'Còn lại âm: các cam kết tạo trước khi có ngân sách vượt hạn mức vừa lập. Số âm được hiển thị, không làm tròn về 0.',
      negativeResult:
        'Còn lại âm với nhãn Đã cam kết vượt hạn mức; báo cáo nêu rõ phần vượt đến từ cam kết tạo trước khi có ngân sách.',
      newCode: 'Mã trung tâm chi phí',
      newName: 'Tên',
      periodType: 'Loại kỳ: {{type}} (Quản trị hệ thống đặt một lần)',
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
      title: 'Trung tâm chi phí & ngân sách'
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
      exceptionHint: 'Xem ở màn Ngoại lệ khoản chi',
      fileLabel: 'Tệp CSV',
      fileRejected: 'Chỉ nhận tệp CSV — tệp XLSX, PDF hoặc mã hóa khác bị từ chối cả tệp.',
      formatNote: 'Tệp CSV theo mẫu chuẩn hoặc mẫu riêng của ngân hàng là nguồn bằng chứng duy nhất ở đợt này.',
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
      uploadHint: 'Chọn mẫu rồi tải tệp CSV lên.',
      uploadTitle: 'Tải tệp',
      useSample: 'Dùng tệp mẫu',
      validRows: 'Dòng hợp lệ',
      vendorQueue: 'Chuyển bộ phận CNTT',
      vendorQueueHint: 'Nhà cung cấp chưa nhận diện được hoặc chưa được duyệt'
    },
    exceptions: {
      amount: 'Số tiền',
      approvedAmount: 'Số tiền được duyệt',
      attach: 'Đính kèm chứng từ',
      basisTried: 'Căn cứ đã đối chiếu',
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
      itNote: 'Quản trị viên CNTT',
      linkedByIt:
        'Nếu bộ phận CNTT liên kết được căn cứ, hệ thống đối soát lại dòng này; phần vượt số tiền được duyệt vẫn là ngoại lệ.',
      outcome: {
        BASIS_LINKED: 'Bộ phận CNTT đã liên kết căn cứ; dòng đã được đối soát lại.',
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
      resultTitle: 'Kết quả kiểm tra cùng bộ phận CNTT',
      ruleNotice:
        'Ngoại lệ là việc cần kiểm tra, không phải vi phạm. Bạn đính kèm chứng từ và kiểm tra cùng bộ phận CNTT nhưng không quyết định chấp nhận khoản chi.',
      sendToApprover: 'Không có căn cứ hợp lệ — chuyển Người duyệt chi',
      status: {
        BASIS_LINKED: 'Đã liên kết căn cứ',
        BILLING_ERROR: 'Lỗi tính tiền',
        CHECKING: 'Đang kiểm tra',
        SENT_TO_APPROVER: 'Chờ Người duyệt chi'
      },
      subtitle: 'Khoản chi chưa khớp căn cứ phê duyệt sau đối soát; mỗi ngoại lệ có đúng một lý do.',
      title: 'Ngoại lệ khoản chi',
      unallocatedNote: 'Phần chưa được giải thích vẫn tính vào thực chi của kỳ, ở dòng Chưa phân bổ.'
    },
    close: {
      addInternal: 'Ghi khoản',
      auditNote: 'Thao tác được ghi vào nhật ký kiểm toán.',
      committed: 'Đã cam kết',
      confirmRelease: 'Giải phóng',
      convertedHint: 'Mỗi hóa đơn chuyển đúng số tiền của nó từ cam kết thành chi phí',
      convertedToCost: 'Đã chuyển thành chi phí',
      heldRemainder: 'Phần dư đang giữ',
      internalAmount: 'Số tiền (đồng)',
      internalDescription: 'Mô tả khoản chi phí',
      internalHint:
        'Không cần hóa đơn hay nhà cung cấp. Mỗi khoản gán đúng một trung tâm chi phí; muốn chia thì ghi nhiều khoản — không áp tỷ lệ phân bổ.',
      internalRequired: 'Nhập mô tả, số tiền lớn hơn 0 và chọn một trung tâm chi phí.',
      internalTitle: 'Chi phí phần mềm nội bộ',
      invoiceOutlook: 'Hóa đơn',
      invoiced: 'Đã có hóa đơn',
      matchedInvoices: 'Hóa đơn đã khớp',
      moreExpected: 'Còn chờ hóa đơn',
      noInvoice: 'Không còn hóa đơn',
      noMoreInvoices: 'Hết hóa đơn — lần cuối {{date}}',
      pickCostCenter: 'Chọn trung tâm chi phí',
      release: 'Giải phóng phần dư',
      releaseDisabled: 'Còn chờ hóa đơn — chưa giải phóng được',
      releaseReason: 'Lý do giải phóng phần dư {{code}} (bắt buộc)',
      releaseReasonRequired: 'Bắt buộc nhập lý do.',
      released: 'Đã giải phóng',
      remainders: 'Phần dư còn giữ',
      remaindersHint: 'Chỉ giải phóng phần dư khi không còn hóa đơn nào sẽ đến.',
      remaindersTitle: 'Khoản cam kết còn phần dư',
      subtitle: 'Bước 1 của đóng {{period}}: chuyển cam kết thành chi phí theo hóa đơn đã khớp và ghi chi phí nội bộ.',
      summaryLabel: 'Tóm tắt đóng kỳ',
      title: 'Đóng {{period}}',
      toAllocation: 'Phân bổ chi phí'
    },
    analysis: {
      allocationHint:
        'Gói dùng chung theo tỷ lệ bộ phận Tài chính khai (tổng 100%); giấy phép cá nhân theo phòng của người dùng, chia theo ngày khi điều chuyển; tài khoản dùng chung về phòng sở hữu hoặc toàn công ty.',
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
      l1Title: 'Chi phí đã cam kết theo hợp đồng',
      l1Total: 'Tổng quý tới',
      l2Deferred:
        'Dự báo theo mô hình thống kê chưa được hiện thực (cần tối thiểu 12 tháng dữ liệu và kiểm chứng lại).',
      l3Hint: 'Ba kịch bản từ giả định do bộ phận Tài chính nhập.',
      l3Note: 'Kịch bản = chi phí đã cam kết + phần phụ thuộc quyết định × 0,5 / 1 / 1,5.',
      l3Title: 'Kịch bản chi phí',
      openExceptions: '{{count}} ngoại lệ đang mở',
      personalSeats: 'Giấy phép cá nhân',
      priorAdjustment: 'Điều chỉnh kỳ trước ({{period}})',
      scenario: {
        base: 'Cơ sở',
        high: 'Cao',
        low: 'Thấp'
      },
      sharedAccounts: 'Tài khoản dùng chung',
      sharedByRatio: 'Gói dùng chung (theo tỷ lệ)',
      subtitle: 'Bước 2 của đóng {{period}}: xem phân bổ, so ngân sách với thực chi và dự báo.',
      title: 'Phân bổ và so sánh ngân sách {{period}}',
      toReport: 'Lập báo cáo kỳ',
      total: 'Tổng',
      unallocated: 'Chưa phân bổ',
      unallocatedNote:
        'Dòng Chưa phân bổ là dòng báo cáo, không phải trung tâm chi phí; không gán vào trung tâm chi phí nào cho tới khi Người duyệt chi quyết.',
      upcomingRenewals: 'Gia hạn sắp tới',
      assumption: {
        costPerHire: 'Chi phí công cụ / người (đồng)',
        newHires: 'Nhân sự mới',
        newProjects: 'Dự án mới (đồng)'
      }
    },
    report: {
      colNarrative: 'Diễn giải',
      colRole: 'Vai trò',
      colSavings: 'Tiết kiệm',
      colSpend: 'Tổng chi',
      draftWarning:
        'Bản nháp do AI soạn từ số liệu của hệ thống — không phải số liệu. Hãy xem và sửa trước khi dùng; mỗi con số đều truy được nguồn.',
      figuresLabel: 'Số liệu kỳ',
      generateDraft: 'Tạo bản nháp bằng AI',
      hidden: 'Không xem',
      immutable:
        'Báo cáo đã phát hành là bản lưu cố định — không phát hành lại; khoản đến muộn và sửa sai hiện ở báo cáo kỳ sau với nhãn điều chỉnh kỳ trước.',
      mode: {
        ai: 'Dùng bản nháp AI',
        manual: 'Tự viết'
      },
      modeHint: {
        ai: 'AI chỉ diễn giải, không tính tiền, không kết luận vi phạm.',
        manual: 'Dùng khi không cần AI, hoặc AI tắt/lỗi — quy trình vẫn chạy đủ.'
      },
      narrativeHint: 'Tùy chọn. Phần diễn giải chỉ có trong bản của bộ phận Tài chính và Người duyệt chi.',
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
        finance: 'Tài chính',
        itAdmin: 'Quản trị viên CNTT',
        manager: 'Trưởng phòng'
      },
      savingsImmediate: 'Tiết kiệm thực hiện ngay',
      savingsNextRenewal: 'Tiết kiệm tại kỳ gia hạn kế tiếp',
      savingsSeparate: 'Hai con số tách riêng, không cộng lại',
      subtitle: 'Bước 3 của đóng kỳ: tùy chọn bản nháp AI, rồi phát hành báo cáo theo phạm vi xem của từng vai trò.',
      title: 'Báo cáo {{period}}',
      totalSpend: 'Tổng chi (theo kỳ)',
      visibilityHint:
        'Trưởng phòng chỉ thấy thực chi và cam kết của phòng mình — không thấy ngân sách hay tổng của công ty.',
      visibilityTitle: 'Ai xem gì',
      visible: 'Được xem'
    }
  }
} as const
