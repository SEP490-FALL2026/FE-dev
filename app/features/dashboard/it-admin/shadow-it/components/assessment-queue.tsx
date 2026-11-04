import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClipboardCheck, ArrowUpRight } from 'lucide-react'
import { useAssessmentQueueList } from '~/shared/api/generated/operations/access-requests/assessment-queue-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function AssessmentQueue({ onOpen }: { onOpen: (id: string, canAct: boolean) => void }) {
  const { t: translate } = useTranslation('itNewSoftware')
  const { formatDateTime, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useAssessmentQueueList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-4' aria-label={translate('queue.title')}>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='flex items-center gap-2 text-sm font-semibold'>
          <ClipboardCheck aria-hidden strokeWidth={1.5} className='size-4 text-primary' />
          {translate('queue.title')}
        </h2>
        {data && (
          <span className='text-xs text-muted-foreground'>
            {translate('queue.total', { count: data.pagination.totalItems })}
          </span>
        )}
      </div>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article
                key={item.requestId}
                className='flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-subtle/50 sm:p-5'
              >
                <div className='min-w-0 flex-1 basis-52 space-y-1.5'>
                  <h3 className='truncate font-semibold' title={item.software.name}>
                    {item.software.name}
                  </h3>
                  <p
                    className='truncate text-sm text-muted-foreground'
                    title={`${item.requester.fullName} · ${item.department.name}`}
                  >
                    {item.requester.fullName}
                    <span aria-hidden> · </span>
                    {item.department.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {translate('queue.users', { count: item.software.expectedUsers })}
                    <span aria-hidden> · </span>
                    {translate(`queue.readiness.${item.readiness}`, { defaultValue: translate('unknown') })}
                  </p>
                </div>
                <div className='space-y-1 text-right text-xs text-muted-foreground'>
                  <p className='font-mono tabular-nums'>{formatDateTime(item.waitingSince)}</p>
                  <p>
                    {translate('queue.missing', { count: item.missingCount })}
                    <span aria-hidden> · </span>
                    {translate('queue.sla', { days: formatNumber(item.slaWorkingDays) })}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <span className={`text-xs ${item.canAct ? 'text-primary-ink' : 'text-muted-foreground'}`}>
                    {translate(item.canAct ? 'queue.actionable' : 'queue.viewOnly')}
                  </span>
                  <button type='button' className={itButtonClass} onClick={() => onOpen(item.requestId, item.canAct)}>
                    {translate('queue.open')}
                    <ArrowUpRight aria-hidden strokeWidth={1.5} className='size-4' />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && <ItPagination page={page} total={data.pagination.totalItems} pageSize={20} onChange={setPage} />}
    </section>
  )
}
