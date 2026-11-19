# Super Admin — bản đồ tích hợp API

Nguồn contract: `openapi/openapi.yaml`; hướng dẫn nghiệp vụ: `../docs/Figma UI-UX/API-Integration` (tài liệu ghi BE `25d524477406`). Orval đọc export live theo mặc định; sinh lại từ snapshot bằng PowerShell:

```powershell
$env:ORVAL_OPENAPI_SOURCE = './openapi/openapi.yaml'
pnpm api:generate
```

## Giao diện và operation

| Giao diện       | Operation được dùng                                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tổng quan       | `onboardingChecklistGet`, `superAdminWatchGet`                                                                                                                                                                                        |
| Tài khoản       | `appUserList`, `appUserGet`, `accountCandidatesList`, `appUserCreate`, `appUserResendInvitation`, `appUserLock`, `appUserUnlock`, `appUserGrantRole`, `appUserRevokeRole`                                                             |
| Trách nhiệm     | `approvalRoleList`, `approvalRoleSet`, `superAdminTransfer`; đọc lại `meGet` sau chuyển giao                                                                                                                                          |
| Phòng ban       | `departmentList`, `departmentGet`, `departmentMemberList`, `departmentCreate`, `departmentUpdate`, `departmentDeactivate`, `departmentHeadAssign`, `departmentHeadVacate`, `departmentSuccessorDesignate`, `departmentSuccessorClear` |
| Dự án           | `projectList`, `projectGet`, `projectCreate`, `projectUpdate`                                                                                                                                                                         |
| Hồ sơ nhân viên | `employeeCreate`, `employeeUpdateOfficialFields`; đọc thành viên theo phòng, chọn người từ tài khoản hoặc ứng viên chưa có tài khoản                                                                                                  |
| Import nhân sự  | `employeeImportUpload`, `employeeImportGet`, `employeeImportRowList`, `employeeImportPreviewRefresh`, `employeeImportConfirm`, `employeeImportCancel`                                                                                 |
| Điều chuyển     | `departmentTransferList`, `departmentTransferRecord`, `departmentTransferReschedule`, `departmentTransferCancel`                                                                                                                      |
| Nghỉ dài hạn    | `longLeaveList`, `longLeaveStart`, `longLeaveChangeReturnDate`, `longLeaveConfirmReturn`                                                                                                                                              |
| Nghỉ việc       | `offboardingCaseList`, `offboardingCaseRecord`, `offboardingCaseChangeLastDay`, `offboardingCaseMarkLeft`, `offboardingCaseCancel`                                                                                                    |
| BM-09           | `personnelNoticeList`, `personnelNoticeGet`, `personnelNoticeRecord`, `personnelNoticeLinkEvent`, `personnelNoticeReject`                                                                                                             |
| Tham số         | `operatingParameterList`, `operatingParameterSet`, `operatingParameterHistory`                                                                                                                                                        |
| Cấu hình        | `nonWorkingDateList`, `nonWorkingDateAdd`, `nonWorkingDateRename`, `nonWorkingDateRemove`, `reportingCurrencyGet`, `reportingCurrencySet`, `currencyList`                                                                             |
| Vận hành        | `controlledWaitList`, `stepCongestionList`, `stepCongestionStepList`, `stepCongestionIncidentList`, `stepCongestionIncidentRecord`                                                                                                    |
| Audit           | `auditEventList` với bộ lọc tài nguyên, người thực hiện, hành động, thời điểm và phân trang                                                                                                                                           |

## DTO, status và quyền

- Response có envelope `{ success, message, data }`; component đọc `data`, chấp nhận `null`. Danh sách phân trang dùng `items` và `pagination` do BE trả, không suy số lượng từ một trang.
- Type/enum nguồn nằm trong `app/shared/api/generated/model/`; file `enums/` của mỗi slice import lại tập mã generated theo từng khái niệm. Không duy trì union demo song song. Mã lạ có nhãn trung tính và không mở thao tác phụ thuộc status.
- Tài khoản có `status` riêng (`ACTIVE`, `LOCKED`) và `activationState` riêng (`INVITED`, `ACTIVATED`). Vai trực tiếp được cấp/thu hồi thường là `IT_ADMIN`, `FINANCE`, `EMPLOYEE`; `SUPER_ADMIN` chỉ bàn giao qua operation riêng. `MANAGER` và `SPENDING_APPROVER` là vai suy ra, không phải lựa chọn gán vai trực tiếp.
- Trách nhiệm phê duyệt gồm `SPENDING_APPROVER`, `CONFLICT_SUBSTITUTE`, `FALLBACK_APPROVER`. Picker gửi **employee ID** khi gán trách nhiệm; bàn giao Super Admin gửi **app-user ID**. BE vẫn quyết định điều kiện nhân sự/trách nhiệm cuối cùng.
- `hrBasis`/`grounds` dùng đúng DTO từng operation, đủ `type`, `reference`, `issuer`, `issuedOn`; không gửi object từ GET làm body PATCH. Trường bỏ trống khác `null`; xóa email/chức danh phải xác nhận bằng lựa chọn riêng.
- Import xác nhận gửi `previewVersion`, `hrBasis`, `idempotencyKey` và tùy chọn xác nhận tệp trùng. Cùng ý định/payload giữ nguyên key khi thử lại sau lỗi không rõ kết quả; đổi preview hoặc căn cứ tạo ý định khác.

## Hành vi và giới hạn

- Tạo/sửa hồ sơ nhân viên có URL riêng `/dashboard/super-admin/personnel/new` và `/dashboard/super-admin/personnel/correct`, bọc RoleGuard giống dashboard; form dài không đặt trong modal nhỏ. Danh sách và lịch sử ngắn vẫn dùng tab/drawer của slice.

- Server state ở TanStack Query; mutation qua shared Axios/auth adapter, không tự retry. Chỉ đóng form/toast thành công sau response BE. Lỗi giữ draft và đọc lại nguồn dữ liệu liên quan; 403 đọc lại `/me`. Retry-After hiển thị countdown và khóa nút gửi trong thời gian chờ.
- Mã lỗi nghiệp vụ được ánh xạ sang nội dung VI/EN tại `shared/hooks/admin-errors.ts`; mã chưa có mapping rơi vào nhóm lỗi HTTP có chủ đích. Không hiển thị message kỹ thuật BE.
- Không có GET danh bạ nhân viên toàn cục ở contract này: danh sách theo phòng và picker tài khoản có phân trang; account-candidates có search, không có page. Có thể nhập mã định danh chính thức khi nguồn picker không có người cần chọn.
- Đã xóa runtime fixtures, bộ enum/translation demo Super Admin và phần auth demo hết dùng. Mock chỉ phục vụ test. Các role khác vẫn còn preview và fixture riêng.
- Định danh workstation và mô phỏng gửi nhắc của demo cũ đã bỏ; không dựng endpoint cho chức năng chưa có contract. Thao tác thu hồi kỹ thuật khi nghỉ việc thuộc IT Admin.
- Kiểm thử request bằng MSW không thay thế kiểm thử với tài khoản Super Admin trên BE local. Chưa thực hiện write trên VPS dùng chung.
