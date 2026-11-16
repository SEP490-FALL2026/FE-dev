import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGhostSeatRuleSkipList } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-rule-skip-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'

export function RunSkips({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('admin')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useGhostSeatRuleSkipList(id, { page, pageSize: 20 })
  const items = query.data?.data?.items ?? []
  return (
    <section className='space-y-5'>
      <button type='button' className={adminButtonClass} onClick={onBack}>
        {translate('ghostSeats.back')}
      </button>
      <h1 className='text-2xl font-semibold tracking-tight'>{translate('ghostSeats.runs.skipsTitle')}</h1>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <div className='divide-y divide-border/40'>
          {items.map((item, index) => (
            <article
              key={`${item.subjectType}:${item.subjectId}:${item.gate}:${index}`}
              className='space-y-3 py-4 text-sm'
            >
              <div className='flex flex-wrap justify-between gap-3'>
                <h2 className='font-medium'>
                  {translate(`ghostSeats.runs.gates.${item.gate}`, { defaultValue: translate('unknown') })}
                </h2>
                <p className='text-muted-foreground'>
                  {translate(`ghostSeats.runs.subject.${item.subjectType}`, { defaultValue: translate('unknown') })}
                </p>
              </div>
              <dl className='grid gap-3 sm:grid-cols-2'>
                {item.detail.sourceName && (
                  <div>
                    <dt className='text-muted-foreground'>{translate('ghostSeats.runs.detail.sourceName')}</dt>
                    <dd className='max-w-80 truncate' title={item.detail.sourceName}>
                      {item.detail.sourceName}
                    </dd>
                  </div>
                )}
                {(['coverageDays', 'requiredDays'] as const).map(
                  (key) =>
                    typeof item.detail[key] === 'number' && (
                      <div key={key}>
                        <dt className='text-muted-foreground'>{translate(`ghostSeats.runs.detail.${key}`)}</dt>
                        <dd className='text-right font-mono tabular-nums'>{formatNumber(item.detail[key])}</dd>
                      </div>
                    )
                )}
                {item.detail.until && (
                  <div>
                    <dt className='text-muted-foreground'>{translate('ghostSeats.runs.detail.until')}</dt>
                    <dd className='text-right font-mono tabular-nums'>{formatDate(item.detail.until)}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
    </section>
  )
}
