export const employeeRequestExtras = {
  plan: {
    title: 'Chi tiết gói đã chọn',
    sharing: 'Điều khoản chia sẻ tài khoản',
    dataLoss: 'Mất dữ liệu khi gỡ quyền',
    sharingValues: { ALLOWED: 'Nhà cung cấp cho phép chia sẻ', NOT_ALLOWED: 'Không cho phép chia sẻ' },
    yes: 'Có',
    no: 'Không',
    sharingHint: 'Điều khoản nhà cung cấp chỉ để tham khảo. Mỗi người vẫn cần tài khoản công ty và suất sử dụng riêng.'
  },
  serviceAccount: {
    title: 'Tài khoản dịch vụ',
    hint: 'Dành cho chủ thể phi con người như bot và CI. Bạn chịu trách nhiệm cho tài khoản này; IT phải kiểm tra trước khi cấp. Không nhập mật khẩu hoặc secret.',
    identifier: 'Định danh tài khoản dự kiến',
    purpose: 'Mục đích tự động hóa',
    review: 'Xem lại yêu cầu tài khoản dịch vụ',
    confirm: 'Xác nhận yêu cầu tài khoản dịch vụ',
    blocked: 'Thiết lập tài chính chưa hoàn tất. Hiện chưa thể gửi yêu cầu.',
    unsupported: 'Gói này không hỗ trợ yêu cầu tài khoản dịch vụ. Chọn gói cấp suất trên thuê bao hoặc phần mềm nội bộ.'
  },
  returnHandover: {
    confirm: 'Xác nhận bàn giao khi hoàn trả',
    hint: 'Xác nhận đã hoàn tất bàn giao dữ liệu cần thiết để IT tiếp tục thu hồi quyền. Xác nhận không đồng nghĩa quyền đã bị thu hồi ngay.',
    done: 'Đã xác nhận bàn giao dữ liệu',
    needed: 'Cần xác nhận bàn giao dữ liệu',
    dueOn: 'Hạn xác nhận {{date}}',
    flagged: 'Đã thu hồi khi chưa có xác nhận bàn giao'
  },
  errors: {
    baseline: 'IT cần hoàn tất dữ liệu suất cấp ban đầu trước khi bạn yêu cầu tài khoản dịch vụ.',
    plan: 'Gói đã chọn không hỗ trợ tài khoản dịch vụ. Vui lòng chọn gói khác.',
    sender: 'Chỉ người đã gửi yêu cầu hoàn trả mới được xác nhận bàn giao dữ liệu.',
    changed: 'Yêu cầu hoàn trả không còn cần xác nhận này. Tải lại và kiểm tra trạng thái hiện tại.'
  }
} as const
