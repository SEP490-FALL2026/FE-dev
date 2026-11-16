import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AuditEventListParams } from '~/shared/api/generated/model'
import { useAuditEventList } from '~/shared/api/generated/operations/audit/audit-event-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminField, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AuditEventDetail } from '../components/audit-event-detail'
import { useAuditLabels } from '../components/audit-values'
import { AiAuditLookup } from '../components/ai-audit-lookup'
import type { AuditEventPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/audit'

const filterFields = ['resourceType', 'resourceId', 'actorAppUserId', 'action', 'occurredFrom', 'occurredTo'] as const
export function SuperAdminAuditView() {
  const { t: translate } = useTranslation('admin')
  const { formatDateTime } = useDashboardFormat()
  const [params, setParams] = useState<AuditEventListParams>({ page: 1, pageSize: 20 })
  const query = useAuditEventList(params)
  const items = query.data?.data?.items ?? []
  const [selected, setSelected] = useState<AuditEventPageResponseDtoDataItemsItem | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const labels = useAuditLabels()
  if (selected) return <AuditEventDetail event={selected} onClose={() => setSelected(null)} />
  if (aiOpen)
    return (
      <div className='space-y-5'>
        <button type='button' className={adminButtonClass} onClick={() => setAiOpen(false)}>
          {translate('auditView.back')}
        </button>
        <AiAuditLookup />
      </div>
    )
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('audit.title')}</h1>
      <button type='button' className={adminButtonClass} onClick={() => setAiOpen(true)}>
        {translate('auditView.aiTitle')}
      </button>
      <form
        className='grid gap-3 rounded-lg border border-border bg-surface p-5 md:grid-cols-3'
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          const next: AuditEventListParams = { page: 1, pageSize: 20 }
          for (const field of filterFields) {
            const value = String(form.get(field) ?? '').trim()
            if (value)
              next[field] = field === 'occurredFrom' || field === 'occurredTo' ? new Date(value).toISOString() : value
          }
          setParams(next)
        }}
      >
        {filterFields.map((field) => (
          <AdminField
            key={field}
            label={translate(
              `audit.${field === 'actorAppUserId' ? 'actor' : field === 'occurredFrom' ? 'from' : field === 'occurredTo' ? 'to' : field}`
            )}
          >
            <input
              type={field.startsWith('occurred') ? 'datetime-local' : 'text'}
              name={field}
              placeholder={
                field === 'occurredFrom' || field === 'occurredTo'
                  ? undefined
                  : translate(`audit.placeholders.${field}`)
              }
              className={adminInputClass}
              maxLength={field === 'resourceId' ? 200 : 100}
            />
          </AdminField>
        ))}
        <button type='submit' className={`${adminButtonClass} justify-self-start`}>
          {translate('audit.apply')}
        </button>
      </form>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <div className='space-y-3'>
          {items.map((item) => (
            <article key={item.id} className='rounded-lg border border-border bg-surface p-5'>
              <div className='flex flex-wrap justify-between gap-3'>
                <h2 className='truncate font-medium' title={labels.action(item.action)}>
                  {labels.action(item.action)}
                </h2>
                <time className='text-right font-mono text-xs tabular-nums' dateTime={item.occurredAt}>
                  {formatDateTime(item.occurredAt)}
                </time>
              </div>
              <dl className='mt-3 grid gap-3 text-sm sm:grid-cols-2'>
                <div>
                  <dt className='text-muted-foreground'>{translate('audit.resourceType')}</dt>
                  <dd className='truncate' title={labels.resource(item.resourceType)}>
                    {labels.resource(item.resourceType)}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('audit.resourceId')}</dt>
                  <dd className='truncate text-right font-mono text-xs tabular-nums' title={item.resourceId}>
                    {item.resourceId}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('audit.actor')}</dt>
                  <dd className='truncate' title={item.actorAppUserId ?? undefined}>
                    {translate(`audit.actorKinds.${item.actorKind}`, { defaultValue: translate('unknown') })}
                    {item.actorAppUserId && ` · ${item.actorAppUserId}`}
                  </dd>
                </div>
              </dl>
              <button className={`${adminButtonClass} mt-3`} type='button' onClick={() => setSelected(item)}>
                {translate('details')}
              </button>
            </article>
          ))}
        </div>
        <AdminPagination
          pagination={query.data?.data?.pagination}
          onPageChange={(page) => setParams({ ...params, page })}
          disabled={query.isFetching}
        />
      </AdminQueryState>
    </div>
  )
}
