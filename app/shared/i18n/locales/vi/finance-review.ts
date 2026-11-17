import type { financeReview as en } from '../en/finance-review'

type Shape<T> = { -readonly [K in keyof T]: T[K] extends string ? string : Shape<T[K]> }

export const financeReview: Shape<typeof en> = {
  year: 'Năm',
  month: 'Tháng',
  monthName: 'Tháng {{month}}',
  state: 'Trạng thái',
  reason: 'Lý do',
  note: 'Ghi chú',
  amount: 'Số tiền',
  none: 'Không có',
  back: 'Về danh sách',
  allStates: 'Mọi trạng thái',
  allCostCenters: 'Mọi trung tâm chi phí',
  costCenter: 'Trung tâm chi phí',
  noCostCenter: 'Chưa phân bổ trung tâm chi phí',
  yearInvalid: 'Nhập năm từ 2000 đến 2100.',
  periods: {
    title: 'Rà soát ngân sách',
    description:
      'Chốt tháng đã kết thúc, đọc số liệu từng trung tâm chi phí (chấm màu đánh dấu những trung tâm chi phí cần để mắt) và ký kỳ.',
    close: 'Chốt tháng',
    closeTitle: 'Chốt tháng',
    closeHint:
      'Chỉ chốt được tháng đã kết thúc, và mỗi tháng chốt một lần. Chốt sẽ tính lại suất-tháng rồi chụp số liệu mọi trung tâm chi phí có ngân sách. Tháng 3, 6, 9 mở rà soát quý.',
    closeSubmit: 'Chốt tháng',
    monthNotEnded: 'Tháng này chưa kết thúc. Chốt được từ ngày 1 của tháng sau.',
    period: 'Kỳ',
    periodLabel: '{{month}}/{{year}}',
    kind: { MONTH: 'Tháng', QUARTER: 'Quý' },
    state: {
      SNAPSHOT: 'Đã chụp số liệu',
      AWAITING_EXPLANATIONS: 'Chờ giải trình',
      SIGNED: 'Đã ký'
    },
    closedBy: 'Người chốt',
    closedByAt: '{{name}} · {{date}}',
    signedBy: 'Người ký',
    notSigned: 'Chưa ký',
    dueOn: 'Hạn giải trình',
    spent: 'Thực chi công ty',
    detailTitle: 'Rà soát {{month}}/{{year}}',
    sign: 'Ký kỳ',
    signTitle: 'Ký kỳ rà soát',
    signHintMonth: 'Ký là xác nhận số liệu đã chụp. Sau khi ký, kỳ không đổi nữa.',
    signHintQuarter:
      'Ký là xác nhận số liệu đã chụp. Ký được cả khi trưởng phòng chưa trả lời: các dòng đó ghi là "chưa giải trình khi Tài chính ký". Sau khi ký, kỳ không đổi nữa.',
    signSubmit: 'Ký',
    signNote: 'Ghi chú khi ký',
    signed: 'Đã ký bởi {{name}} lúc {{date}}',
    unexplainedWarning: '{{count}} trung tâm chi phí còn chờ giải trình. Ký sẽ ghi các dòng đó là chưa giải trình.',
    unexplainedWarningMore:
      'Ít nhất {{count}} trung tâm chi phí còn chờ giải trình (còn dòng ở các trang sau). Ký sẽ ghi các dòng đó là chưa giải trình.',
    sharedPoolUnallocated: 'Chưa phân bổ — kho dùng chung',
    sharedPoolReserve: 'Dự phòng kho dùng chung',
    overReserve: 'Dòng kho dùng chung vượt dự phòng.',
    annualCeiling: 'Trần năm',
    lines: 'Trung tâm chi phí',
    noLines: 'Kỳ này không có dòng nào.',
    changedBanner:
      'Có hóa đơn tới sau khi chụp. Số bên dưới là số lúc chốt; mục "Thay đổi sau ảnh chụp" cho thấy phần đã nhích từ đó.',
    awaitingBanner:
      'Trưởng phòng giải trình các dòng vàng, đỏ và dưới mức trước {{date}}. Trả lời muộn vẫn được nhận cho tới khi bạn ký.',
    lightLabel: 'Đèn {{name}}: {{meaning}}',
    lightNames: { GREEN: 'xanh', YELLOW: 'vàng', RED: 'đỏ', UNDER: 'dưới mức' },
    lightMeanings: {
      GREEN: 'không thuộc các trường hợp còn lại',
      YELLOW: 'dự kiến cuối năm vượt cơ sở, hoặc tốc độ chi vượt 110 % lịch',
      RED: 'dự kiến cuối năm vượt cơ sở cộng dự phòng',
      UNDER: 'từ tháng 6, dự kiến cuối năm dưới 70 % cơ sở'
    },
    base: 'Cơ sở hiệu lực',
    reserve: 'Dự phòng',
    spentCol: 'Thực chi lũy kế',
    spentAfterMonth: 'Đã ghi cho các tháng sau',
    committed: 'Cam kết còn giữ',
    pendingSpend: 'Chờ duyệt chi',
    remaining: 'Còn lại',
    forecast: 'Dự kiến cuối năm',
    pace: 'Tốc độ chi',
    paceValue: '{{percent}} % lịch',
    priceIncrease: 'Tăng giá đã biết',
    variance: 'Chi phí thực so với giá cam kết',
    changedAfterSnapshot: 'Thay đổi sau ảnh chụp',
    explanation: 'Giải trình của trưởng phòng',
    cause: 'Nguyên nhân',
    persistenceLabel: 'Kéo dài bao lâu',
    persistence: { ONE_OFF: 'Một lần', ONGOING: 'Kéo dài' },
    action: 'Hành động',
    knownNeeds: 'Nhu cầu đã biết tới cuối năm',
    explainedBy: 'Ghi bởi {{name}} lúc {{date}}',
    waitingHead: 'Đang chờ trưởng phòng giải trình.',
    noHeadNote: 'Phòng chưa có trưởng phòng lúc mở quý: không ai bị hỏi và không chặn ký.',
    unexplainedNote: 'Tài chính đã ký khi trưởng phòng chưa trả lời.',
    explanationStatus: {
      NOT_REQUIRED: 'Không cần giải trình',
      PENDING: 'Chờ giải trình',
      EXPLAINED: 'Đã giải trình',
      UNEXPLAINED: 'Chưa giải trình khi Tài chính ký',
      NO_HEAD: 'Phòng chưa có trưởng phòng'
    }
  },
  seats: {
    title: 'Chi phí theo suất',
    description:
      'Suất-tháng của một tháng đã kết thúc, mỗi dòng là một suất và một phòng người giữ, cùng dòng kho dùng chung của từng thuê bao.',
    chooseMonth: 'Chọn năm và tháng để xem suất-tháng.',
    empty: 'Tháng này chưa có suất-tháng: tháng chưa kết thúc hoặc hệ thống chưa tính.',
    subscription: 'Thuê bao',
    allSubscriptions: 'Mọi thuê bao',
    employee: 'Người giữ',
    department: 'Phòng',
    days: 'Số ngày giữ',
    monthlyPrice: 'Giá một tháng',
    appliedToCommitment: 'Đã trừ vào cam kết',
    poolTitle: 'Dòng kho dùng chung',
    poolHint:
      'Đã trả = đã phân cho các phòng + chưa phân bổ. Phần rơi vào phòng chưa có trung tâm chi phí đã nằm trong "Đã phân cho các phòng".',
    paid: 'Đã trả',
    paidUnknown: 'Chưa biết số suất hoặc giá',
    invoiced: 'Hóa đơn',
    allocated: 'Đã phân cho các phòng',
    unallocated: 'Chưa phân bổ — kho dùng chung',
    withoutCostCenter: 'Trong đó chưa có trung tâm chi phí'
  },
  adjustments: {
    title: 'Điều chỉnh ngân sách',
    description:
      'Đề nghị Người duyệt chi bổ sung, chuyển, trả lại hoặc giảm ngân sách trong năm. Chỉ lập được khi kỳ lập ngân sách của năm đã khóa.',
    create: 'Lập điều chỉnh',
    createTitle: 'Lập điều chỉnh ngân sách',
    createSubmit: 'Gửi để quyết',
    kind: 'Loại',
    kinds: {
      SUPPLEMENT: 'Bổ sung',
      TRANSFER: 'Chuyển',
      RETURN: 'Trả lại',
      CEILING_REDUCTION: 'Giảm Trần năm'
    },
    kindHints: {
      SUPPLEMENT: 'Thêm ngân sách cho một trung tâm chi phí, lấy từ phần Trần chưa ai nhận.',
      TRANSFER: 'Chuyển ngân sách từ trung tâm chi phí này sang trung tâm chi phí khác.',
      RETURN: 'Trả ngân sách từ một trung tâm chi phí về phần chưa ai nhận.',
      CEILING_REDUCTION: 'Lãnh đạo lấy tiền: Trần năm giảm. Không chọn trung tâm chi phí.'
    },
    transferReasons: { COST_CENTER_CHANGE: 'Phòng đổi trung tâm chi phí giữa năm' },
    from: 'Từ trung tâm chi phí',
    to: 'Đến trung tâm chi phí',
    transferReason: 'Phòng đã đổi trung tâm chi phí giữa năm',
    amountInvalid: 'Nhập số tiền lớn hơn 0.',
    unallocatedHint: 'Phần chưa phân bổ của năm {{year}}: {{amount}}',
    sameCostCenter: 'Chọn hai trung tâm chi phí khác nhau.',
    createdAt: 'Lập',
    createdBy: '{{name}} · {{date}}',
    decision: 'Quyết định',
    decisionReason: 'Lý do quyết định',
    decidedBy: 'Quyết bởi {{name}} lúc {{date}}',
    pending: 'Chờ Người duyệt chi',
    createdVersion: 'Đã tạo phiên bản ngân sách do điều chỉnh cho trung tâm chi phí nhận.',
    states: { PENDING: 'Chờ quyết', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' },
    cycleNotLocked: 'Lập được điều chỉnh khi kỳ ngân sách đã khóa, tức từ ngày sau hạn nộp.',
    cycleNotLockedOn: 'Lập được điều chỉnh từ ngày sau hạn nộp ({{date}}).'
  },
  parameters: {
    items: {
      BUDGET_RESERVE_DEFAULT_PERCENT: {
        label: 'Tỷ lệ dự phòng mặc định của ngân sách năm',
        description:
          'Tỷ lệ phần trăm của ngân sách cơ sở mà một phiên bản mới giữ làm dự phòng khi Tài chính không nhập số riêng.'
      },
      BUDGET_ZBB_KPI3_BELOW_PERCENT: {
        label: 'Ngưỡng sử dụng thấp cần giải trình',
        description:
          'Dòng ngân sách của một đề nghị cần giải trình rút gọn khi mức sử dụng của phần mềm đang chạy đã biết và thấp hơn tỷ lệ này.'
      },
      BUDGET_ZBB_PRICE_INCREASE_PERCENT: {
        label: 'Ngưỡng tăng đơn giá cần giải trình',
        description:
          'Dòng ngân sách của một đề nghị cần giải trình rút gọn khi đơn giá cao hơn giá tháng hiện tại quá tỷ lệ này.'
      }
    },
    title: 'Tham số ngân sách',
    description: 'Giá trị mặc định của ngân sách. Giá trị mới chỉ áp dụng cho việc tạo từ nay.',
    value: 'Giá trị',
    default: 'Mặc định',
    changedAt: 'Đổi lúc',
    edit: 'Đổi',
    editTitle: 'Đổi {{label}}',
    save: 'Lưu giá trị',
    history: 'Lịch sử',
    historyEmpty: 'Chưa đổi lần nào.',
    historyMore: 'Còn các giá trị cũ hơn chưa hiển thị.',
    range: 'Từ {{min}} đến {{max}}',
    rangeInvalid: 'Nhập số nguyên từ {{min}} đến {{max}}.',
    isDefault: 'Mặc định',
    until: 'đến {{date}}',
    current: 'hiện tại',
    empty: 'Chưa có tham số ngân sách nào.'
  }
}
