/** Filter panels of the Finance spend-control lists (FIN-05, FIN-20, FIN-44, FIN-07). */
export const filtersSpend = {
  allCostCenters: 'Tất cả trung tâm chi phí',
  costCenter: 'Trung tâm chi phí',
  status: 'Trạng thái',
  questions: {
    search: 'Tìm kiếm yêu cầu ngân sách',
    searchPlaceholder: 'Tìm theo mã yêu cầu, phần mềm, người yêu cầu, người hỏi hoặc nội dung câu hỏi',
    opinion: 'Ý kiến ngân sách'
  },
  commitments: {
    search: 'Tìm kiếm cam kết chi',
    searchPlaceholder: 'Tìm theo mã cam kết, mã yêu cầu, phần mềm hoặc người duyệt',
    budget: 'Ngân sách',
    due: 'Hạn ghi nhận',
    dueState: {
      onTime: 'Còn hạn',
      overdue: 'Quá hạn'
    },
    empty: 'Không có cam kết nào khớp bộ lọc.'
  },
  budgetExceptions: {
    search: 'Tìm kiếm ngoại lệ ngân sách',
    searchPlaceholder: 'Tìm theo mã yêu cầu, phần mềm, Manager hoặc mô tả ngoại lệ',
    kind: 'Loại ngoại lệ',
    action: 'Phương án xử lý',
    listTitle: 'Danh sách ngoại lệ',
    listHint: '{{shown}} mục đang hiển thị · {{open}} đang mở · {{resolved}} đã xử lý'
  },
  chargeExceptions: {
    search: 'Tìm kiếm ngoại lệ khoản chi',
    searchPlaceholder: 'Tìm theo mã, nhà cung cấp, 4 số cuối thẻ hoặc ghi chú CNTT',
    reason: 'Lý do'
  }
} as const
