import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useMonitoringNoticeCurrentGet,
  getMonitoringNoticeCurrentGetQueryKey
} from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-current-get'
import { useMonitoringNoticeVersionCreate } from '~/shared/api/generated/operations/monitoring-notices/monitoring-notice-version-create'
import type { MonitoringNoticeResponseDtoData } from '~/shared/api/generated/model/monitoring-notices'
import { AdminField, AdminFormDialog, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'

const fields = ['collected', 'notCollected', 'purpose', 'retention', 'stopRight'] as const
export function MonitoringNotice({ onEditingChange }: { onEditingChange?: (editing: boolean) => void }) {
  const { t: translate } = useTranslation('admin')
  const query = useMonitoringNoticeCurrentGet()
  const [editing, setEditing] = useState(false)
  const { formatDateTime } = useDashboardFormat()
  const notice = query.data?.data
  const close = () => {
    setEditing(false)
    onEditingChange?.(false)
  }
  if (editing) return <MonitoringEditor notice={notice ?? null} onClose={close} />
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <h2 className='font-semibold'>{translate('monitoring.title')}</h2>
      <AdminQueryState query={query}>
        {notice ? (
          <>
            <p className='text-right font-mono text-xs tabular-nums'>
              {translate('monitoring.published', { date: formatDateTime(notice.publishedAt) })}
            </p>
            {fields.map((field) => (
              <div key={field}>
                <h3 className='text-sm font-medium'>{translate(`monitoring.${field}`)}</h3>
                <p className='mt-1 whitespace-pre-wrap text-sm text-muted-foreground'>{notice[field]}</p>
              </div>
            ))}
          </>
        ) : (
          <p className='text-sm text-muted-foreground'>{translate('monitoring.empty')}</p>
        )}
        <button
          type='button'
          className={adminButtonClass}
          disabled={query.isFetching}
          onClick={() => {
            setEditing(true)
            onEditingChange?.(true)
          }}
        >
          {translate('monitoring.edit')}
        </button>
      </AdminQueryState>
    </section>
  )
}

function MonitoringEditor({ notice, onClose }: { notice: MonitoringNoticeResponseDtoData; onClose: () => void }) {
  const { t: translate } = useTranslation('admin')
  const [includesToolStatus, setIncludesToolStatus] = useState(notice?.includesToolStatus ?? false)
  const [requiresReacknowledgement, setRequiresReacknowledgement] = useState(true)
  const feedback = useAdminMutationFeedback([getMonitoringNoticeCurrentGetQueryKey()], onClose)
  const mutation = useMonitoringNoticeVersionCreate({ mutation: { ...feedback, retry: false } })
  const newlyCollectsStatus = includesToolStatus && !notice?.includesToolStatus
  return (
    <AdminFormDialog
      page
      title={translate('monitoring.edit')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('monitoring.publish')}
      onSubmit={(event) => {
        event.preventDefault()
        if (mutation.isPending) return
        const form = new FormData(event.currentTarget)
        const text = (field: (typeof fields)[number]) => String(form.get(field) ?? '').trim()
        if (fields.some((field) => !text(field))) return
        mutation.mutate({
          data: {
            collected: text('collected'),
            notCollected: text('notCollected'),
            purpose: text('purpose'),
            retention: text('retention'),
            stopRight: text('stopRight'),
            includesToolStatus,
            requiresReacknowledgement: newlyCollectsStatus || requiresReacknowledgement
          }
        })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('monitoring.warning')}</p>
      <div className='grid gap-4 md:grid-cols-2'>
        {fields.map((field) => (
          <AdminField
            key={field}
            label={translate(`monitoring.${field}`)}
            description={translate(`monitoring.help.${field}`)}
          >
            <textarea
              required
              name={field}
              maxLength={4000}
              rows={4}
              className={adminInputClass}
              defaultValue={notice?.[field] ?? ''}
            />
          </AdminField>
        ))}
        <AdminField
          label={translate('monitoring.includesToolStatus')}
          description={translate('monitoring.toolStatusHelp')}
        >
          <input
            type='checkbox'
            checked={includesToolStatus}
            onChange={(event) => setIncludesToolStatus(event.target.checked)}
            className='size-5 accent-primary'
          />
        </AdminField>
        <AdminField
          label={translate('monitoring.requiresReacknowledgement')}
          description={translate('monitoring.reackHelp')}
        >
          <input
            type='checkbox'
            checked={newlyCollectsStatus || requiresReacknowledgement}
            disabled={newlyCollectsStatus}
            onChange={(event) => setRequiresReacknowledgement(event.target.checked)}
            className='size-5 accent-primary'
          />
        </AdminField>
      </div>
    </AdminFormDialog>
  )
}
