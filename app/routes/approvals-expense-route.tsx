import { ExpenseApprovalPanelPage } from '~/features/approvals/expense-approval-panel-page'

export function meta() {
  return [
    { title: 'Panel Quyết định Duyệt chi - SaaS-Sentry' },
    { name: 'description', content: 'Xem xét yêu cầu chi phí và snapshot ngân sách' }
  ]
}

export default function ApprovalsExpenseRoute() {
  return <ExpenseApprovalPanelPage />
}
