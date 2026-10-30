export const auth = {
  backHome: 'Về trang chủ',
  description: 'Một nơi để theo dõi phần mềm, quyền truy cập và chi phí công nghệ của tổ chức.',
  documentTitle: 'Đăng nhập | SaaS-Sentry',
  email: {
    label: 'Email',
    placeholder: 'ten@congty.com'
  },
  eyebrow: 'Không gian làm việc nội bộ',
  formTitle: 'Đăng nhập',
  password: {
    hide: 'Ẩn mật khẩu',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu của bạn',
    show: 'Hiện mật khẩu'
  },
  roles: {
    employee: {
      description: 'Xem phần mềm được cấp và gửi yêu cầu seat.',
      label: 'Nhân viên'
    },
    finance: {
      description: 'Kiểm soát ngân sách, cam kết, hóa đơn và dự báo.',
      label: 'Tài chính'
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
  submitting: 'Đang đăng nhập…',
  signedIn: 'Đăng nhập thành công.',
  retryIn: 'Thử lại sau {{seconds}} giây',
  loginFooter: 'SaaS-Sentry · Không gian làm việc của tổ chức',
  showcase: { access: 'Truy cập có kiểm soát' },
  support: { description: 'Bạn gặp vấn đề đăng nhập?', link: 'Khôi phục quyền truy cập' },
  welcome: 'Chào mừng trở lại',
  formDescription: 'Dùng tài khoản được cấp để truy cập không gian làm việc.',
  accountNotice: 'Chưa có tài khoản? Liên hệ quản trị viên của tổ chức.',
  forgotPassword: 'Quên mật khẩu?',
  securityNote: 'Phiên làm việc được bảo vệ bằng mã truy cập ngắn hạn.',
  session: {
    checking: 'Đang kiểm tra phiên đăng nhập…',
    unavailable: 'Chưa thể kiểm tra phiên. Vui lòng thử lại khi kết nối ổn định.',
    retry: 'Thử lại',
    loggingOut: 'Đang đăng xuất…',
    logoutFailed: 'Chưa thể đăng xuất khỏi máy chủ. Vui lòng thử lại.'
  },
  footer: 'SaaS-Sentry · Hệ thống quản trị phần mềm nội bộ',
  highlights: {
    accessTitle: 'Đúng quyền truy cập',
    accessBody: 'Thông tin hiển thị theo quyền hiện hành của tài khoản.',
    sessionTitle: 'Phiên an toàn',
    sessionBody: 'Mã truy cập được làm mới khi cần và kết thúc khi đăng xuất.'
  },
  errors: {
    invalidCredentials: 'Email hoặc mật khẩu không đúng.',
    validation: 'Thông tin nhập chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu.',
    blocked: 'Đăng nhập tạm bị chặn. Vui lòng thử lại sau {{seconds}} giây.',
    rateLimited: 'Bạn đã thử quá nhiều lần. Vui lòng chờ rồi thử lại.',
    rateLimitedWait: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau {{seconds}} giây.',
    unavailable: 'Hệ thống tạm thời không thể đăng nhập. Vui lòng thử lại sau.',
    generic: 'Không thể đăng nhập. Vui lòng thử lại.',
    noWorkspace: 'Tài khoản chưa có không gian làm việc khả dụng.',
    requestId: 'Mã yêu cầu: {{requestId}}'
  },
  actions: {
    back: 'Quay lại đăng nhập',
    backToLogin: 'Đến trang đăng nhập',
    currentPassword: 'Mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu mới',
    passwordMismatch: 'Hai mật khẩu chưa khớp.',
    passwordPolicy: 'Mật khẩu mới cần từ 12 đến 128 ký tự và khác email đăng nhập.',
    invalidLink: 'Liên kết không hợp lệ hoặc đã hết hạn.',
    requestNewLink: 'Yêu cầu liên kết mới',
    contactAdmin: 'Liên hệ quản trị viên để được gửi lại lời mời kích hoạt.',
    validation: 'Thông tin nhập chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu.',
    currentPasswordInvalid: 'Mật khẩu hiện tại không đúng.',
    rateLimited: 'Bạn đã thử quá nhiều lần. Vui lòng chờ rồi thử lại.',
    rateLimitedWait: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau {{seconds}} giây.',
    unavailable: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
    genericError: 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.',
    forgot: {
      title: 'Quên mật khẩu',
      description: 'Nhập email đăng nhập. Nếu tài khoản hợp lệ, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.',
      submit: 'Gửi hướng dẫn',
      success: 'Nếu email hợp lệ, bạn sẽ nhận được thư hướng dẫn.'
    },
    reset: {
      title: 'Đặt lại mật khẩu',
      description: 'Chọn mật khẩu mới để tiếp tục sử dụng tài khoản.',
      submit: 'Đặt lại mật khẩu',
      success: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập bằng mật khẩu mới.'
    },
    activate: {
      title: 'Kích hoạt tài khoản',
      description: 'Đặt mật khẩu để hoàn tất lời mời tham gia.',
      submit: 'Kích hoạt tài khoản',
      success: 'Tài khoản đã được kích hoạt. Bạn có thể đăng nhập.'
    },
    change: {
      title: 'Đổi mật khẩu',
      description: 'Sau khi đổi mật khẩu, tất cả phiên đăng nhập sẽ kết thúc.',
      submit: 'Đổi mật khẩu',
      success: 'Mật khẩu đã đổi. Vui lòng đăng nhập lại.'
    }
  },
  title: 'Mọi ứng dụng. Một điểm quản trị.'
} as const
