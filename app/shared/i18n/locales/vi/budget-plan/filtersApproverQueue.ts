/** Filter panels of the Spending Approver lists: the queue (APV-01) and optimization proposals (APV-04). */
export const filtersApproverQueue = {
  costCenter: 'Trung tâm chi phí',
  allCostCenters: 'Tất cả trung tâm chi phí',
  queue: {
    search: 'Tìm kiếm hồ sơ chờ duyệt',
    searchPlaceholder: 'Tìm theo mã hồ sơ, phần mềm, người yêu cầu hoặc phòng ban',
    kind: 'Loại việc',
    check: 'Kết quả kiểm tra ngân sách',
    sla: 'Hạn xử lý',
    slaState: {
      overdue: 'Quá hạn',
      soon: 'Sắp đến hạn (≤ 8 giờ)',
      onTime: 'Còn hạn'
    }
  },
  annual: {
    search: 'Tìm kiếm hồ sơ ngân sách năm',
    searchPlaceholder: 'Tìm theo phòng ban hoặc trung tâm chi phí',
    department: 'Phòng ban',
    allDepartments: 'Tất cả phòng ban',
    empty: 'Không có hồ sơ ngân sách năm nào khớp bộ lọc.'
  },
  optimization: {
    search: 'Tìm kiếm đề xuất tối ưu',
    searchPlaceholder: 'Tìm theo mã đề xuất, ứng dụng hoặc nhà cung cấp',
    status: 'Trạng thái',
    kind: 'Loại tối ưu'
  }
} as const
