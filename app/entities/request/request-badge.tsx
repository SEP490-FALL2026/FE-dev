import { useTranslation } from 'react-i18next'

import type { RequestStatus } from './manager-requests-demo'

const tones: Record<RequestStatus, string> = {
  pending: 'border-primary/20 bg-primary-soft text-primary-ink',
  inProgress: 'border-warning/30 bg-warning/10 text-warning-ink',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-danger/20 bg-danger/10 text-danger',
  overdue: 'border-danger/20 bg-danger/10 text-danger'
}
export function RequestBadge({ status }: { status: RequestStatus }) {
  const { t } = useTranslation('dashboard')
  return (
    <span className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-[11px] font-medium ${tones[status]}`}>
      {t(`teamRequests.statuses.${status}`)}
    </span>
  )
}
