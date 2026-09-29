export const assignmentDetail = {
  title: 'Chi tiết phân quyền',
  documentTitle: 'Chi tiết phân quyền | SaaS-Sentry',
  back: 'Quay lại rà soát quyền truy cập',
  cycle: 'Rà soát quý {{quarter}} năm {{year}}',
  sample:
    'Phân quyền mẫu trong kỳ rà soát quý 2 năm 2026 của Manager. Ngày cấp, hoạt động và rủi ro khớp với danh sách; mục đích và dự án là ví dụ từ thiết kế.',
  partial:
    'Phân quyền mẫu trong kỳ rà soát quý 2 năm 2026 của Manager. Mẫu chưa cung cấp mục đích sử dụng và dự án của phân quyền này.',
  employee: 'Nhân viên được cấp quyền',
  team: 'Nhóm {{name}}',
  fields: {
    assigned: 'Ngày cấp',
    plan: 'Gói',
    activity: 'Hoạt động gần nhất',
    purpose: 'Mục đích sử dụng',
    project: 'Dự án',
    costCenter: 'Trung tâm chi phí'
  },
  purposeAlpha: 'Thiết kế UI/UX cho Dự án Alpha',
  projectAlpha: 'Dự án Alpha',
  missing: 'Chưa được cung cấp',
  lowRiskHint: 'Có sử dụng trong 30 ngày gần nhất của kỳ rà soát mẫu.',
  riskSampleHint: 'Mức rủi ro được cung cấp trong dữ liệu mẫu. Chưa có giải thích chi tiết về chính sách đánh giá.',
  decision: 'Quyết định của bạn',
  chooseDecision: 'Chọn quyết định về quyền truy cập',
  choices: { keep: 'Giữ quyền', reclaim: 'Thu hồi', exempt: 'Miễn rà soát' },
  choiceHints: { keep: 'Vẫn cần sử dụng', reclaim: 'Không còn nhu cầu', exempt: 'Tạm thời giữ quyền' },
  reason: 'Lý do',
  reasonPlaceholder: 'Nhập lý do cho quyết định của bạn...',
  reasonCount: '{{used}}/{{limit}}',
  info: 'Thông tin về quyết định rà soát',
  infoText:
    'Giữ quyền xác nhận nhu cầu tiếp tục sử dụng. Thu hồi đề xuất gỡ quyền. Miễn rà soát đề xuất ngoại lệ tạm thời. Backend phải kiểm tra quyền và xử lý chuyển trạng thái cuối cùng.',
  draftHint:
    'Lựa chọn và lý do là bản nháp chưa lưu trên màn hình này. Chưa thể gửi khi chưa kết nối API rà soát; quyền truy cập và trạng thái chưa thay đổi.',
  submit: 'Gửi quyết định',
  notFound: 'Không tìm thấy phân quyền',
  notFoundHint:
    'Phân quyền này không nằm trong dữ liệu rà soát được cung cấp. Quay lại danh sách để chọn một phân quyền có sẵn.',
  openDetails: 'Mở chi tiết phân quyền'
} as const
