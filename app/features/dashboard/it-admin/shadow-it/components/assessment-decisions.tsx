import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAssessmentDecisionList } from '~/shared/api/generated/operations/access-requests/assessment-decision-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function AssessmentDecisions({ onOpen }: { onOpen: (id: string) => void }) {
  const { t } = useTranslation('itNewSoftware')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useAssessmentDecisionList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-4' aria-label={t('decisions.title')}>
      <h2 className='section-accent text-lg font-semibold'>{t('decisions.title')}</h2>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article key={item.requestId} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div className='min-w-0 space-y-1'>
                  <h3 className='truncate font-semibold' title={item.software.name}>
                    {item.software.name}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {item.requester.fullName} · {item.department.name}
                  </p>
                  <p className='text-sm'>
                    {t(`values.${item.result}`)}
                    {item.reason ? ` · ${item.reason}` : ''}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {item.decidedBy.fullName} · {formatDateTime(item.decidedAt)}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => onOpen(item.requestId)}>
                  {t('queue.open')}
                </button>
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
