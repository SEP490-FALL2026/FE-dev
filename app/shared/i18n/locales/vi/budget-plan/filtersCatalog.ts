/** Filter panels of the Finance catalog screens: FIN-47 decision history, FIN-46 software & cost, FIN-35 optimization. */
export const filtersCatalog = {
  history: {
    allCostCenters: 'Tất cả trung tâm chi phí',
    allKinds: 'Tất cả loại quyết định',
    allOutcomes: 'Tất cả kết quả',
    allYears: 'Tất cả các năm',
    costCenter: 'Trung tâm chi phí',
    kind: 'Loại quyết định',
    outcome: 'Kết quả',
    outcomeValue: {
      ADJUSTMENT_REQUESTED: 'Yêu cầu điều chỉnh',
      APPROVED: 'Đã duyệt',
      REJECTED: 'Từ chối'
    },
    search: 'Tìm kiếm quyết định',
    searchPlaceholder: 'Tìm theo ghi chú, người thực hiện hoặc trung tâm chi phí',
    year: 'Năm tài chính'
  },
  optimization: {
    allCostCenters: 'Tất cả trung tâm chi phí',
    allKinds: 'Tất cả loại tối ưu',
    allStatuses: 'Tất cả trạng thái',
    allTimings: 'Tất cả thời điểm',
    costCenter: 'Trung tâm chi phí',
    kind: 'Loại tối ưu',
    search: 'Tìm kiếm đề xuất tối ưu',
    searchPlaceholder: 'Tìm theo mã đề xuất, ứng dụng hoặc nhà cung cấp',
    status: 'Trạng thái',
    timing: 'Thời điểm áp dụng',
    timingValue: {
      IMMEDIATE: 'Áp dụng ngay',
      NEXT_RENEWAL: 'Tại kỳ gia hạn'
    }
  },
  saas: {
    allBudgets: 'Tất cả',
    allCostCenters: 'Tất cả trung tâm chi phí',
    allGroups: 'Tất cả nhóm phần mềm',
    allStatuses: 'Tất cả trạng thái',
    budget: 'Ngân sách nhóm',
    budgetValue: {
      OVER: 'Vượt mức phân bổ',
      UNALLOCATED: 'Nhóm chưa phân bổ',
      WITHIN: 'Trong mức phân bổ'
    },
    costCenter: 'Trung tâm chi phí',
    group: 'Nhóm phần mềm',
    search: 'Tìm kiếm phần mềm',
    searchPlaceholder: 'Tìm theo tên phần mềm hoặc nhà cung cấp',
    status: 'Trạng thái danh mục'
  }
} as const
