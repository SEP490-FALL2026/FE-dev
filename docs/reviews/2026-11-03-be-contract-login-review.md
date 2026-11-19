# Kiểm tra contract BE và lỗi login — 03/11/2026

## Kết luận

Login 200 nhưng dashboard không tải được do code viết tay Super Admin còn import `approval-roles` và `super-admin-transfers` đã bị BE gỡ. `DashboardPage` import các role cùng lúc nên lỗi module này ảnh hưởng cả năm role demo. Test dashboard trước sửa thất bại ngay ở bước import; test auth dùng dashboard giả vẫn pass.

Đã bỏ các import và workflow API đã gỡ, đọc Người duyệt chi bằng `appUserList(role=SPENDING_APPROVER)` và quản lý vai trực tiếp qua chi tiết tài khoản. Bổ sung `MANAGER`/`SPENDING_APPROVER` vào lựa chọn vai được cấp; `SUPER_ADMIN` vẫn không được gán/chuyển trong ứng dụng.

Đã sửa thêm nhánh `roles: []`, `selfServiceOnly: true`: mở workspace Employee để sử dụng các màn tự phục vụ đã giới hạn sẵn. Giữ nguyên `user.roles` do BE trả về; chỉ thêm quyền truy cập workspace Employee trong session FE, không thêm vai đặc quyền. Tài khoản không có vai và không được BE cho tự phục vụ vẫn không có workspace. Regression đã tái hiện `session.role === null` trước sửa.

## Nguồn và Orval

- Đã đọc `AGENTS.md`, `ARCHITECTURE.md`, `UI_UX_DESIGN_GUIDELINES.md`; không sửa ba tài liệu được bảo vệ.
- Đối chiếu `../docs/Figma UI-UX/API-Integration/README.md`, `ai-integration-guide.md`, thay đổi `2026-11-03-dev-30d14ac4-openapi.md`, reference xác thực/tài khoản và hướng dẫn Super Admin.
- GET OpenAPI thật tại origin BE cấu hình trong môi trường phát triển: 302 operation. Nội dung JSON sau parse trùng snapshot `openapi/openapi.yaml`, gồm `roles` dạng mảng, `managerScope`, nhân sự chưa xếp phòng và các API đã gỡ.
- `pnpm api:generate` đã chạy thành công với `ORVAL_OPENAPI_SOURCE=./openapi/openapi.yaml`. So sánh 3.077 file generated trước/sau: **0 file đổi, thêm hoặc xóa**. Generated đã theo contract mới trước lượt sửa; code viết tay chưa theo kịp. Không sửa tay generated hoặc đưa API đã gỡ trở lại.
- README phía Docs còn ghi bản này chưa deploy. Contract thật hiện đã có 302 operation và cùng cấu trúc snapshot; không dùng ghi chú deploy lịch sử để kết luận API mới còn 404. Đây chỉ chứng minh contract, không xác định commit image đang chạy hoặc trạng thái migration DB.

## Những phần đã sửa theo QĐ-93

| Phạm vi                  | Hành vi sau sửa                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tài khoản                | Bỏ gọi API trách nhiệm phê duyệt/chuyển Super Admin đã gỡ; đọc người giữ vai bằng lọc tài khoản, mở chi tiết để cấp/thu hồi vai. Cập nhật lời hướng dẫn VI/EN, bỏ mô tả vai suy ra. |
| Trưởng phòng/kế nhiệm    | Picker dùng lọc `role=MANAGER`, loại Người duyệt chi, không cho chọn nguồn nhân viên chưa có tài khoản cho các vị trí này. BE vẫn quyết định membership và điều kiện theo ngày.     |
| Request Employee/Manager | Bỏ ô và payload `projectLabel` khỏi cá nhân, nhóm, gửi hộ, tài khoản dịch vụ, gia hạn và xem trước. Không gửi field thừa vào body strict.                                           |
| Phòng ban                | Bỏ `hrBasis` khỏi create/update/deactivate/head/successor; cập nhật giới hạn mã 2–20, tên 200, chức năng 1000 ký tự.                                                                |
| Nhân sự/import           | Bỏ `hrBasis` khỏi tạo/sửa nhân viên và xác nhận import. Giữ `grounds` cho điều chuyển/nghỉ dài hạn/nghỉ việc. Giữ cơ chế idempotency của import.                                    |
| DTO/fixture              | Bổ sung `employeeId`, `newUnplaced`, `preview.blockedBy: null`; bỏ dữ liệu dự án cũ khỏi fixture có type.                                                                           |

## Browser với BE thật

Edge headless mở frontend local, dùng các alias trong tài liệu demo; không mock API. Mật khẩu/token chỉ dùng trong tiến trình, không lưu vào artefact.

| Role              | Alias        | Login và `/me` | Nội dung dashboard    | Reload phiên |
| ----------------- | ------------ | -------------- | --------------------- | ------------ |
| Employee          | `dung.pham`  | 200            | Đúng role, có heading | Pass         |
| Manager           | `cuong.le`   | 200            | Đúng role, có heading | Pass         |
| Finance           | `phuc.trinh` | 200            | Đúng role, có heading | Pass         |
| Spending Approver | `an.nguyen`  | 200            | Đúng role, có heading | Pass         |
| IT Admin          | `rang.mai`   | 200            | Đúng role, có heading | Pass         |

Không có lỗi JavaScript hoặc response API 4xx/5xx trong lượt login/reload cuối. Đã logout các phiên thử, BE trả 204. Chặn các mutation nghiệp vụ trong browser; không gửi/phê duyệt Request, cấp phát, sửa nhân sự hoặc ghi ngân sách trên BE dùng chung. Kiểm thử body mutation thực hiện bằng test HTTP cô lập.

Không có tài khoản Super Admin demo nên chưa kiểm thử live các thao tác Super Admin. Không coi kiểm thử login/dashboard là đã kiểm tra mọi menu hoặc toàn bộ API, cũng không phải đối chiếu từng pixel với thiết kế Figma.

## Phát hiện còn lại

1. **P2 — Chưa nối danh bạ và xếp phòng lần đầu.** `personnel/components/employee-panel.tsx` vẫn chỉ đọc thành viên theo phòng và tạo/sửa hồ sơ; không có consumer cho `employeeList`, `employeeGet`, `employeeFirstPlacement` trong feature. Người chưa xếp phòng có thể được tạo nhưng chưa có màn xếp phòng lần đầu theo `API-Integration/roles/super-admin.md#ho-so-nhan-vien`. Cần một lượt tích hợp chức năng riêng; không dùng API điều chuyển thay thế.
2. **P2 — Thiếu giải thích theo `blockedBy`.** `employee/software-request/components/live-request-preview.tsx` chưa render `preview.blockedBy`; `employee/shared/hooks/employee-errors.ts` chưa phân biệt `REQUEST_PARTY.INELIGIBLE` với lý do `SPENDING_APPROVER`/`UNPLACED`. Form đã chặn gửi khi `canSubmit=false`, nhưng thông báo hiện còn chung chung. Cần ánh xạ lý do VI/EN cho Employee và các luồng gửi hộ liên quan.
3. **Gate test có sẵn — 2 case presentation Super Admin.** `super-admin/shared/admin-technical-presentation.test.tsx` kỳ vọng nhãn dự phòng `Setup step`/`Bước thiết lập`, trong khi tài nguyên `admin.ts` đang trả nhãn khác; bản dịch riêng `admin-overview-presentation.ts` chưa được ghép. Hai lỗi này nằm ngoài thay đổi login/API trong lượt này. Không bỏ qua hoặc xóa test để báo toàn bộ suite xanh.
4. **Gate định dạng có sẵn — 22 file.** `pnpm check` dừng tại `prettier --check .`, gồm các file hướng dẫn, lookup và bản dịch chưa định dạng. Các file được sửa trong lượt này được kiểm tra định dạng/lint riêng; không chạy formatter toàn repo hoặc sửa tài liệu quy tắc.

`AGENTS.md`/`ARCHITECTURE.md` có các đoạn lịch sử chưa theo contract mới (vai suy ra, chưa có danh bạ, trạng thái tích hợp các role). Cần cập nhật riêng nếu Owner cho phép; không dùng các đoạn lịch sử đó để đưa field/API cũ trở lại code.

## Kiểm chứng

- Orval và validate: pass, đầu ra tái sinh không đổi.
- Browser: 5/5 role vào dashboard, reload giữ phiên, logout 204.
- Dashboard/accounts sau sửa import: 19/19 test pass.
- Test contract trên 38 file: lượt đầu 221/225 pass; hai lỗi picker đã sửa và kiểm tra lại cùng lookup nhân sự: 12/12 pass. Hai lỗi presentation có sẵn được ghi ở trên.
- Regression cuối auth/dashboard/accounts/picker: **94/94 test, 11/11 file pass**, gồm hai case role rỗng được phép/không được phép tự phục vụ.
- `pnpm typecheck`: pass, 0 lỗi TypeScript.
- ESLint trên 30 file sửa: pass; Prettier trên đúng phạm vi sửa: pass.
- `pnpm build`: pass sau thay đổi auth cuối. Không còn import API bị gỡ chặn production bundle.
- `pnpm check`: chưa pass vì 22 lỗi định dạng có sẵn; chuỗi check dừng tại Prettier, không coi là đã chạy hết lint/test/build qua lệnh này. Các lệnh kiểm tra nêu trên chạy độc lập.

Log, ảnh và bản chụp contract nằm tại `../../../scratch/be-db-review-2026-11-03/` tính từ thư mục này; không chứa mật khẩu hoặc token.
