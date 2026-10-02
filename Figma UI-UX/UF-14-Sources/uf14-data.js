/**
 * SaaS-Sentry - Canonical Data Module for UF-14
 * IT Admin handles data discrepancies and conflicts
 * Source of truth: BRD v3.11 (BR-28, BR-35, BR-43, QĐ-03)
 */

(function () {
  'use strict';

  function createUF14Data() {
    const stages = [
      { id: 1, name: 'Tổng quan đối soát', code: 'OVERVIEW' },
      { id: 2, name: 'Đối soát nhà cung cấp', code: 'PROVIDER_RECON' },
      { id: 3, name: 'Lệch thiếu tài khoản', code: 'MISSING_ACCOUNT' },
      { id: 4, name: 'Đối soát hóa đơn', code: 'INVOICE_RECON' },
      { id: 5, name: 'Lệch Shadow Access', code: 'SHADOW_ACCESS' },
      { id: 6, name: 'Sổ nhật ký kiểm toán', code: 'AUDIT_LEDGER' }
    ];

    const ledgers = {
      l01: { openMember: 3, openInvoice: 1, pendingAcceptance: 2, resolvedToday: 4 },
      l02: { openMember: 3, openInvoice: 1, pendingAcceptance: 2, resolvedToday: 4 },
      l03: { openMember: 3, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 5 },
      l04: { openMember: 3, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 5 },
      l05: { openMember: 3, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 5 },
      l06: { openMember: 3, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 5 },
      l07: { openMember: 2, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 6 },
      l08: { openMember: 2, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 6 },
      l09: { openMember: 2, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 6 },
      l10: { openMember: 2, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 6 },
      l11: { openMember: 2, openInvoice: 1, pendingAcceptance: 1, resolvedToday: 6 },
      l12: { openMember: 2, openInvoice: 0, pendingAcceptance: 1, resolvedToday: 7 },
      l13: { openMember: 2, openInvoice: 0, pendingAcceptance: 1, resolvedToday: 7 },
      l14: { openMember: 2, openInvoice: 0, pendingAcceptance: 1, resolvedToday: 7 },
      l15: { openMember: 2, openInvoice: 0, pendingAcceptance: 1, resolvedToday: 7 },
      l16: { openMember: 1, openInvoice: 0, pendingAcceptance: 1, resolvedToday: 8 }
    };

    const screens = [
      {
        id: '01',
        stage: 1,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Trung tâm đối soát & mâu thuẫn dữ liệu',
        subtitle: 'Tổng quan các phiên đối soát định kỳ, trạng thái kết nối và hàng đợi sai lệch',
        ledgerKey: 'l01',
        role: 'IT Admin + Finance',
        breadcrumb: 'Đối soát dữ liệu / Bàn làm việc trung tâm'
      },
      {
        id: '02',
        stage: 2,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Đối soát thành viên: GitHub Business',
        subtitle: 'Kiểm tra danh sách thành viên qua GitHub Enterprise API và phát hiện lời mời chờ chấp nhận',
        ledgerKey: 'l02',
        role: 'IT Admin',
        breadcrumb: 'Đối soát dữ liệu / Nhà cung cấp / GitHub Business'
      },
      {
        id: '03',
        stage: 2,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Bắt tay UF-08: Hoàn tất tác vụ PV-2041',
        subtitle: 'Thành viên đã chấp nhận và active trên GitHub, hệ thống tự động hoàn tất tác vụ cấp phát',
        ledgerKey: 'l03',
        role: 'IT Admin / Tác vụ hệ thống',
        breadcrumb: 'Đối soát dữ liệu / Bắt tay UF-08 / PV-2041'
      },
      {
        id: '04',
        stage: 2,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Ứng dụng quản lý thủ công: Canva Team',
        subtitle: 'Quy tắc BR-28.1: Không có API connector tự động, hệ thống tuyệt đối không sinh sai lệch giả',
        ledgerKey: 'l04',
        role: 'IT Admin',
        breadcrumb: 'Đối soát dữ liệu / Nhà cung cấp / Canva Team'
      },
      {
        id: '05',
        stage: 3,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Sai lệch DISC-2026-081: Thiếu tài khoản Figma',
        subtitle: 'Hệ thống có Assignment hợp lệ nhưng Workspace Figma không có tài khoản (BR-43.1 giữ cả 2 giá trị)',
        ledgerKey: 'l05',
        role: 'IT Admin',
        breadcrumb: 'Đối soát dữ liệu / Hàng đợi sai lệch / DISC-2026-081'
      },
      {
        id: '06',
        stage: 3,
        totalStages: 6,
        screenCode: 'ITA-05',
        title: 'Xử lý sai lệch: Kích hoạt cấp lại tài khoản',
        subtitle: 'Màn hình ITA-05: IT Admin chọn kích hoạt ProvisioningTask cấp lại qua UF-08',
        ledgerKey: 'l06',
        role: 'IT Admin',
        breadcrumb: 'Đối soát dữ liệu / ITA-05 Cấp lại tài khoản / DISC-2026-081'
      },
      {
        id: '07',
        stage: 3,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Hoàn tất đóng sai lệch DISC-2026-081',
        subtitle: 'Đã tạo tác vụ PV-2065 chuyển sang UF-08 và đóng sai lệch kèm quyết định người thật (BR-43.2)',
        ledgerKey: 'l07',
        role: 'IT Admin',
        breadcrumb: 'Đối soát dữ liệu / Quyết định hoàn tất / DISC-2026-081'
      },
      {
        id: '08',
        stage: 4,
        totalStages: 6,
        screenCode: 'FIN-04',
        title: 'Đối soát hóa đơn Slack Business+ Tháng 09/2026',
        subtitle: 'Màn hình FIN-04: Ghép dòng hóa đơn INV-2026-09-001 về thuê bao nội bộ SUB-SLK-BP-01',
        ledgerKey: 'l08',
        role: 'Finance (Tài chính)',
        breadcrumb: 'Tài chính / Đối soát hóa đơn / INV-2026-09-001'
      },
      {
        id: '09',
        stage: 4,
        totalStages: 6,
        screenCode: 'FIN-04',
        title: 'Đối chiếu BA con số cạnh nhau (BR-35.1)',
        subtitle: 'Trên hóa đơn: 55 seats | Thuê bao nội bộ: 50 seats | Thực tế dùng: 48 seats active',
        ledgerKey: 'l09',
        role: 'Finance (Tài chính)',
        breadcrumb: 'Tài chính / Đối chiếu 3 con số / SUB-SLK-BP-01'
      },
      {
        id: '10',
        stage: 4,
        totalStages: 6,
        screenCode: 'FIN-04',
        title: 'Phân định nguyên nhân chênh lệch (BR-35.2)',
        subtitle: 'Quy về 1 trong 3 nguyên nhân: Đã mua thêm 5 seats đợt mở rộng Q3 theo Ticket REQ-2026-0889',
        ledgerKey: 'l10',
        role: 'Finance (Tài chính)',
        breadcrumb: 'Tài chính / Phân định nguyên nhân / INV-2026-09-001'
      },
      {
        id: '11',
        stage: 4,
        totalStages: 6,
        screenCode: 'ITA-04',
        title: 'Cập nhật thuê bao nội bộ: 50 → 55 seats',
        subtitle: 'Màn hình ITA-04: Điều chỉnh hồ sơ thuê bao, bảo toàn lịch sử cả 2 giá trị trong Audit Log',
        ledgerKey: 'l11',
        role: 'IT Admin / Finance',
        breadcrumb: 'Thuê bao / ITA-04 Cập nhật / SUB-SLK-BP-01'
      },
      {
        id: '12',
        stage: 4,
        totalStages: 6,
        screenCode: 'FIN-04',
        title: 'Hoàn tất đối soát hóa đơn Slack',
        subtitle: 'Hóa đơn đã khớp & đóng đối soát, khoản cam kết 75$ chuyển sang Đã thành chi phí (F-35)',
        ledgerKey: 'l12',
        role: 'Finance (Tài chính)',
        breadcrumb: 'Tài chính / Đóng đối soát hóa đơn / INV-2026-09-001'
      },
      {
        id: '13',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Phát hiện Shadow Access: alex.vu@partner-corp.com',
        subtitle: 'MỨC RẤT CAO: Tài khoản có quyền trên GitHub nhưng hệ thống nội bộ không có Assignment (BR-28.3)',
        ledgerKey: 'l13',
        role: 'IT Admin (Security)',
        breadcrumb: 'Đối soát dữ liệu / Cảnh báo Shadow Access / DISC-2026-094'
      },
      {
        id: '14',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-15',
        title: 'Điều tra tài khoản ngoài luồng (ITA-15)',
        subtitle: 'Tài khoản được tạo trực tiếp bởi dev-lead lúc 22:15; đã truy cập 3 repositories nhạy cảm',
        ledgerKey: 'l14',
        role: 'IT Security Lead',
        breadcrumb: 'An ninh & Kiểm soát / ITA-15 Điều tra / DISC-2026-094'
      },
      {
        id: '15',
        stage: 5,
        totalStages: 6,
        screenCode: 'ITA-15',
        title: 'Quyết định xử lý: Thu hồi khẩn cấp',
        subtitle: 'Người thật ra quyết định: Thu hồi tài khoản phía GitHub ngay lập tức và mở rà soát bảo mật',
        ledgerKey: 'l15',
        role: 'IT Security Lead',
        breadcrumb: 'An ninh & Kiểm soát / Quyết định vi phạm / DISC-2026-094'
      },
      {
        id: '16',
        stage: 6,
        totalStages: 6,
        screenCode: 'ITA-11',
        title: 'Sổ nhật ký kiểm toán & Hoàn tất đối soát',
        subtitle: 'BR-43.2 & BR-43.3: 100% sai lệch có người thật quyết định, không có bản ghi nào tự đóng theo thời gian',
        ledgerKey: 'l16',
        role: 'IT Admin + Finance + Auditor',
        breadcrumb: 'Đối soát dữ liệu / Sổ nhật ký kiểm toán toàn diện'
      }
    ];

    const entities = {
      session: {
        id: 'REC-2026-0917-Q3',
        triggeredBy: 'Lịch tự động 14:00 & Finance Import',
        executionDate: '17/09/2026 · 14:35 ICT',
        actorIT: 'Trần Quốc Bảo · IT Security Lead (it-admin@company.com)',
        actorFinance: 'Nguyễn Thị Hoa · Kế toán trưởng (finance@company.com)'
      },
      github: {
        subscriptionId: 'SUB-GH-BIZ-01',
        name: 'GitHub Business Enterprise',
        status: 'CONNECTED',
        lastScan: '17/09/2026 14:30',
        totalMembersVendor: 52,
        totalAssignmentsInternal: 50,
        pendingTask: {
          id: 'PV-2041',
          assignmentId: 'ASN-4901',
          employee: 'Nguyễn Minh An (NV-0248)',
          email: 'an.nguyen@company.com',
          invitationSentAt: '16/09/2026 16:20',
          statusBefore: 'CHỜ CHẤP NHẬN',
          statusAfter: 'HOÀN TẤT',
          acceptedAt: '17/09/2026 14:15 ICT'
        },
        shadowAccount: {
          id: 'DISC-2026-094',
          email: 'alex.vu@partner-corp.com',
          roleVendor: 'Member (Write)',
          assignedByVendor: 'dev-lead@company.com',
          detectedAt: '17/09/2026 14:30',
          severity: 'MỨC RẤT CAO',
          reposAccessed: ['core-banking-api', 'payment-gateway', 'infra-terraform'],
          resolution: 'Yêu cầu thu hồi tài khoản khẩn cấp và lập biên bản vi phạm quy trình'
        }
      },
      figma: {
        subscriptionId: 'SUB-FIG-PRO-02',
        name: 'Figma Professional',
        discrepancyId: 'DISC-2026-081',
        severity: 'MỨC TRUNG BÌNH',
        employee: 'Đặng Hoàng Long (NV-0195)',
        email: 'long.dang@company.com',
        assignmentId: 'ASN-4102',
        approvedBy: 'Trần Minh (QL trực tiếp) · 10/09/2026',
        vendorStatus: 'Không tìm thấy tài khoản trong workspace',
        resolutionTask: 'PV-2065',
        resolutionNote: 'Tài khoản bị sót sau đợt reset workspace đầu tháng 9, cần cấp lại ngay'
      },
      slack: {
        subscriptionId: 'SUB-SLK-BP-01',
        name: 'Slack Business+',
        invoiceId: 'INV-2026-09-001',
        period: '01/09/2026 – 30/09/2026',
        amountUSD: 825.0,
        threeNumbers: {
          invoiceSeats: 55,
          invoiceCost: '$825.00 / tháng',
          subscriptionSeatsOld: 50,
          subscriptionCostOld: '$750.00 / tháng',
          activeSeats: 48,
          diffSeats: 5,
          diffCost: '$75.00 / tháng'
        },
        rootCause: 'Đã mua thêm 5 seats đợt mở rộng Q3 theo Ticket REQ-2026-0889 nhưng IT chưa cập nhật hồ sơ thuê bao',
        commitmentId: 'COM-2026-0889'
      },
      canva: {
        subscriptionId: 'SUB-CNV-01',
        name: 'Canva Team',
        status: 'MANUAL_NO_API',
        notice: 'Ứng dụng chưa cấu hình API Connector tự động (chế độ quản lý thủ công). SaaS-Sentry TUYỆT ĐỐI KHÔNG sinh sai lệch giả khi chưa có dữ liệu API (BR-28.1).'
      },
      auditMasterList: [
        {
          id: 'DISC-2026-081',
          app: 'Figma Professional',
          type: 'Hệ thống có, NCC không có',
          severity: 'Trung bình',
          status: 'Đã giải quyết (Chuyển UF-08 · PV-2065)',
          decidedBy: 'Trần Quốc Bảo (IT Admin)',
          time: '17/09/2026 14:45'
        },
        {
          id: 'INV-2026-09-001',
          app: 'Slack Business+',
          type: 'Hóa đơn lệch (+5 seats)',
          severity: 'Trung bình',
          status: 'Đã giải quyết (Sửa thuê bao 50→55)',
          decidedBy: 'Nguyễn Thị Hoa (Kế toán trưởng) & IT Lead',
          time: '17/09/2026 14:55'
        },
        {
          id: 'DISC-2026-094',
          app: 'GitHub Business',
          type: 'NCC có, Hệ thống không biết (Shadow Access)',
          severity: 'Rất cao',
          status: 'Đã giải quyết (Yêu cầu thu hồi khẩn cấp)',
          decidedBy: 'Trần Quốc Bảo (Security Lead)',
          time: '17/09/2026 15:10'
        },
        {
          id: 'PV-2041',
          app: 'GitHub Business',
          type: 'Chờ chấp nhận → Active',
          severity: 'Thông tin',
          status: 'Hoàn tất tự động (Có bằng chứng API)',
          decidedBy: 'Tác vụ hệ thống (QĐ-03)',
          time: '17/09/2026 14:32'
        }
      ]
    };

    return Object.freeze({
      stages,
      ledgers,
      screens,
      entities
    });
  }

  const moduleExports = { createUF14Data };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = moduleExports;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.UF14Data = moduleExports;
  }
})();
