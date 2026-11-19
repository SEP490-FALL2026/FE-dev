/** FIN-08: automatic budget check before a request reaches the Spending Approver. */
export const check = {
  title: 'Kiểm tra ngân sách trước khi gửi duyệt chi',
  subtitle: 'Kết quả kiểm tra tự động cho từng yêu cầu mua SaaS trước khi chuyển Người duyệt chi.',
  ruleNotice:
    'Hệ thống tự kiểm tra ngân sách khi Manager gửi yêu cầu. Yêu cầu đủ ngân sách được chuyển thẳng Người duyệt chi, Tài chính không cần duyệt lại. Chỉ yêu cầu thiếu ngân sách, SaaS ngoài danh mục hoặc trung tâm chi phí hết hiệu lực mới trở thành ngoại lệ để Tài chính xử lý.',
  summaryLabel: 'Tóm tắt kiểm tra ngân sách',
  checked: 'Yêu cầu đã kiểm tra',
  checkedHint: 'Kiểm tra tự động khi Manager gửi',
  passed: 'Đủ ngân sách, đã tự chuyển',
  passedHint: 'Chuyển Người duyệt chi, không cần Tài chính duyệt',
  exceptions: 'Ngoại lệ đang mở',
  exceptionsHint: '{{count}} yêu cầu không đạt kiểm tra',
  forwardedAmount: 'Tổng tiền đã tự chuyển',
  forwardedAmountHint: 'Tổng giá trị yêu cầu đủ ngân sách',
  filters: {
    allCostCenters: 'Tất cả trung tâm chi phí',
    allYears: 'Tất cả các năm',
    costCenter: 'Trung tâm chi phí / Phòng ban',
    exceptionKind: 'Loại ngoại lệ',
    nextStep: 'Bước tiếp theo',
    search: 'Tìm kiếm yêu cầu',
    searchPlaceholder: 'Tìm theo mã yêu cầu, phần mềm hoặc người yêu cầu',
    step: {
      FORWARDED: 'Đã chuyển Người duyệt chi',
      NEEDS_HANDLING: 'Cần xử lý ngoại lệ',
      RESOLVED: 'Đã xử lý xong'
    },
    year: 'Năm ngân sách'
  },
  result: {
    CC_EXPIRED: 'Trung tâm chi phí hết hiệu lực',
    INSUFFICIENT: 'Thiếu ngân sách',
    OUT_OF_CATALOG: 'SaaS ngoài danh mục',
    PASSED: 'Đủ ngân sách'
  },
  colRequest: 'Yêu cầu',
  colRequester: 'Người yêu cầu',
  colAmount: 'Số tiền',
  colRemainingBefore: 'Còn lại trước yêu cầu',
  colResult: 'Kết quả',
  colCheckedAt: 'Thời điểm kiểm tra',
  colNext: 'Bước tiếp theo',
  forwarded: 'Đã chuyển Người duyệt chi',
  handle: 'Xử lý ngoại lệ',
  handleFor: 'Xử lý ngoại lệ {{code}}',
  viewResolution: 'Xem kết quả xử lý',
  viewResolutionFor: 'Xem kết quả xử lý ngoại lệ {{code}}',
  empty: 'Không có yêu cầu nào khớp bộ lọc.'
} as const
