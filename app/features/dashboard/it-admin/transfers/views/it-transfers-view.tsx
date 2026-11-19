import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRightLeft } from 'lucide-react'
import { useDepartmentTransferList } from '~/shared/api/generated/operations/department-transfers/department-transfer-list'
import type { DepartmentTransferListParams } from '~/shared/api/generated/model/department-transfers'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { ItPageHeader, ItSectionTitle } from '../../shared/components/it-page-header'
import { TransferFilters } from '../components/transfer-filters'
import { TransferStatus } from '../enums/transfer-status'
import { TransferDetail } from '../components/transfer-detail'

export function ItTransfersView({ initialId }: { initialId?: string }) {
  const { t: translate } = useTranslation('itTransfers')
  const { formatDate } = useDashboardFormat()
  const [searchParams, setSearchParams] = useSearchParams()
  const [fallbackId, setFallbackId] = useState(initialId)
  const selected = searchParams.get('id') ?? fallbackId
  const requestedPage = Number(searchParams.get('page') ?? 1)
  const params: DepartmentTransferListParams = {
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    pageSize: 20,
    status: Object.values(TransferStatus).find((value) => value === searchParams.get('status')),
    ...Object.fromEntries(
      ['employeeId', 'effectiveFrom', 'effectiveTo', 'graceEndsFrom', 'graceEndsBefore']
        .filter((key) => searchParams.get(key))
        .map((key) => [key, searchParams.get(key)!])
    )
  }
  function select(id?: string) {
    setFallbackId(undefined)
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', 'transfers')
      if (id) next.set('id', id)
      else next.delete('id')
      return next
    })
  }
  function updateParams(values: DepartmentTransferListParams) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', 'transfers')
      for (const key of [
        'page',
        'status',
        'employeeId',
        'effectiveFrom',
        'effectiveTo',
        'graceEndsFrom',
        'graceEndsBefore'
      ] as const) {
        if (values[key]) next.set(key, String(values[key]))
        else next.delete(key)
      }
      return next
    })
  }
  const query = useDepartmentTransferList(params, { query: { enabled: !selected } })
  const data = query.data?.data
  if (selected) return <TransferDetail key={selected} id={selected} onBack={() => select()} />
  return (
    <section className='space-y-5'>
      <ItPageHeader icon={ArrowRightLeft} title={translate('title')} subtitle={translate('hint')} />
      <TransferFilters key={JSON.stringify(params)} params={params} onApply={updateParams} />
      <ItSectionTitle
        title={translate('listTitle')}
        action={
          data && (
            <span className='text-sm text-muted-foreground'>
              {translate('listCount', { count: data.pagination.totalItems })}
            </span>
          )
        }
      />
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 overflow-hidden rounded-xl border border-border/70 bg-surface shadow-sm'>
            {data.items.map((item) => (
              <article key={item.id} className='grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center'>
                <div className='min-w-0'>
                  <h2 className='truncate font-semibold' title={item.employee.fullName}>
                    {item.employee.fullName}
                  </h2>
                  <p className='text-xs text-muted-foreground'>{item.employee.employeeCode}</p>
                  <p className='mt-2 break-words text-sm text-muted-foreground'>
                    {item.from.department.name}
                    <span aria-hidden> → </span>
                    {item.to.department.name}
                  </p>
                </div>
                <div className='space-y-1 text-sm'>
                  <p>{translate(`phases.${item.phase}`, { defaultValue: translate('unknown') })}</p>
                  <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                    {formatDate(item.effectiveOn)}
                  </p>
                  {item.grace && (
                    <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                      {translate('graceUntil', { date: formatDate(item.grace.endsOn) })}
                    </p>
                  )}
                </div>
                <button type='button' className={itButtonClass} onClick={() => select(item.id)}>
                  {translate('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={params.page ?? 1}
          pageSize={20}
          total={data.pagination.totalItems}
          disabled={query.isFetching}
          onChange={(page) => updateParams({ ...params, page })}
        />
      )}
    </section>
  )
}
