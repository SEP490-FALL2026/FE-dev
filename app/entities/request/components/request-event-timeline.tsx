import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react'
import { useAccessRequestEventList } from '~/shared/api/generated/operations/access-requests/access-request-event-list'
import { WorkspaceSection } from '~/shared/ui/workspace-section'
import { groupRequestEvents } from '../request-event-groups'
import { RequestEventEntry } from './request-event-entry'

export function RequestEventTimeline({
  id,
  groupMemberDecisions = false
}: {
  id: string
  groupMemberDecisions?: boolean
}) {
  const { t } = useTranslation('requestFlow')
  const [page, setPage] = useState(1)
  const query = useAccessRequestEventList(id, { page, pageSize: 20 })
  const data = !query.isError ? query.data?.data : undefined
  const events = data?.items ?? []
  const groups = groupMemberDecisions ? groupRequestEvents(events) : events.map((event) => [event])
  const buttonClass =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border/80 bg-surface px-3 text-sm transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50'
  return (
    <WorkspaceSection title={t('timeline')}>
      {query.isPending && (
        <p role='status' className='flex items-center gap-2 py-6 text-sm text-muted-foreground'>
          <LoaderCircle aria-hidden='true' strokeWidth={1.5} className='size-4 animate-spin' />
          {t('loading')}
        </p>
      )}
      {query.isError && (
        <div role='alert'>
          <p>{t('loadError')}</p>
          <button className={buttonClass} onClick={() => void query.refetch()} disabled={query.isFetching}>
            {t('retry')}
          </button>
        </div>
      )}
      {data?.items.length === 0 && <p className='py-6 text-center text-sm text-muted-foreground'>{t('noEvents')}</p>}
      <ol>
        {groups.map((members) => (
          <RequestEventEntry key={members[0].id} members={members} />
        ))}
      </ol>
      {data && data.pagination.totalPages > 1 && (
        <nav
          className='flex flex-wrap items-center justify-end gap-3 border-t border-border/50 pt-4'
          aria-label={t('timeline')}
        >
          <button
            className={buttonClass}
            disabled={query.isFetching || page <= 1}
            onClick={() => setPage(page - 1)}
            aria-label={t('previous')}
            type='button'
          >
            <ArrowLeft aria-hidden='true' strokeWidth={1.5} className='size-4' />
            {t('previous')}
          </button>
          <span className='self-center font-mono text-sm'>
            {page} / {data.pagination.totalPages}
          </span>
          <button
            className={buttonClass}
            disabled={query.isFetching || page >= data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
            aria-label={t('next')}
            type='button'
          >
            {t('next')}
            <ArrowRight aria-hidden='true' strokeWidth={1.5} className='size-4' />
          </button>
        </nav>
      )}
    </WorkspaceSection>
  )
}
