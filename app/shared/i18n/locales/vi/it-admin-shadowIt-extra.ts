export const itAdminShadowItExtra = {
  kicker: 'Yêu cầu phần mềm bên ngoài',
  title: 'Yêu cầu phần mềm ngoài danh mục',
  intro:
    'Thẩm định các đề xuất phần mềm / công cụ AI mới do nhân viên gửi lên; đưa ra quyết định Chấp nhận hoặc Từ chối và phân tách người thụ hưởng.',
  search: 'Tìm phần mềm, người gửi...',
  empty: 'Không có đề xuất phần mềm bên ngoài nào thuộc nhóm này',
  requester: 'Người gửi:',
  submittedAt: '· Ngày gửi:',
  beneficiaries: 'người thụ hưởng',
  plan: 'Gói:',
  productPage: 'Trang sản phẩm',
  purpose: 'Mục đích đề xuất:',
  estimatedCost: 'Chi phí dự kiến:',
  term: 'Thời hạn đề xuất:',
  beneficiaryList: 'Danh sách người thụ hưởng (',
  peopleClose: 'người)',
  splitNotice:
    '* Khi Chấp nhận, hệ thống tách thành từng mục cấp phát độc lập cho mỗi người thụ hưởng, cùng mã đề nghị gốc.',
  nextSteps: 'Các bước tiếp theo sau khi Chấp nhận:',
  nextStepsHelp:
    'Yêu cầu đã được chấp nhận chủ trương. Để chuyển sang "Sẵn sàng cấp", IT Admin cần bổ sung gói vào danh mục phòng và nhập chứng từ mua:',
  addPlan: '1. Thêm gói vào danh mục',
  importPurchase: '2. Nhập chứng từ mua',
  rejectionReason: 'Lý do từ chối:',
  rejectedBy: 'Người từ chối:',
  atTime: '· Lúc:',
  reject: 'Từ chối đề xuất',
  approve: 'Chấp nhận đề xuất',
  decisionMade: 'Đề xuất này đã được ra quyết định (',
  approveKicker: 'Chấp nhận yêu cầu phần mềm bên ngoài',
  approveTitle: 'Xác nhận chấp nhận đề xuất',
  forDepartment: 'cho phòng',
  decisionNote: 'Ghi chú quyết định:',
  decisionNotePlaceholder: 'Nhập ghi chú hoặc yêu cầu mua sắm bổ sung...',
  cancel: 'Hủy',
  confirmApprove: 'Xác nhận Chấp nhận',
  rejectKicker: 'Từ chối yêu cầu phần mềm bên ngoài',
  rejectionHelp: 'Vui lòng nhập lý do từ chối. Người gửi (',
  rejectionHelpEnd: ') sẽ nhận được thông báo giải thích này:',
  rejectionPlaceholder:
    'Ví dụ: Công cụ không đạt chứng chỉ bảo mật dữ liệu doanh nghiệp; đã có phần mềm tương đương trong danh mục...',
  confirmReject: 'Xác nhận Từ chối',
  acceptedNote: 'Đã chấp nhận chủ trương. Chờ bổ sung danh mục & mua quyền.',
  approvedToast: 'Đã Chấp nhận đề xuất {{software}}! Chuyển trạng thái sang "Chờ cấu hình/mua".',
  rejectionRequired: 'Vui lòng nhập lý do từ chối (bắt buộc).',
  rejectedToast: 'Đã Từ chối đề xuất {{software}}. Người gửi sẽ nhận được thông báo kèm lý do.',
  pendingDecision: 'Chờ quyết định',
  pendingConfig: 'Chờ cấu hình/mua',
  accepted: 'Đã chấp nhận',
  rejected: 'Đã từ chối',
  ready: 'Sẵn sàng cấp',
  all: 'Tất cả',
  requestDetails: {
    'EXT-REQ-101': {
      purpose: 'Trang bị AI code editor dựa trên VS Code để tăng tốc độ phát triển dự án Golang & React',
      cost: '$20 / người / tháng',
      duration: '12 tháng (Thuê bao năm)'
    },
    'EXT-REQ-102': {
      purpose: 'Tạo hình ảnh minh họa concept cho chiến dịch truyền thông thương hiệu',
      cost: '$60 / tháng',
      duration: '3 tháng thử nghiệm'
    },
    'EXT-REQ-103': {
      purpose: 'Tìm kiếm nghiên cứu kỹ thuật và tổng hợp tài liệu chuyên sâu',
      cost: '$40 / tháng',
      duration: '12 tháng'
    },
    'EXT-REQ-104': {
      purpose: 'Tra cứu câu lệnh terminal và phân tích log hệ thống',
      cost: '$20 / tháng',
      duration: '6 tháng'
    }
  },
  priorDecisionNote:
    'Đã chấp nhận chủ trương. Cần bổ sung gói vào danh mục phòng (IT-11) và nhập hợp đồng mua (IT-06) trước khi cấp.',
  priorRejectionReason:
    'Không đạt tiêu chuẩn kiểm duyệt an ninh thông tin: Chính sách của Phind chưa có điều khoản cam kết không lưu trữ dữ liệu code doanh nghiệp.',
  staffEngineer: 'Kỹ sư Trưởng (Staff Engineer)',
  operationsEngineer: 'Kỹ sư Vận hành'
} as const
