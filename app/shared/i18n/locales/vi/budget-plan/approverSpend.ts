/** APV-01, APV-02 and the overview: budget checks on SaaS spend and annual budget files for the Spending Approver. */
export const approverSpend = {
  overview: {
    region: 'Việc chờ bạn quyết',
    spendPending: 'Khoản chi SaaS chờ duyệt',
    spendPendingHint: '{{count}} việc đã quá hạn xử lý',
    annualPending: 'Ngân sách năm chờ duyệt',
    annualPendingHint: 'Tài chính trình {{amount}}',
    exceptions: 'Ngoại lệ & điều chỉnh chờ quyết',
    exceptionsHint: '{{exceptions}} ngoại lệ · {{adjustments}} điều chỉnh ngân sách',
    deadline: 'Hạn báo hủy gần nhất',
    toReports: 'Xem báo cáo chi tiêu'
  },
  queue: {
    typeLabel: 'Loại hồ sơ',
    typeSpend: 'Khoản chi SaaS',
    typeAnnual: 'Ngân sách năm',
    checkLabel: 'Kết quả kiểm tra ngân sách',
    colCheck: 'Kiểm tra ngân sách',
    empty: 'Không có hồ sơ nào khớp bộ lọc.'
  },
  annual: {
    title: 'Hồ sơ ngân sách năm {{year}} chờ duyệt',
    hint: 'Ngân sách phòng ban Tài chính đã rà soát, thương lượng và gửi Người duyệt chi.',
    note: 'Ngân sách năm được quyết định trên màn hình Duyệt ngân sách năm, tách riêng khỏi các khoản chi SaaS trong năm.',
    colDepartment: 'Phòng ban',
    colVersion: 'Phiên bản',
    colFinance: 'Tài chính trình',
    colRequested: 'Manager đề xuất',
    colSentAt: 'Gửi lúc',
    version: 'Phiên bản {{version}}',
    open: 'Mở',
    openItem: 'Mở ngân sách năm {{department}}',
    empty: 'Không có hồ sơ ngân sách năm nào chờ duyệt.'
  },
  result: {
    CC_EXPIRED: 'Budget hết hiệu lực',
    INSUFFICIENT: 'Thiếu ngân sách',
    OUT_OF_CATALOG: 'Ngoài danh mục',
    PASSED: 'Trong ngân sách'
  },
  check: {
    title: 'Kết quả kiểm tra ngân sách',
    hint: 'Ngân sách năm {{year}} của {{costCenter}}',
    result: 'Kết quả',
    approved: 'Ngân sách năm được duyệt',
    used: 'Đã sử dụng',
    committed: 'Đã cam kết (đã duyệt, chưa thanh toán)',
    amount: 'Khoản chi này',
    before: 'Còn lại trước khoản chi',
    after: 'Còn lại sau khoản chi',
    rule: 'Còn lại = Ngân sách năm được duyệt − Đã sử dụng − Đã cam kết. Kết quả kiểm tra là căn cứ tham khảo; Người duyệt chi vẫn quyết định cuối cùng.'
  },
  noSnapshot: 'Trung tâm chi phí {{costCenter}} không còn ngân sách quý để đối chiếu.'
} as const
