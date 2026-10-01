/**
 * SaaS-Sentry - Canonical Data Module for UF-13
 * Super Admin manages system configurations, detection thresholds, and approval policy workflows
 * Source of truth: BRD v3.11 (F-37, F-38, F-42, BR-20.1, BR-37.1, BR-37.2, BR-38.1, BR-42.5, BR-13.9, BR-13.10, SoD-1)
 */

(function () {
  'use strict';

  function createUF13Data() {
    const stages = [
      { id: 1, name: 'Tổng quan & Ngưỡng lãng phí', code: 'OVERVIEW_THRESHOLDS' },
      { id: 2, name: 'Phân quyền & Chặn SoD', code: 'SOD_ENFORCEMENT' },
      { id: 3, name: 'Vai trò & Chính sách', code: 'ROLES_POLICIES' },
      { id: 4, name: 'Biên tập luồng duyệt', code: 'POLICY_EDITOR' },
      { id: 5, name: 'Khối xem thử Sandbox', code: 'SIMULATION_SANDBOX' },
      { id: 6, name: 'Áp dụng & Audit Log', code: 'APPLY_AUDIT_LOG' }
    ];

    const ledgers = {
      l01: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 842, inFlightRequests: 5 },
      l02: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 842, inFlightRequests: 5 },
      l03: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 842, inFlightRequests: 5 },
      l04: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 842, inFlightRequests: 5 },
      l05: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 843, inFlightRequests: 5 },
      l06: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 843, inFlightRequests: 5 },
      l07: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 843, inFlightRequests: 5 },
      l08: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.2', auditLogCount: 843, inFlightRequests: 5 },
      l09: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.3', auditLogCount: 844, inFlightRequests: 5 },
      l10: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.3', auditLogCount: 844, inFlightRequests: 5 },
      l11: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.3', auditLogCount: 844, inFlightRequests: 5 },
      l12: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.3', auditLogCount: 844, inFlightRequests: 5 },
      l13: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.3', auditLogCount: 844, inFlightRequests: 5 },
      l14: { activePolicies: 12, policyVersion: 'v2.1', noticeVersion: 'v1.3', auditLogCount: 844, inFlightRequests: 5 },
      l15: { activePolicies: 13, policyVersion: 'v2.2', noticeVersion: 'v1.3', auditLogCount: 845, inFlightRequests: 5 },
      l16: { activePolicies: 13, policyVersion: 'v2.2', noticeVersion: 'v1.3', auditLogCount: 845, inFlightRequests: 5 }
    };

    const screens = [
      {
        id: '01',
        stage: 1,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Bàn làm việc Quản trị Hệ thống & Cấu hình Phạm vi',
        subtitle: 'Quản lý tham số toàn hệ thống, phạm vi áp dụng và chính sách tuân thủ SaaS-Sentry',
        ledgerKey: 'l01',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Bàn làm việc Quản trị viên'
      },
      {
        id: '02',
        stage: 1,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Thiết lập Ngưỡng Lãng phí Đa tầng (BR-20.1)',
        subtitle: 'Cấu hình ngưỡng không hoạt động: Cấp tổ chức (60 ngày) và Ghi đè theo từng ứng dụng',
        ledgerKey: 'l02',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Ngưỡng lãng phí / Thiết lập đa tầng'
      },
      {
        id: '03',
        stage: 1,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Ma trận Phân giải Ưu tiên Ghi đè Ngưỡng (s1)',
        subtitle: 'Thứ tự ưu tiên: Từng ứng dụng > Toàn tổ chức > Mặc định hệ thống (QĐ-23 bỏ phòng ban)',
        ledgerKey: 'l03',
        role: 'Hệ thống / Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Ngưỡng lãng phí / Ma trận phân giải'
      },
      {
        id: '04',
        stage: 2,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Giả lập Thao tác Tác nghiệp Cấp phát / Duyệt (d2)',
        subtitle: 'Kiểm tra cơ chế chặn phân quyền SoD-1 khi Super Admin cố can thiệp luồng nghiệp vụ',
        ledgerKey: 'l04',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Phân quyền & SoD / Giả lập thao tác'
      },
      {
        id: '05',
        stage: 2,
        totalStages: 6,
        screenCode: 'SYS-04',
        title: 'CHẶN PHÂN QUYỀN — Vi phạm SoD-1 (BR-37.1)',
        subtitle: 'Super Admin KHÔNG được gán suất và KHÔNG được phê duyệt yêu cầu nghiệp vụ',
        ledgerKey: 'l05',
        role: 'Hệ thống (Bảo mật)',
        breadcrumb: 'Bảo mật hệ thống / Chặn phân tách trách nhiệm (SYS-04)'
      },
      {
        id: '06',
        stage: 3,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Cấu hình Người duyệt chi (DC) mặc định CEO (FR-3.13)',
        subtitle: 'Chọn một Employee giữ vai Người duyệt chi: Phạm Hoàng Nam (CEO · nv_ceo@company.com)',
        ledgerKey: 'l06',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Vai trò chính sách / Người duyệt chi'
      },
      {
        id: '07',
        stage: 3,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Cấu hình Người thay thế khi Xung đột Lợi ích (BR-13.10)',
        subtitle: 'Cấu hình tĩnh lập trước: Vũ Đình Khoa (COO) duyệt thay khi CEO là người thụ hưởng',
        ledgerKey: 'l07',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Vai trò chính sách / Người thay thế xung đột'
      },
      {
        id: '08',
        stage: 3,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Cấu hình Ngưỡng Backlog & Cảnh báo Tắc nghẽn (FR-3.8)',
        subtitle: 'Thiết lập cảnh báo SLA: Tồn đọng quá 3 ngày hoặc danh sách chờ vượt quá 8 yêu cầu',
        ledgerKey: 'l08',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Vai trò chính sách / Ngưỡng backlog SLA'
      },
      {
        id: '09',
        stage: 3,
        totalStages: 6,
        screenCode: 'ADM-02',
        title: 'Cập nhật Nội dung Thông báo Minh bạch v1.3 (BR-42.5)',
        subtitle: 'Nội dung thay đổi ⟹ Nâng phiên bản mới v1.3, toàn bộ nhân viên phải xác nhận lại',
        ledgerKey: 'l09',
        role: 'Super Admin',
        breadcrumb: 'Cấu hình hệ thống / Thông báo theo dõi / Soạn thảo phiên bản v1.3'
      },
      {
        id: '10',
        stage: 4,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Quản lý Danh mục Chính sách Phê duyệt Luồng',
        subtitle: 'Danh sách 12 chính sách đang kích hoạt; Chọn biên tập chính sách POL-DES-2026 (Figma)',
        ledgerKey: 'l10',
        role: 'Super Admin',
        breadcrumb: 'Luồng phê duyệt / Quản lý chính sách / POL-DES-2026'
      },
      {
        id: '11',
        stage: 4,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Trình soạn thảo Điều kiện & Chuỗi Bước Duyệt mới (a2)',
        subtitle: 'Điều kiện giá trị > 5.000.000 VNĐ; Chuỗi bước: [Bước 1: Quản lý QL] ➔ [Bước 2: Duyệt chi DC]',
        ledgerKey: 'l11',
        role: 'Super Admin',
        breadcrumb: 'Luồng phê duyệt / Soạn thảo chính sách / Điều kiện & Chuỗi bước'
      },
      {
        id: '12',
        stage: 5,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Khối Xem Thử — Mô phỏng Tình huống Giả định (a3)',
        subtitle: 'Simulation Sandbox: Giả lập yêu cầu Figma 12.000.000 VNĐ, hệ thống vẽ chuỗi duyệt dự kiến',
        ledgerKey: 'l12',
        role: 'Super Admin',
        breadcrumb: 'Luồng phê duyệt / Khối xem thử Sandbox / Tình huống mua mới'
      },
      {
        id: '13',
        stage: 5,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Phát hiện Chuỗi Bước Chưa Đúng Ý trong Sandbox (d3 ➔ a4)',
        subtitle: 'Thiếu nhánh xử lý cấp từ kho sẵn có (0 VNĐ); Bấm [Chỉnh sửa điều kiện & chuỗi bước]',
        ledgerKey: 'l13',
        role: 'Super Admin',
        breadcrumb: 'Luồng phê duyệt / Khối xem thử Sandbox / Phát hiện thiếu sót'
      },
      {
        id: '14',
        stage: 5,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Sửa Chuỗi Bước & Mô phỏng Lại Thành Công (a4 ➔ a3 ➔ d3)',
        subtitle: 'Bổ sung nhánh QĐ-29a: Cấp từ kho (0 VNĐ) chỉ cần QL duyệt; Kết quả mô phỏng Khớp hoàn toàn',
        ledgerKey: 'l14',
        role: 'Super Admin',
        breadcrumb: 'Luồng phê duyệt / Khối xem thử Sandbox / Xác thực hoàn tất'
      },
      {
        id: '15',
        stage: 6,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Lưu Áp dụng Chính sách & Audit Log Append-Only (s3 · BR-38.1)',
        subtitle: 'Áp dụng chính sách v2.2; Ghi nhật ký kiểm toán bất biến AUD-2026-9941 (SHA-256)',
        ledgerKey: 'l15',
        role: 'Hệ thống / Super Admin',
        breadcrumb: 'Luồng phê duyệt / Áp dụng chính sách / Ghi nhật ký kiểm toán'
      },
      {
        id: '16',
        stage: 6,
        totalStages: 6,
        screenCode: 'ADM-03',
        title: 'Xác nhận Hiệu lực Chính sách & Handoff Yêu cầu Mới (s4 ➔ e2)',
        subtitle: '5 yêu cầu đang chạy giữ nguyên chuỗi cũ; Yêu cầu mới áp dụng chính sách v2.2 (BR-37.2)',
        ledgerKey: 'l16',
        role: 'Super Admin',
        breadcrumb: 'Luồng phê duyệt / Tổng kết chính sách / Hoàn tất flow UF-13'
      }
    ];

    const thresholds = [
      { app: 'Figma Enterprise', scope: 'Ứng dụng riêng', inactiveDays: 30, override: true, source: 'POL-APP-FIGMA', note: 'Ghi đè mức tổ chức (30 < 60 ngày)' },
      { app: 'GitHub Enterprise', scope: 'Ứng dụng riêng', inactiveDays: 45, override: true, source: 'POL-APP-GITHUB', note: 'Ghi đè mức tổ chức (45 < 60 ngày)' },
      { app: 'Toàn tổ chức', scope: 'Cấp công ty', inactiveDays: 60, override: false, source: 'POL-ORG-DEFAULT', note: 'Áp dụng cho toàn bộ SaaS không có ngưỡng riêng' },
      { app: 'Mặc định hệ thống', scope: 'Mặc định lõi', inactiveDays: 90, override: false, source: 'SYSTEM_CORE', note: 'Fallback cơ sở khi chưa cấu hình tổ chức' }
    ];

    const approvalPolicies = [
      { code: 'POL-DES-2026', name: 'Phần mềm Thiết kế (Figma Enterprise)', app: 'Figma Enterprise', category: 'Thiết kế', steps: 'QL ➔ DC (Snapshot ngân sách)', status: 'Đang sửa đổi (v2.1 ➔ v2.2)' },
      { code: 'POL-DEV-2026', name: 'Nền tảng Phát triển (GitHub Enterprise)', app: 'GitHub Enterprise', category: 'Lập trình', steps: 'QL ➔ DC', status: 'Kích hoạt (v1.8)' },
      { code: 'POL-PM-2026', name: 'Quản lý Dự án (Jira Software)', app: 'Jira Software', category: 'Dự án', steps: 'QL ➔ IT Cấp phát', status: 'Kích hoạt (v2.0)' },
      { code: 'POL-DOC-2026', name: 'Tài liệu Tri thức (Notion Enterprise)', app: 'Notion Enterprise', category: 'Tri thức', steps: 'QL', status: 'Kích hoạt (v1.5)' },
      { code: 'POL-SEC-2026', name: 'Bảo mật Mã nguồn (Snyk Security)', app: 'Snyk Security', category: 'An toàn thông tin', steps: 'QL ➔ DC', status: 'Kích hoạt (v1.2)' }
    ];

    const auditStream = [
      { id: 'AUD-2026-9939', time: '17/09/2026 19:40:12', user: 'quan.nguyen (Super Admin)', action: 'UPDATE_THRESHOLD', target: 'Figma Inactivity -> 30d', status: 'APPENDED', hash: '8f4a...e12b' },
      { id: 'AUD-2026-9940', time: '17/09/2026 19:45:05', user: 'quan.nguyen (Super Admin)', action: 'SOD_BLOCKED', target: 'Attempted Assign License to NV-0255 (SYS-04)', status: 'DENIED & LOGGED', hash: '3c19...99a4' },
      { id: 'AUD-2026-9941', time: '17/09/2026 19:58:30', user: 'quan.nguyen (Super Admin)', action: 'UPDATE_DISCLOSURE_NOTICE', target: 'Notice v1.2 -> v1.3 (Law 91/2025 compliance)', status: 'APPENDED', hash: '5e87...a0df' },
      { id: 'AUD-2026-9942', time: '17/09/2026 20:01:14', user: 'quan.nguyen (Super Admin)', action: 'PUBLISH_APPROVAL_POLICY', target: 'POL-DES-2026 v2.2 (Added 0 VND fast-track)', status: 'APPENDED', hash: '7b22...41cc' }
    ];

    return {
      stages,
      ledgers,
      screens,
      thresholds,
      approvalPolicies,
      auditStream
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createUF13Data };
  } else {
    window.UF13Data = { createUF13Data };
  }
})();
