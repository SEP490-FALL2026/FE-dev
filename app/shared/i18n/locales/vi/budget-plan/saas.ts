/** FIN-46: each SaaS linked to the company catalog, its cost-bearing Cost Center and the related budget. */
export const saas = {
  colAnnualCost: 'Chi phí năm',
  colBudget: 'Ngân sách liên quan',
  colCostCenter: 'Trung tâm chi phí chịu chi phí',
  colGroup: 'Nhóm chi phí',
  colSaas: 'SaaS',
  colSeats: 'Số suất',
  colStatus: 'Danh mục',
  empty: 'Không có SaaS nào khớp bộ lọc.',
  inCatalogCount: 'Có trong danh mục',
  inCatalogHint: 'Được công ty cho phép sử dụng',
  listHint: 'Ngân sách liên quan là số phân bổ năm {{year}} cho nhóm chi phí tại trung tâm chi phí chịu chi phí.',
  listTitle: 'SaaS, nơi chịu chi phí và ngân sách liên quan',
  needsReview: 'Cần Quản trị CNTT đánh giá trước khi mua.',
  newCount: 'SaaS mới cần đánh giá',
  newHint: 'Chi phí năm dự kiến {{amount}}',
  notAllocated: 'Nhóm này chưa được phân bổ',
  notAllowedCount: 'Không được phép',
  notAllowedHint: 'Cần chuyển sang công cụ trong danh mục',
  reviewNotice:
    'SaaS mới chưa có trong danh mục phải được Quản trị CNTT đánh giá trước khi mua. Yêu cầu mua liên quan được xử lý ở màn hình ngoại lệ ngân sách.',
  shareOf: 'Chiếm {{percent}} phân bổ nhóm',
  status: {
    IN_CATALOG: 'Trong danh mục',
    NEW_UNDER_REVIEW: 'Mới, cần đánh giá',
    NOT_ALLOWED: 'Không được phép'
  },
  subtitle:
    'Liên kết từng SaaS với danh mục được công ty cho phép, trung tâm chi phí chịu chi phí và ngân sách liên quan.',
  summaryLabel: 'Tóm tắt danh mục SaaS',
  title: 'Phần mềm và chi phí',
  toExceptions: 'Xem ngoại lệ ngân sách'
} as const
