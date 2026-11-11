export const employeeRequestUx = {
  newAccess: 'Yêu cầu cấp quyền mới',
  existingAccess: 'Quyền đang sử dụng',
  guide: 'Hướng dẫn gửi yêu cầu',
  modes: {
    individual: 'Chọn phần mềm và gói cho bạn, kiểm tra điều kiện trước khi gửi.',
    group: 'Chọn gói và thành viên cùng phòng. Hệ thống sẽ chỉ ra người cần bổ sung thông tin.',
    proposal: 'Đề xuất phần mềm chưa có trong danh mục để IT thẩm định.',
    renewal: 'Chọn quyền cần dùng tiếp. Yêu cầu vẫn cần được phê duyệt trước khi gia hạn.',
    return: 'Chọn quyền không còn cần dùng. IT sẽ xử lý thu hồi sau khi bạn gửi yêu cầu.'
  },
  chooseFromSoftware: 'Chọn từ Công cụ của tôi',
  memberProblems: 'Thành viên cần kiểm tra',
  selectedAccess: 'Quyền đang chọn',
  currentEnd: 'Ngày kết thúc hiện tại',
  renewalOpens: 'Được gửi gia hạn từ {{date}}',
  renewalRange: 'Ngày kết thúc mới phải sau {{previous}} và không quá {{max}}.',
  renewalWindow: 'Chưa tới kỳ gửi gia hạn. Xem ngày được phép gửi tại quyền đang chọn.',
  renewalDate: 'Ngày kết thúc gia hạn vượt giới hạn. Kiểm tra thời hạn tại quyền đang chọn.',
  groupRefused: 'Một số thành viên chưa đủ điều kiện. Kiểm tra thông tin tại từng người.',
  tooMany: 'Yêu cầu này chỉ nhận tối đa {{count}} người.',
  tooFew: 'Cần ít nhất {{count}} người khác nhau.',
  groupDate: 'Ngày kết thúc phải nằm trong giới hạn đến {{date}}.'
} as const
