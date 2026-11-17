import { overviewRedesign } from './admin-overview'
import { parameterPresentation } from './admin-parameters'
import { operationPresentation } from './admin-operations-presentation'
import { overviewMetrics } from './admin-overview-metrics'
import { parameterContract } from './admin-parameter-contract'
import { adminFormHelp } from './admin-form-help'
import { adminOversight } from './admin-oversight'
import { policyLibrary } from './admin-policy-library'
import { operatingDefinitions } from './admin-operating-definitions'

export const admin = {
  ...adminFormHelp,
  ...adminOversight,
  retryIn: 'Thử lại sau {{count}} giây',
  navigation: {
    overview: 'Tổng quan',
    accounts: 'Tài khoản và trách nhiệm',
    departments: 'Phòng ban',
    personnel: 'Nhân sự',
    reminders: 'Tham số vận hành',
    policies: 'Thư viện chính sách',
    operations: 'Giám sát quy trình'
  },
  loading: 'Đang tải…',
  saving: 'Đang lưu…',
  saved: 'Đã lưu thay đổi',
  save: 'Lưu',
  cancel: 'Hủy',
  close: 'Đóng',
  retry: 'Thử lại',
  empty: 'Không có bản ghi phù hợp',
  unknown: 'Trạng thái chưa xác định',
  none: 'Chưa thiết lập',
  all: 'Tất cả',
  pagination: 'Phân trang',
  page: 'Trang {{page}} / {{total}} · {{count}} bản ghi',
  previous: 'Trước',
  next: 'Tiếp',
  requestId: 'Mã tham chiếu: {{id}}',
  actions: 'Thao tác',
  details: 'Chi tiết',
  edit: 'Sửa',
  remove: 'Xóa',
  create: 'Tạo',
  errors: {
    activeDepartureBlock: 'Hồ sơ nghỉ việc vẫn còn hiệu lực. Hủy hồ sơ trước khi gỡ chặn truy cập do nghỉ việc.',
    itAdminLimit: 'Quản trị viên công nghệ thông tin này đã phụ trách đủ số phòng ban cho phép. Chọn người khác.',
    policyStepsFixed:
      'Phải giữ nguyên các bước quyết định và mục kiểm tra tự động của hệ thống. Tải lại bản nháp và chỉ sửa nội dung hiển thị.',
    duplicate: 'Mã, email hoặc ngày này đã tồn tại. Chọn giá trị khác.',
    financeAssigned: 'Đã có tài khoản giữ vai trò tài chính. Kiểm tra phân công hiện tại trước.',
    derivedRole: 'Vai này được suy ra từ trưởng phòng hoặc trách nhiệm phê duyệt.',
    transferOnly: 'Vai Quản trị cấp cao chỉ được thay đổi qua bộ phận vận hành ngoài ứng dụng.',
    spendingApproverAssigned: 'Đã có Người duyệt chi. Kiểm tra người đang giữ vai trước khi thay đổi.',
    managerStillHeading:
      'Nhân sự còn làm, sắp làm trưởng phòng hoặc được chỉ định kế nhiệm. Kết thúc phân công ở phòng trước khi thu hồi vai Quản lý.',
    openWork: 'Nhân sự còn công việc chưa hoàn tất. Xử lý công việc trước khi cấp vai Người duyệt chi.',
    managerRoleRequired: 'Cấp vai Quản lý cho tài khoản trước khi chỉ định trưởng phòng hoặc người kế nhiệm.',
    parameterLocked: 'Tham số này đã bị khóa do dữ liệu nghiệp vụ đang sử dụng.',
    alreadyActivated: 'Tài khoản đã kích hoạt, không cần gửi lại lời mời.',
    accountLocked: 'Tài khoản đang bị khóa. Cần mở khóa trước khi tiếp tục.',
    roleCombination: 'Không thể kết hợp các vai hoặc trách nhiệm này trên cùng tài khoản.',
    unusableAccount: 'Chọn nhân sự đang làm việc với tài khoản đã kích hoạt và có thể đăng nhập.',
    dutyConflict: 'Người thay thế phải khác người đang giữ trách nhiệm duyệt.',
    successorResponsibilities: 'Bàn giao phòng ban hoặc trách nhiệm đặc biệt hiện tại của người này trước.',
    departmentInUse: 'Phòng ban còn nhân sự hoặc dữ liệu phụ thuộc. Cần xử lý trước khi ngừng dùng.',
    headMembership: 'Chọn thành viên đủ điều kiện của phòng tại ngày có hiệu lực.',
    hrBasis:
      'Điền đầy đủ thông tin văn bản nhân sự có thẩm quyền. Thông báo biến động nhân sự của trưởng phòng không phải là quyết định nhân sự.',
    successorRequired: 'Chỉ định người kế nhiệm trưởng phòng hoặc xác nhận rõ không có người kế nhiệm.',
    pendingEvent: 'Nhân sự đã có sự kiện khác xung đột. Kiểm tra sự kiện đó trước.',
    dateInvalid: 'Ngày này không hợp lệ với trạng thái nhân sự hoặc lịch hiện tại.',
    transferCancellation: 'Bổ sung lý do hủy điều chuyển phòng đang chờ.',
    eventMissing: 'Không tìm thấy sự kiện đã ghi phù hợp. Kiểm tra nhân sự và mã tham chiếu sự kiện.',
    verificationRequired: 'Điền phương thức xác minh và căn cứ tham chiếu.',
    previewStale: 'Bản xem trước đã thay đổi. Làm mới và kiểm tra các dòng trước khi xác nhận nhập.',
    importExpired: 'Lần nhập đã hết hạn. Tải lại tệp để tạo bản xem trước mới.',
    duplicateFile: 'Xác nhận bạn có chủ ý nhập lại tệp trùng này.',
    importConfirmed: 'Lần nhập này đã xác nhận. Kiểm tra kết quả trước khi thao tác tiếp.',
    fileInvalid: 'Kiểm tra định dạng, kích thước, các cột bắt buộc và giới hạn dòng của tệp.',
    parameterInvalid: 'Giá trị nằm ngoài miền cho phép của tham số vận hành.',
    unavailable: 'Không tải được dữ liệu. Vui lòng thử lại.',
    forbidden: 'Quyền hiện tại không cho phép thao tác này.',
    missing: 'Không truy cập được bản ghi. Hãy tải lại danh sách.',
    conflict: 'Dữ liệu đã thay đổi hoặc còn ràng buộc. Kiểm tra dữ liệu vừa tải lại trước khi thử tiếp.',
    validation: 'Kiểm tra giá trị đã nhập và các trường bắt buộc.',
    rateLimit: 'Quá nhiều yêu cầu. Vui lòng chờ trước khi thử lại.',
    unknownOutcome: 'Chưa xác định được kết quả lưu. Kiểm tra dữ liệu vừa tải lại trước khi gửi tiếp.',
    lockedCurrency: 'Tiền tệ báo cáo đã bị khóa vì có dữ liệu tài chính sử dụng.',
    selfAction: 'Không thể dùng thao tác này với tài khoản của chính bạn.',
    ineligible: 'Nhân sự chưa đủ điều kiện nhận trách nhiệm đã chọn.'
  },
  overview: {
    metrics: overviewMetrics,
    unknownStep: 'Bước thiết lập chưa xác định',
    redesign: overviewRedesign,
    stepNames: {
      1: 'Tổ chức và nhân sự',
      2: 'Danh mục ứng dụng',
      3: 'Gói và thuê bao',
      4: 'Hiện trạng ghế',
      5: 'Dữ liệu sử dụng'
    },
    setupStates: {
      DONE: 'Hoàn tất',
      INCOMPLETE: 'Chưa hoàn tất',
      BLOCKED: 'Đang bị chặn',
      NOT_AVAILABLE: 'Chưa hỗ trợ'
    },
    setupReasons: {
      NO_DEPARTMENT: 'Tạo phòng ban đang hoạt động.',
      NO_EMPLOYEE: 'Tạo hoặc nhập danh sách nhân viên.',
      NO_APPLICATION: 'Quản trị viên công nghệ thông tin cần cấu hình danh mục ứng dụng.',
      NO_SUBSCRIPTION: 'Quản trị viên công nghệ thông tin cần cấu hình thuê bao.',
      NOT_BUILT_YET: 'Chức năng này chưa được hỗ trợ.'
    },
    setupWarnings: {
      MISSING_HEAD: 'Chưa có trưởng phòng',
      MISSING_IT_ADMIN: 'Chưa có quản trị viên công nghệ thông tin phụ trách',
      MISSING_COST_CENTER: 'Bộ phận tài chính chưa cấu hình trung tâm chi phí'
    },
    facts: {
      activeDepartments: 'Phòng ban đang hoạt động',
      activeEmployees: 'Nhân sự đang làm việc',
      departmentsWithoutCostCenter: 'Phòng chưa có trung tâm chi phí'
    },
    title: 'Thiết lập tổ chức',
    checklist: 'Danh sách thiết lập',
    watch: 'Khả năng vận hành của quản trị viên hệ thống',
    departments: 'Phòng ban',
    accounts: 'Tài khoản và trách nhiệm',
    personnel: 'Nhân sự',
    operations: 'Giám sát quy trình',
    steps: {
      ORGANIZATION: 'Tổ chức',
      EMPLOYEES: 'Nhân viên',
      ACCOUNTS: 'Tài khoản',
      ROLES: 'Trách nhiệm',
      CATALOG: 'Danh mục phần mềm'
    },
    ready: 'Sẵn sàng',
    missing: 'Cần cấu hình',
    warning: 'Cần kiểm tra',
    watchStates: {
      HEALTHY: 'Sẵn sàng',
      HOLDER_LEAVING_STILL_USABLE: 'Đang bàn giao · vẫn có thể thao tác',
      HOLDER_UNUSABLE: 'Người giữ vai chưa thể thao tác',
      NO_HOLDER: 'Chưa có người giữ vai'
    },
    warnings: {
      HOLDER_LEAVING: 'Người giữ vai đang bàn giao trách nhiệm.',
      HANDOVER_OVERDUE: 'Đã qua ngày làm việc cuối. Cần hoàn tất bàn giao.'
    },
    reasons: {
      LOCKED: 'Tài khoản bị khóa',
      LEFT: 'Nhân sự đã nghỉ việc',
      NOT_ACTIVATED: 'Chưa kích hoạt lời mời',
      AWAITING_CREDENTIAL_RESET: 'Đang chờ đặt lại thông tin đăng nhập'
    }
  },
  parameters: {
    additionalDefinitions: operatingDefinitions,
    options: { ON: 'Đang bật', OFF: 'Đang tắt', DAILY: 'Hằng ngày', WEEKLY: 'Hằng tuần' },
    groups: {
      WORKFLOW: 'Quy trình',
      BUDGET: 'Ngân sách',
      PERSONNEL: 'Nhân sự',
      PROVISIONING: 'Cấp quyền sử dụng',
      ACCOUNT: 'Tài khoản',
      DOCUMENT: 'Tài liệu',
      SUBSCRIPTION: 'Thuê bao',
      USAGE: 'Sử dụng phần mềm',
      AI: 'Trí tuệ nhân tạo'
    },
    contract: parameterContract,
    ...parameterPresentation,
    title: 'Tham số vận hành',
    futureOnly: 'Thay đổi áp dụng cho công việc tạo từ nay. Công việc đang chạy giữ nguyên giá trị ban đầu.',
    key: 'Tham số',
    value: 'Giá trị hiện hành',
    default: 'Mặc định',
    unit: 'Đơn vị',
    history: 'Lịch sử',
    edit: 'Cập nhật tham số',
    numericArray: 'Nhập các số cách nhau bằng dấu phẩy.',
    invalid: 'Nhập giá trị đúng kiểu dữ liệu của tham số.',
    olderHistory: 'Phản hồi này chưa bao gồm các thay đổi cũ hơn.',
    changed: 'Thời điểm thay đổi'
  },
  policies: {
    title: 'Thư viện chính sách',
    description: 'Soạn và công bố chính sách vận hành cùng các điều kiện kiểm tra khi phê duyệt.',
    draftBadge: 'Có bản nháp',
    applicableRoles: 'Vai áp dụng',
    publishedAt: 'Ngày ban hành',
    viewDetails: 'Đọc chính sách',
    createDraft: 'Soạn nháp',
    editDraft: 'Sửa bản nháp',
    saveDraft: 'Lưu bản nháp',
    discardDraft: 'Hủy bản nháp',
    publish: 'Xuất bản',
    publishTitle: 'Xuất bản chính sách {{code}}',
    publishConfirm: 'Xác nhận xuất bản',
    publishNotice:
      'Chính sách sẽ có hiệu lực ngay lập tức sau khi xuất bản. Mọi quyết định tiếp theo sẽ áp dụng phiên bản mới.',
    changeNote: 'Căn cứ ban hành',
    changeNotePlaceholder: 'Ghi rõ quyết định, số hiệu, ngày ban hành và người ký ban hành…',
    requiresReacknowledgement: 'Yêu cầu nhân sự xác nhận lại (người đã đọc bản cũ phải đọc lại)',
    draftTitle: 'Bản nháp chính sách {{code}}',
    targetVersion: 'Phiên bản dự kiến: v{{version}}',
    titleLabel: 'Tiêu đề chính sách',
    firstSectionHeading: 'Tiêu đề phần mở đầu',
    firstSectionBody: 'Nội dung quy định',
    version: 'Phiên bản',
    versionNumber: 'Phiên bản {{version}}',
    sections: 'Các điều khoản',
    steps: 'Các bước và điều kiện kiểm tra',
    report: 'Báo cáo xác nhận',
    reportTitle: 'Báo cáo xác nhận đã đọc: {{code}}',
    filterState: 'Trạng thái xác nhận',
    status: 'Trạng thái',
    stateDone: 'Đã xác nhận',
    statePending: 'Chờ xác nhận',
    state_DONE: 'Đã đọc',
    state_PENDING: 'Chưa đọc',
    ackVersion: 'Bản đã đọc',
    acknowledgedAt: 'Thời điểm xác nhận',
    ...policyLibrary
  },
  operations: {
    descriptionPlaceholder: 'Mô tả điểm nghẽn, ảnh hưởng và nội dung cần xử lý',
    ...operationPresentation,
    title: 'Giám sát quy trình',
    congestion: 'Trách nhiệm bị tắc nghẽn',
    incident: 'Ghi nhận sự cố',
    holder: 'Mã nhân viên giữ bước',
    description: 'Mô tả',
    request: 'Yêu cầu',
    since: 'Chờ từ',
    department: 'Phòng ban',
    waitingSteps: 'Bước đang chờ',
    overdueSteps: 'Bước quá hạn',
    reminders: 'Lượt đã nhắc',
    incidentHistory: 'Sự cố đã ghi nhận',
    stepKinds: {
      NEED: 'Duyệt nhu cầu',
      FINANCE_REVIEW: 'Bộ phận tài chính rà soát',
      SPEND_APPROVAL: 'Duyệt chi',
      IT_ASSESSMENT: 'Thẩm định công nghệ'
    }
  }
} as const
