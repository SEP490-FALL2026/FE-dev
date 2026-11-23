# Đặc tả chức năng thiết bị thu thập AI

Tài liệu mô tả chức năng web theo hướng dẫn tích hợp `API-Integration/flows/ai-collector-device.md` và `reference/devices-and-ai-usage.md`, nhóm G7 mức A, SBF-05/SBF-05a. Đây là đặc tả nghiệp vụ và phạm vi FE; nguồn quyết định hành vi và phân quyền cuối cùng là backend. Các route và trạng thái mô tả theo revision trong tài liệu nguồn, cần đối chiếu Swagger của môi trường triển khai.

## Mục đích và phạm vi

IT Admin quản lý sổ máy công ty, người giữ, chứng từ đã ký, mã cài, công cụ được phép, trạng thái kết nối và yêu cầu dừng. Người giữ tự đọc thông báo, xác nhận và xem dữ liệu của mình. Super Admin quản lý phiên bản thông báo. Collector là ứng dụng riêng chạy trên thiết bị: web không cài collector, không nhận và không dùng credential thiết bị để thay collector.

Dữ liệu thu thập là số câu trả lời, tổng token, độ bao phủ theo ngày và trạng thái đăng nhập/hạn mức công cụ được phép. Không thu nội dung chat, prompt, mã nguồn, URL hay IP. Chữ ký BM-06 xác nhận đã được thông tin; không thay thế xác nhận chủ động trên web.

## Vai trò và truy cập

| Vai trò       | Trách nhiệm                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Super Admin   | Phát hành phiên bản thông báo, quy định nội dung theo dõi và có cần xác nhận lại.                               |
| IT Admin      | Quản lý sổ máy, người giữ, bản ký, mã cài, credential, allowlist, dữ liệu/lỗi nhận và yêu cầu dừng.             |
| Người giữ máy | Xem thông báo, tự xác nhận, xem dữ liệu thuộc đăng ký của mình và yêu cầu dừng. Không xác nhận thay người khác. |
| Collector     | Đổi mã lấy credential, đọc cấu hình phiên, gửi dữ liệu và xoay credential. Không dùng phiên đăng nhập web.      |

Sổ máy và lịch sử đăng ký không lọc theo phòng IT phụ trách; dữ liệu usage/trạng thái công cụ của IT được BE lọc theo phạm vi phòng. Dữ liệu cá nhân của người giữ chỉ gồm những ngày và bản chụp thuộc đăng ký của người đó. FE không tự mở rộng quyền.

## Quy trình sử dụng

1. Super Admin phát hành thông báo đang hiệu lực. IT Admin công bố danh sách công cụ AI được thu thập.
2. IT Admin tạo máy với mã tài sản duy nhất, tên máy, hệ điều hành và người giữ; máy bắt đầu ở `AWAITING_ACKNOWLEDGEMENT`. Người giữ đang làm việc hoặc nghỉ dài hạn; ngày bàn giao phải trong khoảng từ ngày vào làm đến hôm nay.
3. Người giữ ký BM-06. IT Admin tải bản ký với mục đích `SIGNATURE_RECORD`, hoàn tất tải lên và lưu bản ký kèm phiên bản thông báo in trên giấy. Phiên bản này có thể là bất kỳ phiên bản đã phát hành.
4. Khi đã lưu bản ký và đăng ký còn mở, IT tạo mã cài `AI_COLLECTOR`; không cần đợi người giữ xác nhận. Mã chỉ hiện một lần, có hạn 24 giờ và dùng một lần. Người cài nhập mã vào collector; việc cấp credential mới thay credential AI collector cũ của cùng đăng ký.
5. Người giữ đọc phiên bản thông báo hiện hành và chủ động xác nhận. Máy chuyển `ACTIVE`. Trước xác nhận, collector có thể cài nhưng BE từ chối dữ liệu.
6. Collector đọc phiên và gửi dữ liệu theo cấu hình. IT kiểm tra lần nhận thành công gần nhất, dữ liệu, trạng thái công cụ và lý do bị từ chối. `ACTIVE` nghĩa là đã xác nhận, không chứng minh collector đang gửi.
7. Khi thay người giữ, đăng ký cũ kết thúc và credential cũ bị thu hồi; đăng ký mới bắt đầu lại quy trình chữ ký và xác nhận. Máy thôi dùng chuyển `RETIRED` và không giao lại được. Người nghỉ việc hoặc bị chặn truy cập khiến đăng ký kết thúc, máy thành `UNREGISTERED`.
8. Người giữ có thể yêu cầu dừng. Dữ liệu tiếp tục được nhận đến khi IT hoàn tất yêu cầu; máy chuyển `COLLECTION_STOPPED`, credential vẫn tồn tại. Người giữ có thể xác nhận lại để mở thu thập.

## Màn hình và thao tác FE

| Khu vực             | Nội dung và hành động                                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sổ máy              | Tìm kiếm, lọc trạng thái/người giữ, phân trang, tạo và mở chi tiết máy. Tránh hiểu lọc phòng trên giao diện là phân quyền BE.                                                                                                                          |
| Chi tiết máy        | Mã tài sản, tên máy, hệ điều hành, người giữ, trạng thái, lần nhận dữ liệu gần nhất, thời gian đăng ký/xác nhận, bản ký và kết thúc đăng ký. Thao tác đổi người giữ, thôi dùng, lưu bản ký, tạo mã cài, xem lịch sử, credential và dữ liệu.            |
| Lịch sử người giữ   | Các đăng ký hiện tại và cũ, thời gian, lý do kết thúc và lần nhận cuối theo từng đăng ký; mở credential theo `registrationId` tương ứng.                                                                                                               |
| Credential          | Loại collector, hạn, lần nhận cuối, trạng thái và nguyên nhân thu hồi; IT thu hồi credential khi cần. Không hiển thị secret.                                                                                                                           |
| Danh sách công cụ   | Xem phiên bản đang áp dụng, chọn tối đa ba công cụ `CLAUDE_CODE`, `CODEX`, `ANTIGRAVITY_CLI`, ánh xạ ứng dụng đủ điều kiện, ghi lý do và phát hành toàn bộ danh sách mong muốn. Bản giống hiện hành bị từ chối. `ANTIGRAVITY_CLI` gắn nhãn thử nghiệm. |
| Dữ liệu theo máy    | Phân trang, lọc thời gian; hiển thị số câu trả lời, token, độ bao phủ, công cụ và ngày. `NOT_OBSERVABLE` là không có dữ liệu, không phải 0; `PARTIAL` là số tối thiểu quan sát được.                                                                   |
| Trạng thái công cụ  | Trạng thái đăng nhập/hạn mức, tỷ lệ đã dùng, thời điểm quan sát và đặt lại nếu có. Thiếu dữ liệu phải hiển thị là không có dữ liệu.                                                                                                                    |
| Lần nhận bị từ chối | Xem thời điểm, lý do và lọc mã lý do. Ví dụ chưa xác nhận: nhắc người giữ; trạng thái công cụ chưa được cho phép trong thông báo: liên hệ Super Admin; lỗi ngày: kiểm tra giờ máy; lỗi dữ liệu: báo đội collector.                                     |
| Yêu cầu dừng        | Xem trạng thái, hạn xử lý và quá hạn; IT hoàn tất yêu cầu `OPEN` sau xác nhận thao tác. Yêu cầu `INVALID` không có thao tác hoàn tất.                                                                                                                  |
| Máy của tôi         | Người giữ đọc thông báo hiện hành, xác nhận chủ động, xem usage/trạng thái theo quyền của mình và gửi yêu cầu dừng. `canAcknowledge` và `blockedReason` từ BE điều khiển việc xác nhận.                                                                |

## Các trạng thái và quy tắc giao diện

- `AWAITING_ACKNOWLEDGEMENT`: đang chờ xác nhận; có thể tạo mã khi đăng ký còn mở và `signatureRecorded = true`. Chưa nhận dữ liệu đến khi người giữ xác nhận.
- `ACTIVE`: đã xác nhận; xem `collection.lastAcceptedAt` để biết có dữ liệu được chấp nhận gần đây hay chưa.
- `COLLECTION_STOPPED`: đã dừng theo yêu cầu; credential không tự bị thu hồi. Người giữ xác nhận lại để mở thu thập.
- `UNREGISTERED`: không còn đăng ký mở; có thể giao lại máy cho người giữ khác.
- `RETIRED`: trạng thái cuối; không giao lại và không tạo mã cài.
- Khi thông báo mới yêu cầu xác nhận lại, `acknowledgedFrom` có thể là `null` dù còn `latestAcknowledgement` cũ; không hiển thị lần cũ như xác nhận hiện hành.
- Tạo mã thất bại nếu chưa có bản ký hoặc đăng ký đã kết thúc. Không lưu mã, không log mã, không đưa mã vào URL hay cache dùng chung.
- Yêu cầu dừng trả `OPEN` hoặc `INVALID` dù HTTP 201. `DUPLICATE`, `ALREADY_STOPPED` và `REGISTRATION_ENDED` cần được trình bày theo trạng thái, không coi mọi 201 là yêu cầu mới đã mở.

## Ranh giới API

| Nghiệp vụ                                          | Operation                                                                                                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Danh sách, tạo, chi tiết, đổi người giữ, thôi dùng | `deviceList`, `deviceCreate`, `deviceGet`, `deviceHolderChange`, `deviceRetire`                                                                           |
| Lịch sử, bản ký, mã cài, credential                | `deviceRegistrationList`, `deviceSignatureRecordCreate`, `deviceEnrollmentCodeCreate`, `deviceCredentialList`, `deviceCredentialRevocationCreate`         |
| Upload bản ký                                      | `documentCreate` → tải trực tiếp theo URL ký → `documentComplete` → `deviceSignatureRecordCreate`; không gọi `documentAttach`.                            |
| Allowlist                                          | `collectorAllowlistEntryList`, `collectorAllowlistVersionCreate`                                                                                          |
| Dữ liệu và lỗi của IT                              | `deviceUsageList`, `deviceToolStatusList`, `deviceIntakeRejectionList`                                                                                    |
| Người giữ                                          | `myDeviceList`, `monitoringNoticeCurrentGet`, `myDeviceAcknowledgementCreate`, `myDeviceUsageList`, `myDeviceToolStatusList`, `myDeviceStopRequestCreate` |
| Yêu cầu dừng của IT                                | `deviceStopRequestList`, `deviceStopRequestComplete`                                                                                                      |
| Collector riêng, không gọi từ FE                   | `deviceEnrollmentCreate`, `deviceSessionGet`, `deviceSessionRotationCreate`, `aiUsageBatchCreate`, `aiToolStatusSnapshotCreate`                           |

`BROWSER_EXTENSION` thuộc mức B: có thể cấp mã/credential theo contract nhưng revision tài liệu chưa có route nhận usage/trạng thái cho loại này. Không mô tả nó như chức năng thu thập đã hoạt động.

## Xử lý lỗi và kiểm thử

Chỉ báo thành công sau xác nhận của BE; giữ dữ liệu nhập khi lỗi và cho tải lại khi dữ liệu đã thay đổi. Không tự thử lại thao tác ghi có kết quả không chắc chắn. Dùng `registrationId` cho bản ký/mã/credential và `deviceId` cho chi tiết máy và dữ liệu theo máy.

Cần kiểm thử: tạo máy và đổi người giữ; upload và gắn đúng bản ký; mã cài chỉ hiện một lần, không lưu secret; điều kiện đã ký nhưng chưa xác nhận; xác nhận chỉ bởi người giữ; phân biệt `NOT_OBSERVABLE`, `PARTIAL` và số 0 thật; phân trang và trạng thái lỗi; yêu cầu dừng `OPEN`/`INVALID`; thu hồi credential; quyền truy cập và dữ liệu ngoài phạm vi. Kiểm thử FE dùng API giả lập; kiểm thử tích hợp với BE và collector thật cần môi trường, quyền và dữ liệu tương ứng.

## Giới hạn FE hiện tại cần tiếp tục hoàn thiện

- Theo yêu cầu giao diện hiện tại, màn thiết bị ẩn nút lưu/mở bản ký và tạo mã cài, cùng các nút điều hướng danh sách cho phép và yêu cầu dừng. Các điều kiện bản ký, xác nhận và mã cài của BE không thay đổi; màn này không còn cung cấp đầy đủ các thao tác thiết lập collector.
- Theo contract hiện tại, `deviceCreate` bắt buộc có người giữ; chưa có API khai báo máy trống hoặc chủ động bỏ người giữ mà giữ máy sẵn sàng. `UNREGISTERED` có thể phát sinh từ quy trình nhân sự và được giao lại; không dùng `deviceRetire` để làm máy trống vì thôi dùng là trạng thái cuối. Muốn quản lý kho máy độc lập và trả máy chưa gán cần bổ sung contract BE.
- BE thu hồi credential khi đổi người giữ: collector cũ không tự tiếp tục dưới danh tính người mới. Người mới cần hồ sơ bản ký/xác nhận và mã cài mới; không được gán ngược usage cũ sang người giữ hiện tại.
- Form lưu BM-06 hiện lấy phiên bản thông báo hiện hành; chưa có giao diện chọn phiên bản đã phát hành cũ như contract cho phép. Không được gắn nhầm bản hiện hành khi giấy đã ký in phiên bản khác.
- FE xóa mã cài khi rời cửa sổ, chuyển tab hoặc sau tối đa một phút; thời hạn mã ở BE vẫn là 24 giờ.
- Quy trình trên mô tả khả năng theo contract và các màn hiện có; chưa xác nhận đầy đủ từng bước bằng BE/collector thật. Không suy diễn rằng collector đã cài hoặc đang gửi chỉ vì có giao diện quản lý.
