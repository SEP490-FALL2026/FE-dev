/** Presentation copy of the redesigned Employee screens (pickers, placeholders, section titles). */
export const employeeUi = {
  select: {
    empty: 'Không có lựa chọn phù hợp'
  },
  placeholders: {
    workPhone: 'Ví dụ: 0901 234 567',
    requestView: 'Chọn tình trạng xử lý (gõ để tìm)',
    requestState: 'Chọn trạng thái yêu cầu (gõ để tìm)',
    requestType: 'Chọn loại yêu cầu (gõ để tìm)',
    rightsView: 'Chọn thời hạn quyền sử dụng (gõ để tìm)',
    application: 'Chọn phần mềm trong danh mục (gõ tên hoặc nhà cung cấp để tìm)',
    departmentApplication: 'Chọn phần mềm của phòng bạn (gõ tên để tìm)',
    kind: 'Lọc theo loại phần mềm (gõ để tìm)',
    plan: 'Chọn gói của phần mềm đã chọn (gõ tên gói để tìm)',
    planFirst: 'Chọn phần mềm trước, sau đó chọn gói',
    members: 'Thêm đồng nghiệp cùng phòng (gõ tên hoặc email để tìm)',
    membersFull: 'Đã đủ 10 người thụ hưởng',
    assignment: 'Chọn quyền đang được cấp (gõ tên phần mềm hoặc gói để tìm)',
    issueAssignment: 'Chọn phần mềm đang gặp lỗi (gõ tên để tìm)',
    issueCategory: 'Chọn loại lỗi (gõ để tìm)',
    issueImpact: 'Chọn mức ảnh hưởng (gõ để tìm)',
    issueDescription: 'Ví dụ: Từ 9 giờ sáng không đăng nhập được, màn hình báo hết hạn bản quyền dù quyền vẫn còn hạn',
    businessReason: 'Ví dụ: Cần Figma để thiết kế giao diện cho dự án khách hàng trong quý này',
    extensionMonths: 'Nhập số tháng gia hạn, ví dụ 3',
    termMonths: 'Nhập số tháng sử dụng, ví dụ 6',
    softwareName: 'Ví dụ: Notion',
    homepage: 'Ví dụ: https://www.notion.so',
    expectedUsers: 'Nhập số người dùng dự kiến, ví dụ 5',
    plannedPlanName: 'Ví dụ: Gói Business cho nhóm thiết kế',
    purpose: 'Ví dụ: Quản lý tài liệu dự án và ghi chú họp của nhóm sản phẩm',
    dataDescription: 'Ví dụ: Tài liệu nội bộ, không chứa dữ liệu cá nhân của khách hàng',
    withdrawReason: 'Ví dụ: Dự án đã kết thúc nên không còn cần phần mềm này',
    policyVersion: 'Chọn phiên bản chính sách (gõ số để tìm)'
  },
  create: {
    softwareStep: 'Phần mềm và gói',
    softwareStepHint: 'Chọn phần mềm của phòng hoặc từ toàn bộ danh mục, sau đó chọn gói.',
    detailsStep: 'Thông tin yêu cầu',
    detailsStepHint: 'Nêu thời gian sử dụng và lý do để người duyệt xử lý nhanh hơn.',
    removeMember: 'Bỏ {{name}} khỏi danh sách',
    memberCount: '{{count}} / 10 người'
  },
  lists: {
    filters: 'Bộ lọc',
    issuesTitle: 'Phiếu báo lỗi của tôi',
    issuesTotal: '{{count}} phiếu',
    returnsHint: 'Theo dõi các yêu cầu hoàn trả quyền sử dụng bạn đã gửi.',
    expiryHint: 'Các quyền sắp hết hạn. Chọn một dòng để gửi yêu cầu gia hạn.',
    draftsHint: 'Bản nháp chưa được gửi đi. Gửi hoặc xóa khi không còn cần.'
  },
  profile: {
    identity: 'Thông tin nhân sự',
    contact: 'Ảnh đại diện và liên hệ'
  },
  privacy: {
    hint: 'Xem thông báo theo dõi máy công ty và dữ liệu được thu thập từ thiết bị của bạn.'
  },
  policies: {
    hint: 'Đọc các chính sách đang áp dụng và xác nhận những chính sách cần bạn đọc.'
  },
  issues: {
    hint: 'Báo lỗi với phần mềm đang được cấp cho bạn và theo dõi phản hồi của bộ phận hỗ trợ.',
    softwareStep: 'Phần mềm gặp lỗi',
    detailsStep: 'Mô tả sự cố'
  }
} as const
