# Mô tả Desktop Agent và AI Gateway cho SaaS-Sentry

**Phiên bản:** 1.0 — 26/09/2026  
**Mục đích:** Làm rõ doanh nghiệp mục tiêu, tính năng và cách xây dựng Desktop Agent, tính năng và cách xây dựng AI Gateway, cùng các business rule bắt buộc đi kèm.

> **Trạng thái:** Đây là đề xuất mở rộng. BRD v3.11 hiện vẫn quy định Desktop Agent tại `FR-4.19` là chỉ thiết kế và chưa đưa AI Gateway vào MVP. Muốn hiện thực phải có quyết định phạm vi của Owner/GVHD và cập nhật BRD, decision log, SRS, ERD, user flow và API contract liên quan.

## 1. Hai câu hỏi về doanh nghiệp

### 1.1. SaaS-Sentry phục vụ doanh nghiệp nào?

SaaS-Sentry hướng tới doanh nghiệp software outsourcing hoặc product engineering tại Việt Nam có đặc điểm:

- Quy mô khoảng 100–500 nhân sự; mốc tham chiếu phù hợp cho demo là 200–300 người.
- Sử dụng khoảng 15–40 phần mềm SaaS và AI tool.
- Có nhiều dự án, cây quản lý trực tiếp và cost center để phân bổ chi phí.
- Có 1–3 IT Admin nhưng chưa có hệ thống SAM/CASB/EDR hoàn chỉnh.
- Cấp laptop Windows 10/11 cho nhân viên và có khả năng quản lý installer, policy và credential công ty.
- Phần lớn SaaS/AI tool được mua bằng gói Business, Team hoặc Enterprise do công ty quản lý.
- Có Finance và Người duyệt chi cần biết license nào đang được sử dụng, chi phí thuộc dự án/cost center nào và gói nào cần tăng, giảm hoặc thu hồi.

Đối tượng không phù hợp cho giai đoạn đầu:

- Doanh nghiệp dùng BYOD làm thiết bị chính.
- Doanh nghiệp dưới 30 người, nơi bảng tính vẫn đủ quản lý.
- Tập đoàn trên 5.000 người đã có IAM, CASB, EDR, SIEM và đội vận hành chuyên biệt.
- Doanh nghiệp không thể yêu cầu AI tool hợp lệ sử dụng workspace, credential hoặc endpoint do công ty quản lý.

### 1.2. Doanh nghiệp đó làm gì và cần SaaS-Sentry để giải quyết vấn đề nào?

Doanh nghiệp thực hiện phát triển, kiểm thử, thiết kế và vận hành sản phẩm phần mềm cho nhiều khách hàng hoặc dự án. Nhân viên thường xuyên sử dụng Microsoft 365, GitHub, Jira, Figma, Canva và các AI coding agent như Codex hoặc Claude Code.

Ba nhu cầu chính của doanh nghiệp là:

1. Quản lý quy trình yêu cầu, phê duyệt và cấp phát phần mềm.
2. Quản lý hợp đồng, hóa đơn, ngân sách và phân bổ chi phí.
3. Có bằng chứng usage đủ rõ để phát hiện phần mềm không được phê duyệt và đánh giá AI agent có được sử dụng tương xứng với chi phí hay không.

Đối với phần mềm desktop và AI coding agent, doanh nghiệp cần trả lời được:

- Phần mềm nào đang được cài hoặc chạy trên thiết bị công ty?
- Phần mềm đó thuộc danh mục được phép, bị cấm hay chưa được nhận diện?
- Binary có publisher/chữ ký số hợp lệ hay không?
- Nhân viên có thực sự tương tác với ứng dụng hay ứng dụng chỉ chạy nền?
- AI agent hợp lệ phát sinh bao nhiêu request, input token, output token, cached token hoặc credit?
- Usage thuộc nhân viên, thiết bị, dự án và cost center nào?
- Không có token là do không sử dụng, do agent/gateway lỗi hay do người dùng bypass cấu hình công ty?

## 2. Desktop Agent — tính năng cần làm và cách xây dựng

### 2.1. Mục đích

Desktop Agent là phần mềm được cài trên laptop Windows do công ty cấp. Agent cung cấp bằng chứng ở cấp thiết bị và quản lý cấu hình kết nối của AI client được công ty phê duyệt.

Agent không dùng để đọc nội dung công việc hoặc đánh giá năng suất. Agent cũng không theo dõi browser history, active tab hoặc full URL vì các SaaS chạy trên trình duyệt được quản lý bằng workspace/vendor analytics của gói doanh nghiệp.

### 2.2. Tính năng cần có

#### Quản lý thiết bị

- Đăng ký thiết bị với SaaS-Sentry và nhận `deviceId` không mang thông tin cá nhân trực tiếp.
- Gắn thiết bị với nhân viên theo khoảng thời gian hiệu lực.
- Nhận policy có version và chữ ký từ server.
- Gửi heartbeat để Backend biết agent đang hoạt động hay offline.
- Dừng thu thập khi enrollment hết hiệu lực, thiết bị bị thu hồi hoặc yêu cầu dừng đã được xử lý.

#### Quét phần mềm đã cài và process đang chạy

- Đọc danh sách phần mềm đã cài từ Windows Registry, MSI và AppX.
- Theo dõi process start/stop.
- Lấy executable name, product name, publisher, version và chữ ký số.
- Tính hash của binary để nhận diện binary giả mạo hoặc bị thay đổi.
- Phân loại cục bộ theo catalog:

| Trạng thái | Ý nghĩa |
| --- | --- |
| `ALLOWED` | Phần mềm được công ty cho phép |
| `MONITORED` | Phần mềm cần thu usage để tối ưu license |
| `PROHIBITED` | Phần mềm bị cấm theo policy đã ban hành |
| `UNAPPROVED` | Phần mềm chưa có trong danh mục được phê duyệt |
| `UNTRUSTED_BINARY` | Chữ ký số/hash không khớp catalog |
| `LICENSE_UNVERIFIED` | Có phần mềm nhưng chưa đủ bằng chứng về entitlement/license |

Agent không được tự gọi một phần mềm là “phần mềm lậu”. Process name chỉ chứng minh ứng dụng có mặt hoặc đang chạy, không chứng minh tình trạng bản quyền.

#### Đo mức sử dụng ứng dụng desktop

- Xác định process đang ở foreground.
- Kiểm tra máy có idle hay không.
- Chỉ cộng thời gian khi ứng dụng ở foreground và người dùng không idle.
- Tổng hợp thành số phút theo ứng dụng và ngày.
- Không gửi raw event từng giây nếu daily aggregate đã đủ mục đích.
- Gửi coverage cùng usage để phân biệt `NO_USAGE` với `AGENT_OFFLINE`.

#### Quản lý cấu hình AI client

Với AI client hỗ trợ custom base URL hoặc managed settings chính thức, Agent thực hiện:

1. Nhận cấu hình AI client từ Backend.
2. Cấu hình client gọi Local AI Sidecar hoặc Central AI Gateway.
3. Kiểm tra base URL/configuration có bị thay đổi không.
4. Gửi configuration health và tạo finding nếu client bị đổi endpoint hoặc Sidecar bị tắt.

Agent không cấu hình system-wide proxy và không bắt toàn bộ network traffic. Chrome, Teams, Figma và ứng dụng ngoài phạm vi tiếp tục kết nối bình thường.

### 2.3. Kiến trúc Desktop Agent

Nên dùng Go cho production agent và tách thành hai process:

```text
SaaSSentryUpdater — Windows Service, Session 0
├─ Cài đặt, cập nhật và rollback
├─ Kiểm tra chữ ký package
├─ Device health
└─ Khởi động Collector theo user session

SaaSSentryCollector — chạy trong user session
├─ Inventory Scanner
├─ Process Monitor
├─ Foreground/Idle Tracker
├─ Local Policy Engine
├─ Local AI Sidecar
├─ Local Encrypted Spool
└─ Telemetry Uploader
```

Windows Service không trực tiếp đo foreground window vì service chạy ở Session 0, tách khỏi interactive user session. Collector phải chạy trong session của người dùng để lấy foreground process và idle state.

### 2.4. Công nghệ sử dụng

| Thành phần | Công nghệ đề xuất | Mục đích |
| --- | --- | --- |
| Agent runtime | Go | Một binary, nhẹ, ít phụ thuộc runtime |
| Windows integration | `golang.org/x/sys/windows`, ToolHelp/PSAPI, WMI/Registry | Process, inventory và Windows API |
| Foreground/idle | `GetForegroundWindow`, `GetWindowThreadProcessId`, `GetLastInputInfo` | Đo tương tác mà không đọc window title |
| Binary trust | WinVerifyTrust + SHA-256 | Kiểm tra publisher/chữ ký/hash |
| Local queue | bbolt | Lưu batch khi offline |
| Bảo vệ credential | Windows DPAPI + ACL | Không lưu credential dạng rõ |
| Giao tiếp server | HTTPS 443, JSON batch, `Idempotency-Key` | Bảo mật và chống gửi trùng |
| Installer | MSI bằng WiX Toolset + code signing | Triển khai qua GPO/Intune |

Python chỉ nên dùng cho spike Windows API, sinh fixture hoặc phân tích thử nghiệm. Không nên dùng Python làm production agent vì runtime, dependency và đóng gói trên nhiều máy phức tạp hơn Go.

### 2.5. Dữ liệu Agent được gửi

```json
{
  "batchId": "uuid",
  "deviceId": "opaque-device-id",
  "agentVersion": "1.0.0",
  "policyVersion": 12,
  "sequence": 108,
  "timezone": "Asia/Ho_Chi_Minh",
  "records": [
    {
      "date": "2026-09-26",
      "applicationId": "codex",
      "productName": "Codex",
      "publisher": "OpenAI",
      "executableName": "codex.exe",
      "signatureStatus": "VALID",
      "binaryHash": "sha256:...",
      "installed": true,
      "runningObserved": true,
      "activeMinutes": 85,
      "policyStatus": "PROHIBITED"
    }
  ],
  "coverage": {
    "collectorMinutes": 430,
    "lastHeartbeatAt": "2026-09-26T10:30:00+07:00"
  }
}
```

Không gửi `employeeId` từ Agent. Backend ánh xạ `deviceId → employee` theo khoảng hiệu lực để thiết bị không tự khai danh tính.

### 2.6. Cách xây dựng

1. Tạo PoC Go trên Windows VM để đọc inventory, process, foreground, idle và chữ ký binary.
2. Xây Local Policy Engine, signed catalog và các trạng thái phân loại ứng dụng.
3. Xây cơ chế tổng hợp daily usage và heartbeat/coverage.
4. Xây local spool bằng bbolt, mã hóa credential bằng DPAPI và upload idempotent.
5. Xây Local AI Sidecar chỉ bind `127.0.0.1`; không mở port ra LAN.
6. Xây updater service, MSI, code signing, staged update và rollback.
7. Thử nghiệm trên Windows VM/test account trước khi pilot trên thiết bị công ty.

## 3. AI Gateway — tính năng cần làm và cách xây dựng

### 3.1. AI Gateway là gì?

AI Gateway là reverse proxy chuyên cho request AI. AI client hợp lệ không gọi trực tiếp OpenAI/Anthropic bằng provider key của công ty mà gọi Gateway:

```text
AI client
    → http://127.0.0.1:18443       Local AI Sidecar
    → https://api.company.vn/ai    Central AI Gateway
    → OpenAI/Anthropic
```

Gateway nhận request, xác thực nhân viên/thiết bị, kiểm tra policy và quota, chuyển request đến provider, relay response về client và lấy token usage từ response của provider.

Gateway hoạt động ở tầng HTTP/API, không nghe lén network và không dùng MITM.

### 3.2. Gateway được đặt ở đâu?

Trong MVP, Gateway được xây bằng NestJS/TypeScript và có thể nằm cùng deployment với Backend hiện tại nhưng phải tách module và route:

```text
NestJS Backend
├─ /api/v1/* → API nghiệp vụ SaaS-Sentry
└─ /ai/v1/*  → AI Gateway
    ├─ Ingress & Authentication
    ├─ Policy/Quota Enforcement
    ├─ Provider Adapters
    ├─ Streaming Relay
    ├─ Usage Extractor
    ├─ Cost Calculator
    └─ Usage Event Store
```

Khi tải lớn hoặc cần cô lập secret/streaming, module `/ai/*` có thể được tách thành service riêng mà không thay đổi contract với Desktop Agent.

### 3.3. Tính năng cần có

#### Xác thực và nhận diện nguồn usage

- Mỗi thiết bị/nhân viên dùng credential riêng, ngắn hạn và thu hồi được.
- Gateway kiểm tra device enrollment và ánh xạ nhân viên theo thời điểm request.
- Không dùng một API key chung cho toàn công ty vì sẽ mất khả năng quy usage cho từng người.
- Provider API key chỉ nằm trên server trong secret store, không đưa xuống thiết bị.

#### Policy và quota

- Kiểm tra AI product/model có được phép không.
- Kiểm tra người dùng có assignment/license hợp lệ không.
- Áp quota theo nhân viên, dự án hoặc cost center.
- Cảnh báo khi gần hết quota.
- Từ chối request khi credential bị revoke hoặc vượt hard limit theo policy.

#### Chuyển tiếp request và streaming

- Hỗ trợ OpenAI-compatible endpoint và Anthropic Messages endpoint trong phạm vi đã xác minh.
- Relay streaming chunk ngay về client để không làm tăng độ trễ đáng kể.
- Giữ backpressure, timeout và client disconnect đúng cách.
- Không ghi prompt, response, tool payload hoặc source code vào log/database.

#### Đo token và chi phí

- Lấy input token, output token, cached token và reasoning token nếu provider trả.
- Lưu model, provider, request status, thời gian và nguồn đo.
- Với streaming, lấy usage ở final event.
- Nếu provider không trả usage, ghi `UNKNOWN` hoặc `ESTIMATED`; không ghi `0`.
- Đối soát tổng Gateway với Analytics API/export chính thức khi provider hỗ trợ.
- Tính chi phí theo pricing version có hiệu lực tại thời điểm request.

### 3.4. Công nghệ sử dụng

| Thành phần | Công nghệ đề xuất | Mục đích |
| --- | --- | --- |
| Gateway runtime | NestJS/TypeScript | Khớp Backend hiện hành |
| HTTP adapter | Fastify | Xử lý request/stream hiệu quả hơn Express mặc định |
| Provider connection | Undici + Node streams/SSE parser | Relay JSON/SSE |
| Metadata | PostgreSQL | Lưu usage event, daily aggregate và audit |
| Quota/idempotency | Redis | Counter, rate limit và chống xử lý trùng |
| Contract | OpenAPI + JSON Schema đóng | Kiểm soát request/response |
| Secrets | Secret manager/KMS | Bảo vệ và rotate provider key |
| Edge | Nginx/Ingress + HTTPS 443 | TLS termination và routing |
| Observability | OpenTelemetry với redaction | Theo dõi lỗi/độ trễ mà không log content |

Không cần viết Gateway bằng Go trong MVP. NestJS đủ phù hợp để tái sử dụng authentication, RBAC, PostgreSQL và cấu trúc Backend hiện tại. Chỉ tách sang Go service nếu benchmark thực tế cho thấy NestJS không đáp ứng số lượng kết nối streaming.

### 3.5. Quy trình một request

1. AI client gửi request đến Local Sidecar trên `127.0.0.1`.
2. Sidecar dùng device credential ngắn hạn để gọi Central AI Gateway qua HTTPS.
3. Gateway xác thực thiết bị, nhân viên, product, model, assignment, quota và policy.
4. Gateway lấy provider secret từ secret store và gọi OpenAI/Anthropic.
5. Gateway relay response về client nhưng không lưu nội dung.
6. Provider trả usage; Gateway chuẩn hóa thành `AIUsageEvent`.
7. Gateway lưu usage metadata và cập nhật tổng theo ngày bằng idempotency key.
8. Backend ghép usage với process evidence của Desktop Agent.

### 3.6. Dữ liệu Gateway được lưu

```json
{
  "usageEventId": "uuid",
  "requestId": "opaque-request-id",
  "employeeId": "E018",
  "deviceId": "DEVICE-044",
  "projectId": "PRJ-12",
  "costCenterId": "CC-DEV",
  "provider": "openai",
  "product": "codex",
  "model": "provider-model-id",
  "inputTokens": 42100,
  "outputTokens": 3800,
  "cachedTokens": 26000,
  "reasoningTokens": null,
  "totalTokens": 45900,
  "usageSource": "PROVIDER_REPORTED",
  "measurementStatus": "COMPLETE",
  "estimatedCost": {
    "amount": "3.82",
    "currency": "USD",
    "pricingVersion": "2026-09-01"
  },
  "occurredAt": "2026-09-26T10:15:22+07:00"
}
```

### 3.7. Công cụ nào bắt buộc đi qua Gateway?

| Khả năng của AI client | Cách xử lý |
| --- | --- |
| Có custom base URL hoặc managed settings chính thức | Agent cấu hình bắt buộc qua Gateway theo company policy |
| Chỉ có workspace/vendor account và Analytics API | Không ép proxy; lấy usage từ vendor analytics |
| Không có custom endpoint lẫn analytics chính thức | Agent chỉ ghi process evidence; token là `UNKNOWN` |
| Chỉ có thể bắt bằng MITM, cookie hoặc OAuth cá nhân | Không hỗ trợ |

Mức cưỡng chế đề xuất là:

- `L1 — Monitor`: Agent kiểm tra process và configuration drift.
- `L2 — Managed configuration`: Agent/MDM cấu hình AI client; company credential chỉ hoạt động qua Gateway.
- `L3 — Network enforcement`: firewall/DNS/Secure Web Gateway chặn gọi trực tiếp provider.

SaaS-Sentry nên thực hiện `L1 + L2`. `L3` là hạ tầng mạng riêng, không thuộc Desktop Agent và không được âm thầm đưa vào MVP. Vì vậy hệ thống bắt buộc usage hợp lệ đi qua Gateway bằng company credential, nhưng không tuyên bố có thể ngăn tuyệt đối tài khoản cá nhân hoặc mạng cá nhân.

### 3.8. Cách xây dựng

1. Tạo module `ai-gateway` trong NestJS, tách route `/ai/v1/*` khỏi API nghiệp vụ.
2. Xây authentication bằng short-lived device/user credential.
3. Xây provider adapter registry; bắt đầu với một OpenAI-compatible adapter và một Anthropic Messages adapter.
4. Xây streaming relay bằng Fastify, Undici và SSE parser.
5. Xây usage normalizer với các nguồn `PROVIDER_REPORTED`, `VENDOR_AGGREGATED`, `ESTIMATED`, `UNKNOWN`.
6. Xây `AIUsageEvent`, daily aggregate, pricing version và idempotency.
7. Xây quota/rate limit bằng Redis.
8. Xây reconciliation job với vendor analytics chính thức.
9. Kết nối usage Gateway với process/coverage của Desktop Agent để tạo recommendation có giải thích.

## 4. Business rules đi kèm

### 4.1. Phạm vi và mục đích

| Mã | Business rule |
| --- | --- |
| `BR-SCOPE-01` | Chỉ triển khai trên thiết bị do công ty sở hữu và quản lý; BYOD nằm ngoài phạm vi. |
| `BR-SCOPE-02` | Mục đích chỉ gồm quản trị tài sản phần mềm, chi phí, license, policy compliance và an toàn. |
| `BR-SCOPE-03` | Cấm dùng dữ liệu để chấm điểm năng suất hoặc tự động kỷ luật nhân viên. |
| `BR-SCOPE-04` | Desktop Agent phải hiện diện rõ, hiển thị trạng thái, policy version và lần gửi gần nhất. |
| `BR-SCOPE-05` | Thay đổi mục đích, field, retention hoặc nhóm ứng dụng phải tạo policy version mới và được phê duyệt lại. |

### 4.2. Business rules cho Desktop Agent

| Mã | Business rule |
| --- | --- |
| `BR-END-01` | Chỉ thu product name, executable name chuẩn hóa, publisher, version, signature status, binary hash, installed/running flag, rounded active minutes và coverage. |
| `BR-END-02` | Cấm thu browser history, URL/domain, window title, command argument, user path, file/content, prompt/code, clipboard, screenshot, keystroke, cookie, password và access token. |
| `BR-END-03` | Ứng dụng liên lạc mặc định không thu active minutes; nếu cần inventory thì chỉ giữ installed metadata. |
| `BR-END-04` | `UNAPPROVED` hoặc `UNKNOWN` chỉ nghĩa là chưa khớp catalog, không đồng nghĩa “phần mềm lậu” hoặc “vi phạm”. |
| `BR-END-05` | `UNTRUSTED_BINARY` phải dựa trên signature/hash; `LICENSE_UNVERIFIED` phải đối chiếu entitlement/license. |
| `BR-END-06` | Finding không tự kill process, uninstall, block hoặc kỷ luật; IT Admin phải review. |
| `BR-END-07` | Heartbeat/coverage bắt buộc; thiếu heartbeat thì usage là `UNKNOWN`, không phải zero. |
| `BR-END-08` | Device–employee binding có khoảng hiệu lực; record được ánh xạ theo thời điểm phát sinh. |
| `BR-END-09` | Agent không cấu hình system-wide proxy, transparent redirect hoặc root certificate. |
| `BR-END-10` | Agent chỉ sửa cấu hình AI client khi vendor có schema/custom endpoint chính thức đã được xác minh. |

### 4.3. Business rules cho AI Gateway

| Mã | Business rule |
| --- | --- |
| `BR-AIG-01` | AI client chỉ được coi là đo token đầy đủ khi dùng company credential/workspace và request đi qua Gateway hoặc vendor analytics chính thức. |
| `BR-AIG-02` | Provider secret không được đưa xuống thiết bị; mỗi nhân viên/thiết bị dùng credential riêng, ngắn hạn và thu hồi được. |
| `BR-AIG-03` | Cấm consumer OAuth harvesting, browser cookie, credential-file scraping và MITM. |
| `BR-AIG-04` | Gateway không lưu prompt, response, tool payload, source code hoặc file content. |
| `BR-AIG-05` | Mỗi usage record bắt buộc có `usageSource` và `measurementStatus`. |
| `BR-AIG-06` | Missing usage phải là `UNKNOWN` hoặc `PARTIAL`, không ghi zero. |
| `BR-AIG-07` | API token cost và subscription seat cost là hai mô hình khác nhau; token ước lượng không được trình bày như hóa đơn thật. |
| `BR-AIG-08` | Process có nhưng token không có chỉ tạo `POSSIBLE_BYPASS`; phải kiểm tra coverage/vendor trước khi kết luận. |
| `BR-AIG-09` | Gateway lỗi dùng fail-closed cho company credential; không tự gọi thẳng provider vì sẽ phá coverage. |
| `BR-AIG-10` | Client không hỗ trợ Gateway phải dùng vendor analytics hoặc mang trạng thái `UNKNOWN/UNSUPPORTED`; không ép qua MITM. |
| `BR-AIG-11` | `L1 + L2` là mức đề xuất; `L3` network enforcement cần quyết định hạ tầng và pháp lý riêng. |

### 4.4. Business rules về đánh giá usage

| Mã | Business rule |
| --- | --- |
| `BR-USG-01` | Phải phân biệt `VERIFIED_USAGE`, `NO_OBSERVED_USAGE`, `UNKNOWN_USAGE`, `POSSIBLE_BYPASS` và `INSUFFICIENT_COVERAGE`. |
| `BR-USG-02` | Endpoint evidence chỉ chứng minh ứng dụng xuất hiện/được tương tác trên thiết bị, không chứng minh tài khoản hoặc giá trị công việc. |
| `BR-USG-03` | Token evidence chứng minh mức tiêu thụ, không tự chứng minh năng suất hoặc chất lượng đầu ra. |
| `BR-USG-04` | Recommendation tăng, giảm hoặc thu hồi gói phải có evidence date, coverage, source và confidence. |
| `BR-USG-05` | Recommendation không tự động mua, hủy, tăng, giảm hoặc thu hồi; luôn cần người có thẩm quyền xác nhận. |
| `BR-USG-06` | Vendor data và nội bộ là hai nguồn khác nhau; sai lệch tạo finding, không tự ghi đè dữ liệu cho khớp. |

### 4.5. Business rules về quyền riêng tư và quyền truy cập

| Mã | Business rule |
| --- | --- |
| `BR-PRV-01` | Căn cứ pháp lý xử lý dữ liệu phải được ghi riêng; biên nhận “đã biết” không tự động được gọi là consent. |
| `BR-PRV-02` | Chưa có căn cứ hợp lệ, notice receipt hoặc enrollment hiệu lực thì server từ chối dữ liệu. |
| `BR-PRV-03` | Nhân viên được xem dữ liệu của chính mình và có quy trình yêu cầu xuất, sửa, phản đối hoặc dừng. |
| `BR-PRV-04` | Manager chỉ xem trạng thái và bằng chứng cần cho quyết định, không xem raw process timeline hoặc nội dung AI. |
| `BR-PRV-05` | IT Admin xem device health, app finding và rejection; Finance chỉ xem chi phí tổng hợp theo cost center. |
| `BR-PRV-06` | Mọi truy cập dữ liệu tracking phải được RBAC ở API và ghi audit. |
| `BR-PRV-07` | Retention phải được duyệt theo từng loại dữ liệu; khi nhân viên nghỉ việc phải xóa dữ liệu cá nhân nếu không có căn cứ hợp lệ để tiếp tục lưu. |
| `BR-PRV-08` | Trước pilot phải có Monitoring Policy, Processing Notice, DPIA, legal-basis register, retention schedule, access matrix và incident-response procedure. |

Khung pháp lý cần được người có thẩm quyền đối chiếu tối thiểu với [Luật 91/2025/QH15](https://vbpl.vn/TW/Pages/ivbpq-toanvan.aspx?ItemID=179252&Keyword=), [Nghị định 356/2025/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=216387&pageid=27160) và [Nghị định 330/2026/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=219266&pageid=27160). Đây là điều kiện governance của sản phẩm, không phải kết luận tư vấn pháp luật.

