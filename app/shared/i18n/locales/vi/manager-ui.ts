/** Presentation copy of the redesigned Manager screens (pickers, placeholders, section titles). */
export const managerUi = {
  currency: 'VND',
  amountFormat: 'Nhập số tiền VND nguyên, không âm, tối đa 16 chữ số.',
  loadFailed: 'Không tải được danh sách. Đóng rồi mở lại để thử lại.',
  statePlaceholder: 'Chọn trạng thái (gõ để tìm)',
  create: {
    softwareStep: '1. Phần mềm và gói',
    peopleStep: '2. Người thụ hưởng',
    reasonStep: '3. Lý do nghiệp vụ'
  },
  placeholders: {
    application: 'Chọn phần mềm trong danh mục (gõ tên hoặc nhà cung cấp để tìm)',
    kind: 'Lọc theo loại phần mềm (gõ để tìm)',
    plan: 'Chọn gói của phần mềm đã chọn (gõ tên gói để tìm)',
    planFirst: 'Chọn phần mềm trước, sau đó chọn gói',
    people: 'Thêm nhân viên trong phòng (gõ tên hoặc email để tìm, tối đa {{count}} người)',
    peopleFull: 'Đã đủ {{count}} người thụ hưởng',
    requestType: 'Chọn loại yêu cầu (gõ để tìm)',
    noticeEmployee: 'Chọn nhân viên trong phòng (gõ tên hoặc mã nhân viên để tìm)',
    noticeKind: 'Chọn loại biến động (gõ để tìm)',
    noticeNote: 'Ví dụ: Nhân viên đã nộp đơn nghỉ việc, ngày làm việc cuối là thứ Sáu',
    date: 'Chọn ngày, ví dụ 30/11/2026',
    month: 'Chọn tháng cần xem (gõ số tháng để tìm)',
    state: 'Chọn trạng thái điều chỉnh (gõ để tìm)',
    persistence: 'Chọn tính chất của khoản chênh lệch (gõ để tìm)',
    cause: 'Ví dụ: Tuyển thêm 3 nhân viên thiết kế nên tăng số suất Figma từ tháng 7',
    action: 'Ví dụ: Thu hồi 2 suất không dùng trong quý tới để bù phần vượt',
    knownAmount: 'Ví dụ: 12.000.000',
    knownNote: 'Ví dụ: Gia hạn Adobe vào tháng 11 cho nhóm truyền thông',
    year: 'Nhập năm, ví dụ 2027',
    costCenterAuto: 'Lấy theo phòng bạn phụ trách',
    requestedAmount: 'Chưa thuế, ví dụ 250.000.000',
    budgetNote: 'Ví dụ: Tăng ngân sách do mở rộng nhóm sản phẩm thêm 5 người',
    businessReason: 'Ví dụ: Nhóm thiết kế cần Figma cho dự án ứng dụng khách hàng trong quý I',
    personalReason: 'Ví dụ: Cần Miro để điều phối các buổi họp lập kế hoạch của phòng',
    proposalReason: 'Ví dụ: Cả phòng dùng Notion để quản lý tài liệu dự án',
    ghostReason: 'Ví dụ: Nhân viên đã chuyển sang dùng công cụ khác từ tháng trước',
    renewalReason: 'Ví dụ: Đồng ý giảm ghế vì nhóm đã chuyển một số người sang dự án khác',
    returnReason: 'Ví dụ: Nhân viên không còn dùng phần mềm này sau khi kết thúc dự án',
    reserveReason: 'Ví dụ: Khoản này cần cho dự án khách hàng mới, đã thống nhất với Finance',
    withdrawReason: 'Ví dụ: Nhân viên đã chuyển dự án nên không còn cần phần mềm này'
  }
} as const
