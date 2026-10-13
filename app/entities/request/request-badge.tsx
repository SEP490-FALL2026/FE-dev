import { useTranslation } from 'react-i18next'

import type { RequestStatus } from './manager-requests-demo'

const tones: Record<RequestStatus, string> = {
  pending: 'border-brand-200 bg-brand-100/60 text-brand-600',
  inProgress: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-danger/20 bg-danger/10 text-danger',
  overdue: 'border-danger/20 bg-danger/10 text-danger'
}
export function RequestBadge({ status }: { status: RequestStatus }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-[11px] font-medium ${tones[status]}`}>
      {t(`teamRequests.statuses.${status}`)}
    </span>
  )
}
