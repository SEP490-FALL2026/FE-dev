export const auth = {
  account: {
    description: 'Mở dashboard dùng chung dưới vai trò này trong BRD.',
    use: 'Dùng tài khoản {{role}}'
  },
  backHome: 'Về trang chủ',
  demo: {
    description: 'Thông tin công khai này chỉ dùng để duyệt giao diện. Hệ thống không lưu phiên hay token.',
    password: 'Mật khẩu dùng chung',
    title: 'Sáu vai trò demo'
  },
  description: 'Chọn một vai trò demo hoặc nhập thông tin để xem trước không gian làm việc dùng chung.',
  documentTitle: 'Đăng nhập | SaaS-Sentry',
  email: {
    label: 'Email',
    placeholder: 'ten@saas-sentry.test'
  },
  eyebrow: 'Bản xem trước hệ thống nội bộ',
  formTitle: 'Đăng nhập vào SaaS-Sentry',
  invalidCredentials: 'Email hoặc mật khẩu demo không đúng.',
  password: {
    hide: 'Ẩn mật khẩu',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu demo',
    show: 'Hiện mật khẩu'
  },
  roles: {
    employee: {
      description: 'Xem phần mềm được cấp và gửi yêu cầu seat.',
      label: 'Nhân viên'
    },
    finance: {
      description: 'Kiểm soát ngân sách, cam kết, hóa đơn và dự báo.',
      label: 'Finance'
    },
    'it-admin': {
      description: 'Vận hành danh mục, license, import usage và discovery.',
      label: 'Quản trị viên CNTT'
    },
    manager: {
      description: 'Xác nhận nhu cầu đội ngũ và review quyền truy cập.',
      label: 'Quản lý trực tiếp'
    },
    'spending-approver': {
      description: 'Quyết định cuối cho chi phí và thay đổi danh mục.',
      label: 'Người duyệt chi'
    },
    'super-admin': {
      description: 'Quản lý tài khoản, vai trò, cấu hình, job và audit.',
      label: 'Quản trị hệ thống'
    }
  },
  submit: 'Đăng nhập',
  title: 'Đúng tín hiệu cho từng vai trò'
} as const
