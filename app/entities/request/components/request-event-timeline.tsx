import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestEventList } from '~/shared/api/generated/operations/access-requests/access-request-event-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function RequestEventTimeline({ id }: { id: string }) {
  const { t } = useTranslation('requestFlow')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const query = useAccessRequestEventList(id, { page, pageSize: 20 })
  const data = !query.isError ? query.data?.data : undefined
  const buttonClass = 'min-h-11 rounded-md border border-border px-3 text-sm disabled:opacity-50'
  return (
    <section className='space-y-4 border-t border-border/60 pt-4'>
      <h3 className='font-semibold'>{t('timeline')}</h3>
      {query.isPending && <p role='status'>{t('loading')}</p>}
      {query.isError && (
        <div role='alert'>
          <p>{t('loadError')}</p>
          <button className={buttonClass} onClick={() => void query.refetch()} disabled={query.isFetching}>
            {t('retry')}
          </button>
        </div>
      )}
      {data?.items.length === 0 && <p className='text-sm text-muted-foreground'>{t('noEvents')}</p>}
      <ol className='divide-y divide-border/40'>
        {data?.items.map((event) => (
          <li key={event.id} className='space-y-1 py-3 text-sm'>
            <div className='flex flex-wrap justify-between gap-2'>
              <span>{t(`events.${event.kind}`, { defaultValue: t('unknown') })}</span>
              <time className='text-right font-mono text-xs tabular-nums' dateTime={event.occurredAt}>
                {formatDateTime(event.occurredAt)}
              </time>
            </div>
            {event.actor && (
              <p className='truncate text-xs text-muted-foreground' title={event.actor.fullName}>
                {event.actor.fullName}
              </p>
            )}
            {event.line && (
              <p className='truncate' title={event.line.fullName}>
                {event.line.fullName}
              </p>
            )}
            {event.reason && <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{event.reason}</p>}
          </li>
        ))}
      </ol>
      {data && data.pagination.totalPages > 1 && (
        <nav className='flex justify-end gap-3' aria-label={t('timeline')}>
          <button
            className={buttonClass}
            disabled={query.isFetching || page <= 1}
            onClick={() => setPage(page - 1)}
            aria-label={t('previous')}
          >
            ←
          </button>
          <span className='self-center font-mono text-sm'>
            {page} / {data.pagination.totalPages}
          </span>
          <button
            className={buttonClass}
            disabled={query.isFetching || page >= data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
            aria-label={t('next')}
          >
            →
          </button>
        </nav>
      )}
    </section>
  )
}
