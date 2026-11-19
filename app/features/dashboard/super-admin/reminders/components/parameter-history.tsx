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
    <section className='space-y-3 rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)] sm:p-6'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='section-accent font-semibold'>
          {translate('parameters.historyTitle', { name: presentation.name(parameter.key, parameter.label) })}
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
                  <dd className='text-right text-xs font-medium'>
                    {presentation.unit(parameter.unit, parameter.unitLabel)}
                  </dd>
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
