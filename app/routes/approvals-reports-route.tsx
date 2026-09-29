import { ApproverReportsPage } from '~/features/approvals/approver-reports-page'

export function meta() {
  return [
    { title: 'Báo cáo Tài chính & Phân tích Chi phí - SaaS-Sentry' },
    {
      name: 'description',
      content: 'Báo cáo tài chính chuyên sâu, ngân sách đơn vị và phân tích lãng phí dành cho Người duyệt chi'
    }
  ]
}

export default function ApprovalsReportsRoute() {
  return <ApproverReportsPage />
}
