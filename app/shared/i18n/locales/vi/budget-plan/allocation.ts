/** FIN-45: allocating the approved annual budget to departments, Cost Centers and SaaS cost groups. */
export const allocation = {
  adjustment: {
    current: 'Ngân sách đã duyệt hiện tại: {{amount}}',
    hint: 'Ngân sách đã duyệt không được sửa trực tiếp. Yêu cầu điều chỉnh cần lý do và quyết định của Người duyệt chi.',
    newTotal: 'Tổng ngân sách đề xuất',
    newTotalPlaceholder: 'Ví dụ: 150000000',
    newTotalRequired: 'Nhập tổng ngân sách mới, khác với số đã duyệt.',
    notice:
      'Yêu cầu được gửi cho Người duyệt chi và ghi vào lịch sử quyết định. Ngân sách đã duyệt giữ nguyên cho đến khi được phê duyệt.',
    reason: 'Lý do điều chỉnh',
    reasonRequired: 'Bắt buộc nhập lý do.',
    sent: 'Đã gửi yêu cầu điều chỉnh {{costCenter}} từ {{before}} thành {{after}} cho Người duyệt chi. Ngân sách đã duyệt giữ nguyên đến khi được phê duyệt.',
    submit: 'Gửi yêu cầu điều chỉnh',
    title: 'Yêu cầu điều chỉnh ngân sách · {{costCenter}}'
  },
  allocated: 'Đã phân bổ',
  amountFor: 'Số phân bổ cho nhóm {{group}}',
  approved: 'Ngân sách đã duyệt',
  colAllocated: 'Đã phân bổ',
  colApproved: 'Tổng đã duyệt',
  colBase: 'Ngân sách cơ sở',
  colBuffer: 'Dự phòng (buffer)',
  colCurrent: 'Đang phân bổ',
  colDepartment: 'Phòng ban',
  colGroup: 'Nhóm chi phí SaaS',
  colNew: 'Số phân bổ mới',
  colUnallocated: 'Chưa phân bổ',
  companyHint: 'Tổng ngân sách công ty {{amount}}. Số đã duyệt bị khóa; chỉ phần phân bổ bên dưới được chỉnh.',
  companyTitle: 'Ngân sách đã duyệt theo phòng ban',
  editorHint: 'Tổng phân bổ vào các nhóm không được vượt ngân sách đã duyệt của trung tâm chi phí.',
  editorTitle: 'Phân bổ theo nhóm chi phí SaaS · {{costCenter}}',
  filters: {
    allDepartments: 'Tất cả phòng ban',
    allocation: 'Trạng thái phân bổ',
    department: 'Phòng ban',
    empty: 'Không có phòng ban phù hợp bộ lọc.',
    notAllocatable:
      'Năm {{year}} ({{status}}) chưa có ngân sách đã duyệt theo phòng ban để phân bổ. Chọn năm đang hiệu lực để phân bổ.',
    state: {
      FULL: 'Đã phân bổ hết',
      NONE: 'Chưa phân bổ',
      PARTIAL: 'Còn chưa phân bổ'
    },
    status: 'Trạng thái ngân sách',
    year: 'Năm ngân sách'
  },
  invalidAmount: 'Nhập số tiền hợp lệ, từ 0 trở lên.',
  locked: 'Đã khóa',
  lockedLabel: 'Ngân sách đã duyệt, không chỉnh sửa trực tiếp',
  overApproved:
    'Không lưu được: tổng phân bổ {{allocated}} sẽ vượt ngân sách đã duyệt {{approved}}. Giảm nhóm khác hoặc gửi yêu cầu điều chỉnh.',
  pickCostCenter: 'Chọn trung tâm chi phí',
  requestAdjustment: 'Yêu cầu điều chỉnh ngân sách đã duyệt',
  saveFor: 'Lưu phân bổ nhóm {{group}}',
  saved: 'Đã lưu phân bổ nhóm {{group}}.',
  subtitle:
    'Chia ngân sách năm {{year}} đã được duyệt xuống từng phòng ban, trung tâm chi phí và nhóm chi phí SaaS. Muốn đổi số đã duyệt phải gửi yêu cầu điều chỉnh.',
  summaryLabel: 'Tổng hợp phân bổ {{costCenter}}',
  title: 'Phân bổ ngân sách đã duyệt',
  unallocated: 'Chưa phân bổ'
} as const
