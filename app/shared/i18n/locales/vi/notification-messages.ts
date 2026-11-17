// Copy from the documented in-app notification catalogue.
export const notificationMessages = {
  REQUEST_SUBMITTED: {
    title: 'Đã gửi yêu cầu',
    body: 'WAITING_NEED_DECISION: "Yêu cầu {{requestId}} đã được gửi và đang chờ người duyệt nhu cầu." · WAITING_CONTROLLED: "Yêu cầu {{requestId}} đã được gửi nhưng hiện chưa có người duyệt nhu cầu. Quản trị viên đã được báo để thiết lập; bạn không cần làm thêm gì." · CONFIRMED: "Yêu cầu {{requestId}} đã được gửi và nhu cầu được xác nhận ngay khi gửi."'
  },
  REQUEST_NEED_APPROVED: {
    title: 'Nhu cầu đã được duyệt',
    body: '"Nhu cầu cho yêu cầu {{requestId}} đã được duyệt. Bước tiếp theo: {{next}}."'
  },
  REQUEST_REJECTED: {
    title: 'Yêu cầu bị từ chối',
    body: '"Yêu cầu {{requestId}} bị từ chối ở bước {{by}}.[ Lý do: {{reason}}.][ Gói tương đương trong danh mục: {{suggestedPlanId}}.]"'
  },
  REQUEST_RETURNED: {
    title: 'Yêu cầu được trả lại để bổ sung',
    body: '"Yêu cầu {{requestId}} được trả lại ở bước {{by}}.[ Lý do: {{reason}}.] Vui lòng bổ sung rồi gửi lại." (Với trưởng phòng nhận ở by = SPEND: thay câu cuối bằng "Yêu cầu quay lại hàng đợi của bạn để trình duyệt chi lại." — FE phân biệt bằng cách so người dùng hiện tại với người yêu cầu của Request.)'
  },
  REQUEST_IT_REJECTED: {
    title: 'IT Admin từ chối yêu cầu',
    body: '"IT Admin từ chối yêu cầu {{requestId}}: {{kind}}.[ Lý do: {{reason}}.][ Gói thay thế: {{alternativePlanId}}.][ Gợi ý: {{alternativeNote}}.] [Không có phương án thay thế.]" (câu trong ngoặc cuối chỉ hiện khi noAlternative = true).'
  },
  REQUEST_SPEND_APPROVED: {
    title: 'Khoản chi đã được duyệt',
    body: '"Khoản chi cho yêu cầu {{requestId}} đã được duyệt. IT Admin sẽ tiến hành cấp quyền."'
  },
  REQUEST_GRANTED: {
    title: 'Đã cấp quyền',
    body: '"Quyền dùng {{requestId}} đã được cấp. {{accessGuide}}.[ Trang chủ: {{homepageUrl}}.]"'
  },
  REQUEST_FAILED: {
    title: 'Không cấp được quyền',
    body: '"Yêu cầu {{requestId}} chưa cấp được quyền. Vui lòng liên hệ {{contact}} để được hỗ trợ."'
  },
  REQUEST_WITHDRAWN: {
    title: 'Yêu cầu đã được rút',
    body: 'byRequester = true: "Yêu cầu {{requestId}} đã được người yêu cầu rút lại." · byRequester = false: "Yêu cầu {{requestId}} đã được trưởng phòng rút lại.[ Lý do: {{reason}}.]"'
  },
  REQUEST_WITHDRAWAL_PENDING: {
    title: 'Yêu cầu chưa kết thúc',
    body: '"Trưởng phòng đã rút yêu cầu {{requestId}}, nhưng yêu cầu chưa kết thúc: đang chờ IT Admin đóng tác vụ cấp quyền."'
  },
  REQUEST_CANCELLED: {
    title: 'Yêu cầu đã được đóng',
    body: '"Yêu cầu {{requestId}} đã được đóng vì {{reasonKind}}."'
  },
  STEP_ASSIGNED: {
    title: 'Bạn có việc cần xử lý',
    body: '"Bạn được giao bước {{stepKind}} của yêu cầu {{requestId}} ({{cause}})."'
  },
  STEP_CLOSED_BY_WITHDRAWAL: {
    title: 'Bước bạn phụ trách đã đóng',
    body: '"Yêu cầu {{requestId}} đã được rút nên bước {{stepKind}} bạn đang giữ được đóng. Bạn không cần xử lý nữa."'
  },
  WITHDRAWAL_AWAITING_IT_CLOSE: {
    title: 'Cần đóng tác vụ cấp quyền',
    body: '"Yêu cầu {{requestId}} đã bị rút nhưng việc cấp quyền từng thất bại. Vui lòng kiểm tra và đóng tác vụ để kết thúc yêu cầu."'
  },
  COMMITMENT_RELEASED_BY_WITHDRAWAL: {
    title: 'Ngân sách giữ chỗ đã được hoàn trả',
    body: '"Yêu cầu {{requestId}} đã bị rút nên khoản ngân sách giữ chỗ cho yêu cầu này đã được trả về ngân sách."'
  },
  GRANT_TASK_CANCELLED: {
    title: 'Tác vụ cấp quyền đã bị hủy',
    body: '"Tác vụ cấp quyền của yêu cầu {{requestId}} đã bị hủy; bạn không cần xử lý tác vụ này nữa."'
  },
  SERVICE_ACCOUNT_BOUNDARY_ACCEPTED: {
    title: 'Tài khoản dịch vụ được chấp nhận',
    body: '"IT Admin đã chấp nhận yêu cầu {{requestId}} về tài khoản dịch vụ; yêu cầu chuyển sang bước cấp quyền."'
  },
  RETURN_REQUESTED: {
    title: 'Quyền của bạn sắp được thu hồi',
    body: 'HEAD_CONFIRMATION: "Trưởng phòng đã xác nhận bạn không còn cần dùng {{planId}}. IT Admin sẽ thu hồi quyền này." · EMPLOYEE_RETURN: "Yêu cầu trả quyền {{planId}} của bạn đã được gửi; IT Admin sẽ thu hồi quyền này."'
  },
  RETURN_COMPLETED: {
    title: 'Quyền đã được thu hồi',
    body: '"IT Admin đã thu hồi xong quyền theo yêu cầu trả quyền. Quyền này không còn hiệu lực."'
  },
  RETURN_FAILED: {
    title: 'Chưa thu hồi được quyền',
    body: '"IT Admin chưa thu hồi được quyền theo yêu cầu trả quyền; quyền vẫn đang còn hiệu lực. Vui lòng liên hệ IT Admin."'
  },
  REQUEST_RENEWAL_APPLIED: {
    title: 'Quyền đã được gia hạn',
    body: '"Quyền dùng {{requestId}} đã được gia hạn[ đến {{newExpectedEndDate}}]."'
  },
  REQUEST_RENEWAL_NOT_APPLIED: {
    title: 'Chưa gia hạn được quyền',
    body: '"Yêu cầu gia hạn {{requestId}} đã được duyệt nhưng chưa áp dụng được: {{problem}}. Quyền giữ nguyên ngày hết hạn cũ."'
  },
  REQUEST_FINANCE_REVIEW_OPENED: {
    title: 'Yêu cầu chuyển sang Finance rà soát',
    body: '"Yêu cầu {{requestId}} đã được chuyển cho Finance rà soát ngân sách."'
  },
  REQUEST_RETURNED_BY_FINANCE: {
    title: 'Finance trả lại yêu cầu',
    body: '"Finance đã trả lại yêu cầu {{requestId}} cho bạn.[ Lý do: {{reason}}.]"'
  },
  REQUEST_AWAITING_BUDGET: {
    title: 'Yêu cầu chờ ngân sách',
    body: '"Yêu cầu {{requestId}} đang chờ ngân sách năm {{year}} của {{costCenterId}} được lập hoặc điều chỉnh."'
  },
  REQUEST_BUDGET_VERSION_ENDED: {
    title: 'Phiên bản ngân sách mà yêu cầu chờ đã kết thúc',
    body: '"Phiên bản ngân sách năm {{year}} của {{costCenterId}} mà yêu cầu {{requestId}} đang chờ đã kết thúc ({{decision}})."'
  },
  REQUEST_RESERVE_CONFIRMATION_NEEDED: {
    title: 'Cần xác nhận dùng quỹ dự phòng',
    body: '"Yêu cầu {{requestId}} vượt ngân sách gốc của phòng và sẽ dùng quỹ dự phòng. Vui lòng xác nhận trước khi trình duyệt chi."'
  },
  REQUEST_BUDGET_BLOCKED: {
    title: 'Yêu cầu bị chặn ở bước kiểm ngân sách',
    body: '"Yêu cầu {{requestId}} chưa đi tiếp được vì: {reasons:list}."'
  },
  REQUEST_RETURNED_AT_DECISION: {
    title: 'Yêu cầu được trả lại khi duyệt chi',
    body: '"Yêu cầu {{requestId}} được trả lại trước khi duyệt chi vì: {reasons:list}."'
  },
  REQUEST_CANCELLED_BENEFICIARY_GONE: {
    title: 'Yêu cầu đã được hệ thống đóng',
    body: 'DEPARTURE: "Yêu cầu {{requestId}} cho {{beneficiaryEmployeeId}} đã được hệ thống đóng vì người này đã nghỉ việc. Khoản ngân sách đã giữ (nếu có) được trả về." · TRANSFER: "Yêu cầu {{requestId}} cho {{beneficiaryEmployeeId}} đã được hệ thống đóng vì người này chuyển sang phòng khác. Nếu vẫn cần, vui lòng gửi yêu cầu mới ở phòng mới."'
  },
  REQUEST_BENEFICIARY_GONE_IT_CHECK: {
    title: 'Cần kiểm tra yêu cầu đang cấp quyền',
    body: 'DEPARTURE: "{{beneficiaryEmployeeId}} đã nghỉ việc nhưng yêu cầu {{requestId}} đang được cấp quyền nên hệ thống chưa tự đóng. Vui lòng kiểm tra với nhà cung cấp, thu hồi lời mời nếu có rồi đóng yêu cầu." · TRANSFER: "{{beneficiaryEmployeeId}} đã chuyển phòng nhưng yêu cầu {{requestId}} đang được cấp quyền nên hệ thống chưa tự đóng. Vui lòng kiểm tra với nhà cung cấp, thu hồi lời mời nếu có rồi đóng yêu cầu."'
  },
  IT_ADMIN_SELF_EXECUTED: {
    title: 'IT Admin tự xử lý quyền của chính mình',
    body: 'IT Admin {{employeeId}} đã tự xử lý tác vụ cấp hoặc thu hồi quyền của chính họ vì không còn IT Admin nào khác có thể làm thay. Vui lòng kiểm tra lại.'
  },
  REQUEST_WAITING_CONTROLLED: {
    title: 'Yêu cầu đang chờ người xử lý',
    body: '"Bước {{stepKind}} của yêu cầu {{requestId}} hiện chưa có người xử lý nên đang chờ. Quản trị viên đã được báo; bạn không cần làm thêm gì."'
  },
  REQUEST_WAITING_ENDED: {
    title: 'Yêu cầu đã có người xử lý',
    body: '"Bước {{stepKind}} của yêu cầu {{requestId}} đã có người phụ trách và được xử lý tiếp."'
  },
  STEP_SLA_REMINDER: {
    title: 'Bước xử lý đã quá hạn',
    body: '"Bước {{stepKind}} của yêu cầu {{requestId}} đã quá hạn[ {{overdueWorkingDays}} ngày làm việc] (nhắc lần {{reminderNumber}}). Vui lòng xử lý sớm." (phần trong ngoặc chỉ hiện khi overdueWorkingDays > 0).'
  },
  STEP_SLA_ESCALATION: {
    title: 'Cấp dưới chưa xử lý một bước',
    body: '"Bước {{stepKind}} của yêu cầu {{requestId}} do {{holderEmployeeId}} phụ trách đã quá hạn[ {{overdueWorkingDays}} ngày làm việc] (nhắc lần {{reminderNumber}}). Bạn nhận thông báo này vì là cấp trên."'
  },
  STEP_SLA_NO_SUPERIOR: {
    title: 'Bước quá hạn cần Super Admin xử lý',
    body: '"Bước {{stepKind}} của yêu cầu {{requestId}} đã quá hạn[ {{overdueWorkingDays}} ngày làm việc] (nhắc lần {{reminderNumber}}): {{cause}}."'
  },
  SPEND_QUEUE_REMINDER: {
    title: 'Yêu cầu chờ trình duyệt chi quá lâu',
    body: 'cause = null: "Yêu cầu {{requestId}} đã chờ trong hàng đợi của bạn quá hạn[ {{overdueWorkingDays}} ngày làm việc] (nhắc lần {{reminderNumber}}). Vui lòng trình duyệt chi." · cause = NO_HOLDER: "Yêu cầu {{requestId}} chờ trình duyệt chi quá hạn[ {{overdueWorkingDays}} ngày làm việc] nhưng phòng chưa có trưởng phòng đang làm việc. Vui lòng bổ nhiệm trưởng phòng."'
  },
  FINANCE_QUESTION_REMINDER: {
    title: 'Câu hỏi gửi Finance chưa được trả lời',
    body: '"Câu hỏi về yêu cầu {{requestId}} gửi Finance đã quá hạn[ {{overdueWorkingDays}} ngày làm việc] (nhắc lần {{reminderNumber}})."'
  },
  STEP_BACKLOG_ALERT: {
    title: 'Có người đang tồn nhiều bước',
    body: '"{{holderEmployeeId}} đang có {{openCount}} bước chờ xử lý (ngưỡng {{threshold}}); bước cũ nhất đã chờ {{oldestAgeWorkingDays}} ngày làm việc."'
  },
  CONTROLLED_WAIT_ALERT: {
    title: 'Có việc đang chờ vì thiếu người phụ trách',
    body: '(1) "Bước {{stepKind}} của yêu cầu {{requestId}} đang chờ vì {{waitingReason}}. Cần: {{configurationHint}}." (2) "Phiên bản ngân sách {{year}} của {{costCenterId}} đang chờ vì {{waitingReason}}. Cần: {{configurationHint}}." (3) "Hồ sơ gia hạn thuê bao {{subscriptionId}} đang chờ vì {{waitingReason}}. Cần: {{configurationHint}}."'
  },
  ABRUPT_DEPARTURE_RECORDED: {
    title: 'Nhân viên nghỉ việc đột xuất',
    body: '{{employeeId}} nghỉ việc đột xuất, có hiệu lực từ {{effectiveOn}}. Truy cập của người này đã bị chặn; cần khóa tài khoản công ty và thu hồi quyền phần mềm.'
  },
  LEAVER_K1_ACCESS_RUNS_ON: {
    title: 'Người đã nghỉ việc vẫn còn truy cập đến hết kỳ thanh toán',
    body: 'Việc hủy gia hạn {{planId}} của {{employeeId}} đã được ghi nhận, nhưng người này vẫn dùng được phần mềm đến hết {{accessUntil}} (hết kỳ đã thanh toán).'
  },
  REVOCATION_OVERDUE: {
    title: 'Quá hạn thu hồi quyền của người nghỉ việc',
    body: '{{employeeId}} đã nghỉ việc nhưng còn {{rightCount}} quyền phần mềm chưa được thu hồi, đã quá hạn {{dueOn}}. Vui lòng xử lý ngay.'
  },
  DEPARTURE_ACCESS_BLOCKED: {
    title: 'Truy cập của người nghỉ việc đã bị chặn',
    body: 'SUPER_ADMIN: {{employeeId}} bị từ chối truy cập từ {{blockedOn}}. Vui lòng đánh dấu người này đã nghỉ việc. · IT_ADMIN: {{employeeId}} bị từ chối truy cập từ {{blockedOn}}. Vui lòng chặn tài khoản email công ty (đặt lại mật khẩu hộp thư, đăng xuất mọi phiên) và mở thu hồi quyền phần mềm trước {{revocationDueOn}}.'
  },
  ACCOUNT_LOCK_OVERDUE: {
    title: 'Chưa khóa tài khoản của người nghỉ việc',
    body: '{{employeeId}} bị chặn truy cập từ {{blockedOn}} nhưng việc khóa tài khoản công ty (đặt lại mật khẩu hộp thư, đăng xuất mọi phiên) vẫn chưa được ghi nhận. Vui lòng thực hiện và ghi nhận ngay.'
  },
  DEPARTURE_REVOCATION_IT_CLOSE: {
    title: 'Cần đóng thủ công các thu hồi đang xử lý',
    body: 'Việc nghỉ việc của {{employeeId}} đã bị hủy nhưng còn {{taskCount}} tác vụ thu hồi quyền đang xử lý. Vui lòng kiểm tra tại nhà cung cấp và đóng các tác vụ theo kết quả thực tế.'
  },
  TRANSFER_REVIEW_DUE: {
    title: 'Hạn rà soát công cụ của nhân viên chuyển đến',
    body: '{{employeeId}} đã chuyển đến phòng {{departmentId}}. Hạn rà soát công cụ là {{dueOn}}. (Thông báo cũ, tính năng này đã ngừng.)'
  },
  TRANSFER_GRACE_STARTED: {
    title: 'Điều chuyển phòng: thời gian giữ quyền cũ',
    body: 'MOVER: Bạn đã chuyển từ {{fromDepartmentId}} sang {{toDepartmentId}}. Bạn tạm giữ quyền phần mềm của phòng cũ đến hết {{graceEndsOn}}, sau đó các quyền này sẽ được thu hồi. · HEAD/IT_ADMIN: {{employeeId}} đã chuyển từ {{fromDepartmentId}} sang {{toDepartmentId}}. Quyền phần mềm của phòng cũ được giữ đến hết {{graceEndsOn}}, sau đó sẽ được thu hồi.'
  },
  TRANSFER_GRACE_ENDING: {
    title: 'Sắp hết thời gian giữ quyền của phòng cũ',
    body: 'Quyền phần mềm của phòng cũ sẽ được thu hồi sau {{graceEndsOn}}. Nếu cần tiếp tục dùng phần mềm nào, hãy gửi yêu cầu cấp quyền cho phòng mới trước ngày đó.'
  },
  TRANSFER_RIGHTS_REVOKING: {
    title: 'Đang thu hồi quyền của phòng cũ',
    body: 'Thời gian giữ quyền đã hết; {{rightCount}} quyền phần mềm của {{employeeId}} thuộc phòng cũ đang được thu hồi. (Khi người nhận chính là employeeId: "{{rightCount}} quyền phần mềm của phòng cũ của bạn đang được thu hồi.")'
  },
  BUDGET_VERSION_AWAITING_DECISION: {
    title: 'Có ngân sách chờ bạn quyết định',
    body: 'Finance đã gửi phiên bản ngân sách năm {{year}} của {{costCenterId}} để bạn xem xét và quyết định.'
  },
  BUDGET_PROPOSAL_SUBMITTED: {
    title: 'Có đề xuất ngân sách mới',
    body: '{{costCenterId}} vừa gửi đề xuất ngân sách năm {{year}}. Vui lòng xem xét.'
  },
  BUDGET_PROPOSAL_RETURNED: {
    title: 'Đề xuất ngân sách bị trả về',
    body: 'Finance đã trả lại đề xuất ngân sách năm {{year}} của {{costCenterId}}. Lý do: {{reason}}. Vui lòng chỉnh sửa và gửi lại trước hạn nộp.'
  },
  BUDGET_VERSION_DECIDED: {
    title: 'Ngân sách đã có quyết định',
    body: 'Phiên bản ngân sách năm {{year}} của {{costCenterId}} đã được {{decision}}. Lý do: {{reason}}.'
  },
  BUDGET_VERSION_CLOSED_UNAPPROVED: {
    title: 'Phiên bản ngân sách đã bị đóng',
    body: 'Năm {{year}} đã kết thúc nhưng phiên bản ngân sách của {{costCenterId}} chưa được phê duyệt, nên đã được đóng lại.'
  },
  BUDGET_PROPOSAL_CLOSED_YEAR_END: {
    title: 'Đề xuất ngân sách đã bị đóng',
    body: 'Năm {{year}} đã kết thúc, đề xuất ngân sách của {{costCenterId}} chưa được sử dụng nên đã được đóng lại.'
  },
  BUDGET_PROPOSAL_TASK_ASSIGNED: {
    title: 'Bạn có đề xuất ngân sách cần xử lý',
    body: 'Đề xuất ngân sách năm {{year}} của {{costCenterId}} ({{departmentId}}) đã bị Finance trả về. Bạn là trưởng phòng hiện tại, vui lòng chỉnh sửa và gửi lại hoặc rút đề xuất.'
  },
  BUDGET_PROPOSAL_TASK_WAITING: {
    title: 'Đề xuất ngân sách đang chờ trưởng phòng',
    body: 'Đề xuất ngân sách năm {{year}} của {{costCenterId}} đã được trả về nhưng phòng chưa có trưởng phòng. Việc gửi lại sẽ chuyển cho trưởng phòng đầu tiên được bổ nhiệm.'
  },
  BUDGET_CYCLE_OPENED: {
    title: 'Kỳ ngân sách {{year}} đã mở',
    body: 'Vui lòng lập và gửi đề xuất ngân sách năm {{year}} của phòng bạn trước ngày {{submissionDeadline}}. Bạn có thể tải biểu mẫu đề xuất ngân sách.'
  },
  BUDGET_CYCLE_DEADLINE_MOVED: {
    title: 'Hạn nộp đề xuất ngân sách đã thay đổi',
    body: 'Hạn nộp đề xuất ngân sách năm {{year}} đã đổi từ {{previousSubmissionDeadline}} sang {{submissionDeadline}}.'
  },
  BUDGET_DEPARTMENT_CEILING_PUBLISHED: {
    title: 'Đã công bố trần ngân sách phòng',
    body: 'Trần ngân sách năm {{year}} của {{departmentId}} đã được công bố.'
  },
  BUDGET_PROPOSAL_DEADLINE_REMINDER: {
    title: 'Quá hạn nộp đề xuất ngân sách',
    body: '{{costCenterId}} chưa gửi đề xuất ngân sách năm {{year}}; hạn nộp là {{submissionDeadline}}. Vui lòng liên hệ Finance để được hướng dẫn.'
  },
  BUDGET_NO_HEAD_AT_DEADLINE: {
    title: 'Phòng chưa có trưởng phòng khi hết hạn nộp ngân sách',
    body: '{{departmentId}} chưa gửi đề xuất ngân sách năm {{year}} (hạn {{submissionDeadline}}) và hiện chưa có trưởng phòng. Finance sẽ lập ngân sách từ dữ liệu nền; Super Admin vui lòng bổ nhiệm trưởng phòng.'
  },
  BUDGET_SUBMISSION_DEADLINE_PASSED: {
    title: 'Đã hết hạn nộp đề xuất ngân sách',
    body: 'Hạn nộp đề xuất ngân sách năm {{year}} ({{submissionDeadline}}) đã qua; còn {{departmentCount}} phòng chưa gửi đề xuất.'
  },
  BUDGET_DECISION_DEADLINE_REMINDER: {
    title: 'Quá hạn quyết định ngân sách',
    body: 'Hạn quyết định ngân sách năm {{year}} ({{decisionDeadline}}) đã qua; còn {{versionCount}} phiên bản đang chờ quyết định.'
  },
  BUDGET_COST_CENTER_SETUP_DUE: {
    title: 'Phòng chưa có Cost Center',
    body: '{{departmentId}} chưa có Cost Center đang dùng cho kỳ ngân sách {{year}}. Vui lòng thiết lập trước hạn nộp.'
  },
  BUDGET_BASELINE_VERSION_HEAD_ASSIGNED: {
    title: 'Đã có phiên bản ngân sách cho phòng bạn',
    body: 'Finance đã dựng sẵn phiên bản ngân sách năm {{year}} của {{costCenterId}} từ dữ liệu nền trước khi bạn nhận chức. Vui lòng xem lại.'
  },
  BUDGET_NEXT_YEAR_MISSING: {
    title: 'Chưa có ngân sách năm {{year}}',
    body: '{{costCenterId}} chưa có ngân sách năm {{year}} được phê duyệt. Các yêu cầu chi sẽ phải chờ đến khi có ngân sách.'
  },
  BUDGET_REVIEW_DUE: {
    title: 'Đến hạn chốt chi phí tháng {{month}}/{{year}}',
    body: 'Vui lòng chốt chi phí tháng {{month}}/{{year}} để có số liệu rà soát ngân sách.'
  },
  BUDGET_REVIEW_SUMMARY: {
    title: 'Tổng kết rà soát ngân sách {{month}}/{{year}}',
    body: 'Finance đã ký rà soát {{kind}} {{month}}/{{year}}: {{greenCount}} Cost Center xanh, {{yellowCount}} vàng, {{redCount}} đỏ, {{underCount}} dùng thấp hơn kế hoạch.'
  },
  BUDGET_SHARED_POOL_OVER_RESERVE: {
    title: 'Quỹ chung vượt mức dự phòng',
    body: 'Đến hết tháng {{month}}/{{year}}, phần chưa phân bổ của quỹ chung đã vượt mức dự phòng của kỳ ngân sách. Vui lòng xem xét.'
  },
  BUDGET_THRESHOLD_REACHED: {
    title: 'Ngân sách đạt {{threshold}}%',
    body: 'Mức sử dụng ngân sách năm {{year}} của {{costCenterId}} đã đạt {{threshold}}% ngân sách cơ sở.'
  },
  BUDGET_REVIEW_EXPLANATION_DUE: {
    title: 'Nhắc giải trình ngân sách',
    body: 'Vui lòng giải trình mức sử dụng ngân sách của {{costCenterId}} cho quý kết thúc tháng {{month}}/{{year}}. Hạn giải trình: {{dueOn}}.'
  },
  BUDGET_REVIEW_EXPLANATION_REQUESTED: {
    title: 'Yêu cầu giải trình ngân sách',
    body: 'Cost Center {{costCenterId}} có đèn {{light}} trong rà soát quý kết thúc tháng {{month}}/{{year}}. Vui lòng giải trình trước ngày {{dueOn}}.'
  },
  BUDGET_ADJUSTMENT_REQUESTED: {
    title: 'Có điều chỉnh ngân sách chờ bạn duyệt',
    body: 'Finance đề nghị {{kind}} ngân sách năm {{year}}. Vui lòng xem xét và quyết định.'
  },
  BUDGET_ADJUSTMENT_DECIDED: {
    title: 'Điều chỉnh ngân sách đã có quyết định',
    body: 'Điều chỉnh {{kind}} năm {{year}}{{costCenterId}} đã được {{decision}}.'
  },
  GHOST_SEAT_G2_DETECTED: {
    title: 'Phát hiện chỗ phần mềm do người đã nghỉ việc giữ',
    body: '{{employeeId}} đã nghỉ việc nhưng vẫn giữ một chỗ {{applicationId}}. Vui lòng xem xét và thu hồi.'
  },
  GHOST_SEAT_NEW: {
    title: 'Có chỗ phần mềm cần bạn quyết định',
    body: 'Phòng {{departmentId}} có khuyến nghị thu hồi chỗ phần mềm ít được sử dụng đang chờ bạn quyết định. Hãy mở hàng đợi để xem chi tiết.'
  },
  GHOST_SEAT_ACTION_TIER: {
    title: 'Có chỗ phần mềm cần thu hồi ở phòng bạn phụ trách',
    body: 'Phòng {{departmentId}} có khuyến nghị thu hồi chỗ phần mềm ở mức hành động. Trưởng phòng sẽ quyết định; bạn có thể xem trước chi tiết.'
  },
  GHOST_SEAT_DECISION_OVERDUE: {
    title: 'Quá hạn quyết định chỗ phần mềm',
    body: 'Khuyến nghị thu hồi chỗ {{applicationId}} của {{employeeId}} đã quá hạn quyết định ({{decisionDueOn}}). Vui lòng xử lý. (Khi employeeId rỗng, bỏ "của {{employeeId}}".)'
  },
  GHOST_SEAT_WAITING_FOR_HEAD: {
    title: 'Phòng chưa có trưởng phòng, việc đang chờ',
    body: 'Phòng {{departmentId}} chưa có trưởng phòng nên các khuyến nghị thu hồi chỗ phần mềm đang chờ. Vui lòng bổ nhiệm trưởng phòng.'
  },
  GHOST_SEAT_RETURNED: {
    title: 'IT Admin trả lại việc thu hồi chỗ phần mềm',
    body: 'IT Admin không thể thực hiện việc thu hồi chỗ {{applicationId}} của {{employeeId}} và đã trả lại cho bạn. Vui lòng xem lại và quyết định.'
  },
  GHOST_SEAT_EXEMPTION_ENDING: {
    title: 'Miễn trừ thu hồi sắp hết',
    body: 'Miễn trừ thu hồi chỗ {{applicationId}} của {{employeeId}} sẽ hết vào {{exemptUntil}}. Sau ngày đó hệ thống sẽ đánh giá lại chỗ này.'
  },
  REVOCATION_UPCOMING: {
    title: 'Quyền phần mềm của bạn sắp bị thu hồi',
    body: 'Quyền dùng {{applicationId}} (gói {{planId}}) của bạn dự kiến sẽ được thu hồi sớm nhất vào ngày {{notBefore}} vì ít được sử dụng.'
  },
  REVOCATION_CANCELLED: {
    title: 'Việc thu hồi quyền đã được hủy',
    body: 'Việc thu hồi quyền dùng {{applicationId}} (gói {{planId}}) của bạn đã được hủy. Bạn tiếp tục dùng như bình thường.'
  },
  USAGE_TRACKING_NOTICE: {
    title: 'Việc sử dụng {{applicationId}} sẽ được theo dõi',
    body: 'Hoạt động được tính là: {{activityDefinition}}. Dữ liệu ghi nhận: {{dataKinds}} Mục đích: {{purpose}} Dữ liệu được lưu {{retentionMonths}} tháng.'
  },
  USAGE_SOURCE_STALE: {
    title: 'Báo cáo sử dụng đã cũ',
    body: 'Nguồn "{{source}}" của {{applicationId}} chỉ có dữ liệu đến {{coverageTo}} (cũ {{freshnessDays}} ngày), nên chưa thể xác định chỗ nào không được dùng. Vui lòng nhập báo cáo mới.'
  },
  LICENSE_EXPIRY_REMINDER: {
    title: 'Quyền phần mềm sắp hết hạn',
    body: 'EMPLOYEE: Quyền dùng {{planId}} của bạn sẽ hết hạn vào {{expectedEndDate}}. Hãy gửi yêu cầu gia hạn nếu bạn vẫn cần dùng. · HEAD: Quyền {{planId}} của {{holderEmployeeId}} sẽ hết hạn vào {{expectedEndDate}}. · IT_ADMIN: Quyền {{planId}} của {{holderEmployeeId}} sẽ hết hạn vào {{expectedEndDate}}; quyền sẽ được thu hồi nếu không gia hạn.'
  },
  RENEWAL_WINDOW_OPENED: {
    title: 'Có thể gia hạn quyền phần mềm',
    body: 'EMPLOYEE: Quyền dùng {{planId}} của bạn sẽ kết thúc vào {{expectedEndDate}}. Bạn có thể gửi yêu cầu gia hạn từ {{opensOn}}. · HEAD: Quyền {{planId}} của {{holderEmployeeId}} sẽ kết thúc vào {{expectedEndDate}}; cửa sổ gửi yêu cầu gia hạn mở từ {{opensOn}}.'
  },
  HANDOVER_CONFIRMATION_DUE: {
    title: 'Cần xác nhận bàn giao quyền',
    body: 'Việc bàn giao quyền phần mềm liên quan đến {{employeeId}} cần được xác nhận trước {{dueOn}}. (Thông báo cũ, tính năng này đã ngừng.)'
  },
  HANDOVER_CONFIRMATION_OVERDUE: {
    title: 'Quá hạn xác nhận bàn giao quyền',
    body: 'Việc xác nhận bàn giao quyền phần mềm liên quan đến {{employeeId}} đã quá hạn {{dueOn}}. (Thông báo cũ, tính năng này đã ngừng.)'
  },
  SERVICE_ACCOUNT_RESPONSIBLE_DUE: {
    title: 'Cần chuyển người phụ trách tài khoản dịch vụ',
    body: '{{employeeId}} đang phụ trách {{accountCount}} tài khoản dịch vụ và có thay đổi nhân sự hiệu lực từ {{dueOn}}. (Thông báo cũ, tính năng này đã ngừng.)'
  },
  SERVICE_ACCOUNT_RESPONSIBLE_OVERDUE: {
    title: 'Tài khoản dịch vụ chưa có người phụ trách mới',
    body: 'Đến ngày {{dueOn}}, tài khoản dịch vụ của {{employeeId}} vẫn chưa có người phụ trách mới. (Thông báo cũ, tính năng này đã ngừng.)'
  },
  SUBSCRIPTION_RENEWAL_ALERT: {
    title: 'Thuê bao sắp đến hạn gia hạn',
    body: 'Còn {{milestoneDays}} ngày đến {{baseDate}} ({{noticeBasis}}) của thuê bao {{subscriptionId}}. {Trạng thái}: nếu decisionRecorded = false → "Chưa có quyết định gia hạn."; nếu decisionRecorded = true và outcomeRecorded = false → "Đã có quyết định, chưa ghi kết quả với nhà cung cấp."; nếu cả hai true → "Đã có quyết định và kết quả." Rồi: usageData = AVAILABLE → "Đã có dữ liệu sử dụng để tham khảo."; NOT_AVAILABLE → "Chưa có dữ liệu sử dụng."'
  },
  SUBSCRIPTION_RENEWAL_DATA_QUALITY: {
    title: 'Thuê bao thiếu thông tin hợp đồng',
    body: 'Thuê bao {{subscriptionId}} chưa có hạn báo hủy hoặc ngày hết hạn nên hệ thống chưa thể nhắc gia hạn. Vui lòng bổ sung thông tin hợp đồng.'
  },
  SUBSCRIPTION_RENEWAL_PROPOSED: {
    title: 'Có đề xuất gia hạn thuê bao chờ bạn xác nhận',
    body: 'IT Admin đề xuất {{choice}} cho thuê bao {{subscriptionId}}. Vui lòng xem xét và xác nhận.'
  },
  SUBSCRIPTION_RENEWAL_DECIDED: {
    title: 'Đã có quyết định gia hạn thuê bao',
    body: 'Phương án {{choice}} cho thuê bao {{subscriptionId}} đã được xác nhận và sẽ thực hiện {{executionPoint}}.'
  },
  SUBSCRIPTION_RENEWAL_LATE: {
    title: 'Gia hạn thuê bao chưa được thực hiện đúng hạn',
    body: 'Đã đến {{baseDate}} nhưng quyết định gia hạn thuê bao {{subscriptionId}} vẫn chưa ghi nhận kết quả với nhà cung cấp. Vui lòng thực hiện và cập nhật kết quả.'
  },
  SUBSCRIPTION_AUTO_RENEWAL_INCIDENT: {
    title: 'Thuê bao có thể đã tự động gia hạn ngoài ý muốn',
    body: 'Đã qua {{baseDate}} mà thuê bao {{subscriptionId}}, vốn tự động gia hạn, chưa có quyết định nào. Thuê bao có thể đã tự gia hạn. Vui lòng kiểm tra với nhà cung cấp.'
  },
  SUBSCRIPTION_EXPIRY_MARKED: {
    title: 'Thuê bao được đánh dấu sẽ kết thúc',
    body: 'Đã qua {{baseDate}} mà thuê bao {{subscriptionId}} chưa có quyết định gia hạn, nên thuê bao được đánh dấu sẽ kết thúc vào {{endDate}}. Khi endDate là null, bỏ cụm "vào {{endDate}}".'
  },
  SUBSCRIPTION_SEATS_INCREASED: {
    title: 'Thuê bao được mua thêm chỗ',
    body: '{{changedByEmployeeId}} đã tăng số chỗ của thuê bao {{subscriptionId}} từ {{fromQuantity}} lên {{toQuantity}}.'
  },
  PURCHASE_INVOICE_SUBMITTED: {
    title: 'Có hóa đơn chờ xác nhận chi',
    body: '"Hóa đơn mua hàng {{linkKind}} kỳ {{servicePeriodMonth}} đang chờ bạn xác nhận chi tiền."'
  },
  PURCHASE_INVOICE_CONFIRMED: {
    title: 'Hóa đơn đã được xác nhận',
    body: '"Finance đã xác nhận chi tiền cho hóa đơn mua hàng {{linkKind}} kỳ {{servicePeriodMonth}}."'
  },
  PURCHASE_INVOICE_RETURNED: {
    title: 'Hóa đơn bị trả lại',
    body: '"Finance đã trả lại hóa đơn mua hàng {{linkKind}} kỳ {{servicePeriodMonth}}. Mở hóa đơn để xem lý do, chỉnh sửa rồi nộp lại."'
  },
  DEPARTMENT_SOFTWARE_PROPOSED: {
    title: 'Có đề xuất thêm phần mềm cho phòng',
    body: 'Phòng {{departmentId}} đề xuất thêm {{applicationId}} (gói {{planId}}) vào danh sách phần mềm. Vui lòng xem xét. Khi planId là null, bỏ "(gói {{planId}})".'
  },
  DEPARTMENT_SOFTWARE_PROPOSAL_DECIDED: {
    title: 'Đề xuất phần mềm đã có kết quả',
    body: 'Đề xuất thêm {{applicationId}} vào danh sách phần mềm của phòng {{departmentId}} đã {{decision}}. Khi bị từ chối và có reason: thêm "Lý do: {{reason}}."'
  },
  DEPARTMENT_WITHOUT_HEAD: {
    title: 'Phòng chưa có trưởng phòng',
    body: '"Phòng {{departmentId}} hiện chưa có trưởng phòng[; có {{waitingCount}} yêu cầu đang chờ]. Vui lòng bổ nhiệm trưởng phòng." (phần trong ngoặc chỉ hiện khi waitingCount > 0).'
  },
  EMPLOYEE_PROFILE_CREATED: {
    title: 'Có nhân viên mới trong phòng',
    body: '{{employeeId}} vừa được thêm vào phòng {{departmentId}}. Vui lòng chuẩn bị các quyền phần mềm cần thiết cho nhân viên này.'
  },
  EMPLOYEE_PROFILE_UPDATED: {
    title: 'Hồ sơ nhân viên đã được cập nhật',
    body: 'Hồ sơ của {{employeeId}} vừa được cập nhật thông tin chính thức. Hãy mở hồ sơ để xem nội dung mới. (Khi người nhận chính là employeeId: "Hồ sơ của bạn vừa được cập nhật thông tin chính thức.")'
  },
  PERSONNEL_EVENT_RECORDED: {
    title: 'Có thay đổi nhân sự',
    body: '{{employeeId}}: {{eventKind}}. (Khi người nhận chính là employeeId, thay "{{employeeId}}" bằng "Bạn".)'
  },
  PERSONNEL_NOTICE_RECEIVED: {
    title: 'Có phiếu báo nhân sự mới',
    body: 'Trưởng phòng {{departmentId}} đã gửi phiếu báo: {{eventKind}} đối với {{employeeId}}. Vui lòng kiểm tra và xử lý.'
  },
  PERSONNEL_NOTICE_OVERDUE: {
    title: 'Phiếu báo nhân sự quá hạn xử lý',
    body: 'Phiếu báo "{{eventKind}}" đối với {{employeeId}} (do trưởng phòng {{departmentId}} gửi) đã quá hạn mà chưa được xử lý.'
  },
  ROLE_HOLDER_LEAVING: {
    title: 'Người giữ vai trò quan trọng sắp nghỉ việc',
    body: '{{employeeId}} đang giữ vai trò {{roleFlag}} và sẽ nghỉ việc từ {{effectiveOn}}. Cần có người nhận bàn giao vai trò này.'
  },
  VENDOR_ADMINS_BELOW_MINIMUM: {
    title: 'Gói phần mềm sắp không còn quản trị viên',
    body: 'Người quản trị cuối cùng của gói {{planId}} ({{applicationId}}) tại nhà cung cấp đang nghỉ việc và không còn ai khác quản trị gói này. Vui lòng sắp xếp người quản trị mới.'
  },
  IT_ADMIN_HANDOVER_PENDING: {
    title: 'IT Admin sắp rời vị trí, cần nhận bàn giao',
    body: 'IT Admin {{employeeId}} {{sourceKind}} từ {{dueOn}} nhưng vẫn còn phụ trách thuê bao hoặc ứng dụng. Cần có IT Admin nhận bàn giao.'
  },
  IT_ADMIN_HANDOVER_RECEIVED: {
    title: 'Bạn đã nhận bàn giao từ IT Admin khác',
    body: '{{fromEmployeeId}} đã bàn giao cho bạn {{subscriptions}} thuê bao và {{applications}} ứng dụng.'
  },
  POLICY_PUBLISHED: {
    title: 'Chính sách mới có hiệu lực',
    body: 'Chính sách {{policyCode}} đã có phiên bản {{versionNumber}}. Khi requiresReacknowledgement = true: "Bạn cần đọc và xác nhận lại." Khi false: "Bạn không cần xác nhận lại."'
  }
} as const
