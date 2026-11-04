import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBusinessOwnerWarningList } from '~/shared/api/generated/operations/applications/business-owner-warning-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function CatalogOwnerWarnings({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const [page, setPage] = useState(1)
  const query = useBusinessOwnerWarningList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-4'>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article key={item.applicationId} className='flex flex-wrap items-center justify-between gap-4 p-5'>
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate font-semibold' title={item.applicationName}>
                    {item.applicationName}
                  </h2>
                  <p className='truncate text-sm text-muted-foreground' title={item.businessOwner.fullName}>
                    {item.businessOwner.fullName}
                  </p>
                </div>
                <span className='text-sm text-danger-ink'>{translate('ownerReview.ownerLeft')}</span>
                <button type='button' className={itButtonClass} onClick={() => onOpen(item.applicationId)}>
                  {translate('details')}
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
