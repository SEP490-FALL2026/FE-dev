import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestEventList } from '~/shared/api/generated/operations/access-requests/access-request-event-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

/** `bare` drops the own heading and divider for use inside a card that already has a title. */
export function RequestEventTimeline({ id, bare = false }: { id: string; bare?: boolean }) {
  const { t } = useTranslation('requestFlow')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const query = useAccessRequestEventList(id, { page, pageSize: 20 })
  const data = !query.isError ? query.data?.data : undefined
  const buttonClass = 'min-h-11 rounded-md border border-border px-3 text-sm disabled:opacity-50'
  return (
    <section className={bare ? 'space-y-4' : 'space-y-4 border-t border-border/60 pt-4'}>
      {!bare && <h3 className='font-semibold'>{t('timeline')}</h3>}
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
          <li key={event.id} className='grid gap-x-6 gap-y-1 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]'>
            <p className='min-w-0 font-medium'>{t(`events.${event.kind}`, { defaultValue: t('unknown') })}</p>
            <time
              className='whitespace-nowrap font-mono text-xs leading-5 tabular-nums text-muted-foreground sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:text-right'
              dateTime={event.occurredAt}
            >
              {formatDateTime(event.occurredAt)}
            </time>
            {event.actor && (
              <p className='min-w-0 truncate text-xs text-muted-foreground sm:col-start-1' title={event.actor.fullName}>
                {event.actor.fullName}
              </p>
            )}
            {event.line && (
              <p className='min-w-0 truncate sm:col-span-2' title={event.line.fullName}>
                {event.line.fullName}
              </p>
            )}
            {event.reason && (
              <p className='whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere] sm:col-span-2'>
                {event.reason}
              </p>
            )}
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
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
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
            <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
          </button>
        </nav>
      )}
    </section>
  )
}
