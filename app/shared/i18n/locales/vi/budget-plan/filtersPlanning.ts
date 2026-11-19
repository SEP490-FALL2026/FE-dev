/** Filter bars of the planning and close lists (FIN-40, FIN-41, FIN-42, FIN-30). */
export const filtersPlanning = {
  allDepartments: 'Tất cả phòng ban',
  budgetStatus: 'Trạng thái ngân sách',
  department: 'Phòng ban',
  negotiation: {
    difference: 'Chênh lệch',
    differenceOption: {
      CUT: 'Finance cắt giảm',
      KEPT: 'Giữ nguyên'
    },
    search: 'Tìm kiếm hồ sơ thương lượng',
    searchPlaceholder: 'Tìm theo phòng ban, trung tâm chi phí hoặc Manager'
  },
  periodClose: {
    empty: 'Không có trung tâm chi phí nào khớp bộ lọc.',
    remainder: 'Phần dư',
    remainderOption: {
      HELD: 'Còn phần dư đang giữ',
      NONE: 'Không có'
    },
    search: 'Tìm kiếm trung tâm chi phí đóng kỳ',
    searchPlaceholder: 'Tìm theo mã hoặc tên trung tâm chi phí',
    status: 'Trạng thái chốt'
  },
  proposals: {
    allYears: 'Tất cả các năm',
    search: 'Tìm kiếm đề xuất ngân sách',
    searchPlaceholder: 'Tìm theo phòng ban, trung tâm chi phí, Manager hoặc phần mềm',
    year: 'Năm ngân sách'
  },
  stage: 'Giai đoạn',
  summary: {
    empty: 'Không có phòng ban nào khớp bộ lọc.',
    footerVisible: 'Tổng các dòng đang hiển thị',
    readiness: 'Sẵn sàng gửi',
    readinessOption: {
      NOT_READY: 'Chưa sẵn sàng',
      READY: 'Sẵn sàng gửi'
    },
    search: 'Tìm kiếm phòng ban trong tổng hợp',
    searchPlaceholder: 'Tìm theo phòng ban hoặc trung tâm chi phí'
  }
} as const
