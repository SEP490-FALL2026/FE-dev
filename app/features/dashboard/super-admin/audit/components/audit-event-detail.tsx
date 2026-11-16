import { useTranslation } from 'react-i18next'
import type { AuditEventPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/audit'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AuditValues, useAuditLabels } from './audit-values'
import { useDashboardFormat } from '../../../dashboard-ui'

export function AuditEventDetail({
  event,
  onClose
}: {
  event: AuditEventPageResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate } = useTranslation('admin')
  const labels = useAuditLabels()
  const { formatDateTime } = useDashboardFormat()
  return (
    <section className='space-y-5'>
      <button type='button' className={adminButtonClass} onClick={onClose}>
        {translate('auditView.back')}
      </button>
      <header>
        <h1 className='text-2xl font-semibold'>{labels.action(event.action)}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          {labels.resource(event.resourceType)} · {formatDateTime(event.occurredAt)}
        </p>
      </header>
      <div className='grid gap-4 md:grid-cols-2'>
        {(['before', 'after'] as const).map((key) => (
          <section key={key} className='space-y-3 rounded-lg border border-border bg-surface p-5'>
            <h2 className='font-semibold'>{translate(`audit.${key}`)}</h2>
            <AuditValues value={event[key]} />
          </section>
        ))}
      </div>
      <button
        type='button'
        className={adminButtonClass}
        onClick={() => {
          const url = URL.createObjectURL(new Blob([JSON.stringify(event, null, 2)], { type: 'application/json' }))
          const link = document.createElement('a')
          link.href = url
          link.download = 'audit-evidence.json'
          link.click()
          window.setTimeout(() => URL.revokeObjectURL(url), 1000)
        }}
      >
        {translate('auditView.download')}
      </button>
    </section>
  )
}
