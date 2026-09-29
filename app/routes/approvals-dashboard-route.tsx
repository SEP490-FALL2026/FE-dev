import { ApproverDashboardPage } from '~/features/approvals/approver-dashboard-page'

export function meta() {
  return [
    { title: 'Dashboard Duyệt chi & Báo cáo - SaaS-Sentry' },
    {
      name: 'description',
      content: 'Tổng quan điều hành dành cho Người duyệt chi (CEO), báo cáo tài chính và hàng đợi duyệt khẩn'
    }
  ]
}

export default function ApprovalsDashboardRoute() {
  return <ApproverDashboardPage />
}
