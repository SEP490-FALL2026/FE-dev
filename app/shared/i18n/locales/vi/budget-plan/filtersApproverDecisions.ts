/** Filter panels of the Spending Approver decision screens: APV-05 annual budget, APV-07 exceptions, APV-06 history. */
export const filtersApproverDecisions = {
  annual: {
    allDepartments: 'Tất cả phòng ban',
    allStages: 'Tất cả giai đoạn',
    allYears: 'Tất cả các năm',
    department: 'Phòng ban',
    empty: 'Không có hồ sơ ngân sách nào khớp bộ lọc.',
    search: 'Tìm kiếm hồ sơ ngân sách',
    searchPlaceholder: 'Tìm theo phòng ban, trung tâm chi phí hoặc manager',
    stage: 'Giai đoạn',
    year: 'Năm ngân sách'
  },
  exceptions: {
    allCostCenters: 'Tất cả trung tâm chi phí',
    allDirections: 'Tất cả hướng điều chỉnh',
    allKinds: 'Tất cả loại ngoại lệ',
    allOptions: 'Tất cả phương án',
    allStatuses: 'Tất cả trạng thái',
    costCenter: 'Trung tâm chi phí',
    direction: 'Hướng điều chỉnh',
    directionValue: {
      decrease: 'Giảm',
      increase: 'Tăng'
    },
    kind: 'Loại ngoại lệ',
    option: 'Phương án của Tài chính',
    search: 'Tìm kiếm hồ sơ ngoại lệ',
    searchPlaceholder: 'Tìm theo mã hồ sơ, phần mềm, trung tâm chi phí, lý do hoặc ghi chú',
    status: 'Trạng thái'
  },
  history: {
    allCostCenters: 'Tất cả trung tâm chi phí',
    allGroups: 'Tất cả nhóm quyết định',
    allOutcomes: 'Tất cả kết quả',
    allYears: 'Tất cả các năm',
    costCenter: 'Trung tâm chi phí',
    group: 'Nhóm quyết định',
    outcome: 'Kết quả',
    search: 'Tìm kiếm trong nhật ký quyết định',
    searchPlaceholder: 'Tìm theo ghi chú, trung tâm chi phí hoặc người duyệt',
    year: 'Năm tài chính'
  }
} as const
