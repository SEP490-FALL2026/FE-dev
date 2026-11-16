export const policyAcknowledgement = {
  title: 'Xác nhận đã đọc chính sách',
  intro:
    'Trước khi vào trang làm việc, bạn cần đọc các chính sách áp dụng cho vai của mình và xác nhận từng chính sách.',
  progress: 'Chính sách {{current}} / {{total}}',
  actionsLabel: 'Xác nhận chính sách này',
  version: 'Phiên bản {{version}}',
  publishedAt: 'Có hiệu lực từ {{date}}',
  changeNote: 'Điểm thay đổi: {{note}}',
  reacknowledge: 'Đã có phiên bản mới. Vui lòng đọc và xác nhận lại.',
  stepsTitle: 'Các bước quyết định do chính sách này điều chỉnh',
  checklistTitle: 'Checklist',
  check: {
    SYSTEM: 'Hệ thống tự kiểm',
    PERSON: 'Người quyết định trả lời'
  },
  confirm: 'Tôi đã đọc và hiểu',
  confirming: 'Đang ghi nhận…',
  loading: 'Đang tải chính sách…',
  loadError: 'Không tải được chính sách.',
  retry: 'Thử lại',
  logout: 'Đăng xuất',
  errors: {
    network: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.',
    forbidden: 'Bạn không có quyền xác nhận chính sách này.',
    notFound: 'Chính sách này không còn nữa. Tải lại trang để xem danh sách hiện hành.',
    rateLimit: 'Thao tác quá nhiều lần. Chờ một lát rồi thử lại.',
    generic: 'Chưa ghi nhận được xác nhận. Vui lòng thử lại.'
  }
}
