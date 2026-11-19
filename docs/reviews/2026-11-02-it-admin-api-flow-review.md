# Review luồng IT Admin và API v1 — 02/11/2026

Kết luận: **chưa nên xem IT Admin hiện tại là luồng vận hành hoàn chỉnh**. Cấu trúc API có nền tảng phù hợp, nhưng còn đường nghiệp vụ bị kẹt, dữ liệu cần quyết định bị ẩn và thao tác đòi người dùng biết UUID. Một phần cần sửa FE bằng API đã có; một phần là thiếu khả năng biểu đạt hoặc thiếu read model ở BE. Không cần thiết kế lại toàn bộ API.

Lượt tích hợp trước chứng minh được nhiều lời gọi và trạng thái kỹ thuật; chưa chứng minh đầy đủ hành trình nghiệp vụ. Có test đang xác nhận một điều kiện sai: yêu cầu phần mềm mới chỉ nối được danh mục khi có công cụ tương đương. Vì vậy số test xanh không thay thế kiểm tra các tình huống thực tế dưới đây.

## 1. Phạm vi và độ chắc chắn

- Review code IT Admin hiện tại, các component dùng chung liên quan, toàn bộ 287 operation của OpenAPI và tài liệu API/BRD hiện hành. HEAD khi bắt đầu: `e8a82e5`; workspace có thay đổi Finance/Approver đang làm dở, được giữ nguyên.
- So bằng `fingerprintOf`/`diffFingerprints` của bộ tài liệu: **không có operation, schema hay security scheme khác** giữa snapshot FE và coverage manifest. Hash theo byte khác do biểu diễn tệp không đủ để kết luận contract khác.
- Snapshot FE SHA-256: `68639fa96dc15d5ae621d121909987badde92e58373b066413b205ad4998d694`. Tài liệu API mô tả BE `25d524477406`.
- Đã chạy mã nguồn thực của hai hàm điều kiện để tái hiện: phần mềm mới không có công cụ tương đương bị khóa liên kết; tác vụ cấp lỗi luôn có nút hủy dù chưa biết có rút yêu cầu hay không. Bằng chứng tại `C:/fe_capstone/scratch/it-admin-review-checks.json`.
- Không sửa code sản phẩm/contract, không gọi ghi BE và không kiểm chứng transaction, worker, connector hoặc phân quyền thực tế trên server. Các rủi ro cần kiểm chứng BE được ghi riêng, không kết luận là server chắc chắn có lỗi.
- Căn cứ nghiệp vụ: quyết định hiện hành → BRD → EP/AC phù hợp quyết định. BRD ghi WF/UF đã là lịch sử theo QĐ-87i. Prototype Figma cũ là tham khảo trải nghiệm, không đủ căn cứ khôi phục chức năng đã bỏ.

**P1:** chặn một luồng thông thường hoặc có nguy cơ xử lý sai đối tượng/thiếu thông tin an toàn quan trọng. **P2:** thiếu khả năng vận hành, phục hồi hoặc phân biệt dữ liệu; cần xử lý trước khi sử dụng thường xuyên. Các đề xuất thiết kế không tự động có nghĩa là BE đang vi phạm quy tắc.

Các đường dẫn mã dưới đây tính từ gốc `FE-dev-main/`; đường dẫn BRD/EP tính từ `C:/fe_capstone/docs/`.

## 2. Những điểm cần ưu tiên trước khi nghiệm thu

### R01 · P1 · FE đang nhầm công cụ thay thế với gói thực sự mua/cấp

**Tình huống:** nhân viên đề xuất phần mềm mới A, IT thẩm định xong, Người duyệt chi đồng ý. IT tạo application/plan/subscription A. Nếu không có `equivalentTool`, nút nối danh mục bị khóa. Nếu có công cụ tương đương B, hộp xác nhận lại gửi `planId` của B, không có chỗ chọn A.

**Bằng chứng:** `shadow-it/hooks/catalog-link-gates.ts:17` bắt buộc `equivalentTool.planId`; `shadow-it/components/catalog-link-section.tsx:53` truyền chính đối tượng đó vào dialog. Test `catalog-link-gates.test.ts:10` đang khẳng định trường hợp không có công cụ tương đương là không được nối.

Đặc tả `accessRequestAssessmentGet` nói `equivalentTool` chỉ là gợi ý không chặn; `accessRequestCatalogLink` nhận gói mới đã đăng ký sau duyệt chi. Xem `reference/requests-new-software-and-service-accounts.md:445` và `:2049`.

**Sửa:** FE phải tách lựa chọn gói thực hiện khỏi gợi ý thay thế, cho tìm/chọn gói đã đăng ký hoặc đi tạo gói rồi quay lại đúng yêu cầu. BE không cần đổi body `catalog-link` chỉ để sửa lỗi này. Nên đổi tên/giải thích `equivalentPlanId` rõ là `alternativePlanId`, bổ sung điều kiện tương thích khi nối gói nếu chưa có. Cần kiểm chứng BE từ chối gói không phù hợp; chưa có bằng chứng server cho phép nối sai.

### R02 · P1 · Nghỉ việc không đóng được phần của người rời đi trong yêu cầu nhóm

**Tình huống:** một yêu cầu nhóm có hai người còn mở; một người nghỉ. FE không có thao tác đóng dòng nhóm. Nếu `request.cancellable` bật nút, nó gọi endpoint hủy cả Request; contract từ chối khi còn nhiều người mở bằng `ACCESS_REQUEST.GROUP_REQUEST_UNSUPPORTED`. Chưa gọi BE thật để xác nhận response của tình huống này.

**Bằng chứng:** `offboarding/components/offboarding-details.tsx:193` không phân nhánh theo `request.group`; `offboarding-action-dialog.tsx:42` luôn gọi `accessRequestCancelForDeparture`. API đã có `accessRequestLineCloseForDeparture(id, employeeId, body)`.

**Sửa FE:** giữ ngữ cảnh người rời đi; yêu cầu nhóm gọi đóng đúng dòng, yêu cầu đơn gọi hủy Request. Hiển thị rõ những người còn lại vẫn tiếp tục. Không cần BE tạo endpoint mới cho nhánh này.

### R03 · P1 · FE không gửi được bằng chứng thu lại lời mời/hoàn tác khi hủy cấp đang làm

`offboarding-action-dialog.tsx:43` chỉ gửi `{cause, note}`. `CancelBodyDto` và `LineClosureBodyDto` đã có `evidence`; API trả `ACCESS_REQUEST.EVIDENCE_REQUIRED` khi việc cấp đã bắt đầu và cần đối chiếu/hoàn tác.

Ghi bằng chứng vào ô ghi chú vẫn không giải quyết được vì payload không có trường đó. Request/tác vụ còn mở làm hồ sơ nghỉ việc tiếp tục bị chặn. Căn cứ hiện hành: BRD FR-2.12, dòng 508.

**Sửa FE:** hỏi trạng thái thực tế và bằng chứng riêng, gửi đúng field. **BE nên bổ sung** `closureRequirements` gồm loại thao tác, `evidenceRequired`, tác vụ liên quan và mã lý do; boolean `cancellable` chưa hướng dẫn đủ cách hoàn tất.

### R04 · P1 · Người thực hiện thu hồi thiếu thông tin bàn giao và hạn giữ dữ liệu

Hàng đợi hết hạn bỏ qua `item.handover`; chi tiết tác vụ không có metadata cổng bàn giao. Quyền trong offboarding cũng không hiện đầy đủ `revocationNote`, hạn/người xác nhận, lý do đang chờ và `accessRunsOnUntil`.

**Tình huống:** gói sẽ mất dữ liệu khi gỡ; IT chỉ thấy cảnh báo chung rồi tới nút nhận/hoàn tất tác vụ, không thấy cần ai xác nhận hoặc được giữ đến lúc nào. Với K1, tác vụ hủy gia hạn hoàn tất nhưng quyền còn truy cập tới ngày X; UI dễ khiến IT không hiểu vì sao hồ sơ chưa đóng được.

**Bằng chứng:** `provisioning/components/provisioning-expiry-queue.tsx:77`, `provisioning/task-actions.ts:10`, `offboarding/components/offboarding-details.tsx:154`. `TaskResponseDto.data.task` không có `handoverDutyId`, `blockedUntil` hay cổng thực thi; expiry/right DTO đã có một phần thông tin bàn giao. BRD FR-2.12, dòng 506 quy định bàn giao, giữ có hạn và K1 đang chấm dứt.

**Sửa FE ngay:** hiện lưu ý của chính gói, hạn xác nhận/người xác nhận và trạng thái truy cập đã có; nối tới `handoverDutyGet/Confirm` đúng thẩm quyền. Hạn giữ/cổng gỡ cần BE trả rõ, không suy từ `dueOn`. **BE:** trả cổng thực thi có cấu trúc trên task và kiểm tra lại trong transaction khi bắt đầu/hoàn tất. **Chưa kết luận BE cho phép gỡ sớm**: cần đọc handler và test integration để xác minh.

### R05 · P1 · Thiếu đường xử lý điều chuyển, dù API đã có

IT không có màn công việc điều chuyển/đóng hồ sơ điều chuyển. Chuyển người phụ trách tài khoản dịch vụ chỉ có trong offboarding và bị giới hạn `fileKind === OFFBOARDING`. Do đó duty thuộc `TRANSFER` không xử lý được ở bề mặt này.

API đã có `departmentTransferList`, `departmentTransferClose`, `serviceAccountDutyList`, `licenseAssignmentChangeResponsible`; quyền/việc IT được ghi rõ trong `roles/it-admin.md`. Đóng điều chuyển có thể bị chặn bởi `SERVICE_ACCOUNT_UNASSIGNED`.

**Sửa FE:** bổ sung đường vào công việc điều chuyển và chuyển trách nhiệm theo đúng hồ sơ. Không đưa việc ghi sự kiện nhân sự về IT; việc đó vẫn thuộc Super Admin. Không cần BE xây lại cơ chế ghi điều chuyển.

### R06 · P1 · UI thuê bao không ghi/đọc đủ hạn báo hủy

`dept-catalog/components/catalog-subscription-editor.tsx:112` không gửi `noticeDeadline`; các ngày ở `:184` không có field này. UI cũng không hiện nguồn hạn (`DECLARED`, `INFERRED_UNCONFIRMED`, `MISSING`...), cảnh báo và mốc nhắc có sẵn.

**Tình huống:** hợp đồng có ngày cuối phải báo hủy cụ thể. IT chỉ điền được số ngày báo trước, không nhập được ngày đã xác nhận và không thấy ngày server đang dùng là suy ra chưa xác nhận. Đây là thông tin tác động trực tiếp đến gia hạn tự động, BRD FR-1.3/FR-1.4, dòng 444–448.

**Sửa FE:** dùng field `noticeDeadline` mà `subscriptionCreate/Update` đã hỗ trợ; hiện nguồn và cảnh báo. Không yêu cầu BE thêm lại field đã có.

### R07 · P1 nếu K4 thuộc phạm vi nghiệm thu · API kho khóa chưa tạo thành vòng đời cấp/thu hồi K4

Danh mục và kho khóa cho khai K4, import và reveal, nhưng `provisioningTaskGrant` từ chối K4; inventory API không có thao tác gán khóa cho người + thiết bị, gỡ kích hoạt và đưa khóa về kho/loại bỏ. Baseline K4 cũng bị từ chối `SEAT_BASELINE.PLAN_NOT_SUPPORTED`.

BRD FR-1.9/FR-2.10, dòng 458/493 vẫn có vòng đời K4; K3 mới là loại chỉ đặc tả. Vì vậy không nên coi import/reveal khóa là đã hoàn thành quản trị K4.

**Chốt với BE/Owner:** hiện thực binding và thu hồi K4 có transaction, hoặc ghi rõ K4 chưa nằm trong phần thực thi của bản phát hành. FE phải giới hạn tương ứng; không cho người dùng đi hết form rồi mới nhận lỗi không hỗ trợ.

## 3. Các lỗ hổng vận hành P2 đã xác nhận

| Mã  | Phát hiện và ảnh hưởng                                                                                                                                       | Trách nhiệm / xử lý tối thiểu                                                                                                                                                                        | Bằng chứng chính                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R08 | Không có đường nhận việc thẩm định trong FE ngoài nhập UUID. Sau duyệt chi cũng khó tìm việc còn thiếu nối danh mục.                                         | FE nối `notificationList` và deep link đã có ngay; BE bổ sung hàng đợi việc còn mở có phân trang, người giữ bước, SLA và giai đoạn. Thông báo đã đọc vẫn không thay thế backlog.                     | `shadow-it/views/it-shadow-it-view.tsx:25`; `components/dashboard-header.tsx:78`; API-GAP-03; `notificationList` tồn tại.                                              |
| R09 | Chọn owner/người kế nhiệm/phòng/phiếu trùng bằng UUID; nhiều thuê bao cùng tên gói không phân biệt được phòng, kỳ, loại mua.                                 | FE dùng `departmentList`, `departmentTechnicalMemberList`, `currencyList`, danh sách plan/issue đã có. BE thêm display context và bộ lọc phù hợp nếu thiếu; không mở API nhân sự Super Admin cho IT. | `catalog-application-form.tsx:100`, `catalog-purchase-form.tsx:130`, `offboarding-service-duties.tsx:113`, `issue-transition-dialog.tsx:65`.                           |
| R10 | Form cấp trả phí cho phép bỏ thuê bao, K5 vẫn hiện chọn thuê bao; danh sách không đủ ngữ cảnh chọn đúng phòng/còn ghế.                                       | FE tách nhánh trả phí/K5; BE bổ sung `provisioningType`, phòng và yêu cầu đầu vào vào grant queue, bộ lọc phòng và capacity cho subscription candidates. Không nhất thiết cần endpoint mới.          | `provisioning-grant-queue.tsx:34`, `:40`, `:88`; `GrantQueueResponseDto.plan` chỉ có id/tên.                                                                           |
| R11 | Mọi GRANT lỗi đều hiện hủy rút yêu cầu, dù API chỉ cho hủy khi đã rút.                                                                                       | FE đọc trạng thái rút hoặc BE mở rộng permitted actions với `CANCEL_WITHDRAWN`; đừng suy ra từ `FAILED`.                                                                                             | `provisioning/task-actions.ts:26`; `provisioningTaskCancel` có `NO_WITHDRAWAL`. Đã tái hiện bằng hàm nguồn.                                                            |
| R12 | Nhiều tác vụ automatic không tự cập nhật; lỗi gần nhất, retry time và người đang nhận việc bị ẩn.                                                            | FE hiển thị DTO đã có, polling vừa phải khi tác vụ còn mở và tab đang hoạt động. Tách nhận mới khỏi tiếp quản. BE cần điều kiện phiên bản/ownership cho tiếp quản an toàn.                           | `provisioning/views/it-provisioning-view.tsx:38`, `:113`; `query-client.ts:8`; claim cho phép tiếp quản IN_PROGRESS.                                                   |
| R13 | Nút refresh offboarding chỉ tải detail, còn quyền/request/grant/duty giữ snapshot cũ. Task ID có sẵn nhưng không có nút mở đúng task.                        | FE refresh cả nhóm query của case; điều hướng bằng `taskId` thay vì về hàng đợi chung.                                                                                                               | `offboarding-details.tsx:35`, `:65`, `:164`, `:242`.                                                                                                                   |
| R14 | Không có UI cấu hình owner/admin workspace K2, quy trình chuyển owner, điều khoản/checklist, giới hạn cài đặt K4 và ý kiến điều khoản.                       | FE dùng `planWorkspaceProfileSet`, `planTermsSet/Get`, `planTermOpinionRecord`, `planWarningList` đã tồn tại. Đây là phần chưa map, không phải toàn bộ đều thiếu API.                                | `catalog-plan-editor.tsx:83`; BRD FR-2.9 dòng 491 và FR-1.10 dòng 462.                                                                                                 |
| R15 | Ngừng ứng dụng chỉ có nút bị khóa; không hiện blockers hay bước ghi xác nhận Business Owner.                                                                 | FE hiện preflight, trạng thái xác nhận và gọi `applicationRetirementConfirm` trước retire khi đủ điều kiện. Xác nhận phải theo đúng nghĩa ghi nhận của endpoint, không giả làm owner đăng nhập.      | `catalog-application-detail.tsx:197`; retirement DTO đã có blockers/confirmation.                                                                                      |
| R16 | Xóa field nullable không thật sự xóa: `noticePeriodDays` rỗng bị bỏ khỏi PATCH; assessment owner/equivalent/risk rỗng thành undefined và quay về giá trị cũ. | FE phân biệt unchanged / value / explicit null; BE đã hỗ trợ null ở các field này.                                                                                                                   | `catalog-subscription-editor.tsx:119`; `shadow-it/components/assessment-fields.tsx:137`; `AssessmentPatchDto`, `UpdateSubscriptionBodyDto`.                            |
| R17 | Lưu form thẩm định/hoàn tất không cho kiểm tra đầy đủ báo giá, tổng tiền, lịch trả và chi phí ước tính; thiếu dữ liệu chỉ hiện thông báo chung.              | FE hiện `pricing`, `costEstimate`, `missingReason` sẵn có; BE thêm danh sách field/cổng còn thiếu trước submit. Không tính lại tiền bằng number ở FE.                                                | `shadow-it/views/it-shadow-it-view.tsx:96`; `assessmentResponseDtoDataAssessmentPricing.ts`; `...CostEstimate.ts`; response chỉ có `complete` cho độ đầy đủ tổng quát. |
| R18 | Vault bỏ qua summary đã mua/usable/effective capacity trên lần mở lại; baseline cho chọn K4 dù contract từ chối.                                             | FE render `KeyPageResponseDto.summary` thường trực; lọc/giải thích target không hỗ trợ trước upload.                                                                                                 | `catalog-license-keys.tsx:75`, `:131`, `:217`; `catalog-seat-baseline.tsx:39`.                                                                                         |
| R19 | Chi tiết SaaS bỏ qua mã ticket vendor, tác vụ cấp liên quan, linkedWork, phiếu gốc/lý do trùng, mức ảnh hưởng, thời điểm và hạn phản hồi.                    | FE hiện thông tin đã lưu và thêm lựa chọn liên kết luồng có sẵn; queue mặc định việc được giao và có bộ lọc quá hạn. Không tự tạo tác vụ từ phiếu.                                                   | `saas-issues/components/issue-detail.tsx:44`; `issue-transition-dialog.tsx:50`; `it-saas-issues-view.tsx:17`; DTO đã có.                                               |

Một số cải thiện UX tiếp theo: mở tin nhắn mới nhất sau gửi khi lịch sử >20 dòng; dùng URL lưu đối tượng đang xem để Back/refresh/quay từ danh mục không mất ngữ cảnh; cảnh báo rời form còn nháp; tổng quan ưu tiên việc cần làm/quá hạn thay vì chỉ tổng số bản ghi lịch sử. Đây không phải lý do bắt BE xây thêm một bộ API mới cho từng nút.

## 4. Những chỗ BE thực sự cần bổ sung hoặc làm rõ

### B01 · Chứng từ chưa gắn được với đối tượng mua một cách có thể tìm lại

Toàn bộ spec chỉ có `contractCreate/Get`, không có contract list; contract chỉ chứa id/name/người tạo/thời điểm. `contractId` chỉ xuất hiện ở các schema document, không có quan hệ với application/plan/subscription/request; cũng không có đọc danh sách tệp của hợp đồng.

Vì vậy thêm widget upload ở FE chưa đủ: sau reload vẫn không có đường từ thuê bao tới hợp đồng/hóa đơn và tệp để người có quyền kiểm tra. BRD FR-1.5, dòng 449 yêu cầu lưu tệp hóa đơn/hợp đồng gốc.

Có lệch quyền rõ trong contract: `documentLink` chỉ cho IT Admin/Finance và quy định từ chối Spending Approver (`reference/catalog-plans-subscriptions.md:2558`, `:2579`), trong khi FR-1.5 cho Người duyệt chi mở **chỉ tệp thuộc hồ sơ đang được giao quyết**. Cần cả quan hệ đối tượng và kiểm tra quyền theo hồ sơ, không chỉ mở role này cho toàn bộ chứng từ.

**Đề xuất tối thiểu:** quan hệ mua/thuê bao ↔ hợp đồng; đọc hợp đồng/tệp theo đối tượng có phân quyền; metadata số hợp đồng/nhà cung cấp/hiệu lực nếu thực sự được nghiệp vụ sử dụng. Giữ quy trình signed upload → complete → attach; xử lý hết hạn URL và kiểm tra tệp ở BE. Mức ưu tiên P1 nếu chứng từ là điều kiện nghiệm thu luồng mua, còn lại P2 phải có trước vận hành đầy đủ.

### B02 · Bằng chứng phiếu lỗi là khoảng trống giữa BRD và contract

BRD FR-2.15 dòng 519 và EP-07 US-07-10 AC-4 dòng 481 có tệp minh chứng tùy chọn. `saasIssueSubmit` hiện nói không đính kèm tệp; submit/message/detail không có attachment refs. Generic documents chỉ gắn contract, không phải lời giải sẵn cho nhân viên đính kèm ảnh lỗi.

**Chốt phạm vi:** thêm upload/download có quyền theo phiếu, `attachmentIds`/metadata và purpose phù hợp; hoặc ghi quyết định hoãn minh chứng vào phạm vi phát hành. OQ-31 chưa chốt thời hạn lưu không tự động có nghĩa là chức năng đính kèm đã được hoãn.

### B03 · Preflight và permitted actions phải đủ để FE giải thích được

Các cổng hiện rải ở `complete`, `missing`, `canRetire`, `canConfirm`, `availableDecisions`, `cancellable`, hoặc chỉ lộ khi POST lỗi. Task lại thiếu gate bàn giao; offboarding blockers là map khóa tùy ý sang số.

Nên chuẩn hóa một projection theo tác vụ, không chuyển luật nghiệp vụ về FE. Ví dụ **đề xuất, chưa phải DTO hiện có**:

```json
{
  "version": 12,
  "allowedActions": ["RECORD_HANDOVER"],
  "executionGate": {
    "state": "WAITING_HANDOVER",
    "blockedUntil": "2026-11-03T10:00:00Z",
    "handoverDutyId": "<uuid>",
    "blockers": [{ "code": "HANDOVER_PENDING", "resourceId": "<uuid>" }]
  }
}
```

Mã có danh mục ổn định, tài nguyên và hành động để mở nơi giải quyết; FE dịch code. GET preflight chỉ là hướng dẫn, POST vẫn phải kiểm tra lại nguyên tử. BE trả hạn giữ có hiệu lực theo chính sách đã chốt: nghỉ đột ngột mặc định 1 ngày làm việc; giá trị hạn ngắn cho một số nguồn thu hồi khác còn cần chốt (EP-07, OQ-D-05). FE không tự suy ra hạn giữ từ dueOn.

### B04 · Cần đường phục hồi thao tác ghi bị mất phản hồi

Không tự retry write là đúng. Nhưng sau tạo grant thành công mà mất response, người dùng mất task ID, dialog vẫn còn và chỉ nhận thông báo chung. Task list không lọc theo request/beneficiary; import ID/idempotency key chỉ ở state của component nên rời trang mất phiên phục hồi.

**BE:** idempotency key cho ý định tạo grant/tạo tài nguyên quan trọng, hoặc route đọc lại outcome theo request/client operation ID; tìm task theo Request; danh sách/đọc lại import đang mở. **FE:** giữ operation/import ID theo URL hoặc storage có phạm vi phiên, reconcile trước khi bật gửi lại. Chưa có bằng chứng tạo trùng seat thật; guard overlap có thể đã chặn, nhưng phục hồi UX hiện chưa khép kín.

### B05 · Concurrency cần điều kiện phiên bản, nhất là việc ở nhà cung cấp

Claim hiện cho IT khác tiếp quản tác vụ IN_PROGRESS mà không có expected version hay lý do. Snapshot form FE giảm stale write nhưng không đóng được race sau GET. Form application vẫn gửi cả những field người dùng không sửa.

**BE đề xuất:** `version`/ETag và precondition cho cập nhật, claim/takeover/complete; takeover rõ người đang làm và lý do; audit người thực hiện; kiểm tra quyền/owner hiện tại nguyên tử. **FE:** gửi field thay đổi, cảnh báo tiếp quản và hiện claimant. Đây là rủi ro cần test đồng thời, chưa phải kết luận server đang ghi đè mất dữ liệu.

### B06 · Lời mời chưa chấp nhận cần trạng thái con và bằng chứng hoàn thành rõ

BRD FR-2.5 dòng 484 có giữ seat, nhắc sau N ngày, thu lại sau M ngày; KPI-2 dòng 125 loại lời mời chưa chấp nhận. Task có `doneWhen = MEMBER_ACTIVE`, nên không đúng nếu nói contract không có khái niệm thành viên hoạt động. Tuy nhiên chưa có invitation state/timestamp/deadline và kết quả typed cho đã mời/chưa kích hoạt.

**Chốt BE:** IN_PROGRESS đã bao gồm chờ chấp nhận chưa, worker kiểm tra lúc nào, điều kiện chuyển COMPLETED là gì? Có thể thêm `deliveryState`/`invitation` riêng thay vì tăng tất cả enum trạng thái. FE phải hiện rõ và không hướng dẫn IT coi “đã gửi lời mời” là “đã dùng được”. Kiểm thử worker/handler trước khi kết luận.

### B07 · Duty cần liên kết với đúng nguồn; duplicate cần đường theo dõi bảo vệ riêng tư

- Handover list chưa lọc theo case/file; FE hiện dùng employeeId để ghép duty vào offboarding. Detail không có originating case/file ID, nên danh sách có thể lẫn duty từ hoàn trả/hết hạn/điều chuyển. BE nên trả source reference hoặc source memberships vì một duty có thể dùng lại giữa nhiều lý do; FE hiện đúng ngữ cảnh. `canConfirm` vẫn bảo vệ quyền, không có bằng chứng vượt quyền.
- EP-07 cho phiếu E3 trùng phiếu E1; reporter của E3 không được GET nội dung riêng của E1. Nên có canonical progress/resolution summary hoặc phản chiếu kết quả an toàn, không mở cả hội thoại gốc. Đây là khoảng trống trải nghiệm/quyền cần thiết kế, không phải yêu cầu bỏ kiểm tra quyền.

### B08 · OpenAPI cần giữ đủ ngữ nghĩa cho Orval

`ErrorEnvelopeDto.error.details` hiện là map không có cấu trúc. Nhiều ngày nghiệp vụ là string không có format; validator có thêm luật không thể thấy ở type sinh. FE hiện chủ yếu gộp 422 thành lỗi chung, không đưa `details.issues[].path` về field.

**BE:** mô tả format date/date-time đúng chỗ, enum lỗi/readiness ổn định, schema cho issues/blockers/retry metadata, luật liên trường hoặc ví dụ hợp lệ. Cân nhắc discriminator cho union request/draft. **FE:** map lỗi theo operation + code + path, giữ nháp và đưa người dùng tới trường cần sửa. Không hiển thị nguyên thông báo tiếng Anh của validator như copy sản phẩm.

## 5. Field nào thiếu, field nào không nên gọi là dư

| Nhóm                                                     | Đánh giá / đề xuất                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `equivalentPlanId` và gói thực hiện                      | Khác nghĩa. Giữ phương án tương đương tùy chọn, tách lựa chọn fulfillment. Tên hiện tại dễ gây nhầm; không dùng một field cho cả hai.                                                                                                                                                                            |
| `complete` và `status = COMPLETED`                       | Một cái nói đủ dữ liệu, một cái nói đã quyết. Nên đổi boolean thành `completionReadiness.isReady` kèm missing/blockers; tránh trả hai cờ cùng nghĩa.                                                                                                                                                             |
| `vendorId` + `vendorName`                                | Không tự động dư: có thể là vendor chuẩn hóa và tên snapshot. Cần chốt ưu tiên khi gửi cả hai, cho phép thay/xóa thế nào; không để FE đoán.                                                                                                                                                                      |
| `quote` / `pricing` / `costEstimate`                     | Không dư: báo giá gốc, giá tính cho Request và chi phí ước tính có thuế. Phải giải thích amount là theo người/kỳ hay trọn gói, quantity/basis, phiên bản báo giá và chênh lệch khi mua thực tế; hiện schema chưa làm rõ đủ mô hình giá của quote. Cần BE xác nhận công thức, chưa kết luận phép tính server sai. |
| `billingCycle` / `paymentFrequency` / `commitmentMonths` | Không dư: chu kỳ định giá, lịch trả tiền và cam kết là ba chiều khác nhau. UI cần phân nhóm/nhãn rõ, không xóa bớt để làm ngắn form.                                                                                                                                                                             |
| `requester` / `beneficiary` / `responsibleEmployee`      | Không dư: gửi hộ, người dùng quyền và người phụ trách tài khoản dịch vụ khác nhau. UI nên hiện đúng vai thay vì chỉ tên một người.                                                                                                                                                                               |
| `planId` / `subscriptionId` / `applicationId`            | Không dư: `planId` là gói, `subscriptionId` là lần mua/thuê bao, `applicationId` là sản phẩm. UUID là dữ liệu truyền API, không nên là thông tin bắt người vận hành nhập thủ công.                                                                                                                               |
| `count` cùng `assignmentIds` khi thu hồi                 | Có thể nhìn như trùng, nhưng contract dùng count làm xác nhận số quyền lựa chọn, kể cả khi bỏ IDs để chọn tất cả. Không bỏ vội; nên gọi rõ `expectedSelectedCount` và vẫn tính/kiểm tra ở server.                                                                                                                |
| Summary/cảnh báo/capacity                                | Nhiều field đã có nhưng FE bỏ qua. Đưa ra UI trước khi đề nghị BE bổ sung bản sao của chính dữ liệu đó.                                                                                                                                                                                                          |
| Secret trong task/phiếu/bằng chứng                       | Không thêm password/token/key để làm luồng có vẻ tiện hơn. Giữ vault riêng, reveal ngắn hạn và hướng dẫn không đưa secret vào note/evidence.                                                                                                                                                                     |

## 6. Luồng đích nên nhìn như thế nào trên FE

**Phần mềm mới trả phí:** việc được giao → mở đúng đề xuất → lưu thẩm định theo nhóm thông tin → thấy checklist còn thiếu và preview chi phí do BE tính → hoàn tất thẩm định → theo dõi đang chờ trình/duyệt → duyệt xong xuất hiện việc cấu hình danh mục → tạo/chọn đúng application/plan/purchase trong ngữ cảnh Request → xem readiness → nối gói thực hiện → mở đúng tác vụ cấp → thấy kết quả dùng được. Công cụ tương đương luôn là gợi ý phụ.

**Cấp/thu hồi:** queue theo phòng/người phụ trách và độ gấp → chi tiết có người đang xử lý, hướng dẫn và điều kiện trước thao tác → nhận việc/tiếp quản có ý thức → thực hiện ngoài hệ thống hoặc theo dõi connector → ghi kết quả và bằng chứng phù hợp kiểu K → kiểm tra outcome khi mất phản hồi. Có hướng dẫn rõ khi cần bổ sung thuê bao/ghế/baseline, không chỉ nút bị khóa.

**Nghỉ việc:** mở case và xác nhận đã LEFT → ưu tiên khóa tài khoản công ty ngoài hệ thống và ghi nhận → từng dòng quyền có lưu ý/hold/handover và K1 còn truy cập → hủy đúng Request hoặc dòng nhóm kèm bằng chứng → đổi người phụ trách tài khoản dịch vụ đúng phòng → mở task trực tiếp → quay lại case đã refresh → checklist/blocker chỉ đúng việc cần làm → đóng khi BE xác nhận. Chặn đăng nhập ứng dụng/credential thiết bị theo sự kiện nhân sự thuộc luồng Super Admin/BE. Không đổi người dùng license cá nhân thành người kế nhiệm; không để IT xác nhận thay trưởng phòng.

**SaaS:** việc được giao/quá hạn → đủ category/impact/owner/ticket vendor → hội thoại mới nhất → ghi kết quả và liên kết tác vụ cần xử lý → duplicate có picker + phiếu gốc/lý do → người báo theo dõi được tiến độ trong phạm vi quyền. Giữ phạm vi hỗ trợ SaaS, không mở rộng thành bộ ITSM đầy đủ.

## 7. Thứ tự thực hiện đề nghị

1. Sửa FE không chờ BE: R01–R03, R06, picker/nhãn thuê bao, hủy đúng điều kiện, context bàn giao đã có, refresh/deep link và nullable clears. Sửa cả test đang khẳng định rule sai.
2. Khép các chức năng FE còn thiếu nhưng API đã có: điều chuyển, workspace/terms, retirement confirmations, notifications, thông tin ticket/linked work và capacity warnings.
3. BE chốt gate thực thi/closure, readiness, outcome recovery/idempotency và concurrency. Thống nhất scope K4, chứng từ và tệp phiếu lỗi trước khi cam kết nghiệm thu.
4. Khép read model IT work queue, contract associations/history/import recovery và candidate filtering cần thiết. Không dựng một endpoint cho mỗi nhãn UI.
5. Chạy acceptance nhiều vai với backend thật hoặc môi trường integration riêng; không lấy ví dụ JSON tổng hợp hay test mock làm bằng chứng kết thúc nghiệp vụ.

## 8. Các ca nghiệm thu bắt buộc bổ sung

- Đề xuất phần mềm mới không có công cụ tương đương, duyệt mua xong tạo gói mới và cấp được đúng gói.
- Có công cụ tương đương B nhưng quyết định mua A: không nối B ngoài ý muốn; đổi gói không tương thích bị BE từ chối rõ.
- Nhóm ba người, một người nghỉ/điều chuyển: chỉ đúng dòng bị đóng, những người khác tiếp tục.
- Hủy khi chưa làm, đã mời chưa nhận, đã có quyền thực và đang lỗi: bằng chứng/kết cục khác nhau theo thực tế.
- Nghỉ đột ngột với gói mất dữ liệu: khóa đăng nhập ngay, gỡ dữ liệu theo confirmation hoặc hạn giữ server; không thể bỏ qua bằng gọi API trực tiếp.
- K1 hủy gia hạn nhưng còn tới X: vẫn hiện access còn chạy và không đóng sớm hồ sơ; ghi access-cut đúng thời điểm/bằng chứng.
- Duty IT từ hết hạn và duty trưởng phòng từ nghỉ việc cùng nhân viên: đúng nguồn, đúng người xác nhận, không nhập nhằng quyền.
- Hai IT cùng nhận/tiếp quản/sửa tài nguyên: kết quả có precondition/audit rõ, không âm thầm làm hai lần ở nhà cung cấp.
- POST tạo grant đã commit nhưng mất response: đọc lại đúng task, không tạo lại hoặc buộc người dùng mò queue.
- K2 gửi lời mời chưa được chấp nhận: giữ seat và hiển thị đang chờ; chỉ hoàn tất khi đạt MEMBER_ACTIVE; nhắc/thu lại theo N/M.
- Hai phòng cùng mua một gói, nhiều kỳ: chọn đúng thuê bao bằng tên phòng/kỳ; không thể cấp chéo phòng.
- Hạn báo hủy khai rõ, suy ra, chưa xác nhận và bị xóa: cảnh báo dùng đúng nguồn; PATCH null thật sự xóa.
- Baseline bỏ trang/quay lại, preview hết hạn, CSV sai cột và đóng khi còn import khác: phục hồi/giải thích được; K4 không đi vào nhánh không hỗ trợ.
- K4 nếu trong scope: khóa → người + thiết bị → kiểm giới hạn → gỡ kích hoạt → về kho/loại bỏ theo điều khoản.
- Tải lại thuê bao vẫn tìm được hợp đồng/tệp; người không liên quan không tải được chứng từ.
- Phiếu lỗi có >20 tin nhắn, mã ticket, linked task, duplicate khác reporter và tệp minh chứng: đọc lại/theo dõi đúng, không lộ hội thoại riêng.
- Retirement thiếu xác nhận owner hoặc còn quyền/thuê bao: chỉ ra đối tượng chặn; giải quyết xong mới cho ngừng.

## 9. Những thiết kế nên giữ

Tách quyết định nghiệp vụ khỏi task thực thi; giữ quyền nhân sự ở Super Admin; dùng Money dạng chuỗi và ngày nghiệp vụ dạng ngày; server kiểm quyền/cổng nghiệp vụ; queue phân trang; không retry write tự động; confirmation import idempotent theo một ý định; K1 phân biệt hủy gia hạn và cắt truy cập; vault không đưa secret vào query/mutation result, có xác nhận reveal và chống response muộn; không giả gửi ticket vendor; không tự mở luồng khác từ phiếu lỗi.

**Không yêu cầu khôi phục bộ công cụ chuẩn/requestability theo phòng:** QĐ-87h đã bỏ; banner FE nói thiếu API cho chức năng đó nên đổi cho đúng phạm vi sản phẩm. Usage/telemetry/optimization/renewal/reconciliation chưa có contract phải được thống nhất là ngoài phạm vi bản phát hành, thay vì tiếp tục giữ nhiều mục điều hướng trống như chức năng đã sẵn sàng.
