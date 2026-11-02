import { useTranslation } from 'react-i18next'
import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { useOperatingParameterHistory } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-history'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { adminButtonClass } from '../../shared/components/admin-form'
import { useParameterPresentation } from '../hooks/use-parameter-presentation'

export function ParameterHistory({
  parameter,
  onClose
}: {
  parameter: ParameterListResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate } = useTranslation('admin')
  const query = useOperatingParameterHistory(parameter.key)
  const presentation = useParameterPresentation()
  const { formatDateTime } = useDashboardFormat()
  return (
    <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-semibold'>
          {translate('parameters.historyTitle', { name: presentation.name(parameter.key) })}
        </h2>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('close')}
        </button>
      </div>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        {query.data?.data?.items.map((item) => (
          <article
            key={item.from}
            className='grid gap-4 border-b border-border/40 py-3 text-sm sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]'
          >
            <div>
              <span
                className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${item.until === null ? 'bg-primary-soft text-primary-ink' : 'bg-surface-subtle text-muted-foreground'}`}
              >
                {translate(item.until === null ? 'parameters.currentlyApplied' : 'parameters.noLongerApplied')}
              </span>
              <dl className='mt-3 space-y-2 rounded-md bg-surface-subtle/70 p-3'>
                <div className='flex items-center justify-between gap-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('parameters.value')}</dt>
                  <dd className='min-w-0 text-right font-mono font-semibold tabular-nums [overflow-wrap:anywhere]'>
                    {presentation.value(item.value)}
                  </dd>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <dt className='shrink-0 text-xs text-muted-foreground'>{translate('parameters.unit')}</dt>
                  <dd className='text-right text-xs font-medium'>{presentation.unit(parameter.unit)}</dd>
                </div>
              </dl>
            </div>
            <dl className='grid gap-2 text-right text-xs'>
              <div>
                <dt className='text-muted-foreground'>{translate('parameters.validFrom')}</dt>
                <dd className='mt-1 font-mono tabular-nums'>
                  <time dateTime={item.from}>{formatDateTime(item.from)}</time>
                </dd>
              </div>
              {item.until && (
                <div>
                  <dt className='text-muted-foreground'>{translate('parameters.validUntil')}</dt>
                  <dd className='mt-1 font-mono tabular-nums'>
                    <time dateTime={item.until}>{formatDateTime(item.until)}</time>
                  </dd>
                </div>
              )}
            </dl>
          </article>
        ))}
        {query.data?.data?.hasMore && (
          <p className='text-xs text-muted-foreground'>{translate('parameters.olderHistory')}</p>
        )}
      </AdminQueryState>
    </section>
  )
}
