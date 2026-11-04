import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarClock } from 'lucide-react'
import { useSubscriptionRenewalList } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import type { SubscriptionRenewalListParams } from '~/shared/api/generated/model/subscription-renewals'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { itButtonClass } from '../../shared/components/it-form'
import { RenewalState } from '../enums/renewal-state'
import { RenewalDetail } from '../components/renewal-detail'
import { RenewalSubscriptions } from '../components/renewal-subscriptions'
import { RenewalDeadlineEvents } from '../components/renewal-deadline-events'

export function ItRenewalsView({
  initialId,
  initialView = 'cases'
}: {
  initialId?: string
  initialView?: 'cases' | 'subscriptions' | 'events'
}) {
  const { t: translate } = useTranslation('itRenewals')
  const { formatDate } = useDashboardFormat()
  const [view, setView] = useState(initialView)
  const [selected, setSelected] = useState(initialId)
  const [params, setParams] = useState<SubscriptionRenewalListParams>({ page: 1, pageSize: 20 })
  const query = useSubscriptionRenewalList(params, { query: { enabled: view === 'cases' && !selected } })
  const data = query.data?.data
  if (selected) return <RenewalDetail id={selected} onBack={() => setSelected(undefined)} />
  return (
    <section className='space-y-5'>
      <header>
        <p className='it-eyebrow'>{translate('subscriptions')}</p>
        <h1 className='mt-1 flex items-center gap-3 text-2xl font-semibold tracking-tight'>
          <CalendarClock aria-hidden strokeWidth={1.5} className='size-6 text-primary' />
          {translate('title')}
        </h1>
      </header>
      <div role='group' aria-label={translate('title')} className='flex flex-wrap gap-2'>
        {(['cases', 'subscriptions', 'events'] as const).map((key) => (
          <button
            key={key}
            type='button'
            aria-pressed={view === key}
            className={itButtonClass}
            onClick={() => setView(key)}
          >
            {translate(key)}
          </button>
        ))}
      </div>
      {view === 'subscriptions' ? (
        <RenewalSubscriptions />
      ) : view === 'events' ? (
        <RenewalDeadlineEvents />
      ) : (
        <>
          <div className='flex flex-wrap items-end gap-4'>
            <div className='w-full sm:max-w-xs'>
              <ItChoiceSelect
                label={translate('state')}
                value={params.state ?? ''}
                options={[
                  { value: '', label: translate('all') },
                  ...Object.values(RenewalState).map((value) => ({ value, label: translate(`values.${value}`) }))
                ]}
                onChange={(value) =>
                  setParams((previous) => ({
                    ...previous,
                    page: 1,
                    state: Object.values(RenewalState).find((item) => item === value)
                  }))
                }
              />
            </div>
            <label className='flex min-h-11 items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={params.late === 'true'}
                onChange={(event) =>
                  setParams((previous) => ({ ...previous, page: 1, late: event.target.checked ? 'true' : undefined }))
                }
              />
              {translate('late')}
            </label>
          </div>
          <ItQueryState query={query}>
            {data?.items.length ? (
              <div className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
                {data.items.map((item) => (
                  <article key={item.id} className='flex flex-wrap items-center justify-between gap-4 p-5'>
                    <div className='min-w-0 flex-1 basis-48'>
                      <h2 className='truncate font-semibold' title={item.subscription.applicationName}>
                        {item.subscription.applicationName}
                      </h2>
                      <p className='truncate text-sm text-muted-foreground' title={item.subscription.planName}>
                        {item.subscription.planName}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm'>
                        {translate(`values.${item.state}`, { defaultValue: translate('unknown') })}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {translate(`values.${item.proposedChoice}`, { defaultValue: translate('unknown') })}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-mono text-sm tabular-nums'>{formatDate(item.milestone.baseDate)}</p>
                      {item.lateFlagged && <p className='text-xs text-danger'>{translate('lateFlag')}</p>}
                    </div>
                    <button type='button' className={itButtonClass} onClick={() => setSelected(item.id)}>
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
              total={data.pagination.totalItems}
              pageSize={20}
              onChange={(page) => setParams((previous) => ({ ...previous, page }))}
            />
          )}
        </>
      )}
    </section>
  )
}
