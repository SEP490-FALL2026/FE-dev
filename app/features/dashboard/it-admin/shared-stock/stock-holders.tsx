import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLicenseAssignmentList } from '~/shared/api/generated/operations/license-assignments/license-assignment-list'
import { ItEmpty, ItQueryState } from '../shared/components/it-query-state'
import { ItPagination } from '../shared/components/it-pagination'

export function StockHolders({ subscriptionId }: { subscriptionId: string }) {
  const { t } = useTranslation('itAdmin')
  const [page, setPage] = useState(1)
  const query = useLicenseAssignmentList({ subscriptionId, activeOnly: 'true', page, pageSize: 20 })
  return (
    <section className='space-y-3'>
      <h3 className='font-medium'>{t('stock.holders')}</h3>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <ul className='divide-y divide-border rounded-md border border-border'>
            {query.data.data.items.map((item) => (
              <li key={item.id} className='flex flex-wrap justify-between gap-2 p-3 text-sm'>
                <span>
                  {item.employee.fullName} · {item.employee.employeeCode}
                </span>
                {item.revocation && <span className='text-muted-foreground'>{t('stock.revoking')}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {query.data?.data && (
        <ItPagination page={page} pageSize={20} total={query.data.data.pagination.totalItems} onChange={setPage} />
      )}
    </section>
  )
}
