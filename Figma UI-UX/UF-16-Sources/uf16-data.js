/**
 * SaaS-Sentry - Canonical Data Module for UF-16
 * IT Admin deploys browser collector, employee confirms tracking disclosure
 * Source of truth: BRD v3.11 (F-42, F-45, BR-42, BR-45, ADR-10, ADR-13, Luật 91/2025)
 */

(function () {
  'use strict';

  function createUF16Data() {
    const stages = [
      { id: 1, name: 'Tổng quan thiết bị', code: 'OVERVIEW' },
      { id: 2, name: 'Cấu hình Allowlist', code: 'ALLOWLIST_CONFIG' },
      { id: 3, name: 'Thông báo minh bạch', code: 'DISCLOSURE_NOTICE' },
      { id: 4, name: 'Xác nhận chủ động', code: 'ACTIVE_CONFIRMATION' },
      { id: 5, name: 'Cổng nhận & Dữ liệu', code: 'INGESTION_DATA' },
      { id: 6, name: 'Bảng giám sát bộ thu thập', code: 'MONITORING_HEALTH' }
    ];

    const ledgers = {
      l01: { registeredDevices: 24, confirmedDevices: 18, pendingConfirmation: 6, rejectedRecords: 3 },
      l02: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l03: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l04: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l05: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l06: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l07: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l08: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l09: { registeredDevices: 25, confirmedDevices: 18, pendingConfirmation: 7, rejectedRecords: 3 },
      l10: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 3 },
      l11: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 3 },
      l12: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 4 },
      l13: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 4 },
      l14: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 4 },
      l15: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 4 },
      l16: { registeredDevices: 25, confirmedDevices: 19, pendingConfirmation: 6, rejectedRecords: 4 }
    };

    const screens = [
      {
        id: '01',
        stage: 1,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Trung tâm quản lý thiết bị & bộ thu thập',
        subtitle: 'Quản lý tiện ích trình duyệt trên máy công ty, trạng thái xác nhận và cổng Gateway',
        ledgerKey: 'l01',
        role: 'IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Bàn làm việc trung tâm'
      },
      {
        id: '02',
        stage: 1,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Đăng ký thiết bị công ty: DEV-MBP-2026-088',
        subtitle: 'Gán MacBook Pro M3 cho nhân viên Lê Hoàng Long (NV-0255 · Phòng Kỹ thuật), hiệu lực 17/09/2026',
        ledgerKey: 'l02',
        role: 'IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Đăng ký thiết bị / DEV-MBP-2026-088'
      },
      {
        id: '03',
        stage: 2,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Sinh Allowlist tự động & Danh mục loại trừ (BR-45.4)',
        subtitle: 'Cho phép: github.com, figma.com, atlassian.net | LOẠI TRỪ TUYỆT ĐỐI: Slack, Teams, Zoom, Gmail',
        ledgerKey: 'l03',
        role: 'Hệ thống / IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Cấu hình Allowlist / ADR-10'
      },
      {
        id: '04',
        stage: 2,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Phát hành thông báo có đánh phiên bản v1.2 (s2)',
        subtitle: 'Gửi thông báo theo dõi định kỳ tới hòm thư và cổng nội bộ của Lê Hoàng Long (long.le@company.com)',
        ledgerKey: 'l04',
        role: 'IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Phát hành thông báo / Phiên bản v1.2'
      },
      {
        id: '05',
        stage: 3,
        totalStages: 6,
        screenCode: 'EMP-05',
        title: 'Cổng tự phục vụ nhân viên: Thông báo mới',
        subtitle: 'Lê Hoàng Long nhận thông báo yêu cầu xác nhận chính sách theo dõi SaaS máy công ty',
        ledgerKey: 'l05',
        role: 'Nhân viên (Lê Hoàng Long)',
        breadcrumb: 'Cổng nhân viên / Hộp thư thông báo / v1.2'
      },
      {
        id: '06',
        stage: 3,
        totalStages: 6,
        screenCode: 'EMP-05',
        title: 'Chi tiết thông báo minh bạch 5 mục (Điều 25 Luật 91/2025)',
        subtitle: 'Thu gì | KHÔNG thu gì | Mục đích | Thời hạn lưu trữ | Quyền yêu cầu dừng (BR-42.4)',
        ledgerKey: 'l06',
        role: 'Nhân viên',
        breadcrumb: 'Cổng nhân viên / Tuyên bố minh bạch / Luật 91/2025'
      },
      {
        id: '07',
        stage: 3,
        totalStages: 6,
        screenCode: 'EMP-05',
        title: 'Quyền chủ thể dữ liệu & Yêu cầu dừng thu thập',
        subtitle: 'BR-42.6 & F-40: Nhân viên có quyền gửi yêu cầu tạm dừng tiện ích theo diện quyền chủ thể dữ liệu',
        ledgerKey: 'l07',
        role: 'Nhân viên',
        breadcrumb: 'Cổng nhân viên / Quyền chủ thể dữ liệu / F-40'
      },
      {
        id: '08',
        stage: 3,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Trạng thái CHƯA XÁC NHẬN: Khóa cổng Gateway',
        subtitle: 'BR-45.1: Chưa xác nhận thì KHÔNG CÓ DỮ LIỆU; cổng nhận khóa chặt, ứng dụng chỉ còn G1/G2',
        ledgerKey: 'l08',
        role: 'IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Nhánh chặn chưa xác nhận / b1'
      },
      {
        id: '09',
        stage: 4,
        totalStages: 6,
        screenCode: 'EMP-05',
        title: 'Nhân viên bấm xác nhận chủ động (d1 ➔ s3)',
        subtitle: 'Lưu biên bản điện tử: Timestamp 17/09/2026 15:20:14 ICT, IP nội bộ, Phiên bản v1.2 (BR-42.4)',
        ledgerKey: 'l09',
        role: 'Nhân viên',
        breadcrumb: 'Cổng nhân viên / Xác nhận điện tử / v1.2'
      },
      {
        id: '10',
        stage: 4,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Mở Cổng Gateway & Cấp Token tiếp nhận (s3)',
        subtitle: 'DEV-MBP-2026-088 chuyển sang ĐÃ XÁC NHẬN (v1.2); Gateway mở cổng nhận bản tổng hợp',
        ledgerKey: 'l10',
        role: 'Hệ thống / IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Mở cổng Gateway / DEV-MBP-2026-088'
      },
      {
        id: '11',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Tiện ích lọc tại máy client & Payload tối giản (s4)',
        subtitle: 'BR-45.2 & BR-45.3: Lọc tại nguồn, chỉ gửi domain, date, active_minutes; không gửi URL chi tiết',
        ledgerKey: 'l11',
        role: 'Tiện ích client (Browser Extension)',
        breadcrumb: 'Bộ thu thập & Thiết bị / Mô phỏng Payload / BR-45.3'
      },
      {
        id: '12',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Kiểm tra Cổng nhận: Từ chối bản ghi sai lược đồ',
        subtitle: 'd2=sai ➔ s5: Gateway phát hiện trường lạ/thiết bị chưa hợp lệ, từ chối ngay và ghi audit log',
        ledgerKey: 'l12',
        role: 'Cổng Ingestion Gateway',
        breadcrumb: 'Bộ thu thập & Thiết bị / Từ chối bản ghi / s5'
      },
      {
        id: '13',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Kiểm tra Cổng nhận: Chấp thuận bản ghi hợp lệ',
        subtitle: 'd2=đúng ➔ s6: Xác thực token hợp lệ, đúng lược đồ, chuyển sang bộ xử lý khớp danh tính',
        ledgerKey: 'l13',
        role: 'Cổng Ingestion Gateway',
        breadcrumb: 'Bộ thu thập & Thiết bị / Tiếp nhận thành công / s6'
      },
      {
        id: '14',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Khớp danh tính & Đánh giá mức độ sử dụng (BR-45.5)',
        subtitle: 'Ghép 85 phút GitHub vào Assignment ASN-4901; đạt ngưỡng ≥15 phút/ngày ➔ Đánh dấu Active Day',
        ledgerKey: 'l14',
        role: 'Hệ thống',
        breadcrumb: 'Bộ thu thập & Thiết bị / Khớp danh tính & Usage'
      },
      {
        id: '15',
        stage: 6,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Bảng giám sát bộ thu thập (Cấm xếp hạng người)',
        subtitle: 'BR-45.6 & SoD-2: Theo dõi sức khỏe thiết bị; TUYỆT ĐỐI KHÔNG xếp hạng thời gian theo con người',
        ledgerKey: 'l15',
        role: 'IT Admin',
        breadcrumb: 'Bộ thu thập & Thiết bị / Bảng giám sát sức khỏe'
      },
      {
        id: '16',
        stage: 6,
        totalStages: 6,
        screenCode: 'ITA-16',
        title: 'Dữ liệu tiện ích sẵn sàng bàn giao cho UF-10 (e2)',
        subtitle: 'Dữ liệu đo lường hợp pháp từ tiện ích trình duyệt sẵn sàng làm đầu vào tối ưu license G3/G4',
        ledgerKey: 'l16',
        role: 'IT Admin + Auditor',
        breadcrumb: 'Bộ thu thập & Thiết bị / Bàn giao UF-10'
      }
    ];

    const entities = {
      device: {
        id: 'DEV-MBP-2026-088',
        model: 'Apple MacBook Pro 14" (Apple M3 Pro / 18GB / 512GB)',
        serial: 'C02G8490MD6R',
        os: 'macOS Sonoma 14.6.1 · Chrome Managed Enterprise',
        assignedTo: 'Lê Hoàng Long (NV-0255)',
        email: 'long.le@company.com',
        department: 'Phòng Kỹ thuật phần mềm (Cost Center CC-TECH-01)',
        effectiveDate: '17/09/2026',
        status: 'CONFIRMED_V1_2'
      },
      allowlist: [
        { domain: 'github.com', app: 'GitHub Business Enterprise', status: 'ALLOWED', category: 'Dev Tools' },
        { domain: 'figma.com', app: 'Figma Professional', status: 'ALLOWED', category: 'Design Tools' },
        { domain: 'atlassian.net', app: 'Jira Software & Confluence', status: 'ALLOWED', category: 'Project Management' },
        { domain: 'notion.so', app: 'Notion Team Workspace', status: 'ALLOWED', category: 'Knowledge Base' }
      ],
      exclusionList: [
        { domain: 'slack.com', app: 'Slack Business+', reason: 'Ứng dụng liên lạc nội bộ (Cờ Communication · ADR-10)', status: 'EXCLUDED' },
        { domain: 'teams.microsoft.com', app: 'Microsoft Teams', reason: 'Ứng dụng liên lạc & họp trực tuyến (ADR-10)', status: 'EXCLUDED' },
        { domain: 'zoom.us', app: 'Zoom Workplace Pro', reason: 'Ứng dụng thoại & video họp (ADR-10)', status: 'EXCLUDED' },
        { domain: 'mail.google.com', app: 'Google Workspace Gmail', reason: 'Thư điện tử cá nhân & nội bộ (ADR-10)', status: 'EXCLUDED' }
      ],
      noticeVersion: 'v1.2 (Cập nhật 15/09/2026 theo Điều 25 Luật 91/2025)',
      gateway: {
        token: 'ingest-tok_7f9a2b84c10e',
        endpoint: 'https://gateway.saas-sentry.internal/v1/collector/ingest',
        samplePayload: {
          device_id: 'DEV-MBP-2026-088',
          domain: 'github.com',
          date: '2026-09-17',
          active_minutes: 85
        }
      }
    };

    return Object.freeze({
      stages,
      ledgers,
      screens,
      entities
    });
  }

  const moduleExports = { createUF16Data };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = moduleExports;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.UF16Data = moduleExports;
  }
})();
