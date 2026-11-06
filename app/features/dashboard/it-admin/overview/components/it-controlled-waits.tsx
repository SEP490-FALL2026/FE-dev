import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useControlledWaitList } from '~/shared/api/generated/operations/controlled-waits/controlled-wait-list'
import type { ControlledWaitListResponseDtoDataItemsItem } from '~/shared/api/generated/model/controlled-waits/controlledWaitListResponseDtoDataItemsItem'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function ItControlledWaits() {
  const { t: translate } = useTranslation('itDepartmentWork')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ControlledWaitListResponseDtoDataItemsItem>()
  const query = useControlledWaitList({ page, pageSize: 20 })
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold [text-wrap:balance]'>{translate('waits')}</h2>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('waitHint')}</p>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.stepId} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate font-semibold' title={item.requester.fullName}>
                    {item.requester.fullName}
                  </h3>
                  <p className='truncate text-sm text-muted-foreground' title={item.department.name}>
                    {item.department.name}
                  </p>
                  <p className='text-sm text-warning-ink'>
                    {translate(`values.${item.waitingReason}`, { defaultValue: translate('unknown') })}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelected(item)}>
                  {translate('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
      {selected && (
        <ItDetailDialog title={translate('waits')} onClose={() => setSelected(undefined)}>
          <dl className='grid gap-4 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{translate('requester')}</dt>
              <dd className='break-words'>{selected.requester.fullName}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('department')}</dt>
              <dd className='break-words'>{selected.department.name}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('step')}</dt>
              <dd>{translate(`values.${selected.stepKind}`, { defaultValue: translate('unknown') })}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('reason')}</dt>
              <dd>{translate(`values.${selected.waitingReason}`, { defaultValue: translate('unknown') })}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('since')}</dt>
              <dd className='text-right font-mono tabular-nums'>{formatDateTime(selected.waitingSince)}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('next')}</dt>
              <dd>
                {selected.configurationHint
                  ? translate(`values.${selected.configurationHint}`, { defaultValue: translate('unknown') })
                  : translate('unknown')}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-muted-foreground'>{translate('requestReference')}</dt>
              <dd className='break-all font-mono text-xs'>{selected.requestId}</dd>
            </div>
          </dl>
        </ItDetailDialog>
      )}
    </section>
  )
}
