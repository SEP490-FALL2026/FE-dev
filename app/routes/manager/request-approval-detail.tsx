import { RequestApprovalPage } from '~/features/manager/request-approval/request-approval-page'
import type { Route } from './+types/request-approval-detail'

export default function RequestApprovalDetailRoute({ params }: Route.ComponentProps) {
  return <RequestApprovalPage requestId={params.id} />
}
