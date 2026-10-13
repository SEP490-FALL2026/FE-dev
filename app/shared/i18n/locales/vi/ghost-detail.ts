export const ghostDetail = {
  title: 'Chi tiết bản quyền không hoạt động',
  documentTitle: 'Chi tiết bản quyền không hoạt động | SaaS-Sentry',
  subtitle: 'Xem xét bản quyền có dấu hiệu không sử dụng và xử lý dựa trên bằng chứng cùng bối cảnh công việc.',
  back: 'Quay lại rà soát bản quyền không hoạt động',
  summary: 'Tóm tắt ứng dụng và nhân viên',
  appDescription: 'Nền tảng thiết kế và tạo mẫu dành cho nhóm phát triển sản phẩm.',
  department: 'Phòng ban:',
  costCenter: 'Trung tâm chi phí:',
  plan: 'Gói bản quyền',
  monthlyCost: 'Chi phí hàng tháng',
  perMonth: '{{value}} / tháng',
  notProvided: 'Chưa được cung cấp',
  sample:
    'Bản xem trước. Thông tin nhân viên, hoạt động gần nhất, số ngày không hoạt động và độ tin cậy theo dòng đã chọn vì hai mẫu không khớp nhau. Thông tin bổ sung của Figma, chi phí, timeline và ghi chú là dữ liệu minh họa; ngày đầu timeline theo dòng rà soát. Đây chưa phải đánh giá chính sách thực tế.',
  partial:
    'Mẫu chỉ cung cấp dòng rà soát này. Chưa có gói, chi phí, bằng chứng sử dụng, timeline và ghi chú cho bản quyền này.',
  notFound: 'Không tìm thấy bản quyền không hoạt động',
  notFoundHint: 'Bản ghi này không có trong mẫu được cung cấp. Quay lại danh sách để chọn bản quyền.',
  status: '{{tier}} · {{count, number}} ngày không hoạt động',
  recordNavigation: 'Điều hướng bản quyền',
  previous: 'Bản quyền trước',
  next: 'Bản quyền sau',
  position: '{{index, number}} / {{total, number}}',
  outsideFilter: 'Ngoài bộ lọc hiện tại',
  detailTabs: 'Các phần chi tiết bản quyền',
  tabs: {
    overview: 'Tổng quan',
    evidence: 'Sử dụng & Bằng chứng',
    requests: 'Yêu cầu liên quan',
    audit: 'Lịch sử kiểm toán'
  },
  details: 'Chi tiết',
  activityValue: '{{date}} ({{count, number}} ngày không hoạt động)',
  meaningful: 'Hoạt động có ý nghĩa',
  integration: '{{source}} (qua tích hợp)',
  exactMatch: 'Khớp email chính xác',
  definitionHint:
    'Được xem là hoạt động khi nhân viên thực hiện thao tác thiết kế như tạo, sửa hoặc xem tệp, bình luận hay chia sẻ.',
  facts: {
    lastActivity: 'Ngày hoạt động gần nhất',
    definition: 'Định nghĩa hoạt động',
    source: 'Nguồn dữ liệu',
    identity: 'Đối chiếu danh tính',
    coverage: 'Phạm vi dữ liệu sử dụng',
    savings: 'Tiết kiệm ước tính (kỳ gia hạn tới)',
    confidence: 'Độ tin cậy'
  },
  timelineTitle: 'Dòng thời gian',
  timeline: {
    active: 'Hoạt động gần nhất',
    activeHint: 'Mở tệp thiết kế trong Figma',
    detected: 'Phát hiện dấu hiệu không hoạt động',
    detectedHint: 'Ngưỡng G3 mẫu (≥ 60 ngày không hoạt động)',
    recommended: 'Đã tạo đề xuất',
    recommendedHint: 'Bộ quy tắc mẫu (G3)',
    pending: 'Chờ quyết định của quản lý',
    pendingHint: 'Đang chờ'
  },
  dateTime: '{{date}}, {{time}}',
  noTimeline: 'Chưa có dòng thời gian cho bản quyền này.',
  notesTitle: 'Ghi chú',
  addNote: 'Thêm ghi chú...',
  save: 'Lưu',
  draftHint: 'Chỉ là bản nháp tại trang. Việc lưu cần quy trình backend.',
  noNotes: 'Chưa có ghi chú cho bản quyền này.',
  notes: {
    managerRole: '(Quản lý)',
    manager: 'Vui lòng rà soát cùng nhóm. Nếu không cần nữa, chúng ta sẽ thu hồi bản quyền này.',
    adminRole: '(Quản trị IT)',
    admin: 'Đã xác nhận không có hoạt động sử dụng gần đây từ phía IT. Chờ quyết định của bạn.'
  },
  evidenceTitle: 'Bằng chứng & Dữ liệu',
  usageData: 'Dữ liệu sử dụng',
  available: 'Có dữ liệu',
  collected: 'Dữ liệu thu thập',
  data: {
    activity: 'Ngày hoạt động gần nhất',
    summary: 'Tóm tắt sử dụng (tổng hợp)',
    events: 'Sự kiện ứng dụng (giới hạn)'
  },
  fullEvidence: 'Xem toàn bộ bằng chứng',
  noRawEvidence:
    'Mẫu chỉ cung cấp bản tóm tắt bằng chứng này. Chưa có sự kiện gốc, biểu đồ sử dụng hay nhật ký tích hợp.',
  noEvidence: 'Chưa có bằng chứng sử dụng cho bản quyền này.',
  relatedTitle: 'Thông tin liên quan',
  appDetails: 'Chi tiết ứng dụng',
  assignedBy: 'Được cấp bởi',
  hrSystem: 'Hệ thống nhân sự',
  requestMismatch:
    'REQ-1024 xuất hiện trong mẫu nhưng yêu cầu hiện có thuộc nhân viên khác. Liên kết này chưa được xác minh nên chưa thể mở yêu cầu.',
  noAudit: 'Chưa có bản ghi kiểm toán. Dòng thời gian mẫu không phải lịch sử kiểm toán chính thức.',
  context: 'Bằng chứng và thao tác rà soát',
  takeAction: 'Xử lý',
  actions: { reclaim: 'Thu hồi bản quyền', keep: 'Giữ lại (Thêm ghi chú)', exempt: 'Miễn trừ (Đặt ngày hết hạn)' },
  recommendation: {
    reclaim: 'Bản quyền này có thể không được sử dụng và có thể thu hồi để tối ưu chi phí.',
    keep: 'Giữ lại bản quyền và tiếp tục theo dõi.',
    exempt: 'Miễn trừ bản quyền khỏi đợt rà soát hiện tại.'
  },
  noReason: 'Mẫu cung cấp đề xuất này nhưng chưa có cơ sở giải thích.',
  rule: 'Quy tắc mẫu: {{rule}}. Quyết định rà soát chưa khả dụng trong bản xem trước.'
} as const
