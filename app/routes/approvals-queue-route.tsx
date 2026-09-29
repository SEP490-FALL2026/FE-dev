import { ApprovalQueuePage } from '~/features/approvals/approval-queue-page'

export function meta() {
  return [
    { title: 'Hàng đợi duyệt chi - SaaS-Sentry' },
    { name: 'description', content: 'Danh sách duyệt chi và quyết định kỳ gia hạn theo SLA' }
  ]
}

export default function ApprovalsQueueRoute() {
  return <ApprovalQueuePage />
}
