import { i18n } from '~/shared/i18n/i18n'

const costCenterKeys: Record<string, string> = {
  'CC-ENG': 'engineering',
  'CC-DES': 'design',
  'CC-OPS': 'operations',
  'CC-MKT': 'marketing',
  'CC-SAL': 'sales',
  'CC-COMPANY': 'company',
  'CC-PRD': 'product'
}

const demoTextKeys: Record<string, string> = {
  'Phòng Thiết kế còn đủ ngân sách quý 4 để mua thêm 15 suất Figma không?': 'designBudgetQuestion',
  'Marketing chưa có ngân sách quý 4 — Tài chính có dự kiến lập trong tuần này không?': 'marketingBudgetQuestion',
  'Kiểm tra giúp ngân sách Kỹ thuật cho 10 suất Cursor Pro.': 'engineeringBudgetQuestion',
  'Còn khoảng 115 triệu sau khi trừ cam kết đang giữ. Ý kiến tham khảo, không chặn.': 'engineeringBudgetAnswer',
  'Ngân sách Toàn công ty cho gói Notion AI 40 suất?': 'companyBudgetQuestion',
  'Ngân sách Vận hành cho Miro Team?': 'operationsBudgetQuestion',
  'Ngân sách quý 4 của CC-OPS còn 768.000 ₫ sau cam kết đang giữ; yêu cầu cần 31.680.000 ₫.': 'opsBudgetShortfall',
  'HubSpot chưa có trong danh mục được phép; Quản trị CNTT đang đánh giá.': 'hubspotOutsideCatalog',
  'Nhóm Công cụ phát triển của CC-ENG còn 4.200.000 ₫; Snyk Team cần 18.600.000 ₫ cho quý 4.': 'engineeringToolsShortfall',
  'Đề xuất bổ sung từ buffer năm của Phòng Kỹ thuật; bắt buộc sau sự cố bảo mật tháng 9.': 'engineeringTopUpNote',
  'Yêu cầu dùng ngân sách năm 2025 đã hết hiệu lực.': 'expiredBudgetYear',
  'Chuyển sang ngân sách năm 2026 của CC-SAL.': 'transferTo2026Budget',
  'Tuyển thêm 5 lập trình viên năm 2027.': 'hireFiveDevelopers',
  '19 suất không hoạt động; giữ 40 suất như đề xuất gia hạn của CNTT.': 'keepFortySeats',
  '31/50 suất đang hoạt động': 'thirtyOneActiveSeats',
  'Giữ nguyên quy mô dự án.': 'projectScopeUnchanged',
  '9 suất không hoạt động': 'nineInactiveSeats',
  'Mở rộng trợ lý lập trình cho toàn đội.': 'expandCodingAssistant',
  'Thử nghiệm trợ lý chăm sóc khách hàng.': 'trialCustomerAssistant',
  'Chưa có trong danh mục — trùng một phần với Cursor Pro': 'overlapsCursor',
  'Dự án Fintech Redesign cần thêm 5 suất.': 'fintechNeedsSeats',
  '4 ghost seat đã đề xuất thu hồi; giữ 25 suất.': 'keepTwentyFiveSeats',
  '21/25 suất đang hoạt động': 'twentyOneActiveSeats',
  'Dựng video và minh họa.': 'videoAndIllustration',
  'Kiểm thử khả dụng.': 'usabilityTesting',
  'Thương lượng gói năm giảm 40%.': 'annualDiscount',
  'Bàn trợ giúp nội bộ.': 'internalHelpdesk',
  'Giám sát 10 máy chủ thanh toán.': 'monitorPaymentServers',
  'Trực sự cố 24/7.': 'incidentResponse',
  'Họp với đối tác.': 'partnerMeetings',
  'Trùng chức năng với Google Meet': 'overlapsGoogleMeet',
  'Bổ sung báo giá HubSpot và kế hoạch chiến dịch 2027 làm căn cứ cho số người dùng.': 'hubspotInfoRequest',
  'Tự động hóa chiến dịch.': 'campaignAutomation',
  'Thiết kế nội dung quảng cáo.': 'adContentDesign',
  'Nghiên cứu từ khóa.': 'keywordResearch',
  'Quản lý khách hàng.': 'customerManagement',
  'Video giới thiệu sản phẩm.': 'productVideos',
  'Chỉ 2 người dùng thường xuyên; giữ 2 suất.': 'keepTwoSeats',
  'Toàn công ty, thêm nhân sự mới.': 'companyGrowth',
  'Có thể hạ xuống Business+ (4% dùng tính năng Enterprise)': 'downgradeBusinessPlus',
  'Email, lịch, Meet.': 'emailCalendarMeet',
  'Tài liệu nội bộ.': 'internalDocuments',
  'Danh mục: không có ChatGPT': 'catalogMissingChatgpt',
  'Yêu cầu đã duyệt: không có': 'noApprovedRequest',
  'Quản trị CNTT đang xác minh người dùng thẻ 8812 (Phòng Kỹ thuật).': 'checkingCardUser',
  'Thuê bao Slack Enterprise Grid — 8.000.000 ₫/tháng': 'slackSubscriptionBasis',
  'Thuê bao Confluence Standard — hết hạn 31/08/2026': 'expiredConfluenceBasis',
  'Gói đã hủy ở danh mục nhưng nhà cung cấp vẫn trừ tiền.': 'cancelledPlanCharged',
  'Thuê bao Miro Team': 'miroSubscriptionBasis',
  'Đã liên kết với thuê bao Miro Team.': 'linkedMiroSubscription',
  'Danh mục: không có Canva Pro': 'catalogMissingCanva',
  'Hệ thống chấm công nội bộ — máy chủ quý 3': 'internalTimesheetServers',
  'CI runner nội bộ — phần Phòng Kỹ thuật': 'internalCiRunner',
  'CC-PRD đã ngừng hiệu lực và được gộp vào CC-DES; yêu cầu vẫn gắn mã cũ.': 'retiredCostCenter',
  'Duyệt ngân sách năm 2026 cho 6 trung tâm chi phí.': 'approvedAnnualBudget',
  'Tổng vượt kế hoạch chi phí; yêu cầu Tài chính giảm buffer Phòng Kỹ thuật xuống 10%.': 'reduceEngineeringBuffer',
  'Chấp thuận tăng ngân sách Marketing cho chiến dịch nửa cuối năm.': 'approvedMarketingIncrease',
  'REQ-2026-078 · Cursor Pro · 10 suất — trong ngân sách.': 'cursorRequestApproved',
  'REQ-2026-071 · Canva Pro ngoài danh mục — không chấp thuận, dùng Adobe Express có sẵn.': 'canvaRequestRejected',
  'Điều chỉnh tăng cho chiến dịch nửa cuối năm, đã được Người duyệt chi chấp thuận.': 'marketingIncreaseReason',
  'Figma Organization: 4 ghost seat đã đề xuất thu hồi; giữ 25 suất.': 'figmaSeatReview',
  'Buffer 5% cho Phòng Thiết kế.': 'designBuffer',
  'Yêu cầu bổ sung báo giá HubSpot và kế hoạch chiến dịch 2027.': 'hubspotQuoteRequested',
  'Gửi ngân sách 2027 của Phòng Kinh doanh cho Người duyệt chi.': 'salesBudgetSubmitted',
  'Thêm PagerDuty cho trực sự cố 24/7 từ quý 4 sau sự cố thanh toán tháng 9.': 'pagerDutyAdded',
  'Mẫu chuẩn SaaS-Sentry (CSV)': 'standardCsv',
  'Vietcombank — thẻ doanh nghiệp (CSV)': 'vietcombankCsv',
  'Techcombank — sao kê tài khoản (CSV)': 'techcombankCsv'
}

export function financeDemoText(value: string): string {
  const key = demoTextKeys[value]
  if (key) return i18n.t(`dashboard:financeDemo.text.${key}`, { defaultValue: value })
  return value
    .replace(/(· \d+) suất\b/g, (_, count: string) =>
      i18n.t('dashboard:financeDemo.units.seats', { defaultValue: `${count} suất`, value: count })
    )
    .replace(/(· \d+) máy chủ/g, (_, count: string) =>
      i18n.t('dashboard:financeDemo.units.servers', { defaultValue: `${count} máy chủ`, value: count })
    )
    .replace(/(· \d+) nhà phát triển\b/g, (_, count: string) =>
      i18n.t('dashboard:financeDemo.units.developers', { defaultValue: `${count} nhà phát triển`, value: count })
    )
}

export function financeCostCenterName(code: string, fallback: string): string {
  const key = costCenterKeys[code]
  return key ? i18n.t(`dashboard:financeDemo.costCenters.${key}.name`, { defaultValue: fallback }) : fallback
}

export function financeDepartmentName(code: string, fallback: string): string {
  const key = costCenterKeys[code]
  return key ? i18n.t(`dashboard:financeDemo.costCenters.${key}.department`, { defaultValue: fallback }) : fallback
}
